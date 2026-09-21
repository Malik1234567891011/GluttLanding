/* ---------------------------------------------------------------------------
   pixel.js — the site-wide Meta Pixel.

   Loaded on every page except /app, which boots the same Pixel ID from its
   own landing/app/track.js. Adopts an existing window.fbq and only installs
   the base code when there is none, so a page can never end up with two
   Pixels or two inits.

   This used to live in landing/meta/ beside the in-person booking funnel.
   The funnel is gone; the Pixel stays because the App Store ads report to it.
--------------------------------------------------------------------------- */

const META_PIXEL_ID = '2198241070747099';

function ensurePixel() {
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

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');
  return true;
}

ensurePixel();
