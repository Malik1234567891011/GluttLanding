/* ---------------------------------------------------------------------------
   /cooking/confirmed  (rewritten here by vercel.json)

   Rendered by the server so the gate cannot be walked around: there is no
   static file at this path to fetch. Every request re-reads the booking from
   Calendly, so a cancelled or rescheduled session is caught even when the
   signed cookie is still valid. Without a valid cookie the visitor is simply
   redirected to /meta — no error page, no hint that anything exists here.
--------------------------------------------------------------------------- */

const cfg = require('./_lib/config');
const { verifyBooking, CalendlyUnavailable } = require('./_lib/calendly');
const S = require('./_lib/session');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* --------------------------------- shell --------------------------------- */

const STYLE = `
:root{--bg:#f7f3ee;--surface:#fff;--ink:#1b1917;--muted:#6b635b;--line:#e3dbd0;
--green:#1f6b45;--green-soft:#e6f0e9;--safe-b:env(safe-area-inset-bottom,0px);--safe-t:env(safe-area-inset-top,0px)}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased}
h1,h2,h3,p,ol,ul,figure{margin:0}ol,ul{padding:0;list-style:none}
a{color:inherit}
:focus-visible{outline:3px solid var(--green);outline-offset:2px;border-radius:6px}
.wrap{width:min(560px,100% - 40px);margin:0 auto;padding:calc(18px + var(--safe-t)) 0 calc(40px + var(--safe-b))}
.brand{font-size:18px;font-weight:700;letter-spacing:-.03em;text-decoration:none;display:inline-block}
.hero{text-align:center;padding:26px 0 4px}
.mark{width:104px;height:104px;margin:0 auto 22px;display:block;overflow:visible}
.mark circle,.mark path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.mark__plate{stroke:var(--green);stroke-width:2.4;opacity:.34}
.mark__rim{stroke:var(--green);stroke-width:1.4;opacity:.2}
.mark__check{stroke:var(--green);stroke-width:5}
.mark__steam{stroke:var(--green);stroke-width:1.8;opacity:0;transform-box:fill-box;transform-origin:center}
h1{font-size:clamp(32px,9vw,42px);font-weight:700;letter-spacing:-.038em;line-height:1.04}
.lede{margin-top:12px;font-size:17px;color:var(--muted);text-wrap:balance}
.lede b{color:var(--ink);font-weight:600}
.card{margin-top:26px;padding:22px;border:1px solid var(--line);border-radius:22px;background:var(--surface)}
.card__recipe{font-size:21px;font-weight:700;letter-spacing:-.025em;line-height:1.2}
.card__row{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:13px 0;border-bottom:1px solid var(--line)}
.card__row:last-of-type{border-bottom:0;padding-bottom:0}
.card__k{color:var(--muted);font-size:14px}
.card__v{font-size:16px;font-weight:600;text-align:right}
.paid{display:inline-flex;align-items:center;gap:7px;margin-top:16px;padding:8px 13px;border-radius:999px;
background:var(--green-soft);color:var(--green);font-size:13.5px;font-weight:700;letter-spacing:.01em}
.paid svg{width:13px;height:13px}
h2{margin-top:40px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.steps{margin-top:14px}
.steps li{display:grid;grid-template-columns:28px 1fr;gap:14px;padding:15px 0;border-bottom:1px solid var(--line)}
.steps li:last-child{border-bottom:0}
.steps b{display:block;font-size:16px;font-weight:700;letter-spacing:-.02em;margin-bottom:2px}
.steps span{color:var(--muted);font-size:15px}
.steps i{font-style:normal;font-size:13px;font-weight:700;color:var(--green);padding-top:2px}
.calm{margin-top:32px;padding:20px;border-radius:18px;background:var(--green-soft)}
.calm b{display:block;font-size:16px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px}
.calm span{color:#3f6b53;font-size:15px}
.manage{margin-top:30px;display:flex;gap:18px;justify-content:center}
.manage a{color:var(--muted);font-size:14px;text-underline-offset:3px}
.manage a:hover{color:var(--ink)}
.foot{margin-top:38px;padding-top:18px;border-top:1px solid var(--line);display:flex;
justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--muted);font-size:13.5px}
.foot a{text-decoration:none}.foot a:hover{color:var(--ink)}
.foot nav{display:flex;gap:16px}
.pend{text-align:center;padding:64px 0}
.pend p{margin-top:16px;color:var(--muted);font-size:16px}
.dots{display:inline-flex;gap:5px}
.dots i{width:6px;height:6px;border-radius:50%;background:var(--green);opacity:.35;animation:blip 1.2s ease-in-out infinite}
.dots i:nth-child(2){animation-delay:.16s}.dots i:nth-child(3){animation-delay:.32s}
@keyframes blip{0%,100%{opacity:.28;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
@media(min-width:760px){.wrap{width:min(640px,100% - 64px);padding-top:32px}.hero{padding-top:40px}}

/* the plate draws itself, a check resolves inside it, then two wisps of steam.
   ~1.3s in total, then the page is still. */
.mark__plate{stroke-dasharray:290;stroke-dashoffset:290;animation:draw .9s cubic-bezier(.65,0,.35,1) .1s forwards}
.mark__rim{stroke-dasharray:227;stroke-dashoffset:227;animation:draw .8s cubic-bezier(.65,0,.35,1) .3s forwards}
.mark__check{stroke-dasharray:60;stroke-dashoffset:60;animation:draw .45s cubic-bezier(.34,1.2,.64,1) .72s forwards}
.mark__steam{animation:steam 3.6s ease-in-out 1.15s infinite}
.mark__steam--b{animation-delay:1.75s}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes steam{0%{opacity:0;transform:translateY(2px)}22%{opacity:.5}100%{opacity:0;transform:translateY(-11px)}}
.reveal{opacity:0;transform:translateY(10px);animation:rise .6s cubic-bezier(.22,.61,.36,1) forwards}
.reveal--1{animation-delay:.85s}.reveal--2{animation-delay:.97s}.reveal--3{animation-delay:1.09s}
@keyframes rise{to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){
  .mark__plate,.mark__rim,.mark__check{stroke-dashoffset:0;animation:none}
  .mark__steam{display:none}
  .reveal{opacity:1;transform:none;animation:none}
  .dots i{animation:none;opacity:.6}
}`;

