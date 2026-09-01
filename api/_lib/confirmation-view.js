/* ---------------------------------------------------------------------------
   confirmation-view.js — the rendered /cooking/confirmed experience.

   Presentation only. It receives a booking that has already been verified
   against the Calendly API and renders exactly the fields that verification
   produced — never a query parameter, never a fabricated value. If a field is
   absent the layout is designed to look deliberate without it.

   Emits no analytics of any kind. The single browser Purchase lives on /meta,
   fired before the redirect here; a second one on this page would be counted
   twice, so there is deliberately no script tag in this document at all.
--------------------------------------------------------------------------- */

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* ================================ styles ================================ */

const STYLE = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);
font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
font-size:16px;line-height:1.5;-webkit-font-smoothing:antialiased;overflow-x:hidden}
h1,h2,h3,p,ol,ul,figure,dl{margin:0}ol,ul{padding:0;list-style:none}
a{color:inherit}
:focus-visible{outline:3px solid var(--green);outline-offset:3px;border-radius:6px}

.wrap{width:min(560px,100% - 40px);margin:0 auto;
padding:calc(20px + var(--safe-t)) 0 calc(44px + var(--safe-b))}

.brand{display:inline-flex;align-items:center;min-height:44px;
font-size:18px;font-weight:700;letter-spacing:-.03em;text-decoration:none}

/* ------------------------------- the mark ------------------------------ */
.hero{text-align:center;padding:22px 0 0}
.mark{width:104px;height:104px;margin:0 auto 24px;display:block;overflow:visible}
.mark circle,.mark path{fill:none;stroke-linecap:round;stroke-linejoin:round}
.mark__plate{stroke:var(--green);stroke-width:2.2;opacity:.32}
.mark__rim{stroke:var(--green);stroke-width:1.3;opacity:.18}
.mark__check{stroke:var(--green);stroke-width:5}
.mark__steam{stroke:var(--green);stroke-width:1.8;opacity:0}

h1{font-size:clamp(34px,9.4vw,46px);font-weight:700;letter-spacing:-.042em;line-height:1.02}
.lede{margin:14px auto 0;max-width:30ch;font-size:17px;color:var(--muted);text-wrap:balance}
.lede b{color:var(--ink);font-weight:600}

/* --------------------------- reservation card --------------------------
   An invitation, not a receipt: the date is the largest thing in it, the
   money is a quiet endorsement at the bottom.
----------------------------------------------------------------------- */
.card{margin-top:30px;padding:26px 24px 22px;border:1px solid var(--line);
border-radius:var(--r-xl);background:var(--surface-warm);
box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 10px 30px -22px rgba(40,32,24,.30)}
.card__what{font-size:21px;font-weight:700;letter-spacing:-.025em;line-height:1.22;
overflow-wrap:anywhere;text-wrap:balance}
.card__when{margin-top:18px}
.card__date{font-size:clamp(25px,6.6vw,29px);font-weight:700;letter-spacing:-.035em;
line-height:1.1;overflow-wrap:anywhere}
.card__time{margin-top:4px;font-size:18px;font-weight:500;color:var(--muted)}
.card__rule{height:1px;margin:20px 0 16px;background:var(--line-soft)}
.card__foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
.card__where{font-size:15px;color:var(--muted)}
.paid{display:inline-flex;align-items:center;gap:7px;padding:8px 13px;border-radius:999px;
background:var(--green-soft);color:var(--green-ink);font-size:13.5px;font-weight:700;
letter-spacing:.005em;white-space:nowrap}
.paid svg{width:13px;height:13px;flex:none}

/* --------------------------------- next -------------------------------- */
.label{margin-top:42px;font-size:12.5px;font-weight:600;letter-spacing:.15em;
text-transform:uppercase;color:var(--muted)}
.steps{margin-top:14px}
.steps li{display:grid;grid-template-columns:30px 1fr;gap:15px;padding:17px 0;
border-bottom:1px solid var(--line-soft)}
.steps li:last-child{border-bottom:0;padding-bottom:0}
.steps i{font-style:normal;font-size:12.5px;font-weight:700;color:var(--green);padding-top:3px;
letter-spacing:.02em}
.steps b{display:block;font-size:16.5px;font-weight:700;letter-spacing:-.02em;margin-bottom:3px}
.steps span{color:var(--muted);font-size:15.5px}

