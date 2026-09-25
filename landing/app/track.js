/* ---------------------------------------------------------------------------
   track.js — campaign parameters and a local event log for /app.

   The Meta Pixel lived here until 2026-09-25 and was removed with the ads it
   reported on. Nothing is sent anywhere now: campaign parameters are kept in a
   first-party cookie in case a provider is ever added, and taps on the store
   buttons are logged in memory (`Glutt.appEvents()` in the console).

   Nothing personal is ever stored — no email, name or query text.
--------------------------------------------------------------------------- */


const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const CLICK_KEYS = ['fbclid', 'gclid', 'ttclid'];
const ATTR_COOKIE = 'glutt_attr';

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

/** Kept so app.js needs no change; the Meta click-id cookie is no longer written. */
export function captureClickId() {}

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

/* -------------------------------- events --------------------------------- */

/**
 * The Meta Pixel was removed on 2026-09-25: the ads it reported on are not
 * running, and it was the only thing on the site setting third-party cookies.
 * These calls stay because app.js calls them, and because the local log is
 * handy in the console. Nothing leaves the page.
 */

const uuid = () =>
  crypto?.randomUUID?.() ??
  `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export function pageView() {
  /* no analytics provider; kept so the call site does not have to change */
}

/** One tap on a store button. Logged locally so the funnel can be eyeballed. */
export function appStoreClick(placement) {
  const eventId = uuid();
  log.push({ eventId, placement, ...attribution(), t: Date.now() });
  return eventId;
}

/** Exposed for debugging: Glutt.appEvents() in the console. */
window.Glutt = Object.assign(window.Glutt || {}, { appEvents: () => log.slice() });
