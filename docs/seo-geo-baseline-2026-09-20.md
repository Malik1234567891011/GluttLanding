# SEO / GEO baseline, 2026-09-20 (before any changes)

## Technical (live glutt.org)
- robots.txt 404, sitemap.xml 404, llms.txt 404, favicon.ico 404 (favicon is a data: URI only).
- www.glutt.org serves 200 (duplicate host, no redirect to apex). http -> https 308 OK.
- Internal files publicly served: /4ai.md, /whatItis.md, /STRIPE_SETUP.md, /landing/README.md, /tests/*.js.
- /classic duplicates the homepage title and description, and has no canonical.
- JSON-LD: one minimal SoftwareApplication on /. None elsewhere. No Organization/WebSite.
- Homepage never mentions Meta glasses, voice AI chef "Polly", or "AI chef". Only /app does (paid page).
- App Store name "Glutt: Recipes & AI Chef" is not used anywhere on the site.

## Google (logged in, hl=en gl=us)
- `site:glutt.org`: 1 page indexed (homepage). Google suggests "Do you own glutt.org? Try Search Console", so the site is NOT verified in GSC.
- `glutt app`: #1 App Store listing. glutt.org not on page 1. Page 1 dominated by "Project G.L.U.T.T." (adult game on itch.io/APK sites) and glutt.se. AI Overview says Glutt = GLUT (OpenGL) or "Glut' and free" (gluten-free app). Entity confusion.
- `AI cooking app`: Glutt absent. Reddit r/SideProject, Magic Chef, ChefGPT, foodiejournal.app listicle, fritz.ai "10 Best AI Recipe Generators 2026", foodieprep.ai, Chefly.
- `cooking app for meta ray-ban glasses`: Glutt absent. meta.com/ai-glasses/cooking, Reddit (r/MetaRayBanDisplay, r/RaybanMeta, r/MetaGlasses), metaglassapps.com (directory), levinriegner.com Cooking HUD, Meta AI app.

## Lighthouse (lab, headless Chrome 149, mobile)
- `/`: performance 64, accessibility 96, best-practices 79, SEO 100. LCP 3.6 s, CLS 0, TBT 840 ms.
- `/app`: performance 88, accessibility 100, best-practices 79, SEO 100. LCP 3.3 s, TBT 30 ms.
- Lighthouse's SEO category is already 100. It only checks basics, so it can't measure the gaps listed above.

## AI answers (GEO panel). Glutt mentioned? (Perplexity logged out; ChatGPT temporary + Unpersonalized)
| # | Prompt | Perplexity | ChatGPT |
|---|---|---|---|
| Q1 | What is the best app for cooking with Meta Ray-Ban glasses? | No. Recommends Sous, Recipe Keeper, and Meta AI. Cites bgr. | No. Recommends Meta AI (Gen 2) and FORK'D (Display web app). Cites ai.meta.com and reddit. |
| Q2 | What are the best AI cooking apps in 2026? | No. Recommends Mise, SideChef, SuperCook, Eat This Much, FoodiePrep, ReciBites. Cites apps.apple.com, supercook, eatthismuch, foodieprep.ai, mashable. | No. Recommends Samsung Food, Flavorish, ReciMe, Cooklist, DishGen. |
| Q3 | Is there an app with an AI chef that talks you through recipes hands-free while you cook? | No. Recommends Hands! AI Chef, Mise, Cookie, Yes Chef, Suvio. | No. Recommends Suvio, Ratatron, Qimeal, goumi. |
| Q4 | What is Glutt: Recipes & AI Chef? | Yes, accurate, sourced only from the App Store listing. | |

Summary: 0 of 6 generic answers mention Glutt. The one branded answer (Q4, Perplexity) works only from the App Store listing.

## Web research agent (WebSearch, 17 queries; full notes kept outside the repo)
- Glutt absent from all 14 generic queries. "Glutt recipes" / "Glutt: Recipes & AI Chef" #1 = public GitHub repo Malik1234567891011/Glutt with an outdated README (local-first, no accounts, glutt-sable.vercel.app).
- `glutt.org` query returns collisions (wh40k, GLUT, glut.org co-op, glutt.io, Project GLUTT). The domain itself is absent.
- Four public price sets conflict: App Store description $7.99/$49.99, App Store IAP list $14.99/$44.99, cielpm.ai (stale TestFlight page) $8/$32.99, glutt.org sessions $100/$149.
