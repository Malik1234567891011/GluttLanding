# SEO and GEO for glutt.org

Goal: Glutt shows up when people search or ask an AI about **AI cooking apps**, **AI chefs**,
**hands-free / voice cooking**, and **cooking with Meta glasses**, at $0, without changing how the
site looks.

- Baseline measurements (before any change): [`seo-geo-baseline-2026-09-20.md`](seo-geo-baseline-2026-09-20.md)
- After-change measurements: [`seo-geo-results.md`](seo-geo-results.md)

## What the research said (2026), in one screen

1. **Google says GEO is SEO.** AI Overviews and AI Mode use the normal index and ranking. So step one is
   simply getting indexed. On 2026-09-20 only the homepage was.
2. **Most AI crawlers do not run JavaScript** (GPTBot, ClaudeBot, PerplexityBot, Meta). Every fact has to
   be in the raw HTML. The site is static HTML, so this is fine. JSON-LD is inline, never injected.
3. **ChatGPT app recommendations cite App Store pages most** (AppTweak, May 2026: 47.5% of citations
   were app stores). **The App Store listing matters more than the website.** It currently never mentions
   Meta glasses and its subtitle is "Your cookbook, smart pantry".
4. **Earned mentions beat backlinks.** YouTube mentions correlate most with AI visibility (Ahrefs,
   ~0.74). Then third-party "best X" lists, Reddit threads and directories.
5. **Self-ranked listicle farms got demoted** in January 2026. One honest comparison page is fine. A
   series of them is not.
6. **FAQ rich results are gone** (May 2026). FAQ markup is harmless and still helps parsing.
   **App Store ratings may not be copied into our own markup**, so there is no aggregateRating.
7. **llms.txt** gets almost no crawler traffic (Ahrefs: 97% of files had zero requests). We ship one
   anyway because it is free, but nothing depends on it.
8. Content that gets cited: an answer-first opening with a definitional sentence ("Glutt is…") in the
   first third of the page, tables, question-shaped headings, specific numbers with sources, visible
   dates, and titles and slugs that match how people ask.

## What was done (2026-09-20)

**Technical**
- `robots.txt` (allow all, AI crawlers included and named), `sitemap.xml` with real lastmod,
  `llms.txt`, a branded `404.html`.
- `www.glutt.org` → `glutt.org` 308. `cleanUrls` + `trailingSlash: false`, so `/x/` and `/x.html`
  collapse onto `/x`. Absolute self-canonical on every page.
- Real favicon files (`/favicon.ico`, `/icon-192.png`, `/apple-touch-icon.png`), the same green G
  as before. Google cannot use data: URI favicons.
- 1200×630 JPG `og:image` (WebP previews break on some platforms).
- `.vercelignore` stops internal files being served (`/4ai.md`, `/STRIPE_SETUP.md`, tests…).
- JSON-LD from one source of truth (`content/site.mjs`): Organization, WebSite, MobileApplication,
  plus Article / WebPage / FAQPage / BreadcrumbList per page.
- IndexNow key at `/861884f62d5e74f6460fa88dcd29835b.txt`, pinged after deploy (Bing, Yandex, Seznam,
  Naver). Bing feeds ChatGPT search and Copilot.

**Content (new pages, generated from `content/pages/`)**

| URL | Targets |
| --- | --- |
| `/guides/cooking-with-meta-glasses` | cooking with Meta glasses, Ray-Ban Meta cooking app, Meta glasses recipe app |
| `/ai-chef` | AI chef app, AI cooking assistant, voice AI chef |
| `/guides/hands-free-cooking` | hands-free cooking app, voice cooking assistant |
| `/guides/save-recipes-from-tiktok-instagram` | save recipes from TikTok / Instagram, recipe app that imports from TikTok |
| `/best-ai-cooking-apps` | best AI cooking apps 2026 (honest, disclosed, other apps win categories) |
| `/faq`, `/about`, `/guides` | brand/entity questions, disambiguation from other "Glutt"s |

**Existing pages**
- Homepage: new title, description and social tags. Same layout; three lines of copy name Polly and
  Meta glasses. Footer: "Book an in-person session" became "Cooking with Meta glasses", and FAQ was
  added.
- In-person session funnel removed (per Malik). Old URLs redirect. The files are kept outside the repo in
  `~/GluttLanding-removed-sessions-2026-09-20/` and in git history.
