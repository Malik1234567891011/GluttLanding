#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   build-pages.mjs — writes the guide, FAQ and about pages, the sitemap,
   robots.txt and llms.txt from content/pages/*.mjs.

   The site still has no build step: this runs locally and its output is
   committed, so Vercel serves plain static files exactly as before.

     node scripts/build-pages.mjs

   Hand-written pages (/, /app, /features, /support, legal) are not generated;
   they are only listed in the sitemap and llms.txt.
--------------------------------------------------------------------------- */

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE, ORG_ID, APP_ID, WEBSITE_ID, orgNode, appNode, websiteNode } from '../content/site.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ------------------------------- helpers -------------------------------- */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const stripTags = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function humanDate(iso) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

const isoStamp = (d) => (d.length === 10 ? `${d}T12:00:00+00:00` : d);

function readingMinutes(html) {
  const words = stripTags(html).split(' ').length;
  return Math.max(2, Math.round(words / 230));
}

/** ISO timestamp of the last commit touching `file`, or its mtime if uncommitted/dirty. */
async function lastModified(file) {
  const abs = join(ROOT, file);
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: ROOT }).toString().trim();
    if (!dirty) {
      const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { cwd: ROOT }).toString().trim();
      if (iso) return iso;
    }
  } catch {
    /* not a git checkout: fall through to mtime */
  }
  return (await stat(abs)).mtime.toISOString();
}

/* ------------------------------ fragments ------------------------------- */

function nav(current) {
  const link = (href, label) =>
    `<a class="nav__link" href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<header class="nav">
      <a class="nav__brand" href="/" aria-label="Glutt home">Glutt</a>
      <nav class="nav__links" aria-label="Main navigation">
        ${link('/features', 'Features')}
        ${link('/ai-chef', 'AI chef')}
        ${link('/guides', 'Guides')}
        ${link('/faq', 'FAQ')}
        ${link('/support', 'Support')}
      </nav>
      <a class="btn btn--primary btn--sm" href="${SITE.appStoreUrl}">Get the app</a>
    </header>`;
}

export function footer() {
  return `<footer class="ft">
      <div class="wrap ft__inner">
        <div class="ft__brand">
          <strong>Glutt</strong>
          <p>${esc(SITE.oneLiner)}</p>
          <p class="ft__muted">Support: <a href="mailto:${SITE.email}">${SITE.email}</a></p>
          <p class="ft__muted">© ${new Date().getUTCFullYear()} ${esc(SITE.company)}. All rights reserved.</p>
        </div>
        <nav class="ft__col" aria-label="Product links">
          <h2>Product</h2>
          <a href="/features">Full product overview</a>
          <a href="/ai-chef">Polly, the AI chef</a>
          <a href="/guides/cooking-with-meta-glasses">Cooking with Meta glasses</a>
          <a href="/guides">All guides</a>
          <a href="${SITE.appStoreUrl}">Get Glutt on the App Store</a>
        </nav>
        <nav class="ft__col" aria-label="Company links">
          <h2>Help &amp; legal</h2>
          <a href="/faq">FAQ</a>
          <a href="/about">About Glutt</a>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/delete-account">Delete Account</a>
        </nav>
      </div>
    </footer>`;
}

function crumbs(page) {
  const items = [{ name: 'Glutt', url: '/' }, ...(page.crumbs || []), { name: page.crumb || page.navLabel, url: page.path }];
  const html = items
    .map((c, i) =>
      i === items.length - 1
        ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
        : `<li><a href="${c.url}">${esc(c.name)}</a></li>`
    )
    .join('');
  const ld = {
    '@type': 'BreadcrumbList',
    '@id': SITE.origin + page.path + '#breadcrumb',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: SITE.origin + (c.url === '/' ? '/' : c.url),
    })),
  };
  return { html: `<ol class="crumbs">${html}</ol>`, ld };
}

function faqBlock(faq) {
  if (!faq?.length) return '';
  return `<section class="faq" aria-labelledby="faq-h">
          <h2 id="faq-h">Frequently asked questions</h2>
          ${faq.map((f) => `<h3>${esc(f.q)}</h3>\n          ${f.a.trim().startsWith('<') ? f.a : `<p>${f.a}</p>`}`).join('\n          ')}
        </section>`;
}

