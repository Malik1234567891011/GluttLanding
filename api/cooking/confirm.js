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
  const startTime = String(q.event_start_time || '');
  const inviteeEmail = String(q.invitee_email || '');
  const secure = (req.headers['x-forwarded-proto'] || 'https') === 'https';

  // Not even shaped like a Calendly redirect — nothing to verify.
  if (!isUuid(inviteeUuid)) return redirect(res, cfg.FALLBACK_PATH);

  const secret = cfg.secret();
  if (!secret) {
    // Fail closed: without a signing key we cannot issue a trustworthy session,
    // and we will not fake one. Calendly's own confirmation still reaches them.
    console.error('[cooking/confirm] CONFIRMATION_SECRET is not set');
    return redirect(res, cfg.FALLBACK_PATH);
  }

  try {
    const result = await verifyWithRetry({ inviteeUuid, inviteeEmail, startTime });

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
    const pending = S.sign({ i: inviteeUuid, st: startTime }, secret, S.TTL_PENDING);
    return redirect(res, cfg.CONFIRMED_PATH, [
      S.cookie(S.PENDING_COOKIE, pending, S.TTL_PENDING, { secure }),
    ]);
  }
};
