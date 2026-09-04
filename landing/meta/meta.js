/* ---------------------------------------------------------------------------
   meta.js — behaviour for the paid-acquisition page.

   Everything above the fold (headline, price, action) is server-rendered HTML
   and needs none of this. This module only adds the scheduler, the sticky
   action and measurement, so the page is useful before it runs and still
   useful if it never does.
--------------------------------------------------------------------------- */

import {
  CALENDLY_BOOKING_URL,
  CALENDLY_INTRO_URL,
  calendlyEmbedUrl,
  PRICE,
  PRICE_VALUE,
} from './config.js';
import { initTracking, track, pixel, attribution } from './track.js';

document.documentElement.classList.remove('no-js');

const $ = (id) => document.getElementById(id);

/* ------------------------- which booking is this? -------------------------
   A page hosts exactly one Calendly event and declares which via data-booking
   on #cal. Everything downstream — the Meta event, the dedupe key, the
   confirmation route — reads from this one table, so a single booking can
   never fire both Schedule and Purchase. There is no default: an unrecognised
   value books nothing rather than guessing.

     intro : the FREE 10-minute call  -> Schedule, no value, never Purchase
     paid  : the $109.99 session      -> Purchase 109.99 USD
------------------------------------------------------------------------- */

const BOOKINGS = {
  intro: {
    url: CALENDLY_INTRO_URL,
    metaEvent: 'Schedule',
    // deliberately no value/currency: nothing is charged for an intro call
    params: {},
    dedupeKey: 'glutt_intro_scheduled',
    trackName: 'meta_intro_call_scheduled',
    confirmPath: () => '/intro/confirmed',
  },
  paid: {
    url: CALENDLY_BOOKING_URL,
    metaEvent: 'Purchase',
    params: { value: PRICE_VALUE, currency: 'USD' },
    dedupeKey: 'glutt_purchase',
    trackName: 'meta_booking_scheduled',
    // the server verifies the payment and issues the signed cookie
    confirmPath: (ids) => {
      const u = new URL('/api/cooking/confirm', location.origin);
      u.searchParams.set('invitee_uuid', ids.invitee);
      if (ids.event) u.searchParams.set('event_uuid', ids.event);
      return u.toString();
    },
  },
};

const bookingKind = document.getElementById('cal')?.dataset.booking || '';
const BOOKING = BOOKINGS[bookingKind] || null;

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
    // Retreat as soon as the scheduler reaches the strip the bar occupies, so
    // it can never sit over the date controls at any scroll position.
    const barH = bar.offsetHeight || 82;
    const calArrived = cal.getBoundingClientRect().top < window.innerHeight - barH;
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
  const map = {
    utmSource: a.utm_source,
    utmMedium: a.utm_medium,
    utmCampaign: a.utm_campaign,
    utmContent: a.utm_content,
    utmTerm: a.utm_term,
  };
  /* Drop the keys we do not have. Calendly serialises a missing value as the
     literal string "undefined" into the embed URL, which then lands in their
     attribution as a real campaign name. Only send what actually arrived. */
  for (const k of Object.keys(map)) {
    if (!map[k]) delete map[k];
  }
  return map;
}

function showFailure(host, skel) {
  if (host.querySelector('.cal__fail')) return;
  skel?.remove();
  const box = document.createElement('div');
  box.className = 'cal__fail';
  box.innerHTML =
    '<p>We couldn’t load available times.</p>' +
    `<a class="btn btn--primary" href="${BOOKING.url}" target="_blank" rel="noopener">Open booking page</a>`;
  host.appendChild(box);
  track('meta_calendar_failed');
}

/* Shown when the intro event has not been created in Calendly yet, so the page
   states the situation plainly instead of rendering an empty box. */