function sourcesBlock(sources) {
  if (!sources?.length) return '';
  return `<aside class="sources" aria-labelledby="src-h">
          <h2 id="src-h">Sources</h2>
          <ol>
            ${sources.map((s) => `<li><a href="${s.url}" rel="noopener">${esc(s.title)}</a>${s.note ? ` — ${esc(s.note)}` : ''}</li>`).join('\n            ')}
          </ol>
        </aside>`;
}

function relatedBlock(page, all) {
  const rel = (page.related || []).map((slug) => all.find((p) => p.slug === slug)).filter(Boolean);
  if (!rel.length) return '';
  return `<nav class="related" aria-labelledby="rel-h">
          <h2 id="rel-h">Keep reading</h2>
          <ul>
            ${rel.map((p) => `<li><a href="${p.path}">${esc(p.navLabel)}<span>${esc(p.cardText)}</span></a></li>`).join('\n            ')}
          </ul>
        </nav>`;
}

function ctaBlock(page) {
  const title = page.ctaTitle || 'Cook it with <em>someone on your side.</em>';
  return `<section class="cta" aria-label="Get Glutt">
          <h2>${title}</h2>
          <p>${esc(SITE.oneLiner)}</p>
          <a class="btn btn--primary" href="${SITE.appStoreUrl}">Get Glutt on the App Store</a>
          <small>iPhone with iOS 17.2 or later. Free to download, with a free trial of Glutt Premium.</small>
        </section>`;
}

/* ------------------------------- JSON-LD -------------------------------- */

function pageGraph(page, breadcrumbLd) {
  const url = SITE.origin + page.path;
  const graph = [orgNode(), websiteNode()];
  if (page.includeApp) graph.push(appNode());

  const main = {
    '@type': page.schemaType || 'Article',
    '@id': url + '#main',
    url,
    name: stripTags(page.h1),
    headline: stripTags(page.h1).slice(0, 110),
    description: page.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': WEBSITE_ID },
    // Google wants a full ISO 8601 datetime with a timezone, not a bare date.
    datePublished: isoStamp(page.published),
    dateModified: isoStamp(page.updated),
    image: SITE.origin + (page.image || SITE.ogImage),
    breadcrumb: { '@id': breadcrumbLd['@id'] },
    publisher: { '@id': ORG_ID },
  };
  if (main['@type'] === 'Article' || main['@type'] === 'TechArticle') {
    main.author = page.author === 'org' ? { '@id': ORG_ID } : SITE.founderNode;
    main.mainEntityOfPage = url;
  }
  if (page.about) main.about = page.about;
  if (page.mentionsApp) main.mentions = { '@id': APP_ID };
  if (main['@type'] === 'AboutPage' || main['@type'] === 'CollectionPage') delete main.headline;
  if (page.hasPart) main.hasPart = page.hasPart;
  graph.push(main, breadcrumbLd);

  if (page.faqSchema && page.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': url + '#faq',
      url,
      mainEntity: page.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) },
      })),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

/* -------------------------------- page ---------------------------------- */

function render(page, all) {
  const url = SITE.origin + page.path;
  const bc = crumbs(page);
  const minutes = readingMinutes(page.body + (page.faq || []).map((f) => f.a).join(' '));
  const byline =
    page.hideByline
      ? ''
      : `<p class="byline">
            <span>Updated <time datetime="${page.updated}">${humanDate(page.updated)}</time></span>
            <span>By ${page.author === 'org' ? 'the Glutt team' : esc(SITE.founder) + ', founder of Glutt'}</span>
            <span>${minutes} min read</span>
          </p>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f3efe6" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${page.ogType || 'article'}" />
    <meta property="og:site_name" content="Glutt" />
    <meta property="og:title" content="${esc(page.ogTitle || page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE.origin}${page.image || SITE.ogImage}" />
    <meta property="og:image:alt" content="${esc(page.imageAlt || SITE.ogImageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Instrument+Serif:ital@1&display=swap"
    />
    <link rel="stylesheet" href="/landing/guide.css" />
    <script type="application/ld+json">
${pageGraph(page, bc.ld)}
    </script>
    <script type="module" src="/landing/core/pixel.js"></script>
  </head>

  <body class="gd">
    <a class="skip-link" href="#main">Skip to content</a>
    ${nav(page.path)}

    <main id="main" class="doc">
      <div class="wrap">
        ${bc.html}
        <article>
          <header class="doc__head">
            ${page.eyebrow ? `<p class="eyebrow">${esc(page.eyebrow)}</p>` : ''}
            <h1>${page.h1}</h1>
            <p class="lede">${page.lede}</p>
            ${byline}
          </header>

          <div class="doc__body">
            ${page.answer ? `<div class="answer"><strong>Short answer</strong><p>${page.answer}</p></div>` : ''}
            ${typeof page.body === 'function' ? page.body(all) : page.body}
            ${faqBlock(page.faq)}
            ${sourcesBlock(page.sources)}
          </div>
        </article>

        <div class="doc__foot">
          ${relatedBlock(page, all)}
          ${page.hideCta ? '' : ctaBlock(page)}
        </div>
      </div>
    </main>

    ${footer()}
  </body>
</html>
`;
}

