/* ---------------------------------------------------------------------------
   meta.js — behaviour for the paid-acquisition page.

   Everything above the fold (headline, price, action) is server-rendered HTML
   and needs none of this. This module only adds the scheduler, the sticky
   action and measurement, so the page is useful before it runs and still
   useful if it never does.
--------------------------------------------------------------------------- */

import { CALENDLY_BOOKING_URL, calendlyEmbedUrl, PRICE } from './config.js';
import { initTracking, track, pixel, attribution } from './track.js';

document.documentElement.classList.remove('no-js');

const $ = (id) => document.getElementById(id);
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------ hero video ------------------------------
   Kept off the critical path: nothing is fetched until the page has painted,
   and never on a metered connection or with reduced motion.
------------------------------------------------------------------------- */

function initVideo() {
  const v = $('hero-video');
  if (!v) return;

  const saveData = navigator.connection?.saveData;
  const slow = /2g/.test(navigator.connection?.effectiveType || '');
  if (reduced || saveData || slow) {
    v.pause?.(); // the poster is a complete image on its own
    v.removeAttribute('autoplay');
    return;
  }

  const start = () => {
    v.preload = 'auto';
    v.load();
    v.play?.().catch(() => {
      /* autoplay refused — the poster remains, which is a complete image */
    });
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  // don't decode frames for a video nobody is looking at
  new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) v.play?.().catch(() => {});
      else v.pause?.();
    }
  }).observe(v);
}

/* ------------------------------ sticky CTA ------------------------------
   Appears once the hero action has scrolled away, and gets out of the way
   again as soon as the scheduler is on screen so it can never sit on top of
   the date and time controls.
------------------------------------------------------------------------- */

function initSticky() {
  const bar = $('sticky');
  const heroCta = document.querySelector('.hero .btn');
  const cal = $('cal');
  if (!bar || !heroCta || !cal) return;

  /* Watching the whole booking section was wrong: it is over a thousand pixels
     tall, so it counted as "visible" while the reader was still on the steps
     and the bar never appeared at all. What matters is the scheduler itself —
     the bar shows once the hero button is gone, and gets out of the way as the
     calendar actually arrives, so it can never sit over the date controls. */
  let raf = 0;
  const read = () => {
    raf = 0;
    const heroGone = heroCta.getBoundingClientRect().bottom < 0;
    const calArrived = cal.getBoundingClientRect().top < window.innerHeight * 0.4;
    bar.classList.toggle('is-in', heroGone && !calArrived);
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  bar.hidden = false;
  read();
}

/* ------------------------------- Calendly -------------------------------
   Loaded only as the booking section approaches, and driven entirely through
   Calendly's documented embed API and postMessage events. No reaching into
   the iframe.
------------------------------------------------------------------------- */

const CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const LOAD_TIMEOUT = 12000;

function utmFromAttribution() {
  const a = attribution();
  return {
    utmSource: a.utm_source,
    utmMedium: a.utm_medium,
    utmCampaign: a.utm_campaign,
    utmContent: a.utm_content,
    utmTerm: a.utm_term,
  };
}

function showFailure(host, skel) {
  if (host.querySelector('.cal__fail')) return;
  skel?.remove();
  const box = document.createElement('div');
  box.className = 'cal__fail';
  box.innerHTML =
    '<p>We couldn’t load available times.</p>' +
    `<a class="btn btn--primary" href="${CALENDLY_BOOKING_URL}" target="_blank" rel="noopener">Open booking calendar</a>`;
  host.appendChild(box);
  track('meta_calendar_failed');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      if (window.Calendly) resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.addEventListener('load', resolve, { once: true });
    s.addEventListener('error', reject, { once: true });
    document.head.appendChild(s);
  });
}

