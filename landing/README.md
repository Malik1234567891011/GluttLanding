# Glutt landing experience (`/`)

The cinematic front door added at the site root. It is **additive**: every page,
route, asset and script that existed before is untouched and still served.

## What was preserved

| Before | Now |
| --- | --- |
| `/` — the original landing page | **`/classic`** — byte-identical copy, still live |
| `/privacy` `/terms` `/support` `/delete-account` `/checkout/*` | untouched |
| `styles.css`, `site.js`, `api/create-checkout-session.js` | untouched |
| `today.png` `recipes.png` `progress.png` | untouched (still used by `/classic`) |

`styles.css` is *not* loaded by the new page, so the new design cannot regress
the classic or legal pages, and vice versa.

Legacy deep links keep working: `/#features`, `/#how-it-works` and `/#book` are
all real sections on the new page, so nothing that linked into the old root
breaks. `/classic#features` and `/classic#how-it-works` also resolve.

## Structure

```
index.html            the new front door (semantic DOM; works with no JS)
classic/index.html    the previous landing page, preserved verbatim
landing/
  landing.css         design tokens + every style for the new page
  main.js             bootstrap: intro, nav, anchors, analytics, scene wiring
  core/
    motion.js         one rAF ticker, easings, per-material damping, DUR/MASS
    scroll.js         reads scroll; act progress + run-up. Never intercepts it
    pointer.js        damped pointer, movement energy, magnetic buttons
    analytics.js      additive event layer (no-ops if no provider is present)
  gl/heat.js          the warm-air refraction shader (WebGL1, ~5KB)
  scenes/
    world.js          the continuous camera: poses per act, fragments, portal
    cook.js           scripted "Hey Chef" sequence (no model calls)
    editorial.js      the flat chapter's reveals + bleed-image parallax
assets/
  food/               real photography from the app repo, WebP, 640 + 1280
  screens/            real product screenshots, WebP, 560 + 900
```

## Decisions worth knowing

**No new dependencies.** `package.json` still lists only `stripe`. There is no
build step, so npm packages could not be bundled anyway; the page uses native ES
modules. GSAP and Three.js were considered and rejected: the scroll choreography
is ~120 lines of interpolation, and the only thing that genuinely needs WebGL is
one full-screen refraction pass — a 600KB scene graph would have cost more than
the effect is worth. CSS 3D transforms carry the phone, which keeps the real
screenshot crisp and the type as selectable DOM.

**Nothing calls a model.** The cooking sequence is scripted client-side and
driven by scroll position. No OpenAI/Anthropic request fires for the marketing
animation. No audio is ever played.

**Only real features are shown.** Copy and UI are taken from the shipped app:
the wake word is `Hey Chef` (`Polly` is the internal engine name), and the
cooking screen mirrors `Glutt Polly.dc.html` plus `PollySessionView.swift`.

**Adaptive quality.** `world.js` watches frame times and steps the shader down
(0.85 → 0.6 → 0.42 internal resolution) before disabling it entirely and falling
back to the CSS ground. DPR is capped at 1.5. Rendering stops when no act is on
screen and when the tab is hidden.

**Accessibility.** All content is semantic DOM; the world layers are
`aria-hidden`. `prefers-reduced-motion` keeps every composition and removes the
camera travel, shader, steam and drift. With JS disabled the hero is a finished
static composition — the intro overlay is `display:none` until JS opts in, so it
can never trap the page.

## ⚠️ Maintenance: pricing now appears twice

The booking section (**$100** one-time / **$149** monthly) is rendered in **both**
`index.html` and `classic/index.html`. Both post to the same unchanged
`/api/create-checkout-session` with the same `data-checkout-plan` values, so
Stripe behaviour is identical — but **a price change has to be made in both
files**. See `../STRIPE_SETUP.md` for the Stripe side.

## Analytics

The site had no analytics provider, and none was added. `core/analytics.js`
collects landing events (`landing_view`, `hero_primary`, `hero_secondary`,
`nav_cta`, `to_classic`, `final_primary`, `checkout_session`, `checkout_monthly`,
`scroll_depth`) and forwards them to `dataLayer` / `gtag` / `plausible` /
`posthog` / `fathom` **if one is ever installed**. Until then every call is a
no-op and nothing is sent anywhere. `Glutt.events()` in the console shows the
recent log.
