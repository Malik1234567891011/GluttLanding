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
| `META_PIXEL_ID` | Optional override for the Pixel ID. `NEXT_PUBLIC_META_PIXEL_ID` is also accepted. **Only reaches the confirmation page** — see Pixel below. |
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

Pixel `1015291791330103`, set in `landing/meta/config.js` and mirrored in
`api/_lib/config.js`.

**The env var only reaches the confirmation page.** `/meta` is a static file and
this project has no build step, so nothing can inline an environment variable
into it — `NEXT_PUBLIC_` is a Next.js convention that does not apply here. The
literal in `config.js` is what that page actually uses. The serverless
confirmation page does read the environment, and accepts either
`META_PIXEL_ID` or `NEXT_PUBLIC_META_PIXEL_ID`, falling back to the same
literal. A Pixel ID is public either way, so nothing is exposed by this.

If a Pixel is ever installed site-wide (or via a tag manager), both pages adopt
the existing `fbq` and never call `init` a second time.

**Purchase** fires on Calendly's `event_scheduled` message, and nowhere else —
not on opening the scheduler, picking a time, reaching payment, or reloading.
The embedded event is the paid Private Cooking Session, which cannot be
scheduled unless its Stripe payment succeeds, so that message is the moment
money has changed hands. Parameters are `value: 109.99`, `currency: 'USD'`,
and nothing else.

It is reported from two places, both with `eventID` set to the Calendly invitee
uuid, so Meta collapses them into one conversion:

1. `/meta`, the instant Calendly confirms the booking;
2. `/cooking/confirmed`, after the server has verified it against the Calendly
   API and confirmed the payment succeeded.

That redundancy means the conversion still lands if someone closes the tab
before the confirmation page, or if that redirect is not configured yet.
Guarded three ways against double counting: an in-memory set, a `localStorage`
key per booking (so a reload cannot re-count), and Meta's own `eventID`
deduplication.

**⚠️ Calendly has the same Pixel ID.** Calendly's integration fires from inside
its own iframe on calendly.com, which is a separate document — a Pixel cannot be
shared across documents, so this is not something we can dedupe against; those
events carry no `eventID` of ours. After the first real booking, open Events
Manager and check whether a single booking produced more than one **Purchase**.
If Calendly is firing Purchase as well, remove the Pixel from the Calendly event
and keep ours: ours carries the value, the currency and an eventID, and is
corroborated by the server-verified copy. (Calendly's integration is usually
`PageView` + `Schedule` rather than `Purchase`, in which case there is no
conflict — but verify rather than assume.)

Tested in a real browser: `tests/purchase.browser.test.js` covers every rule
above, including the wrong-origin case, the reload case and a Pixel broken by an
ad blocker.

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