/* The check only appears once the booking is verified — showing a resolved
   tick while we are still confirming would claim something we do not know. */
const mark = ({ check = true } = {}) => `
<svg class="mark" viewBox="0 0 120 120" aria-hidden="true">
  <circle class="mark__plate" cx="60" cy="60" r="46"/>
  <circle class="mark__rim" cx="60" cy="60" r="36"/>
  ${check ? '<path class="mark__check" d="M45 61.5 L55.5 72 L76 50"/>' : ''}
  <path class="mark__steam" d="M51 12c-3.5-4 3.5-6.5 0-11"/>
  <path class="mark__steam mark__steam--b" d="M69 12c-3.5-4 3.5-6.5 0-11"/>
</svg>`;

function shell({ title, body }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f7f3ee">
<title>${esc(title)}</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231f6b45'/%3E%3Ctext x='16' y='23' font-family='Helvetica, Arial, sans-serif' font-size='20' font-weight='bold' text-anchor='middle' fill='white'%3EG%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap">
<style>${STYLE}</style></head>
<body><div class="wrap">${body}</div></body></html>`;
}

/* -------------------------------- content -------------------------------- */

function successPage(b) {
  const paid =
    b.payment && b.payment.amount != null
      ? `<span class="paid"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 7"/></svg>
         Paid · ${esc(formatMoney(b.payment))} · ingredients included</span>`
      : `<span class="paid">Ingredients included</span>`;

  const lede = b.recipe
    ? `You're making <b>${esc(b.recipe)}</b>${b.when.date ? ` on <b>${esc(b.when.date)}</b>` : ''}${
        b.when.time ? ` at <b>${esc(b.when.time)}</b>` : ''
      }.`
    : b.when.date
      ? `Your cooking session is booked for <b>${esc(b.when.date)}</b>${
          b.when.time ? ` at <b>${esc(b.when.time)}</b>` : ''
        }.`
      : `Your cooking session is booked.`;

  const manage =
    b.rescheduleUrl || b.cancelUrl
      ? `<div class="manage reveal reveal--3">${
          b.rescheduleUrl ? `<a href="${esc(b.rescheduleUrl)}">Reschedule</a>` : ''
        }${b.cancelUrl ? `<a href="${esc(b.cancelUrl)}">Cancel</a>` : ''}</div>`
      : '';

  const body = `
