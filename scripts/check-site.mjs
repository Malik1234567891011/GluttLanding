#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   check-site.mjs — the SEO and link checks that should pass before a deploy.

     npm run check

   Fails (exit 1) on: a page without a title, description or absolute
   canonical; a page with zero or several <h1>; JSON-LD that does not parse;
   an internal link or sitemap URL that resolves to nothing; leftovers of the
   removed in-person booking funnel. Warns on long titles and descriptions.
--------------------------------------------------------------------------- */

import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://glutt.org';
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'content', 'scripts', '.vercel']);

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) out.push(...(await htmlFiles(join(dir, e.name))));
    } else if (e.name.endsWith('.html')) out.push(join(dir, e.name));
  }
  return out;
}

const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const redirectSources = (vercel.redirects || [])
  .filter((r) => !r.has)
  .map((r) => new RegExp('^' + r.source.replace(/:path\*/g, '.*').replace(/:\w+/g, '[^/]+') + '$'));

/** Does a site-relative path resolve to something Vercel will serve? */
function resolves(path) {
  const clean = decodeURI(path.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return true;
  if (redirectSources.some((re) => re.test(clean))) return true;
  const rel = clean.replace(/^\//, '');
  return (
    existsSync(join(ROOT, rel, 'index.html')) ||
    existsSync(join(ROOT, rel + '.html')) ||
    (existsSync(join(ROOT, rel)) && !rel.endsWith('/'))
  );
}

const files = await htmlFiles(ROOT);
const pagePath = (f) => {
  const r = '/' + relative(ROOT, f).replace(/index\.html$/, '').replace(/\.html$/, '');
  return r.length > 1 ? r.replace(/\/$/, '') : '/';
};

for (const f of files) {
  const rel = relative(ROOT, f);
  const html = await readFile(f, 'utf8');
  const is404 = rel === '404.html';
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) err(rel, 'missing <title>');
  else if (title.replace(/&amp;/g, '&').length > 70) warn(rel, `title is ${title.length} chars: ${title}`);

  if (!is404 && !noindex) {
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
    if (!desc) err(rel, 'missing meta description');
    else if (desc.length < 70 || desc.length > 175) warn(rel, `description is ${desc.length} chars`);

    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canon) err(rel, 'missing canonical');
    else if (canon !== ORIGIN + (pagePath(f) === '/' ? '/' : pagePath(f)))
      err(rel, `canonical ${canon} does not match ${ORIGIN}${pagePath(f)}`);
  }

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(rel, `${h1s} <h1> elements`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      err(rel, 'JSON-LD does not parse: ' + e.message);
    }
  }

  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//')) continue;
    if (!resolves(m[1])) err(rel, `broken internal link ${m[1]}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !resolves(u)) err(rel, `broken srcset ${u}`);
    }
  }

  for (const bad of ['/classic', 'href="#book"', 'data-checkout-plan', 'calendly', 'landing/meta/', 'In-person', 'in-person session']) {
    if (html.includes(bad)) err(rel, `leftover from the booking funnel: ${bad}`);
  }
}

// sitemap
const sitemap = await readFile(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  if (!loc.startsWith(ORIGIN)) err('sitemap.xml', `foreign URL ${loc}`);
  else if (!resolves(loc.slice(ORIGIN.length) || '/')) err('sitemap.xml', `URL resolves to nothing: ${loc}`);
}
const robots = await readFile(join(ROOT, 'robots.txt'), 'utf8');
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) err('robots.txt', 'no Sitemap line');
if (/Disallow:\s*\/\s*$/m.test(robots)) err('robots.txt', 'something disallows the whole site');

for (const w of warnings) console.log('warn ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`\n${files.length} HTML files, ${locs.length} sitemap URLs: ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