.calm{margin-top:34px;padding:22px;border-radius:var(--r-lg);background:var(--green-soft)}
.calm b{display:block;font-size:16.5px;font-weight:700;letter-spacing:-.02em;
color:var(--green-ink);margin-bottom:5px}
.calm span{color:#4a6f5b;font-size:15.5px}

.manage{margin-top:30px;text-align:center}
.manage p{font-size:14px;color:var(--muted);margin-bottom:6px}
.manage div{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.manage a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;
font-size:14.5px;color:var(--muted);text-underline-offset:3px}
.manage a:hover{color:var(--ink)}

.foot{margin-top:40px;padding-top:20px;border-top:1px solid var(--line-soft);
display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;
color:var(--muted);font-size:13.5px}
.foot nav{display:flex;gap:6px}
.foot a{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;text-decoration:none}
.foot a:hover{color:var(--ink)}

/* ------------------------------- pending ------------------------------- */
.pend{text-align:center;padding:70px 0 40px}
.pend h2{font-size:21px;font-weight:700;letter-spacing:-.025em;margin-top:6px}
.pend p{margin:12px auto 0;max-width:34ch;color:var(--muted);font-size:15.5px}
.dots{display:inline-flex;gap:6px;margin-top:18px}
.dots i{width:6px;height:6px;border-radius:50%;background:var(--green);opacity:.3;
animation:blip 1.25s ease-in-out infinite}
.dots i:nth-child(2){animation-delay:.16s}.dots i:nth-child(3){animation-delay:.32s}
@keyframes blip{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:.95;transform:translateY(-3px)}}

@media(min-width:720px){
  .wrap{width:min(620px,100% - 72px);padding-top:40px}
  .hero{padding-top:34px}
  .card{padding:30px 28px 24px}
}

/* ------------------------------ the moment -----------------------------
   The plate draws itself, a check resolves inside it, then two wisps of
   steam. ~1.3s, then the page is still. Everything animates opacity and
   transform only, so nothing reflows and nothing shifts.
----------------------------------------------------------------------- */
.mark__plate{stroke-dasharray:290;stroke-dashoffset:290;animation:draw .9s cubic-bezier(.65,0,.35,1) .08s forwards}
.mark__rim{stroke-dasharray:227;stroke-dashoffset:227;animation:draw .8s cubic-bezier(.65,0,.35,1) .28s forwards}
.mark__check{stroke-dasharray:60;stroke-dashoffset:60;animation:draw .45s cubic-bezier(.34,1.2,.64,1) .7s forwards}
.mark__steam{animation:steam 3.8s ease-in-out 1.15s infinite}
.mark__steam--b{animation-delay:1.9s}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes steam{0%{opacity:0;transform:translateY(2px)}22%{opacity:.45}100%{opacity:0;transform:translateY(-11px)}}
.rv{opacity:0;transform:translateY(9px);animation:rise .62s var(--e) forwards}
.rv1{animation-delay:.82s}.rv2{animation-delay:.94s}.rv3{animation-delay:1.06s}.rv4{animation-delay:1.18s}
@keyframes rise{to{opacity:1;transform:none}}

@media(prefers-reduced-motion:reduce){
  .mark__plate,.mark__rim,.mark__check{stroke-dashoffset:0;animation:none}
  .mark__steam{display:none}
  .rv{opacity:1;transform:none;animation:none}
  .dots i{animation:none;opacity:.55}
}`;

/* ================================ pieces ================================ */

const mark = ({ check = true } = {}) => `
<svg class="mark" viewBox="0 0 120 120" aria-hidden="true">
  <circle class="mark__plate" cx="60" cy="60" r="46"/>
  <circle class="mark__rim" cx="60" cy="60" r="36"/>
  ${check ? '<path class="mark__check" d="M45 61.5 L55.5 72 L76 50"/>' : ''}
  <path class="mark__steam" d="M51 12c-3.5-4 3.5-6.5 0-11"/>
  <path class="mark__steam mark__steam--b" d="M69 12c-3.5-4 3.5-6.5 0-11"/>
</svg>`;

const TICK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"
  stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 7"/></svg>`;

const FOOT = `<div class="foot"><span>© 2026 Glutt</span>
<nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>`;