<a class="brand" href="/">Glutt</a>
<div class="hero">
  ${mark()}
  <h1 class="reveal reveal--1">You're booked.</h1>
  <p class="lede reveal reveal--2">${lede}</p>
</div>

<div class="card reveal reveal--2">
  ${b.recipe ? `<p class="card__recipe">${esc(b.recipe)}</p>` : ''}
  ${b.when.date ? `<div class="card__row"><span class="card__k">Date</span><span class="card__v">${esc(b.when.date)}</span></div>` : ''}
  ${b.when.time ? `<div class="card__row"><span class="card__k">Time</span><span class="card__v">${esc(b.when.time)}</span></div>` : ''}
  <div class="card__row"><span class="card__k">Where</span><span class="card__v">Your home</span></div>
  ${paid}
</div>

<h2 class="reveal reveal--3">We'll take it from here</h2>
<ol class="steps reveal reveal--3">
  <li><i>01</i><div><b>We get everything</b><span>We'll bring the ingredients you need for your recipe.</span></div></li>
  <li><i>02</i><div><b>We come to you</b><span>On your session day we'll arrive at your home with everything ready to cook.</span></div></li>
  <li><i>03</i><div><b>You cook</b><span>You'll make the recipe yourself with Glutt + Meta glasses guiding you, and we'll be there the whole way.</span></div></li>
</ol>

<div class="calm reveal reveal--3">
  <b>Your session is locked in.</b>
  <span>Your confirmation and calendar invite are on the way. We'll reach out before your session if we need anything else.</span>
</div>

${manage}

<div class="foot">
  <span>© 2026 Glutt</span>
  <nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:hi@cielpm.ai">Contact</a></nav>
</div>`;

  return shell({ title: "You're booked — Glutt", body });
}

function formatMoney(p) {
  // Calendly reports amounts in major units
  const n = Number(p.amount);
  if (!Number.isFinite(n)) return '';
  const cur = (p.currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: n % 1 === 0 ? 0 : 2,
    }).format(n);
  } catch {
    return `${n} ${cur}`;
  }
}

/**
 * The conversion is reported exactly once from the browser, by /meta on
 * Calendly's event_scheduled. This page deliberately sends no Pixel event of
 * its own: two browser Pixel events sharing an eventID is not a deduplication
 * path Meta documents — eventID is specified for pairing a browser event with a
 * Conversions API event — so a second fbq('track','Purchase') here would risk
 * counting the same booking twice.
 *
 * What this page still does is verify the payment server-side and record it,
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

function pendingPage() {
  return shell({
    title: 'Confirming your session — Glutt',
    body: `<a class="brand" href="/">Glutt</a>
<div class="pend">
  ${mark({ check: false })}
  <p><span class="dots"><i></i><i></i><i></i></span></p>
  <p>We're confirming your session. Your Calendly confirmation email is the source of truth while we reconnect &mdash; refresh in a moment.</p>
</div>
<div class="foot"><span>© 2026 Glutt</span>
<nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:hi@cielpm.ai">Contact</a></nav></div>`,
  });
}

/* -------------------------------- handler -------------------------------- */

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
    : { inviteeUuid: pending.i, startTime: pending.st };

  try {
    const result = await verifyBooking(args);

    if (!result.ok) {
      // cancelled, wrong event type, or never real — clear and send them away
      return bounce(res, [S.clear(S.VERIFIED_COOKIE), S.clear(S.PENDING_COOKIE)]);
    }

    // refresh the session so a legitimate customer can reload
    const token = S.sign(
      { e: result.booking.eventUuid, i: result.booking.inviteeUuid },
      secret,
      S.TTL_VERIFIED
    );

    logVerifiedConversion(result.booking);

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
