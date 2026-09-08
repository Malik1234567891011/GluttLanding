/* ---------------------------------------------------------------------------
   app.js — behaviour for the install page.

   The page is useful before this runs: the hero, the copy and every CTA are
   plain HTML with the real App Store href, so a failed module costs nothing.
   This adds the video, the sticky bar and the conversion tracking.
--------------------------------------------------------------------------- */

import { APP_STORE_URL } from './config.js';
import { captureClickId, attribution, pageView, appStoreClick } from './track.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------ hero video ------------------------------
   Never the LCP: the poster is preloaded and painted, and the file is only
   fetched once the page has loaded. On a metered connection or with reduced
   motion the poster simply stays.
------------------------------------------------------------------------- */

function initVideo() {
  const v = document.getElementById('hero-video');
  if (!v) return;

  const saveData = navigator.connection?.saveData;
  const slow = /2g/.test(navigator.connection?.effectiveType || '');
  if (reduced || saveData || slow) return;

  const start = () => {
    v.preload = 'auto';
    v.load();
    // muted + playsinline is what lets iOS autoplay at all; if it still
    // refuses, the poster is already a complete image.
    v.play?.().catch(() => {});
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  // don't decode frames for a video nobody is looking at
  new IntersectionObserver((entries) => {
    for (const e of entries) e.isIntersecting ? v.play?.().catch(() => {}) : v.pause?.();
  }).observe(v);
}

/* ------------------------------ sticky bar ------------------------------
   Appears once the hero CTA has scrolled away and retreats before the final
   CTA, so the two never stack on top of each other.
------------------------------------------------------------------------- */

function initSticky() {
  const bar = document.getElementById('sticky');
  const heroCta = document.querySelector('.hero .cta');
  const finalCta = document.querySelector('.sec--final');
  if (!bar || !heroCta || !finalCta) return;

  let raf = 0;
  const read = () => {
    raf = 0;
    const heroGone = heroCta.getBoundingClientRect().bottom < 0;
    // retreat by the bar's own measured height so it can never cover the
    // final call to action or the footer links
    const barH = bar.offsetHeight || 96;
    const finalHere = finalCta.getBoundingClientRect().top < window.innerHeight - barH;
    bar.classList.toggle('is-in', heroGone && !finalHere);
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  bar.hidden = false;
  read();
}

/* -------------------------------- the tap -------------------------------
   Every App Store button reports the same conversion. The link is a real
   href, so the navigation happens whether or not tracking succeeds — the
   beacon is fired first and the browser sends it during unload.
------------------------------------------------------------------------- */

function initCtas() {
  for (const el of document.querySelectorAll('[data-store]')) {
    // config is the source of truth; the markup carries the same URL so the
    // button still works with no JS
    if (el.getAttribute('href') !== APP_STORE_URL) el.setAttribute('href', APP_STORE_URL);

    el.addEventListener('click', () => {
      appStoreClick(el.dataset.placement || 'unknown');
    });
  }
}

/* --------------------------------- boot --------------------------------- */

captureClickId();
// persist campaign parameters on arrival, not just at click time — a visitor
// may land with them and convert after navigating around
attribution();
pageView();
initCtas();
initVideo();
initSticky();
