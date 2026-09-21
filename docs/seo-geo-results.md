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