/* -------------------------------- main ---------------------------------- */

async function loadPages() {
  const dir = join(ROOT, 'content/pages');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.mjs')).sort();
  const pages = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(join(dir, f)).href);
    const p = mod.default;
    p.path = p.path || '/' + p.slug;
    pages.push(p);
  }
  return pages.sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
}

async function main() {
  const pages = await loadPages();

  for (const page of pages) {
    const out = join(ROOT, page.path.slice(1), 'index.html');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, render(page, pages));
    console.log('wrote', page.path);
  }

  /* ---- 404 ---- */
  // Vercel serves /404.html for any missing path. Better than a bare
  // "page not found": it keeps a lost visitor (or crawler) inside the site.
  const notFound = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="robots" content="noindex" />
    <title>Page not found | Glutt</title>
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700&family=Instrument+Serif:ital@1&display=swap" />
    <link rel="stylesheet" href="/landing/guide.css" />
  </head>
  <body class="gd">
    ${nav('')}
    <main id="main" class="doc">
      <div class="wrap">
        <div class="doc__head">
          <p class="eyebrow">404</p>
          <h1>This page <em>burned.</em></h1>
          <p class="lede">The page you were looking for doesn't exist, or it moved. These are the places people usually mean:</p>
        </div>
        <div class="cards">
          <a href="/"><h2>Glutt home</h2><p>The iPhone cooking app with a live AI chef.</p></a>
          <a href="/features"><h2>Features</h2><p>Everything Glutt does, in detail.</p></a>
          <a href="/guides"><h2>Guides</h2><p>Meta glasses, hands-free cooking, recipe imports and more.</p></a>
          <a href="/support"><h2>Support</h2><p>Questions about your account or the app.</p></a>
        </div>
      </div>
    </main>
    ${footer()}
  </body>
