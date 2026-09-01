# Paid-acquisition funnel — `/meta` and `/cooking/confirmed`

Two new routes for Meta/Instagram ad traffic. Additive: every pre-existing
route, asset and script is untouched, and neither page loads the homepage's
stylesheet or its WebGL/scroll code.

```
meta/index.html            the ad landing page (static, instant)
landing/meta/
  config.js                the two public values + widget options
  meta.css                 self-contained styles
  meta.js                  video, sticky CTA, Calendly embed, events
  track.js                 campaign capture + funnel events + Meta Pixel
assets/meta/               hero loop (709KB) + poster
api/
  cooking/confirm.js       Calendly's redirect target: verify → sign → 302
  cooking-confirmed.js     server-rendered, gated confirmation page
  _lib/{calendly,session,config}.js   not routed by Vercel (leading _)
vercel.json                /cooking/confirmed → the function
tests/confirmation.test.js 23 tests, `npm test`
```

## ⚠️ Before this goes live

**1. Set the environment variables** in Vercel (Production + Preview). All are
server-side; none may use a `NEXT_PUBLIC_`-style public prefix.

| Variable | Purpose |
| --- | --- |
| `CALENDLY_API_TOKEN` | Calendly personal access token. Verification is impossible without it, and the page **fails closed** — customers keep Calendly's own confirmation. |
| `CONFIRMATION_SECRET` | Long random string; signs the confirmation cookie. |
| `META_PIXEL_ID` | Optional. Enables the Purchase signal on confirmation. |
| `CALENDLY_BOOKING_URL` | Optional override; defaults to the event above. |

**2. Configure the Calendly event** (Event type → Confirmation page):
redirect to `https://glutt.org/api/cooking/confirm` **with "Pass event details
to your redirect page" enabled**. Do this *after* step 1, otherwise customers
land on a route that cannot verify them and get bounced to `/meta`.

## Security model

The confirmation page is not merely unlinked — there is no file at that path.
`vercel.json` rewrites it to a function that:

1. requires an HMAC-signed `HttpOnly` cookie the server issued itself;
2. re-reads the booking from Calendly **on every render**, so a cancellation or
   reschedule is caught even with a valid cookie;
3. requires the booking to be active and to belong to this event type;
4. reports payment only when Calendly says the payment succeeded.

Nothing in the redirect URL is trusted — the invitee uuid is a lookup key, not
proof. Forged query strings, forged cookies, cookies signed with another key,
and expired cookies all redirect silently to `/meta`. The cookie holds two
Calendly identifiers and an expiry: no name, email, address or recipe.

When Calendly is unreachable the page never claims the booking failed; it shows
a calm "we're confirming your session" state that points at the Calendly email.

`npm test` covers all of the above, including the reschedule and outage paths.

## Analytics

The site still has no analytics provider. `track.js` captures campaign
parameters into a first-party `glutt_attr` cookie (so they survive the round
trip through Calendly) and forwards events to `dataLayer` / `gtag` /
`plausible` / `posthog` / `fathom` **if one is ever installed** — otherwise
every call is a no-op.

Events: `meta_landing_view`, `meta_booking_cta_clicked`, `meta_calendar_viewed`,
`meta_calendar_failed`, `meta_booking_started`, `meta_booking_time_selected`,
`meta_booking_scheduled`, `meta_booking_direct_opened`.

Meta standard events: `InitiateCheckout` when a time is picked; `Purchase`
(`value`, `currency`, `eventID` = invitee uuid, so refreshes deduplicate) only
on the server-verified confirmation, and only when Calendly confirms payment.
If the event type does not collect payment, `Schedule` is sent instead — we do
not report revenue we cannot verify.

Never sent to analytics: address, email, phone, recipe text, payment details.

## Options you may want

In `landing/meta/config.js`:

- `HIDE_CALENDLY_COOKIE_BANNER` — **currently `false`**. Calendly shows its own
  consent banner inside the iframe, and it covers part of the date grid on
  mobile. `hide_gdpr_banner` removes it, but that is a consent decision rather
  than a design one, so it is off until someone decides.
- `HIDE_EVENT_DETAILS` — `true`. Hides Calendly's duplicate name/price/description
  header so the calendar itself is the first thing in the module.

## Price

The page advertises **$109.99**, matching the Calendly event. It lives in one
place — `PRICE` (and `PRICE_VALUE` for the Meta conversion value) in
`config.js` — and every label on the page is marked `[data-price]`. The
confirmation page does not use it at all: that figure comes from the payment
Calendly reports, so it cannot disagree with what was actually charged.

If the price changes, change it in Calendly and in `config.js`.

## Notes

- `/meta` is indexable. Ad landing pages are often `noindex`; add the tag if you
  prefer. `/cooking/confirmed` is `noindex, nofollow` and `no-store`.
- The hero loop is real footage from the app's media pipeline (butter chicken,
  home kitchen, no faces, no burned-in captions). It is illustrative b-roll, not
  footage of a Glutt customer session — worth replacing with real session
  footage once you have some.
- The session is 2 hours per the Calendly event. That is not stated on the page,
  to avoid a hardcoded value drifting out of sync; the scheduler shows it.
