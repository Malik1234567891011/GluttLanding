# Glutt landing experience (`/`)

The cinematic front door added at the site root. It is **additive**: every page,
route, asset and script that existed before is untouched and still served.

## Routes

| Route | What it is |
| --- | --- |
| `/` | the cinematic front door (`index.html`) |
| `/features` | the full product overview, in the older `styles.css` design (was `/classic`, which now redirects here) |
| `/app` | the install page for paid Meta ads traffic |
| `/ai-chef`, `/faq`, `/about`, `/best-ai-cooking-apps`, `/guides/*` | generated from `content/pages/*.mjs` by `scripts/build-pages.mjs` |
| `/privacy` `/terms` `/support` `/delete-account` | legal and support pages, `styles.css` |

The in-person cooking sessions (Stripe checkout, Calendly booking, `/meta`,
`/cooking/*`, `/intro/*`, `/checkout/*`, `api/`) were removed on 2026-09-20 when
Glutt went back to being only the app. The old URLs redirect (see `vercel.json`).

## Structure

```
index.html            the new front door (semantic DOM; works with no JS)
features/index.html   the full product overview (styles.css)
content/              facts (site.mjs) and page sources for the generated pages
scripts/              build-pages.mjs (generator) and check-site.mjs (pre-deploy checks)
landing/
  landing.css         design tokens + every style for the new page
  guide.css           the generated reading pages: same tokens, bone ground
  main.js             bootstrap: intro, nav, anchors, analytics, scene wiring
  core/
    motion.js         one rAF ticker, easings, per-material damping, DUR/MASS
    scroll.js         reads scroll; act progress + run-up. Never intercepts it
    pointer.js        damped pointer, movement energy, magnetic buttons
    analytics.js      additive event layer (no-ops if no provider is present)
    pixel.js          the site-wide Meta Pixel (every page except /app)
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

**No new dependencies.** `package.json` lists no dependencies at all. There is no
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

## Fonts are self-hosted

`landing.css` and `guide.css` start with `@font-face` rules pointing at
`assets/fonts/*.woff2`. They are the same files fonts.googleapis.com served, so the
pages look identical; it just removes the googleapis + gstatic round trips before
text can paint. The homepage went from Lighthouse performance 64 to 99 on the same
harness, mostly from this and from dropping the old PNG screenshots.

To refresh them (only needed if a family or weight changes):

```bash
curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 \
  (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Instrument+Serif:ital@1&display=swap"
```

Take the `latin` and `latin-ext` `@font-face` blocks, download each `woff2` into
`assets/fonts/`, and keep the `unicode-range` lines exactly as Google wrote them.
`/app` still loads Nunito from Google; it has its own design and its own loader.

## SEO pages and structured data

`node scripts/build-pages.mjs` writes the guide/FAQ/about pages, `sitemap.xml`,
`robots.txt`, `llms.txt`, `404.html`, and the JSON-LD between the `ld:start` /
`ld:end` markers in `index.html` and `app/index.html`. Every fact comes from
`content/site.mjs`, so the site and its structured data cannot drift apart.
Run `npm run check` before deploying: it fails on missing titles, descriptions
or canonicals, broken internal links, bad JSON-LD and booking-funnel leftovers.
See `docs/SEO-GEO.md` for why the pages are shaped the way they are.

## Analytics

The site had no analytics provider, and none was added. `core/analytics.js`
collects landing events (`landing_view`, `hero_primary`, `hero_secondary`,
`nav_cta`, `to_classic`, `final_primary`, `scroll_depth`) and forwards them to `dataLayer` / `gtag` / `plausible` /
`posthog` / `fathom` **if one is ever installed**. Until then every call is a
no-op and nothing is sent anywhere. `Glutt.events()` in the console shows the
recent log.