</html>
`;
  await writeFile(join(ROOT, '404.html'), notFound);
  console.log('wrote /404.html');

  /* ---- JSON-LD in the hand-written pages ---- */
  // Replaced between <!-- ld:start --> and <!-- ld:end --> so the homepage and
  // /app describe Glutt with exactly the same facts as every generated page.
  const handGraphs = {
    'index.html': [
      orgNode(),
      websiteNode(),
      appNode(),
      {
        '@type': 'WebPage',
        '@id': SITE.origin + '/#webpage',
        url: SITE.origin + '/',
        name: 'Glutt: Recipes & AI Chef',
        description: SITE.definition,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': APP_ID },
        primaryImageOfPage: SITE.origin + SITE.ogImage,
        inLanguage: 'en-US',
      },
    ],
    'app/index.html': [
      orgNode(),
      appNode(),
      {
        '@type': 'WebPage',
        '@id': SITE.origin + '/app#webpage',
        url: SITE.origin + '/app',
        name: 'Glutt: a little chef on your shoulder',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': APP_ID },
        inLanguage: 'en-US',
      },
    ],
  };
  for (const [file, graph] of Object.entries(handGraphs)) {
    const abs = join(ROOT, file);
    const html = await readFile(abs, 'utf8');
    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)
      .split('\n')
      .map((l) => '      ' + l)
      .join('\n');
    const next = html.replace(
      /(<!-- ld:start[^>]*-->)[\s\S]*?(\s*<!-- ld:end -->)/,
      `$1\n    <script type="application/ld+json">\n${json}\n    </script>$2`
    );
    if (next === html && !html.includes('application/ld+json')) throw new Error('ld markers missing in ' + file);
    await writeFile(abs, next);
    console.log('injected JSON-LD into', file);
  }

  /* ---- sitemap ---- */
  const handWritten = [
    { path: '/', file: 'index.html' },
    { path: '/features', file: 'features/index.html' },
    { path: '/app', file: 'app/index.html' },
    { path: '/support', file: 'support/index.html' },
    { path: '/privacy', file: 'privacy/index.html' },
    { path: '/terms', file: 'terms/index.html' },
    { path: '/delete-account', file: 'delete-account/index.html' },
  ];
  const entries = [];
  for (const h of handWritten) entries.push({ loc: SITE.origin + h.path, lastmod: await lastModified(h.file) });
  for (const p of pages) entries.push({ loc: SITE.origin + p.path, lastmod: isoStamp(p.updated) });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
  await writeFile(join(ROOT, 'sitemap.xml'), sitemap);
  console.log('wrote /sitemap.xml', entries.length, 'urls');

  /* ---- robots.txt ---- */
  // Everything is public and every crawler is welcome, AI search and training
  // crawlers included: an app nobody has heard of wants to be read. Named
  // groups are listed only so the intent is explicit to anyone auditing it.
  const aiAgents = [
    'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended', 'Google-Extended', 'DuckDuckBot', 'DuckAssistBot',
    'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot',
    'PerplexityBot', 'Perplexity-User', 'Meta-WebIndexer', 'Meta-ExternalAgent', 'Meta-ExternalFetcher',
    'facebookexternalhit', 'Amazonbot', 'Amzn-SearchBot', 'MistralAI-User', 'CCBot', 'YandexBot',
  ];
  const robots = `# glutt.org — every page is public, and every crawler is welcome.
# That includes AI search and AI training crawlers: we want Glutt to be
# known to the assistants people ask about cooking apps.

User-agent: *
Allow: /

${aiAgents.map((a) => `User-agent: ${a}`).join('\n')}
Allow: /

Sitemap: ${SITE.origin}/sitemap.xml
`;
  await writeFile(join(ROOT, 'robots.txt'), robots);
  console.log('wrote /robots.txt');

  /* ---- llms.txt ---- */
  const llms = `# Glutt

> ${SITE.definition}

Glutt: Recipes & AI Chef is an iPhone app (iOS 17.2 or later; not iPad) made by ${SITE.company}. It launched on the App Store on July 15, 2026. It is free to download; full use needs a Glutt Premium subscription, which starts with a free trial.

Key facts:
- App Store: ${SITE.appStoreUrl}
- Website: ${SITE.origin}/
- Polly is Glutt's live voice AI chef. Say "Chef" (or "Hey Chef") and ask out loud; she answers, runs timers, walks through each step and can look through the iPhone camera at the pan.
- Works with Ray-Ban Meta and Oakley Meta glasses as a Bluetooth headset: when the glasses are connected, Glutt uses their microphones and open-ear speakers for Polly, so the phone can stay on the counter. Seeing through the glasses' camera is not available yet; Meta's toolkit for third-party apps is still in developer preview.
- Imports recipes from TikTok, Instagram, YouTube, Reddit, any recipe website and screenshots, including methods that are only spoken in a video.
- Knows your fridge, pantry and equipment; shows missing ingredients and substitutes; builds grocery lists.
- Cook mode with large type, automatic timers and serving scaling; calories and protein per serving.
- Skills: a map of 75 cooking techniques across 9 regions, photo-checked by the AI chef, with nine Cook Ranks from Prep Cook to Head Chef.
- Support: ${SITE.email}

## Guides

${pages
  .filter((p) => p.llms !== false && p.slug !== 'guides')
  .map((p) => `- [${stripTags(p.navLabel)}](${SITE.origin}${p.path}): ${p.description}`)
  .join('\n')}

## Product

- [Homepage](${SITE.origin}/): What Glutt is and how it works.
- [Full product overview](${SITE.origin}/features): Every feature, in detail.
- [Support](${SITE.origin}/support): How to contact us.
- [Privacy Policy](${SITE.origin}/privacy)
- [Terms of Service](${SITE.origin}/terms)
`;
  await writeFile(join(ROOT, 'llms.txt'), llms);
  console.log('wrote /llms.txt');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
