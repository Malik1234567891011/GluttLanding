/* ---------------------------------------------------------------------------
   pixel.js — the site-wide Meta Pixel.

   Meta's setup instructions are to install the base code on every page, and
   until now it was only on /meta. That meant a visit to glutt.org itself — the
   obvious page to open when testing — fired nothing at all.

   This is not a second loader. It calls the same ensurePixel() that /meta uses,
   which adopts an existing window.fbq and only installs the base code when
   there is none, so a page can never end up with two Pixels or two inits. The
   ID stays single-sourced in config.js.

   /meta does NOT load this file: its own module already boots the Pixel, and
   the funnel there is deliberately left untouched.
--------------------------------------------------------------------------- */

import { ensurePixel } from './track.js';

ensurePixel();
