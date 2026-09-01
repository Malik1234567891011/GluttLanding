/* ---------------------------------------------------------------------------
   config.js (server) — mirrors the public values in landing/meta/config.js.

   Kept as a separate CommonJS file because this project has no build step:
   the browser needs ES modules and Vercel's functions are CommonJS. If you
   change the booking URL, change it in both files.

   Secrets are read from the environment only, and never sent to the client:
     CALENDLY_API_TOKEN   Calendly personal access token
     CONFIRMATION_SECRET  HMAC key for the short-lived confirmation cookie
     META_PIXEL_ID        optional; enables the Purchase signal on confirmation
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
  pixelId: () => process.env.META_PIXEL_ID || '',

  /** Where unverified visitors go. */
  FALLBACK_PATH: '/meta',
  CONFIRMED_PATH: '/cooking/confirmed',
};
