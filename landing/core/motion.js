/* ---------------------------------------------------------------------------
   motion.js — the shared motion system.

   One rAF loop for the whole page. Everything that moves subscribes here, so
   there is exactly one layout/paint pass per frame and nothing animates while
   the tab is hidden or the world is off screen.

   Motion categories (kept deliberately small so timings stay coherent):
     ui      150–300ms   pointer + state response
     major   700–1600ms  scene changes
     ambient 6–20s       the world breathing
   Scroll choreography is continuous interpolation, not a duration.
--------------------------------------------------------------------------- */

export const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const DUR = {
  uiFast: 160,
  ui: 220,
  uiSlow: 300,
  major: 1100,
  majorLong: 1500,
};

/* Perceived mass, as damping responsiveness (higher = lighter = snappier).
   A sheet of paper should not settle like a slab of glass. */
export const MASS = {
  camera: 3.6,
  phone: 3.1, // heavy glass
  food: 4.4, // dense, slow
  card: 7.2, // paper
  chip: 9.0, // near weightless UI
  pointer: 10.0,
  steam: 1.6, // drifts long after everything else stops
};

export const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  soft: (t) => 1 - Math.pow(1 - t, 4),
  // slight overshoot, for light objects only
  back: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2),
};

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;

/** Remap v from [a,b] to 0..1, clamped. The workhorse of the scroll story. */
export const range = (v, a, b) => clamp((v - a) / (b - a || 1));

/** Frame-rate independent damping. dt in seconds, k from MASS. */
export const damp = (cur, target, k, dt) => cur + (target - cur) * (1 - Math.exp(-k * dt));

/** A scalar that chases a target with a given mass. */
export class Damped {
  constructor(value = 0, k = MASS.card) {
    this.value = value;
    this.target = value;
    this.k = k;
  }
  set(v) {
    this.target = v;
    return this;
  }
  snap(v) {
    this.value = this.target = v;
    return this;
  }
  step(dt) {
    this.value = damp(this.value, this.target, this.k, dt);
    return this.value;
  }
  get settled() {
    return Math.abs(this.target - this.value) < 0.0001;
  }
}

/* ------------------------------- the ticker ------------------------------ */

const subs = new Set();
let running = false;
let last = 0;
let awake = true;

function frame(now) {
  if (!running) return;
  const dt = Math.min((now - last) / 1000, 1 / 20); // clamp after a stall
  last = now;
  for (const fn of subs) fn(dt, now);
  requestAnimationFrame(frame);
}

function start() {
  if (running || !subs.size || !awake) return;
  running = true;
  last = performance.now();
  requestAnimationFrame(frame);
}

function stop() {
  running = false;
}

/** Subscribe to the loop. Returns an unsubscribe function. */
export function onTick(fn) {
  subs.add(fn);
  start();
  return () => {
    subs.delete(fn);
    if (!subs.size) stop();
  };
}

/** Expensive work pauses with the tab. */
document.addEventListener('visibilitychange', () => {
  awake = !document.hidden;
  awake ? start() : stop();
});

/** Run fn once the browser is idle, without blocking first paint. */
export const whenIdle = (fn, timeout = 900) =>
  'requestIdleCallback' in window
    ? requestIdleCallback(fn, { timeout })
    : setTimeout(fn, 1);

/** Element enters/leaves the viewport. Used to stop rendering unseen scenes. */
export function onVisible(el, cb, rootMargin = '15% 0px') {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => cb(e.isIntersecting, e)),
    { rootMargin, threshold: 0 }
  );
  io.observe(el);
  return () => io.disconnect();
}
