/* ---------------------------------------------------------------------------
   editorial.js — the flat chapter.

   Deliberately a different motion language from the world above it: type is
   revealed by a mask rather than a fade-up, photography drifts inside its own
   crop, and rules draw themselves. Restrained on purpose — after the camera
   work, stillness is the effect.
--------------------------------------------------------------------------- */

import { onTick, REDUCED, clamp } from '../core/motion.js';

export function createEditorial() {
  const reveals = document.querySelectorAll(
    '.ed__display, .ed__standfirst, .ed__sub, .ed__item, .ed__deflist > div, .ed__aside > *, .ed__rule > span, .book__title, .book__copy, .plan'
  );

  reveals.forEach((el, i) => {
    el.classList.add('rv');
    el.style.setProperty('--rv-i', String(i % 6));
  });

  if (REDUCED) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    /* A plain geometry check rather than IntersectionObserver. Several of
       these elements sit inside sticky, `overflow: clip` pins where observer
       callbacks are unreliable — and a reveal that silently never fires
       leaves the content invisible, which is the worst possible failure. */
    let pending = [...reveals];
    const check = () => {
      if (!pending.length) return;
      const h = window.innerHeight;
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top >= h * 0.88) return true;
        el.classList.add('is-in');
        return false;
      });
    };

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        check();
      });
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', schedule);
    check();
  }

  /* --- the bleed image drifts inside its crop as it passes --- */
  const bleed = document.querySelector('.ed__bleed');
  const img = bleed?.querySelector('img');

  if (img && !REDUCED) {
    let inView = false;
    new IntersectionObserver(
      (es) => es.forEach((e) => (inView = e.isIntersecting)),
      { rootMargin: '20% 0px' }
    ).observe(bleed);

    onTick(() => {
      if (!inView) return;
      const r = bleed.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height));
      // 8% of travel inside a 1.16 scale — movement you feel, not notice
      img.style.transform = `translate3d(0, ${((p - 0.5) * -8).toFixed(2)}%, 0) scale(1.16)`;
    });
  }
}
