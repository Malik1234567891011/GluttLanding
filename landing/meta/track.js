/* ---------------------------------------------------------------------------
   track.js — attribution + funnel events for the paid route.

   Separate from landing/core/analytics.js on purpose: that module belongs to
   the homepage which is already in production, and this one additionally owns
   the Meta Pixel and campaign capture. Nothing here is shared, so neither can
   break the other.

   Privacy: campaign parameters only. No name, email, phone, address, recipe
   text or payment detail is ever passed to an analytics provider from here.
--------------------------------------------------------------------------- */

import { META_PIXEL_ID } from './config.js';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const CLICK_KEYS = ['fbclid', 'gclid', 'ttclid'];
const ATTR_COOKIE = 'glutt_attr';

const log = [];

/* ----------------------------- attribution ----------------------------- */

function readCookie(name) {
  return document.cookie
    .split('; ')
    .find((c) => c.startsWith(name + '='))
    ?.slice(name.length + 1);
}

/**
 * Campaign parameters from the ad click, remembered in a first-party cookie so
 * they survive the round trip out to Calendly and back to /cooking/confirmed.
 * Values are truncated and whitelisted — never the full query string.
 */
export function attribution() {
  const q = new URLSearchParams(location.search);
  const fresh = {};
  for (const k of [...UTM_KEYS, ...CLICK_KEYS]) {
    const v = q.get(k);
    if (v) fresh[k] = v.slice(0, 120);
  }

  if (Object.keys(fresh).length) {
    try {
      document.cookie =
        `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(fresh))}; Path=/; Max-Age=2592000; SameSite=Lax` +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch {
      /* cookies blocked — attribution is best-effort, never load-bearing */
    }
    return fresh;
  }

  try {
    const stored = readCookie(ATTR_COOKIE);
    return stored ? JSON.parse(decodeURIComponent(stored)) : {};
  } catch {
    return {};
  }
}

/* ------------------------------- pixel -------------------------------- */

/**
 * Uses whatever Pixel is already on the page. The base code is only injected
 * when there is no `fbq` at all and an ID is configured, so a Pixel installed
 * globally (or by a tag manager) is adopted rather than duplicated — calling
 * init twice would double-count everything.
 */
export function ensurePixel() {
  if (typeof window.fbq === 'function') return true;
  if (!META_PIXEL_ID) return false;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
  return true;
}

/**
 * Meta standard event. `id` becomes the eventID, which is how Meta collapses
 * the same conversion reported from more than one place.
 *
 * Only ever pass non-personal parameters: value, currency and the like. No
 * name, email, phone, address or recipe goes anywhere near this.
 */
export function pixel(event, params = {}, id) {
  if (!ensurePixel()) return; // no Pixel on the page: nothing to do, nothing breaks
  try {
    window.fbq('track', event, params, id ? { eventID: id } : undefined);
  } catch {
    /* never let a tracking failure break booking */
  }
}

/* ------------------------------- events -------------------------------- */

export function track(name, props = {}) {
  const payload = { ...attribution(), ...props, page: 'meta' };
  log.push({ name, payload, t: Date.now() });
  if (log.length > 60) log.shift();

  try {
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: name, ...payload });
    if (typeof window.gtag === 'function') window.gtag('event', name, payload);
    if (typeof window.plausible === 'function') window.plausible(name, { props: payload });
    if (window.posthog?.capture) window.posthog.capture(name, payload);
    if (window.fathom?.trackEvent) window.fathom.trackEvent(name);
  } catch {
    /* analytics must never break the page */
  }
}

export function initTracking() {
  attribution();
  ensurePixel();
  track('meta_landing_view');
}

window.Glutt = Object.assign(window.Glutt || {}, { metaEvents: () => log.slice() });