- `/classic` → `/features`: same design, no booking, current features. Its 1–2.6 MB PNGs swapped for the
  identical WebP files.
- Scroll story fix: without the booking section below it, the finale's phone overlapped the CTA at the
  bottom of the page. The world now scrolls up with the page past the last act (`pastOf` in scroll.js).

**Honesty constraints the copy follows**
- Glasses: Glutt uses Ray-Ban Meta / Oakley Meta glasses as a Bluetooth headset. It prefers their mic
  and speakers automatically (`PollyAudioSession.swift`). **Camera through the glasses is not shipped.**
  The glasses subsystem was removed from the app on 2026-08-17, and Meta's toolkit is still in developer
  preview. The pages say so.
- No prices on the site. Four conflicting price sets are public; the App Store is the source of truth.
- No celebrity-chef names (licensing risk), and no aggregate ratings in markup.

## Done on 2026-09-21 (second pass)

- **Google Search Console** on Malik's gmail: glutt.org is verified (HTML meta tag in `index.html`;
  don't remove it), the sitemap was read successfully, and indexing was requested for 9 URLs (the daily
  cap): the glasses guide, /ai-chef, /, /best-ai-cooking-apps, the hands-free guide, the import guide,
  /faq and /about. "Search generative AI" is left at the default, Include.
- **`/guides/mealime-alternatives`**. Mealime's own closing page says it is discontinued on 2026-10-21 and
  personal data is deleted. The guide shows how to import its public recipe pages before then, and
  compares alternatives honestly. Pushed to IndexNow.

## Done on 2026-09-25 (third pass)

- **Meta Pixel removed** from every page, plus the `_fbc` cookie `/app` wrote. Malik: the ads it
  reported on are not running. It was the only third-party cookie on the site, and the only thing
  keeping Lighthouse Best Practices at 79. Homepage is now 100 / 100 / 100 with accessibility 96
  (the one flag is muted-text contrast, which is the design).
- **Three guides**, chosen to cover what the app does and what people will search after Connect:
  `/guides/cooking-with-meta-ray-ban-display`, `/guides/learn-to-cook-with-ai` (Skills),
  `/guides/make-your-own-cookbook` (recipe saving and organizing).
- Accuracy note: the shipping App Store build (1.2.3, from the `apple-ready` branch) has **no glasses
  code**, and Skills checks are scored from an **iPhone photo**. The glasses-verified skill flow exists
  only on a demo branch, so the site says photo. `/app` still shows a "Meta glasses toggle" screenshot
  and an in-app waitlist that the shipping build does not have — worth a look.

## Still open: needs Malik

Everything below is in [`ready-to-paste.md`](ready-to-paste.md) with final text:
- **Bing Webmaster Tools**: sign in with Google, then "Import from GSC" (the sign-in page can't be
  automated, and it creates a Bing account).
- **Search Console, tomorrow**: request indexing for /guides/mealime-alternatives, /features and /guides.
- **App Store listing**: subtitle, keywords, promo text, a glasses paragraph, the price mismatch, and
  review prompts.
- **GitHub `Glutt` README intro and homepage URL**: blocked for the assistant because it is Omar's repo too.
- **AlternativeTo, Product Hunt, YouTube, Reddit**: need accounts in Malik's name.
- **cielpm.ai**: still shows the stale Glutt pre-launch page. Left alone, per "don't use Ciel for anything".

## How to re-measure

Prompt panel. Use Perplexity logged out and ChatGPT in a temporary, **Unpersonalized** chat (memory
knows Malik is the founder, which biases a normal chat). Also Google `site:glutt.org` and a few queries.

1. What is the best app for cooking with Meta Ray-Ban glasses?
2. What are the best AI cooking apps in 2026?
3. Is there an app with an AI chef that talks you through recipes hands-free while you cook?
4. What is Glutt: Recipes & AI Chef?
5. What is glutt.org?
6. Recipe app that imports TikTok recipes and lets you cook hands-free by voice?

Realistic timeline: new pages indexed in 1–3 weeks once submitted, first long-tail AI citations
(Meta glasses, hands-free) in ~1–2 months, and head terms ("best AI cooking app") in 3–6+ months, driven
mostly by App Store ratings, YouTube and third-party lists.
