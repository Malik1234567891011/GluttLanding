/* ---------------------------------------------------------------------------
   track.js — Meta Pixel for the /app install page.

   One conversion matters here: a tap on an App Store button. Every tap fires a
   custom event AND a standard one, sharing an event_id so a future Conversions
   API call can be deduplicated against it.

   Nothing personal is ever sent — no email, name or query text. Just the event,
   an opaque id, and campaign parameters.
--------------------------------------------------------------------------- */

import { PIXEL_ID, IS_PRODUCTION } from './config.js';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const CLICK_KEYS = ['fbclid', 'gclid', 'ttclid'];
const ATTR_COOKIE = 'glutt_attr';
const FBC_COOKIE = '_fbc';

const log = [];
const setCookie = (name, value, maxAge) => {
  try {
    document.cookie =
      `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax` +
      (location.protocol === 'https:' ? '; Secure' : '');
  } catch {
    /* cookies blocked — attribution is best-effort, never load-bearing */
  }
};
const readCookie = (name) =>
  document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.slice(name.length + 1);

/* ----------------------------- attribution ------------------------------ */

/**
 * Meta's click id has a defined cookie shape: fb.1.<timestamp>.<fbclid>.
 * Writing it ourselves means a later Conversions API call can send `fbc` and
 * match the click even though the browser event is what fired first.
 */
export function captureClickId() {
  const fbclid = new URLSearchParams(location.search).get('fbclid');
  if (fbclid && !readCookie(FBC_COOKIE)) {
    setCookie(FBC_COOKIE, `fb.1.${Date.now()}.${fbclid.slice(0, 400)}`, 7776000); // 90 days
  }
}

export function attribution() {
  const q = new URLSearchParams(location.search);
  const fresh = {};
  for (const k of [...UTM_KEYS, ...CLICK_KEYS]) {
    const v = q.get(k);
    if (v) fresh[k] = v.slice(0, 120);
  }
  if (Object.keys(fresh).length) {
    setCookie(ATTR_COOKIE, encodeURIComponent(JSON.stringify(fresh)), 2592000);
    return fresh;
  }
  try {
    const s = readCookie(ATTR_COOKIE);
    return s ? JSON.parse(decodeURIComponent(s)) : {};
  } catch {
    return {};
  }
}

/* -------------------------------- pixel --------------------------------- */

/**
 * Adopts an existing fbq if one is already on the page and only installs the
 * base code when there is none, so a Pixel added site-wide can never be
 * initialised twice.
 */
function ensurePixel() {
  if (!IS_PRODUCTION || !PIXEL_ID) return false;
  if (typeof window.fbq === 'function') return true;

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

  window.fbq('init', PIXEL_ID);
  return true;
}

const uuid = () =>
  crypto?.randomUUID?.() ??
  `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function pageView() {
  if (!ensurePixel()) return;
  try {
    window.fbq('track', 'PageView');
  } catch {
    /* tracking must never break the page */
  }
}

/**
 * One tap → two events sharing an event_id:
 *   AppStoreClick  custom, so the funnel reads plainly in Events Manager
 *   Lead           standard, so Meta can optimise delivery against it
 * Meta deduplicates a browser event against a server event with the same
 * eventID, which is what the CAPI stub below is for.
 */
export function appStoreClick(placement) {
  const eventId = uuid();
  const props = { placement, ...attribution() };

  if (ensurePixel()) {
    try {
      window.fbq('trackCustom', 'AppStoreClick', props, { eventID: eventId });
      window.fbq('track', 'Lead', {}, { eventID: eventId });
    } catch {
      /* ignore */
    }
  }

  sendToCapi({ eventName: 'AppStoreClick', eventId, props });
  log.push({ eventId, placement, t: Date.now() });
  return eventId;
}

/* ------------------------- Conversions API stub --------------------------
   Deliberately not implemented. Wiring it needs a META_CAPI_TOKEN, which must
   stay server-side — it can never live in this file or in config.js.

   To turn it on:
     1. add /api/meta-capi.js that reads process.env.META_CAPI_TOKEN
     2. POST to https://graph.facebook.com/v21.0/<PIXEL_ID>/events with
        event_name, event_id (the same one passed here), event_source_url,
        action_source: 'website', and user_data.fbc from the _fbc cookie
     3. flip CAPI_ENDPOINT below to '/api/meta-capi'
   Meta will then collapse the browser event and the server event into one
   conversion, because they carry the same event_id.
------------------------------------------------------------------------- */

const CAPI_ENDPOINT = '';

function sendToCapi(payload) {
  if (!CAPI_ENDPOINT || !IS_PRODUCTION) return;
  try {
    const body = JSON.stringify({ ...payload, fbc: readCookie(FBC_COOKIE) || null, url: location.href });
    // keepalive so the request survives the navigation to the App Store
    navigator.sendBeacon?.(CAPI_ENDPOINT, new Blob([body], { type: 'application/json' })) ||
      fetch(CAPI_ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
  } catch {
    /* never block the tap */
  }
}

/** Exposed for debugging: Glutt.appEvents() in the console. */
window.Glutt = Object.assign(window.Glutt || {}, { appEvents: () => log.slice() });
