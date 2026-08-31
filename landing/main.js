/* ---------------------------------------------------------------------------
   main.js — bootstrap.

   Order matters: the page is usable before any of this runs. The hero's type,
   CTAs and navigation are plain server-rendered DOM, the phone is static HTML
   with a CSS ambient animation, and everything below only upgrades what is
   already on screen. If this module fails to load, the site still works.
--------------------------------------------------------------------------- */

import { REDUCED, whenIdle } from './core/motion.js';
import { magnetise } from './core/pointer.js';
import { track, bindClicks, scrollDepth } from './core/analytics.js';
import { measure } from './core/scroll.js';
import { createWorld } from './scenes/world.js';
import { createCookScene } from './scenes/cook.js';
import { createEditorial } from './scenes/editorial.js';

document.documentElement.classList.remove('no-js');

/* ------------------------------ intro ------------------------------------
   ~900ms total and non-blocking: nothing waits on it, and it is skipped
   outright for reduced motion or when arriving at a deep link.
-------------------------------------------------------------------------- */

function runIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const skip = REDUCED || location.hash || (window.scrollY || 0) > 40;
  if (skip) {
    intro.remove();
    return;
  }

  document.body.classList.add('is-intro');
  setTimeout(() => {
    document.body.classList.add('intro-done');
    setTimeout(() => intro.remove(), 700);
  }, 900);
}

/* ------------------------------- nav ------------------------------------- */

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const nav = document.getElementById('nav');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* The nav inverts over the bone-coloured chapters so it stays readable. */
  const flat = document.querySelector('.ed');
  if (nav && flat) {
    const io = new IntersectionObserver(
      ([e]) => nav.classList.toggle('is-light', e.isIntersecting && e.boundingClientRect.top < 80),
      { rootMargin: '-64px 0px -100% 0px', threshold: 0 }
    );
    io.observe(flat);

    // the footer is dark again, so flip back
    const ft = document.querySelector('.ft');
    if (ft) {
      new IntersectionObserver(
        ([e]) => e.isIntersecting && e.boundingClientRect.top < 80 && nav.classList.remove('is-light'),
        { rootMargin: '-64px 0px -100% 0px' }
      ).observe(ft);
    }
  }
}

/* --------------------------- in-page anchors -----------------------------
   Legacy deep links (/#features, /#how-it-works, /#book) are all still real
   targets on this page. Very long smooth scrolls are turned into jumps so a
   click never leaves someone watching the page slide for five seconds.
-------------------------------------------------------------------------- */

function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    const far = Math.abs(top - window.scrollY) > window.innerHeight * 3;
    window.scrollTo({ top, behavior: REDUCED || far ? 'auto' : 'smooth' });
    history.pushState(null, '', `#${id}`);
  });
}

/* ------------------------------- boot ------------------------------------ */

runIntro();
initNav();
initAnchors();
bindClicks();
scrollDepth();

const cook = createCookScene();

const world = createWorld({
  onCookProgress: (p, active) => cook.update(p, active),
});

createEditorial();

/* Magnetic buttons are a desktop nicety; magnetise() no-ops elsewhere. */
document.querySelectorAll('[data-magnetic]').forEach((el) => magnetise(el));

/* Sticky act heights depend on fonts + images; re-measure once they land. */
whenIdle(() => measure());
window.addEventListener('load', () => measure());

track('landing_view', {
  reduced_motion: REDUCED,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
});

window.Glutt = Object.assign(window.Glutt || {}, { world, remeasure: measure });
