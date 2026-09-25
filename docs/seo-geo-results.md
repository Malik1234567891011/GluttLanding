# SEO / GEO results after the 2026-09-20 changes

Deployed to production 2026-09-21 ~00:05 ET (commits 428e56a → 250d4d6). Measured within the first hour.
Rankings and AI answers lag indexing by days to weeks, so this file separates **what is already true**
from **what is still pending a crawl**. Re-run the panel in `SEO-GEO.md` weekly and append below.

## Technical: before → after (verified live)

| Check | Before | After |
| --- | --- | --- |
| robots.txt / sitemap.xml / llms.txt | 404 / 404 / 404 | 200 / 200 (15 URLs) / 200 |
| Crawlable favicon | data: URI only | /favicon.ico, /icon-192.png, /apple-touch-icon.png |
| www.glutt.org | duplicate copy (200) | 308 → glutt.org |
| /x/, /x.html, /x/index.html duplicates | all 200 | 308 → /x |
| Internal files served (/4ai.md, /STRIPE_SETUP.md, tests) | 200 | 404 |
| Pages with a canonical | 4 | all 21 indexable pages |
| JSON-LD | 1 minimal SoftwareApplication on / | Organization, WebSite, MobileApplication on every page; Article/FAQPage/Breadcrumb on guides |
| Google Rich Results Test (glasses guide) | n/a | 4 valid items: Article, Breadcrumbs, Organization, Software App. The only note is the optional aggregateRating, deliberately omitted |
| Indexable pages targeting "AI chef", "Meta glasses", "hands-free cooking" | 0 (only the paid /app page mentioned glasses) | 6 guides + FAQ + about + features |
| AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Meta-WebIndexer) | allowed, but thin homepage | allowed; glasses guide serves 26.8 KB of raw HTML, 16× "Ray-Ban Meta", full JSON-LD, no JS needed |
| IndexNow | none | 15 URLs submitted: api.indexnow.org 202, Bing 200, Yandex 202 |
| PageSpeed Insights, mobile, homepage | local Lighthouse: perf 64, a11y 96, BP 79, SEO 100 (different environment) | PSI (Google servers): perf 73, a11y 94 → one heading-order issue fixed after the run, BP 100, SEO 100 |

## GEO panel, first hour (nothing re-crawled yet)