function shell({ title, body }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f7f3ee">
<title>${esc(title)}</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231f6b45'/%3E%3Ctext x='16' y='23' font-family='Helvetica, Arial, sans-serif' font-size='20' font-weight='bold' text-anchor='middle' fill='white'%3EG%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap">
<link rel="stylesheet" href="/landing/meta/tokens.css">
<style>${STYLE}</style></head>
<body><div class="wrap">${body}</div></body></html>`;
}

function money(payment) {
  const n = Number(payment.amount);
  if (!Number.isFinite(n)) return '';
  const cur = (payment.currency || 'USD').toUpperCase();
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

/* ================================ pages ================================= */

/**
 * @param {object} b a verified booking. Only fields verification produced are
 *                   rendered; anything absent is designed around, not invented.
 */
function successPage(b) {
  const { recipe, when, payment, eventName } = b;
  const paid = payment && payment.amount != null;

  // The headline sentence uses whatever was genuinely verified.
  const lede = recipe
    ? `You're making <b>${esc(recipe)}</b>${when.date ? ` on <b>${esc(when.date)}</b>` : ''}${
        when.time ? ` at <b>${esc(when.time)}</b>` : ''
      }.`
    : when.date
      ? `Your cooking session is booked for <b>${esc(when.date)}</b>${
          when.time ? ` at <b>${esc(when.time)}</b>` : ''
        }.`
      : `Your cooking session is booked.`;

  // Without a recipe the card leads with the verified event name, so the
  // layout reads as deliberate rather than missing something.
  const heading = recipe || eventName || 'Private cooking session';

  const manage =
    b.rescheduleUrl || b.cancelUrl
      ? `<div class="manage rv rv4"><p>Need to make a change?</p><div>${
          b.rescheduleUrl ? `<a href="${esc(b.rescheduleUrl)}">Reschedule</a>` : ''
        }${b.cancelUrl ? `<a href="${esc(b.cancelUrl)}">Cancel</a>` : ''}</div></div>`
      : '';

  const body = `
<a class="brand" href="/">Glutt</a>

<div class="hero">
  ${mark()}
  <h1 class="rv rv1">You're booked.</h1>
  <p class="lede rv rv2">${lede}</p>
</div>

<div class="card rv rv2">
  <p class="card__what">${esc(heading)}</p>
  ${
    when.date || when.time
      ? `<div class="card__when">
           ${when.date ? `<p class="card__date">${esc(when.date)}</p>` : ''}
           ${when.time ? `<p class="card__time">${esc(when.time)}</p>` : ''}
         </div>`
      : ''
  }
  <div class="card__rule"></div>
  <div class="card__foot">
    <span class="card__where">Your home · ingredients included</span>
    ${paid ? `<span class="paid">${TICK} Paid · ${esc(money(payment))}</span>` : ''}
  </div>
</div>

<p class="label rv rv3">We'll take it from here</p>
<ol class="steps rv rv3">
  <li><i>01</i><div><b>We get everything</b><span>We'll bring the ingredients you need for your recipe.</span></div></li>
  <li><i>02</i><div><b>We come to you</b><span>On your session day we'll arrive at your home with everything ready to cook.</span></div></li>
  <li><i>03</i><div><b>You cook</b><span>You'll make the recipe yourself with Glutt + Meta glasses guiding you, and we'll be there the whole way.</span></div></li>
</ol>

<div class="calm rv rv4">
  <b>Your session is locked in.</b>
  <span>Your confirmation and calendar invite are on the way. We'll reach out before your session if we need anything else.</span>
</div>

${manage}
${FOOT}`;

  return shell({ title: "You're booked — Glutt", body });
}

/** Shown while a genuine booking cannot yet be verified. Claims nothing. */
function pendingPage() {
  return shell({
    title: 'Confirming your session — Glutt',
    body: `<a class="brand" href="/">Glutt</a>
<div class="pend">
  ${mark({ check: false })}
  <h2>Confirming your session…</h2>
  <span class="dots"><i></i><i></i><i></i></span>
  <p>Your Calendly confirmation email is the source of truth while we reconnect. Refresh in a moment.</p>
</div>
${FOOT}`,
  });
}

module.exports = { successPage, pendingPage, esc };