function showUnconfigured(host, skel) {
  skel?.remove();
  const box = document.createElement('div');
  box.className = 'cal__fail';
  box.innerHTML =
    '<p>Booking is not open yet. Email <a href="mailto:hi@cielpm.ai">hi@cielpm.ai</a> and we will set up a time.</p>';
  host.appendChild(box);
  console.warn('[glutt] CALENDLY_INTRO_URL is not set in landing/meta/config.js');
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

  if (!BOOKING) return; // page declares no booking; nothing to embed

  const embedUrl = calendlyEmbedUrl(BOOKING.url);
  if (direct) direct.href = BOOKING.url;

  if (!BOOKING.url) {
    showUnconfigured(host, skel);
    return;
  }

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

      /* Wait for the scheduler to actually paint. The iframe's load event fires
         while Calendly is still rendering, and its first postMessage arrives
         earlier still — settling on either left a blank panel. Calendly emits
         event_type_viewed once the scheduling page is on screen, which is the
         honest signal. (Presentation only: the tracking listener is separate
         and untouched, and the timeouts below still cover a missed message.) */
      window.addEventListener('message', (e) => {
        if (e.origin === 'https://calendly.com' && e.data?.event === 'calendly.event_type_viewed') {
          settle();
        }
      });

      /* The fallback is guarded: removing the skeleton on a bare timer pulls
         the section's height out from under the page while the iframe is still
         blank. It only fires once the iframe has actually laid out. */
      const settleIfPainted = () => {
        const f = host.querySelector('iframe');
        if (f && f.offsetHeight > 200) settle();
      };

      const attach = (f) => {
        // not settle() on load — Calendly is still rendering at that point
        f.addEventListener('load', () => setTimeout(settleIfPainted, 1200), { once: true });
        setTimeout(settleIfPainted, 5000);
        setTimeout(settleIfPainted, 9000);
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

/* --------------------------- the conversion --------------------------------
   Fired only on a completed booking — never on opening the scheduler, picking
   a day or a time, reaching payment, or reloading.

   Which Meta event goes out is decided entirely by BOOKING, which comes from
   the page's data-booking attribute. The free intro call sends Schedule with
   no value; the paid session sends Purchase at 109.99 USD. Neither page can
   send the other's event, because neither page hosts the other's embed.

   eventID is the Calendly invitee uuid. For the paid session that is also what
   the server-verified confirmation reports, so Meta collapses the pair into one
   conversion. Nothing personal is sent: value, currency and an opaque id.
------------------------------------------------------------------------- */

const firedBookings = new Set();

const uuidFromUri = (uri) =>
  typeof uri === 'string' ? uri.split('/').filter(Boolean).pop() || '' : '';

/** Both identifiers travel in the same event_scheduled message. */
function idsFrom(payload) {
  return {
    invitee: uuidFromUri(payload?.invitee?.uri),
    event: uuidFromUri(payload?.event?.uri),
  };
}

function alreadyCounted(key) {
  if (firedBookings.has(key)) return true;
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false; // storage blocked; the in-memory guard and eventID still hold
  }
}

function markCounted(key) {
  firedBookings.add(key);
  try {
    localStorage.setItem(key, '1');
  } catch {
    /* ignore */
  }
}

function recordConversion(id) {
  if (!BOOKING) return;
  const key = `${BOOKING.dedupeKey}:${id || 'unidentified-booking'}`;

  // once per booking, however many times the listener or the page runs
  if (alreadyCounted(key)) return;
  markCounted(key);

  track(BOOKING.trackName, id ? { booking_id: id } : {});
  pixel(BOOKING.metaEvent, BOOKING.params, id || undefined);

  if (!id) {
    console.warn(
      `[glutt] event_scheduled carried no invitee uri — ${BOOKING.metaEvent} sent without an eventID`
    );
  }
}

/* ------------------------- handover to confirmation -----------------------
   Calendly's own "You are scheduled!" panel is the end of the road inside the
   iframe; we send the customer to our own confirmation instead. Where that is
   depends on the booking kind: the free call goes to a static page, the paid
   session goes through server-side verification first.

   The navigation is held briefly so the Meta beacon leaves first — fbq sends
   asynchronously and an immediate navigation can cancel it in flight.
------------------------------------------------------------------------- */

const HANDOVER_DELAY_MS = 800;
let handingOver = false;

function goToConfirmation(ids) {
  if (handingOver || !BOOKING) return;

  // Without the invitee uuid the paid confirmation cannot verify anything and
  // would bounce the customer to /meta, so leave them on Calendly's own panel.
  if (!ids.invitee && bookingKind === 'paid') {
    console.warn('[glutt] event_scheduled carried no invitee uri — staying on Calendly\'s confirmation');
    return;
  }

  handingOver = true;
  const target = BOOKING.confirmPath(ids);
  // replace, not assign: a completed booking should not be reachable with Back
  setTimeout(() => location.replace(target), HANDOVER_DELAY_MS);
}

/* --------------------------- Calendly events ----------------------------
   Officially supported postMessage events, read from Calendly's own origin.
   Nothing here reaches into the iframe, so Calendly's native Pixel integration
   is untouched.
------------------------------------------------------------------------- */

function initCalendlyEvents() {
  window.addEventListener('message', (e) => {
    if (e.origin !== 'https://calendly.com') return;
    const name = e.data?.event;
    if (typeof name !== 'string' || !name.startsWith('calendly.')) return;

    if (name === 'calendly.event_type_viewed') track('meta_booking_started');
    if (name === 'calendly.date_and_time_selected') {
      track('meta_booking_time_selected');
      // only the paid session is a checkout; picking a time for a free call is not
      if (bookingKind === 'paid') {
        pixel('InitiateCheckout', { value: PRICE_VALUE, currency: 'USD' });
      }
    }
    if (name === 'calendly.event_scheduled') {
      const ids = idsFrom(e.data?.payload);
      recordConversion(ids.invitee); // Schedule or Purchase — never both
      goToConfirmation(ids);
    }
  });
}

/* --------------------------------- CTA ---------------------------------- */

function initCtas() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ev]');
    if (el) track(el.dataset.ev, el.dataset.cta ? { placement: el.dataset.cta } : {});
  });
}

/* Keeps every price label in step with PRICE in config.js. The HTML already
   ships the right number, so nothing flashes; this only matters when the price
   changes there. The CTA copy is deliberately not price-led — "See available
   times" describes what the click actually does, since it only scrolls to the
   scheduler and charges nothing. */
function syncPrice() {
  for (const el of document.querySelectorAll('[data-price]')) {
    if (el.textContent.trim() !== PRICE) el.textContent = PRICE;
  }
}

/* Continuity for the "V1 | Founder AI Glasses" ad. Meta passes the ad name in
   utm_content, so traffic from that creative gets one line confirming they
   landed on the right thing. Everyone else never sees it. Read-only: the
   parameter is matched, never modified, and attribution is untouched. */
function initMatchLine() {
  const el = $('matchline');
  if (!el) return;
  const content = (new URLSearchParams(location.search).get('utm_content') || '').toLowerCase();
  // tolerant of Meta's naming: "V1 | Founder AI Glasses", "v1_founder_ai_glasses", etc.
  const isGlassesAd = /glass/.test(content) || (/\bv1\b/.test(content) && /founder/.test(content));
  if (isGlassesAd) el.hidden = false;
}

/* --------------------------------- boot --------------------------------- */

syncPrice();
initMatchLine();

initTracking();
initCtas();
initSticky();
initCalendly();
initCalendlyEvents();
