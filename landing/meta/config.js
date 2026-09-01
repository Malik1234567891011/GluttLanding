/* ---------------------------------------------------------------------------
   config.js — the two public values the /meta funnel needs.

   Both are public by nature: a Calendly scheduling URL is meant to be visited,
   and a Meta Pixel ID is visible in the source of every page that loads one.
   Neither is a credential, so neither belongs in an environment variable that
   a static page cannot read anyway.

   Real secrets (Calendly API token, HMAC key, CAPI token) live only in Vercel
   environment variables and are read exclusively by the server — see
   api/_lib/config.js, which mirrors the public values for the server side.
--------------------------------------------------------------------------- */

/** The scheduling page for the in-home cooking session. */
export const CALENDLY_BOOKING_URL = 'https://calendly.com/hi-cielpm/30min';

/**
 * Widget colours. Background and text match this page exactly so the embed
 * reads as part of the page rather than an iframe dropped into it.
 * primary is Glutt's brand green.
 */
export const CALENDLY_COLORS = {
  background_color: 'f7f3ee',
  text_color: '1b1917',
  primary_color: '1f6b45',
};

/**
 * The advertised price, matching what the Calendly event "Private Cooking
 * Session — Miami" actually charges. It appears in the hero, both CTAs and the
 * booking heading; every one of those is marked [data-price], so this is the
 * only place to change it. Keep it in step with Calendly — the page must never
 * advertise a number the checkout does not charge.
 */
export const PRICE = '$109.99';

/** The same figure as a number, for conversion values sent to Meta. */
export const PRICE_VALUE = 109.99;

/**
 * Calendly's own header repeats the name, duration, price and description we
 * already state above the embed, and pushes the calendar itself below the
 * fold. Hiding it is what makes the dates the first thing in the module.
 */
export const HIDE_EVENT_DETAILS = true;

/**
 * Calendly shows its own cookie consent banner inside the iframe. It can be
 * suppressed with hide_gdpr_banner, but that is a consent decision rather than
 * a design one, so it is off until someone decides otherwise.
 */
export const HIDE_CALENDLY_COOKIE_BANNER = false;

/**
 * The Glutt *website* Pixel. Public by nature — it is visible in the source of
 * every page that loads one.
 *
 * Not to be confused with 1015291791330103, which is the Glutt app dataset
 * and must not be used for this funnel. This page installs the website Pixel
 * once for glutt.org; Calendly fires its own events from inside its iframe on
 * calendly.com, which is a separate document.
 *
 * Set to '' to ship no pixel at all.
 */
export const META_PIXEL_ID = '1541408760532310';

/** Builds the embed URL, carrying the invitee's campaign attribution through. */
export function calendlyEmbedUrl(params = {}) {
  const url = new URL(CALENDLY_BOOKING_URL);
  const all = {
    ...CALENDLY_COLORS,
    ...(HIDE_EVENT_DETAILS ? { hide_event_type_details: '1' } : {}),
    ...(HIDE_CALENDLY_COOKIE_BANNER ? { hide_gdpr_banner: '1' } : {}),
    ...params,
  };
  for (const [k, v] of Object.entries(all)) {
    if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}