| Prompt | Perplexity (logged out) | ChatGPT (temp, unpersonalized) |
| --- | --- | --- |
| Best app for cooking with Meta Ray-Ban glasses? | No Glutt (cites meta.com) | not re-run |
| AI chef that talks you through recipes hands-free? | No Glutt (ChefTalk, Cookie) | not re-run |
| What is glutt.org? | Knows it is an iOS cooking app with an "AI chef", but still quotes the **old cached homepage title** | not run |
| Does Glutt work with Meta Ray-Ban glasses? | not run | "Yes, but with a caveat… can't verify it shipped." Sources: a GitHub issue on facebook/meta-wearables-dat-ios (#266, Aug 9), the App Store and Meta's DAT FAQ. **glutt.org is not cited yet.** The new guide answers exactly this question accurately (audio yes, camera not yet), so it should be the cited source once Bing indexes it |

Google: `site:glutt.org` still shows only the homepage. The site is **not in Search Console** (checked: the
logged-in Google account has no properties), so Google will find the new pages only through normal
crawling until it is added.

## What to expect and when

- **Days:** Bing picks up the IndexNow URLs, and ChatGPT search and Copilot can then cite the guides.
  Perplexity re-crawls on its own schedule.
- **1–3 weeks:** Google indexes the guides. This is much faster once Search Console has the sitemap and
  indexing requests.
- **1–2 months:** long-tail AI citations ("Meta glasses cooking app", "hands-free AI chef").
- **3–6+ months:** head terms ("best AI cooking app"). These depend mostly on App Store ratings, YouTube
  and third-party lists, not on the website.

---

## Check-in 2026-09-24 (day 4)

**Google is the big change.**

| | 2026-09-20 | 2026-09-24 |
| --- | --- | --- |
| Pages indexed | 1 (homepage) | **8** |
| Impressions (Search Console) | none (no property) | **66**, 1 click, avg position 6.1 |
| Structured data | not seen | Breadcrumbs report now active in Search Console |

All 8 indexed pages are the ones submitted on Sunday: `/`, the Meta glasses guide, `/ai-chef`,
the hands-free guide, `/best-ai-cooking-apps`, the TikTok import guide, `/faq`, `/about`. The
remaining 7 are "Discovered – currently not indexed"; indexing was requested today for
`/guides/mealime-alternatives`, `/features` and `/guides`.

First queries Glutt appears for (impressions, average position):
- "can ai glasses help with food and cooking tips?" — position 11
- "ray-ban rice cooker" — position 6 (2 impressions)
- "ai recipe app" — 39 · "ai cooking apps" — 48 · "the glutt" — 1

**Ranking on page 1 already:** for `app to cook hands free with ray-ban meta glasses`, the Meta glasses
guide sits around #6, under Meta's own pages. Google is also pulling the "Short answer" boxes as the
text fragments it highlights.

**Perplexity now recommends Glutt** for the Meta glasses question, and cites
`glutt.org/guides/cooking-with-meta-glasses` alongside meta.com and Engadget:

> Following one exact recipe step by step — **Glutt with Polly (iPhone only)**: it retains the specific
> recipe, servings, current step, and active timers, and routes conversational audio through connected
> Ray-Ban Meta glasses.

That is the first AI answer to recommend Glutt unprompted. Baseline: absent from all 6.

**Still absent:**
- ChatGPT (temporary + unpersonalized) for the same question: cites only Meta and Ray-Ban pages. Bing
  has served 3 impressions and 0 AI citations so far, and ChatGPT search leans on Bing.
- Perplexity for the generic "AI chef that talks you through recipes" question: it lists Suvio,
  Hands! AI Chef, Cookie and ChefChef, all of which compete on App Store listings. This is the cluster
  the App Store listing rewrite in `ready-to-paste.md` is for.

**Competitive notes from this round**
- **New York Times Cooking is coming to Meta AI glasses** (ranking for the glasses queries now).
- Meta's glasses web-app platform names cooking guides as a target use case, and a "Fond" cooking app
  for Meta Ray-Ban Display showed up on Reddit. The category is filling fast; the glasses guide should
  be kept current.
- "mealime alternative" is already crowded (Pann, MealThinker, Spiceful, Fond, Plan to Eat). Our page
  was only submitted today, and Mealime closes Oct 21, so it has about four weeks to earn a position.

### Same day, later: another pass (2026-09-24)

Meta Connect landed on Sept 23–24, which is why the glasses queries moved. Changes made in response,
all live:

- **The glasses guide now covers Connect.** The camera-free **Ray-Ban Meta Audio** ($349, preorder
  Oct 13), **Ray-Ban Meta (Gen 3)**, and **NYT Cooking's hands-free mode** (narrated steps, swipeable
  cards on Display, "later this fall"), with a straight answer about when theirs is the better pick.
  The camera-free frames are a genuine angle: Glutt only needs mic and speakers, so it loses nothing
  where Meta's own live AI vision cannot work at all. Three new FAQs answer queries Search Console
  shows people arriving on (cooking tips, timers, camera-free frames).
- **New guide `/guides/cook-with-what-you-have`** for the "what can I make with what's in my fridge"
  cluster, which the site had nothing for. Sources the EPA food-waste figure; gives SuperCook and
  Cooklist their due.
- **`/ai-chef` now has a 12-second cook-mode video** with VideoObject markup. Rich Results Test:
  4 valid items including Videos. The clip is trimmed past an older build's "Connecting your glasses"
  screen, since the same site says the glasses camera is not shipping.
- **Fonts self-hosted.** Same files Google served, so nothing looks different.
- **Homepage footer** now links `/guides` and `/about`, which had no link from the strongest page.

**Speed, same Lighthouse harness as the 2026-09-20 baseline:**

| Page | Before | After |
| --- | --- | --- |
| `/` performance | 64 | **99** |
| `/` LCP | 3.6 s | **1.9 s** |
| `/` total blocking time | 840 ms | **60 ms** |
| `/ai-chef` | n/a | 99, LCP 1.5 s |

Best Practices sits at 79 on both, entirely from the Meta Pixel's third-party cookies. That is the
ads attribution working as intended, so it stays.

Indexing requested today (6 of ~10 daily): mealime, features, guides, the new pantry guide, and the two
updated pages (glasses guide, ai-chef). IndexNow pinged after each deploy.
