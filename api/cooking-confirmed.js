/* ---------------------------------------------------------------------------
   /cooking/confirmed  (rewritten here by vercel.json)

   Rendered by the server so the gate cannot be walked around: there is no
   static file at this path to fetch. Every request re-reads the booking from
   Calendly, so a cancelled or rescheduled session is caught even when the
   signed cookie is still valid. Without a valid cookie the visitor is simply
   redirected to /meta — no error page, no hint that anything exists here.

   Presentation lives in _lib/confirmation-view.js. This file is the gate.
--------------------------------------------------------------------------- */

const cfg = require('./_lib/config');
const { verifyBooking, CalendlyUnavailable } = require('./_lib/calendly');
const { successPage, pendingPage } = require('./_lib/confirmation-view');
const S = require('./_lib/session');

/**
 * The conversion is reported exactly once from the browser, by /meta on
 * Calendly's event_scheduled, before it redirects here. This page sends no
 * Pixel event of its own: two browser Pixel events sharing an eventID is not a
 * deduplication path Meta documents — eventID is specified for pairing a
 * browser event with a Conversions API event — so a second fbq('track',
 * 'Purchase') here would risk counting one booking twice.
 *
 * What this page does instead is verify the payment server-side and record it,
 * which is the honest signal and the foundation for CAPI below.
 */
function logVerifiedConversion(booking) {
  const paid = Boolean(booking.payment && booking.payment.amount != null);
  console.log(
    JSON.stringify({
      at: 'cooking_session_booking_confirmed',
      booking_id: booking.inviteeUuid,
      event_id: booking.inviteeUuid,
      paid,
      value: paid ? booking.payment.amount : null,
      currency: paid ? booking.payment.currency : null,
      // never logged: name, email, phone, address, recipe
    })
  );

  /* ---- Conversions API hook -------------------------------------------
     When server-side conversions are added, send the Purchase from here with
     event_id set to booking.inviteeUuid — the same id /meta puts in the
     browser event's eventID. That is the pairing Meta actually deduplicates,
     and it makes the reported conversion payment-verified rather than merely
     scheduled. It needs a META_CAPI_TOKEN, which must stay server-side.
     Deliberately not implemented on a guess at credentials.
  --------------------------------------------------------------------- */
}

function bounce(res, cookies = []) {
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.setHeader('Cache-Control', 'no-store');
  res.statusCode = 302;
  res.setHeader('Location', cfg.FALLBACK_PATH);
  res.end();
}

function send(res, html, cookies = []) {
  if (cookies.length) res.setHeader('Set-Cookie', cookies);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.statusCode = 200;
  res.end(html);
}

module.exports = async function handler(req, res) {
  const secret = cfg.secret();
  if (!secret) return bounce(res);

  const cookies = S.parseCookies(req);
  const verified = S.verify(cookies[S.VERIFIED_COOKIE], secret);
  const pending = S.verify(cookies[S.PENDING_COOKIE], secret);
  const secure = (req.headers['x-forwarded-proto'] || 'https') === 'https';

  // no signed session of any kind: this page does not exist for you
  if (!verified && !pending) return bounce(res);

  const args = verified
    ? { inviteeUuid: verified.i, eventUuid: verified.e }
    : { inviteeUuid: pending.i, eventUuid: pending.e, startTime: pending.st };

  try {
    const result = await verifyBooking(args);

    if (!result.ok) {
      // cancelled, wrong event type, or never real — clear and send them away
      return bounce(res, [S.clear(S.VERIFIED_COOKIE), S.clear(S.PENDING_COOKIE)]);
    }

    logVerifiedConversion(result.booking);

    // refresh the session so a legitimate customer can reload
    const token = S.sign(
      { e: result.booking.eventUuid, i: result.booking.inviteeUuid },
      secret,
      S.TTL_VERIFIED
    );

    return send(res, successPage(result.booking), [
      S.cookie(S.VERIFIED_COOKIE, token, S.TTL_VERIFIED, { secure }),
      S.clear(S.PENDING_COOKIE),
    ]);
  } catch (err) {
    if (!(err instanceof CalendlyUnavailable)) {
      console.error('[cooking/confirmed] unexpected:', err);
      return bounce(res);
    }
    // Never tell someone who paid that they are not booked because our
    // upstream is down.
    console.error('[cooking/confirmed] calendly unavailable:', err.message);
    return send(res, pendingPage());
  }
};
