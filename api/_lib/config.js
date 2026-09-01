/* ---------------------------------------------------------------------------
   config.js (server) — mirrors the public values in landing/meta/config.js.

   Kept as a separate CommonJS file because this project has no build step:
   the browser needs ES modules and Vercel's functions are CommonJS. If you
   change the booking URL, change it in both files.

   Secrets are read from the environment only, and never sent to the client:
     CALENDLY_API_TOKEN   Calendly personal access token
     CONFIRMATION_SECRET  HMAC key for the short-lived confirmation cookie
     META_PIXEL_ID        optional override for the Pixel ID below
     NEXT_PUBLIC_META_PIXEL_ID  also accepted (same thing; no build step here)
--------------------------------------------------------------------------- */

const CALENDLY_BOOKING_URL =
  process.env.CALENDLY_BOOKING_URL || 'https://calendly.com/hi-cielpm/30min';

module.exports = {
  CALENDLY_BOOKING_URL,

  /** Strip query/trailing slash so it can be compared with Calendly's own
      event_type.scheduling_url. */
  bookingUrlKey() {
    try {
      const u = new URL(CALENDLY_BOOKING_URL);
      return (u.origin + u.pathname).replace(/\/+$/, '').toLowerCase();
    } catch {
      return '';
    }
  },

  apiToken: () => process.env.CALENDLY_API_TOKEN || '',
  secret: () => process.env.CONFIRMATION_SECRET || '',
  /**
   * Reserved for the Conversions API. No browser Pixel event is sent from the
   * server-rendered confirmation page — /meta owns the single browser Purchase
   * — so nothing reads this today.
   *
   * Either env name works, since server-rendered code can read the environment.
   * NEXT_PUBLIC_ is a Next.js build-time convention and this project has no
   * build step; it is accepted only because that is where the value was put.
   * The static /meta page cannot read either one: its value is the literal in
   * landing/meta/config.js.
   */
  pixelId: () =>
    process.env.META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    '1095750586231675', // website Pixel, not the app dataset

  /** Where unverified visitors go. */
  FALLBACK_PATH: '/meta',
  CONFIRMED_PATH: '/cooking/confirmed',
};
