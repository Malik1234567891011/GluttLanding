/* ---------------------------------------------------------------------------
   analytics.js — additive only.

   The site ships no analytics provider today. Rather than install one, this
   collects landing interaction events and forwards them to whatever provider
   is present (dataLayer / gtag / plausible / posthog / fathom), then keeps a
   short in-memory log for debugging. If no provider is ever added, every call
   is a no-op — nothing is sent anywhere and no third party is contacted.
--------------------------------------------------------------------------- */

const log = [];

export function track(name, props = {}) {
  const payload = { ...props, page: 'landing_v2' };
  log.push({ name, payload, t: Date.now() });
  if (log.length > 80) log.shift();

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

/** Exposed for debugging: Glutt.events() in the console. */
window.Glutt = Object.assign(window.Glutt || {}, { events: () => log.slice() });

export function bindClicks(root = document) {
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ev]');
    if (el) track(el.dataset.ev, { label: el.textContent.trim().slice(0, 48) });
  });
}

/** Fires once per depth marker. */
export function scrollDepth(marks = [25, 50, 75, 100]) {
  const seen = new Set();
  let ticking = false;
  const read = () => {
    ticking = false;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    const pct = ((window.scrollY || 0) / h) * 100;
    for (const m of marks) {
      if (pct >= m && !seen.has(m)) {
        seen.add(m);
        track('scroll_depth', { depth: m });
      }
    }
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(read);
      }
    },
    { passive: true }
  );
}
