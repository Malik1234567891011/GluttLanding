# Paid-acquisition funnel — `/meta` and `/cooking/confirmed`

Two new routes for Meta/Instagram ad traffic. Additive: every pre-existing
route, asset and script is untouched, and neither page loads the homepage's
stylesheet or its WebGL/scroll code.

```
meta/index.html            the ad landing page (static, instant)
landing/meta/
  config.js                the two public values + widget options
  meta.css                 self-contained styles
  meta.js                  sticky CTA, Calendly embed, funnel events
  track.js                 campaign capture + funnel events + Meta Pixel
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
| `META_PIXEL_ID` | Reserved for Conversions API. `NEXT_PUBLIC_META_PIXEL_ID` also accepted. Cannot reach the static `/meta` page — see Pixel below. |
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

## Meta Pixel and the Purchase conversion

Website Pixel `1541408760532310`, set in `landing/meta/config.js`.

`1015291791330103` is the Glutt **app** dataset and is not used by this
funnel. If the Vercel env var still holds it, update it — see the env note at
the end of this section.

**Exactly one browser Purchase, and it is on `/meta`.** It fires on Calendly's
`event_scheduled` message and nowhere else — not on opening the scheduler,
picking a time, reaching payment, or reloading. The embedded event is the paid
Private Cooking Session, which cannot be scheduled unless its Stripe payment
succeeds, so that message is the moment money has changed hands. Parameters are
`value: 109.99` and `currency: 'USD'`; `eventID` is the Calendly invitee uuid.

Guarded three ways against firing twice: an in-memory set, a `localStorage` key
per booking so a reload cannot re-count, and Meta's own `eventID` handling.

**`/cooking/confirmed` sends no Pixel event at all** — the rendered page
contains no `<script>` tag. Two browser Pixel events sharing an `eventID` is
not a deduplication path Meta documents: `eventID` is specified for pairing a
*browser* event with a *Conversions API* event. A second browser Purchase there
would have risked counting one booking twice.

What that page still does is verify the payment against the Calendly API,
display it, and log the result server-side:

```json
{"at":"cooking_session_booking_confirmed","booking_id":"…","event_id":"…",
 "paid":true,"value":109.99,"currency":"USD"}
```

**Adding Conversions API later** is the intended next step, and the hook is
marked in `api/cooking-confirmed.js`. Send the Purchase from there with
`event_id` set to the same Calendly invitee uuid that `/meta` puts in
`eventID`. That is the pairing Meta actually deduplicates, and it upgrades the
reported conversion from *scheduled* to *payment-verified*. It needs a
`META_CAPI_TOKEN`, which must stay server-side.

**Calendly's native Pixel integration stays connected.** It fires from inside
its own iframe on calendly.com under its own event names —
`invitee_select_day`, `invitee_select_time`, `invitee_meeting_scheduled` —
which are useful for funnel analysis and do not collide with our standard
`Purchase`.

If a Pixel is ever installed site-wide (or via a tag manager), `/meta` adopts
the existing `fbq` and never calls `init` a second time.

**The env var only reaches server-rendered code.** `/meta` is a static file and
this project has no build step, so nothing can inline an environment variable
into it — `NEXT_PUBLIC_` is a Next.js convention that does not apply here. The
literal in `config.js` is what that page uses, which is why swapping the Pixel
was a code change rather than an env change. A Pixel ID is public either way.

⚠️ `NEXT_PUBLIC_META_PIXEL_ID` in Vercel was set to the **app dataset**
(`1015291791330103`). Nothing reads it today — `api/_lib/config.js` is
reserved for the CAPI work above — but it takes precedence over the literal
there, so update it to `1541408760532310` or delete it before server-side
conversions are added. Otherwise the verified Purchase would land in the app
dataset instead of the website one.

Tested in a real browser: `tests/purchase.browser.test.js` covers every rule
above, including the wrong-origin case, the reload case and a Pixel broken by an
ad blocker. `tests/confirmation.test.js` asserts the confirmation page emits no
Pixel code.

## Restraint

There is no hero image or video: the page is type, one action, three steps and
the calendar. That is deliberate — the offer is legible in a single viewport at
375px and the scheduler arrives almost immediately, which is the only thing this
route is measured on.

The subhead is one line because the three steps say "pick the recipe / we bring
the ingredients / you cook" properly; saying it twice was the largest block of
text on the page.

A hero loop cut from the app's butter-chicken footage was built and then removed
(see git history for `assets/meta/`). To bring it back:

```
ffmpeg -ss 5 -t 3 -i seg-bc-aromatics.mp4 -ss 6 -t 3 -i seg-bc-cream.mp4 \
       -ss 4.5 -t 3.5 -i seg-bc-butter.mp4 \
  -filter_complex "[0:v]crop=ih*4/5:ih,scale=640:800,setsar=1[a]; \
                   [1:v]crop=ih*4/5:ih,scale=640:800,setsar=1[b]; \
                   [2:v]crop=ih*4/5:ih,scale=640:800,setsar=1[c]; \
                   [a][b][c]concat=n=3:v=1:a=0[v]" \
  -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -r 24 -crf 33 \
  -movflags +faststart session-loop.mp4
```

(Sources are in `Cook4Me/media-worker/work/finish-hDjK5C2aoSs/`. Those offsets
skip the burned-in ingredient captions in the first seconds of each clip.)

## Price

The page advertises **$109.99**, matching the Calendly event. It appears three
times and only once as a display: on the hero button, on the sticky button, and
as one quiet line at the booking module so the number is never absent while
someone is choosing a time. It lives in one place — `PRICE` (and
`PRICE_VALUE` for the Meta conversion value) in `config.js` — and every label
is marked `[data-price]`. The
confirmation page does not use it at all: that figure comes from the payment
Calendly reports, so it cannot disagree with what was actually charged.

If the price changes, change it in Calendly and in `config.js`.

## Notes

- `/meta` is indexable. Ad landing pages are often `noindex`; add the tag if you
  prefer. `/cooking/confirmed` is `noindex, nofollow` and `no-store`.
- The session is 2 hours per the Calendly event. That is not stated on the page,
  to avoid a hardcoded value drifting out of sync; the scheduler shows it.
