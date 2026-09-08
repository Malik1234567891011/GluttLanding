/* ---------------------------------------------------------------------------
   /app — configuration.

   Public values only. A Pixel ID is visible in the source of any page that
   loads one and an App Store link is meant to be followed, so neither is a
   secret. Real credentials (a CAPI token) would live in the environment and be
   read only by the server — see the stub in track.js.
--------------------------------------------------------------------------- */

/** Glutt: Recipes & AI Chef — verified live via Apple's lookup API. */
export const APP_STORE_URL = 'https://apps.apple.com/app/id6780553556';

/** The Glutt Miami website dataset, same as the rest of the site. */
export const PIXEL_ID = '2198241070747099';

/**
 * Tracking is skipped anywhere that is not the live domain, so local work and
 * Vercel previews never pollute the dataset.
 */
export const IS_PRODUCTION =
  typeof location !== 'undefined' && /(^|\.)glutt\.org$/.test(location.hostname);
