# Weekly SEO/GEO upkeep runbook

The scheduled cloud routine "Glutt SEO/GEO weekly upkeep" runs this every Monday. Edit this file to
change what it does; the routine only says "follow docs/weekly-upkeep.md".

**Read first:** `docs/SEO-GEO.md` (strategy and the honesty rules), `docs/seo-geo-results.md` (the log,
newest entry last), `landing/README.md` (how the site is built).

**How the site builds.** The guides, FAQ, about page, `sitemap.xml`, `robots.txt`, `llms.txt`,
`404.html` and the homepage JSON-LD are **generated**. Edit `content/pages/*.mjs` or
`content/site.mjs`, then run `node scripts/build-pages.mjs`, then `npm run check` (must report
**0 errors**). Never hand-edit generated HTML. Pushing `main` deploys to glutt.org.

## 1. Health check

- `curl` every URL in `sitemap.xml`; all must return 200.
- `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/favicon.ico` return 200.
- `https://www.glutt.org/` 308-redirects to `https://glutt.org/`.
- `curl -A 'Mozilla/5.0 (compatible; GPTBot/1.1)' https://glutt.org/guides/cooking-with-meta-glasses`
  returns the full HTML including the JSON-LD block. AI crawlers do not run JavaScript, so this is the
  check that matters most.

Fix anything broken whose cause is in this repo. Report anything else.

## 2. News check, then update what it changes

Search for developments since the last dated entry in `docs/seo-geo-results.md`:

- Meta AI glasses and cooking: Ray-Ban Meta (Gen 1/2/3), Ray-Ban Meta Audio, Oakley Meta,
  Meta Ray-Ban Display, Meta Neural Band, Meta AI / Muse.
- Whether **New York Times Cooking's hands-free mode** actually shipped (it was "later this fall").
- Whether Meta's **Wearables Device Access Toolkit** opened publishing beyond developer preview. If it
  ever does, that is the biggest single update this site can make: camera-through-glasses becomes real,
  and `/guides/cooking-with-meta-glasses` needs rewriting that day.
- New third-party cooking apps for Meta glasses (competitors).
- The **Mealime** shutdown (was 2026-10-21): after it happens, `/guides/mealime-alternatives` must move
  to past tense.

Pages this usually touches: `content/pages/10-meta-glasses.mjs`, `12-display.mjs`, `45-mealime.mjs`,
`50-best-apps.mjs`.

## 3. Rules that matter more than freshness

- **Only state what you verified on a primary source in this run**, and add it to that page's `sources`.
  Meta's own pages and developer docs beat press coverage.
- **Never claim an unshipped feature.** The App Store build has no glasses camera access, and Skills
  checks are scored from an **iPhone photo**, not through glasses. If you cannot verify a claim, cut it.
- **No prices for Glutt on the site.** The App Store is the source of truth.
- **Do not bump an `updated` date unless the page's content actually changed.** Fake freshness is worse
  than an old date.
- Do not change the visual design, and do not add analytics or ad pixels (the Meta Pixel was removed on
  purpose, 2026-09-25).
- Competitor claims must stay fair. This site's credibility is the asset.

## 4. Ship it

If anything changed:

1. `node scripts/build-pages.mjs && npm run check` — 0 errors required.
2. Commit with a message explaining *why*, and push to `main`. If the push is rejected, open a PR instead.
3. Ping IndexNow for changed URLs:
   ```bash
   curl -s -X POST https://api.indexnow.org/indexnow \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"host":"glutt.org","key":"861884f62d5e74f6460fa88dcd29835b",
          "keyLocation":"https://glutt.org/861884f62d5e74f6460fa88dcd29835b.txt",
          "urlList":["https://glutt.org/..."]}'
   ```
4. Append a short dated entry to `docs/seo-geo-results.md`: what changed, what you verified, what you
   deliberately did not do. Keep it to a few lines.

If nothing material changed, say so in the final message and append nothing. A quiet week is a fine
outcome; inventing work to look busy is not.

## 5. Flag for Malik (cannot be done from the cloud)

The routine has no access to Search Console, Bing Webmaster Tools, the App Store or the browser. When
relevant, end the run by reminding him about the open items in `docs/ready-to-paste.md`, especially:

- Request indexing in Search Console for any **new** page (about 10 a day allowed).
- The App Store listing rewrite: subtitle, keywords, promo text, the Ray-Ban Meta paragraph, and the
  price mismatch between the description and the in-app purchase list.
- Ratings: the US store still shows 0, which is the weakest signal Glutt has.