function initCalendly() {
  const host = $('cal');
  const skel = $('cal-skel');
  const direct = $('cal-direct');
  if (!host) return;

  const embedUrl = calendlyEmbedUrl();
  if (direct) direct.href = CALENDLY_BOOKING_URL;

  let started = false;

  const boot = async () => {
    if (started) return;
    started = true;

    const timer = setTimeout(() => showFailure(host, skel), LOAD_TIMEOUT);

    try {
      await loadScript(CALENDLY_SCRIPT);
      if (!window.Calendly?.initInlineWidget) throw new Error('Calendly API missing');

      window.Calendly.initInlineWidget({
        url: embedUrl,
        parentElement: host,
        prefill: {},
        utm: utmFromAttribution(),
      });

      /* Hand off from the skeleton to the real scheduler. initInlineWidget
         injects its iframe synchronously, so the element already exists by the
         time we get here — watching for it with a MutationObserver would wait
         for a mutation that has already happened. Settle on whichever arrives
         first: the iframe's load event, or Calendly's first postMessage. */
      const settle = () => {
        if (!skel || !skel.isConnected) return;
        clearTimeout(timer);
        skel.remove();
        host.classList.add('is-live');
        track('meta_calendar_viewed');
      };

      window.addEventListener('message', (e) => {
        if (e.origin === 'https://calendly.com' && typeof e.data?.event === 'string') settle();
      });

      /* The fallback is guarded: removing the skeleton on a bare timer pulls
         the section's height out from under the page while the iframe is still
         blank. It only fires once the iframe has actually laid out. */
      const settleIfPainted = () => {
        const f = host.querySelector('iframe');
        if (f && f.offsetHeight > 200) settle();
      };

      const attach = (f) => {
        f.addEventListener('load', settle, { once: true });
        setTimeout(settleIfPainted, 4000);
        setTimeout(settleIfPainted, 8000);
      };

      const frame = host.querySelector('iframe');
      if (frame) attach(frame);
      else {
        const watch = new MutationObserver(() => {
          const f = host.querySelector('iframe');
          if (!f) return;
          watch.disconnect();
          attach(f);
        });
        watch.observe(host, { childList: true, subtree: true });
      }
    } catch {
      clearTimeout(timer);
      showFailure(host, skel);
    }
  };

  // start fetching a screen before the section arrives
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) boot();
    },
    { rootMargin: '600px 0px' }
  ).observe(host);

  // …and immediately if someone taps the action first
  document.querySelectorAll('a[href="#book"]').forEach((a) => a.addEventListener('click', boot));
}

/* --------------------------- Calendly events ----------------------------
   Officially supported postMessage events. `event_scheduled` fires when the
   booking is created — the Purchase conversion itself is only counted on the
   server-verified confirmation page, never here.
------------------------------------------------------------------------- */

function initCalendlyEvents() {
  window.addEventListener('message', (e) => {
    if (e.origin !== 'https://calendly.com') return;
    const name = e.data?.event;
    if (typeof name !== 'string' || !name.startsWith('calendly.')) return;

    if (name === 'calendly.event_type_viewed') track('meta_booking_started');
    if (name === 'calendly.date_and_time_selected') {
      track('meta_booking_time_selected');
      pixel('InitiateCheckout', { value: 100, currency: 'USD' });
    }
    if (name === 'calendly.event_scheduled') track('meta_booking_scheduled');
  });
}

/* --------------------------------- CTA ---------------------------------- */

function initCtas() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ev]');
    if (el) track(el.dataset.ev, el.dataset.cta ? { placement: el.dataset.cta } : {});
  });
}

/* The HTML ships the correct price already, so there is never a flash; this
   only matters when someone changes PRICE in config.js. */
function syncPrice() {
  for (const el of document.querySelectorAll('[data-price]')) {
    const next = (el.dataset.price === 'cta' ? `Book for ${PRICE}` : PRICE);
    if (el.textContent.trim() !== next) el.textContent = next;
  }
}

/* --------------------------------- boot --------------------------------- */

syncPrice();

initTracking();
initCtas();
initVideo();
initSticky();
initCalendly();
initCalendlyEvents();
