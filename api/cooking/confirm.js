/* ---------------------------------------------------------------------------
   /api/cooking/confirm — where Calendly sends a customer after they book.

   Configure this as the event type's redirect URL with "pass event details"
   enabled:  https://glutt.org/api/cooking/confirm

   Nothing in the incoming query is trusted. The uuid is used only as a lookup
   key; the booking is then read back from Calendly with a server-side token and
   must be active, of the right event type, and paid where payment applies.
   On success we issue a short-lived signed cookie and send the customer to a
   clean URL that carries no personal data.
--------------------------------------------------------------------------- */

const cfg = require('../_lib/config');
const { verifyBooking, CalendlyUnavailable, isUuid } = require('../_lib/calendly');
const { pendingPage } = require('../_lib/confirmation-view');
const S = require('../_lib/session');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Calendly can take a moment to index a brand-new booking. */
async function verifyWithRetry(args, attempts = 3) {
  let last = { ok: false, reason: 'not_found' };
  for (let i = 0; i < attempts; i += 1) {
    last = await verifyBooking(args);
    if (last.ok || last.reason !== 'not_found') return last;
    if (i < attempts - 1) await sleep(700 * (i + 1));
  }
  return last;
}

function redirect(res, location, cookies = []) {
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', location);
  res.end();
}

module.exports = async function handler(req, res) {
  const q = req.query || {};
  const inviteeUuid = String(q.invitee_uuid || '');
  // Optional, and from the same Calendly identifier family: when present the
  // booking is read directly instead of searched for. Not a second identifier
  // scheme — invitee_uuid remains the one that matters.
  const eventUuid = String(q.event_uuid || '');
  const startTime = String(q.event_start_time || '');
  const inviteeEmail = String(q.invitee_email || '');
  const secure = (req.headers['x-forwarded-proto'] || 'https') === 'https';

  // Not even shaped like a Calendly redirect — nothing to verify.
  if (!isUuid(inviteeUuid)) return redirect(res, cfg.FALLBACK_PATH);

  const secret = cfg.secret();
  if (!secret) {
    /* Still fail closed — no session is issued and nothing about the booking is
       confirmed — but someone who has just paid should not be bounced back onto
       the sales page. The holding page claims nothing and points at Calendly's
       email, which is the same thing a stranger hitting this URL would see. */
    console.error('[cooking/confirm] CONFIRMATION_SECRET is not set');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.statusCode = 200;
    return res.end(pendingPage());
  }

  try {
    const result = await verifyWithRetry({ inviteeUuid, eventUuid, inviteeEmail, startTime });

    if (!result.ok) {
      console.warn('[cooking/confirm] rejected:', result.reason);
      return redirect(res, cfg.FALLBACK_PATH, [S.clear(S.PENDING_COOKIE)]);
    }

    const token = S.sign(
      { e: result.booking.eventUuid, i: result.booking.inviteeUuid },
      secret,
      S.TTL_VERIFIED
    );

    return redirect(res, cfg.CONFIRMED_PATH, [
      S.cookie(S.VERIFIED_COOKIE, token, S.TTL_VERIFIED, { secure }),
      S.clear(S.PENDING_COOKIE),
    ]);
  } catch (err) {
    if (!(err instanceof CalendlyUnavailable)) {
      console.error('[cooking/confirm] unexpected:', err);
      return redirect(res, cfg.FALLBACK_PATH);
    }

    // We could not reach Calendly, so we must not tell a paying customer that
    // their booking does not exist. Hand them a pending session; the
    // confirmation page retries and shows a calm recovery state meanwhile.
    // Only non-personal values go in the cookie.
    console.error('[cooking/confirm] calendly unavailable:', err.message);
    const pending = S.sign(
      { i: inviteeUuid, e: eventUuid || undefined, st: startTime },
      secret,
      S.TTL_PENDING
    );
    return redirect(res, cfg.CONFIRMED_PATH, [
      S.cookie(S.PENDING_COOKIE, pending, S.TTL_PENDING, { secure }),
    ]);
  }
};
