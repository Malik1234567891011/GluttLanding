/* ---------------------------------------------------------------------------
   pointer.js — pointer physics.

   Gives the pointer a small amount of physical influence: a damped position,
   a velocity field the heat shader can read, and magnetic buttons. Everything
   here is desktop-only and opt-in — touch devices never get hover behaviour,
   and the cursor itself is left completely alone.
--------------------------------------------------------------------------- */

import { onTick, Damped, MASS, REDUCED, clamp } from './motion.js';

export const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

/** -1..1 from viewport centre, damped. */
export const pointer = {
  x: new Damped(0, MASS.pointer),
  y: new Damped(0, MASS.pointer),
  /** raw 0..1 viewport coords, for the shader */
  rawX: 0.5,
  rawY: 0.5,
  /** 0..1 recent movement energy — drives the heat distortion */
  energy: new Damped(0, 3.4),
  active: false,
};

let lastX = 0.5;
let lastY = 0.5;
let speed = 0;

if (hasFinePointer) {
  window.addEventListener(
    'pointermove',
    (e) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      speed += Math.hypot(nx - lastX, ny - lastY) * 9;
      lastX = nx;
      lastY = ny;
      pointer.rawX = nx;
      pointer.rawY = ny;
      pointer.x.set(nx * 2 - 1);
      pointer.y.set(ny * 2 - 1);
      pointer.active = true;
    },
    { passive: true }
  );

  window.addEventListener('pointerleave', () => {
    pointer.active = false;
    pointer.x.set(0);
    pointer.y.set(0);
  });

  onTick((dt) => {
    speed *= Math.exp(-6 * dt); // decay
    pointer.energy.set(clamp(speed, 0, 1));
    pointer.x.step(dt);
    pointer.y.step(dt);
    pointer.energy.step(dt);
  });
}

/* ------------------------------ magnetism ------------------------------- */

/**
 * Buttons lean toward the pointer within a radius, then spring back.
 * Small on purpose — this is a hint of physicality, not a toy.
 */
export function magnetise(el, { radius = 74, pull = 0.3 } = {}) {
  if (!hasFinePointer || REDUCED) return;

  const dx = new Damped(0, 12);
  const dy = new Damped(0, 12);
  let near = false;
  let stop = null;

  const run = () => {
    if (stop) return;
    stop = onTick((dt) => {
      dx.step(dt);
      dy.step(dt);
      el.style.transform = `translate3d(${dx.value.toFixed(2)}px, ${dy.value.toFixed(2)}px, 0)`;
      if (!near && dx.settled && dy.settled) {
        el.style.transform = '';
        stop();
        stop = null;
      }
    });
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ox = e.clientX - cx;
      const oy = e.clientY - cy;
      const d = Math.hypot(ox, oy);
      const reach = radius + Math.max(r.width, r.height) / 2;

      if (d < reach) {
        const f = (1 - d / reach) * pull;
        dx.set(ox * f);
        dy.set(oy * f);
        near = true;
        run();
      } else if (near) {
        near = false;
        dx.set(0);
        dy.set(0);
        run();
      }
    },
    { passive: true }
  );
}
