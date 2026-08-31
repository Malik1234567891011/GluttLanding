/* ---------------------------------------------------------------------------
   scroll.js — reads scroll, never takes it.

   No wheel/touch interception and no scroll hijacking: the trackpad stays
   exactly as responsive as the browser makes it. Smoothness comes from the
   camera easing toward the scroll position, not from re-timing the user's
   input.

   Offsets are measured once per resize so the per-frame cost is a scalar read.
--------------------------------------------------------------------------- */

import { clamp } from './motion.js';

const acts = new Map(); // name -> { el, top, height, span, progress, active }
let vh = window.innerHeight;
let docReady = false;

export function registerAct(name, el) {
  acts.set(name, { el, top: 0, height: 0, span: 1, progress: 0, approach: 0, active: false });
}

export function measure() {
  vh = window.innerHeight;
  const pageY = window.scrollY || window.pageYOffset;
  for (const a of acts.values()) {
    const r = a.el.getBoundingClientRect();
    a.top = r.top + pageY;
    a.height = r.height;
    // how far the page scrolls while this act's stage is pinned
    a.span = Math.max(a.height - vh, 1);
  }
  docReady = true;
}

/** 0 before the act, 0..1 while pinned, 1 after. */
export function progressOf(name) {
  const a = acts.get(name);
  return a ? a.progress : 0;
}

/**
 * 0..1 as the act's top travels from the bottom of the viewport to the top —
 * i.e. the run-up before `progressOf` starts moving. Acts that follow each
 * other share a boundary and need no run-up, but the finale sits after the
 * flat editorial chapter, so it needs an entrance of its own.
 */
export function approachOf(name) {
  const a = acts.get(name);
  return a ? a.approach : 0;
}

export function isActive(name) {
  const a = acts.get(name);
  return a ? a.active : false;
}

/** Recompute every act's progress. Called once per frame by the world. */
export function sample() {
  if (!docReady) measure();
  const y = window.scrollY || window.pageYOffset;
  for (const a of acts.values()) {
    a.progress = clamp((y - a.top) / a.span);
    a.approach = clamp((y + vh - a.top) / vh);
    // "active" spans the whole time any part of the act is on screen
    a.active = y + vh > a.top && y < a.top + a.height;
  }
  return y;
}

export const viewportH = () => vh;

/* One measure pass per layout change, debounced into the next frame. */
let pending = 0;
function remeasure() {
  cancelAnimationFrame(pending);
  pending = requestAnimationFrame(measure);
}

window.addEventListener('resize', remeasure, { passive: true });
window.addEventListener('orientationchange', remeasure, { passive: true });
window.addEventListener('load', remeasure);
if (document.fonts?.ready) document.fonts.ready.then(remeasure);
