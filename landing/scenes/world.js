/* ---------------------------------------------------------------------------
   world.js — the continuous camera.

   One phone, one set of fragments, one journey. Every act reads from the same
   scroll-driven state, so nothing ever "loads a new section" — the world just
   keeps travelling. Poses are authored per act as keyframes and blended, which
   means intermediate scroll positions are composed too, not only the ends.
--------------------------------------------------------------------------- */

import { onTick, Damped, MASS, REDUCED, clamp, lerp, range, ease } from '../core/motion.js';
import { registerAct, sample, progressOf, approachOf, isActive, measure } from '../core/scroll.js';
import { pointer, hasFinePointer } from '../core/pointer.js';
import { createHeatField } from '../gl/heat.js';

const ACTS = ['hero', 'save', 'plan', 'portal', 'cook', 'final'];

/* --------------------------- fragment authoring ---------------------------
   Ten objects, each with a job. x/y are viewport percentages from centre,
   z is depth in px, r is roll, s scale, o opacity. `absorb` is the point in
   the save act where the object crosses the glass and becomes a Glutt recipe.
-------------------------------------------------------------------------- */

const FRAGMENTS = [
  {
    id: 'video',
    depth: 0.92,
    w: 124,
    mass: MASS.card,
    absorb: 0.18,
    resolves: { img: '/assets/food/korean-beef-640.webp', title: 'Korean Beef Bowls', meta: '35 min · 4 servings' },
    html: `<div class="frag__media"><img src="/assets/food/korean-beef-640.webp" alt="" loading="lazy" decoding="async"></div>
           <span class="frag__tag">Reel</span><span class="frag__play"></span>
           <span class="frag__cap">korean beef bowls 🔥 save this</span>`,
    cls: 'frag--video',
    hero: { x: 34, y: -28, z: 120, r: -7, s: 1, o: 1 },
    plan: { x: -10, y: -22, z: 0, r: 0, s: 0.9, o: 1 },
    portal: { x: -19, y: -8, z: -140, r: 0, s: 0.7, o: 0.85 },
  },
  {
    id: 'shot',
    depth: 0.6,
    w: 138,
    mass: MASS.card,
    absorb: 0.42,
    resolves: { img: '/assets/food/salmon-dill-640.webp', title: 'Lemon Dill Salmon', meta: '25 min · high protein' },
    cls: 'frag--paper',
    html: `<div class="frag__h">Screenshot · 14:22</div>
           <div class="frag__lines"><i></i><i></i><i></i><i></i></div>`,
    hero: { x: 13, y: 31, z: -30, r: 5, s: 1, o: 1 },
    plan: { x: -10, y: -2, z: 0, r: 0, s: 0.9, o: 1 },
    portal: { x: 0, y: -8, z: -140, r: 0, s: 0.7, o: 0.85 },
  },
  {
    id: 'web',
    depth: 0.42,
    w: 150,
    mass: MASS.card,
    absorb: 0.66,
    resolves: { img: '/assets/food/shawarma-640.webp', title: 'Saffron Shawarma Bowl', meta: '40 min · meal prep' },
    cls: 'frag--paper',
    html: `<div class="frag__url">a recipe blog, 40 paragraphs in</div>
           <div class="frag__h">Sheet-Pan Shawarma</div>
           <div class="frag__lines"><i></i><i></i><i></i><i></i></div>`,
    hero: { x: 37, y: 23, z: -110, r: -4, s: 1, o: 1 },
    plan: { x: -10, y: 18, z: 0, r: 0, s: 0.9, o: 1 },
    portal: { x: 19, y: -8, z: -140, r: 0, s: 0.7, o: 0.85 },
  },
  {
    id: 'pantry',
    depth: 0.75,
    w: 0,
    mass: MASS.chip,
    cls: 'frag--chip frag--pantry',
    html: `<span class="dot dot--amber"></span>Greek yogurt · <b>2 days left</b>`,
    hero: { x: 5, y: -8, z: 60, r: -2, s: 1, o: 1 },
    plan: { x: -2, y: -22, z: 0, r: 0, s: 1, o: 1 },
    portal: { x: -12, y: 10, z: -120, r: 0, s: 0.8, o: 0 },
  },
  {
    id: 'macro',
    depth: 0.5,
    w: 0,
    mass: MASS.chip,
    cls: 'frag--chip',
    html: `<span class="dot dot--green"></span><b>32g</b> protein`,
    hero: { x: 41, y: -8, z: 20, r: 3, s: 1, o: 1 },
    plan: { x: -2, y: -2, z: 0, r: 0, s: 1, o: 1 },
    portal: { x: 2, y: 10, z: -120, r: 0, s: 0.8, o: 0 },
  },
  {
    id: 'timer',
    depth: 0.35,
    w: 0,
    mass: MASS.chip,
    cls: 'frag--chip',
    html: `<span class="dot dot--green"></span>Tuesday · <b>25 min</b>`,
    hero: { x: 15, y: 42, z: -80, r: 2, s: 1, o: 1 },
    plan: { x: -2, y: 18, z: 0, r: 0, s: 1, o: 1 },
    portal: { x: 15, y: 10, z: -120, r: 0, s: 0.8, o: 0 },
  },
  {
    id: 'grocery',
    depth: 0.28,
    w: 120,
    mass: MASS.card,
    cls: 'frag--paper',
    html: `<div class="frag__h">Groceries</div>
           <div class="frag__lines"><i></i><i></i><i></i></div>`,
    hero: { x: 33, y: 40, z: -160, r: 6, s: 1, o: 0.9 },
    plan: { x: -7, y: 34, z: -90, r: 0, s: 0.7, o: 0 },
    portal: { x: -28, y: 2, z: -180, r: 0, s: 0.66, o: 0 },
  },
  {
    id: 'food-salmon',
    depth: 0.68,
    w: 104,
    mass: MASS.food,
    cls: 'frag--food',
    html: `<img src="/assets/food/salmon-dill-640.webp" alt="" loading="lazy" decoding="async" style="aspect-ratio:1;">`,
    hero: { x: 7, y: -34, z: 80, r: 8, s: 1, o: 1 },
    plan: { x: 19, y: 30, z: -120, r: 0, s: 0.6, o: 0 },
    portal: { x: 28, y: 2, z: -180, r: 0, s: 0.66, o: 0.7 },
  },
  {
    id: 'food-shawarma',
    depth: 0.22,
    w: 112,
    mass: MASS.food,
    cls: 'frag--food is-round',
    html: `<img src="/assets/food/shawarma-640.webp" alt="" loading="lazy" decoding="async" style="aspect-ratio:1;">`,
    hero: { x: 26, y: -40, z: -190, r: -3, s: 1, o: 0.85 },
    plan: { x: -22, y: 32, z: -160, r: 0, s: 0.5, o: 0 },
    portal: { x: 0, y: 18, z: -220, r: 0, s: 0.6, o: 0.5 },
  },
  {
    /* held back for the finale: the one thing left at the end is dinner */
    id: 'dish',
    depth: 0.8,
    w: 340,
    mass: MASS.food,
    finaleOnly: true,
    cls: 'frag--food is-round',
    html: `<img src="/assets/food/hot-honey-640.webp" srcset="/assets/food/hot-honey-640.webp 640w, /assets/food/hot-honey-1280.webp 1280w" sizes="300px" alt="" loading="lazy" decoding="async" style="aspect-ratio:1;">`,
    hero: { x: 0, y: 40, z: -400, r: 0, s: 0.6, o: 0 },
    plan: { x: 0, y: 40, z: -400, r: 0, s: 0.6, o: 0 },
    portal: { x: 0, y: 40, z: -400, r: 0, s: 0.6, o: 0 },
  },
];

/* Where a fragment sits once the phone has swallowed it: at the glass, small,
   invisible. The transformation reads as "in it goes, out comes a recipe". */
const ABSORBED = { x: 0, y: 0, z: 40, r: 0, s: 0.34, o: 0 };

/* --------------------------- phone poses per act -------------------------- */

const POSE = {
  desktop: {
    heroA: { x: 25, y: 0, z: 0, ry: -11, rx: 2.5, s: 1 },
    heroB: { x: 22, y: -2, z: 40, ry: -9, rx: 2, s: 1.02 },
    saveA: { x: 20, y: -2, z: 60, ry: -8, rx: 2, s: 1.03 },
    saveB: { x: 8, y: 0, z: 150, ry: -3, rx: 1, s: 1.12 },
    planA: { x: 8, y: 0, z: 150, ry: -3, rx: 1, s: 1.12 },
    planB: { x: -28, y: 4, z: 30, ry: 4, rx: 12, s: 0.8 },
    portalA: { x: -28, y: 4, z: 30, ry: 4, rx: 12, s: 0.8 },
    portalB: { x: 0, y: 16, z: -260, ry: 0, rx: 58, s: 0.7 },
    cookA: { x: 0, y: 16, z: -100, ry: 0, rx: 0, s: 0.82 },
    cookB: { x: 0, y: 15, z: 60, ry: 0, rx: 0, s: 0.84 },
    finalIn: { x: -12, y: 22, z: -300, ry: 0, rx: 0, s: 0.46 },
    finalA: { x: -12, y: 6, z: -40, ry: 0, rx: 0, s: 0.64 },
    finalB: { x: -12, y: 4, z: 10, ry: 0, rx: 0, s: 0.66 },
  },
  mobile: {
    heroA: { x: 0, y: 34, z: 0, ry: -4, rx: 1.5, s: 1 },
    heroB: { x: 0, y: 31, z: 30, ry: -3, rx: 1, s: 1.02 },
    saveA: { x: 0, y: 28, z: 40, ry: -2, rx: 1, s: 1.03 },
    saveB: { x: 0, y: 14, z: 90, ry: 0, rx: 0, s: 1.06 },
    planA: { x: 0, y: 14, z: 90, ry: 0, rx: 0, s: 1.06 },
    planB: { x: 0, y: -22, z: -120, ry: 0, rx: 10, s: 0.62 },
    portalA: { x: 0, y: -22, z: -120, ry: 0, rx: 10, s: 0.62 },
    portalB: { x: 0, y: 4, z: -260, ry: 0, rx: 44, s: 0.5 },
    cookA: { x: 0, y: 15, z: -40, ry: 0, rx: 0, s: 1.02 },
    cookB: { x: 0, y: 13, z: 40, ry: 0, rx: 0, s: 1.06 },
    finalIn: { x: -8, y: 18, z: -260, ry: 0, rx: 0, s: 0.5 },
    finalA: { x: -8, y: 2, z: -30, ry: 0, rx: 0, s: 0.66 },
    finalB: { x: -8, y: 0, z: 0, ry: 0, rx: 0, s: 0.68 },
  },
};

const blend = (a, b, t) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  ry: lerp(a.ry, b.ry, t),
  rx: lerp(a.rx, b.rx, t),
  s: lerp(a.s, b.s, t),
});

const blendFrag = (a, b, t) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
  r: lerp(a.r, b.r, t),
  s: lerp(a.s, b.s, t),
  o: lerp(a.o, b.o, t),
});

export function createWorld({ onScreen, onCookProgress, onTone } = {}) {
  const front = document.getElementById('stage-front');
  const back = document.getElementById('stage-back');
  const phone = document.getElementById('phone');
  const tilt = document.getElementById('phone-tilt');
  const gloss = document.getElementById('phone-gloss');
  const steam = document.getElementById('steam');
  const portalEl = document.getElementById('portal');
  const portalDisc = portalEl?.querySelector('.portal__disc');
  const portalGlow = document.getElementById('portal-glow');
  const canvas = document.getElementById('heat');
  const worlds = document.querySelectorAll('.world');
  const ticks = [...document.querySelectorAll('#save-ticks li')];
  const finalTitle = document.querySelector('.final__title');

  document.querySelectorAll('[data-act]').forEach((el) => registerAct(el.dataset.act, el));

  /* Three layouts, not one layout squeezed. Between phone and wide desktop
     there is a band where the device barely shrinks but the room around it
     does, so that band drops to the reduced object set as well. */
  const isMobile = () => window.innerWidth <= 760;
  const isCompact = () => window.innerWidth > 760 && window.innerWidth <= 1180;

  /* ---------------------------- build fragments --------------------------- */

  const frags = FRAGMENTS.map((def) => {
    const el = document.createElement('div');
    el.className = `frag ${def.cls}`;
    el.innerHTML = def.html;
    if (def.w) el.style.setProperty('--fw', `${def.w}px`);

    if (def.resolves) {
      const r = document.createElement('div');
      r.className = 'frag__resolved';
      r.innerHTML = `<img src="${def.resolves.img}" alt="" loading="lazy" decoding="async">
                     <span class="frag__rmeta"><b>${def.resolves.title}</b><i>${def.resolves.meta}</i></span>`;
      el.appendChild(r);
    }

    // near objects live in front of the headline, far ones behind it
    (def.depth > 0.55 ? front : back).appendChild(el);

    return {
      def,
      el,
      seed: Math.random() * 1000,
      x: new Damped(0, def.mass),
      y: new Damped(0, def.mass),
      resolved: false,
    };
  });

  /* Mobile keeps four fragments plus the finale dish, at their own positions
     and 0.72 scale — a narrower screen cannot carry nine objects, and shrinking
     the desktop layout would just make everything collide. */
  const MOBILE_KEEP = new Set(['video', 'shot', 'web', 'pantry', 'dish']);
  const MOB_SCALE = 0.72;
  const CMP_SCALE = 0.78;
  const CMP = {
    video: { hero: { x: 33, y: -28 } },
    shot: { hero: { x: 11, y: 32 } },
    web: { hero: { x: 34, y: 24 } },
    pantry: { hero: { x: -4, y: -20 } },
  };
  const MOB = {
    // everything sits below the headline and around the rising device
    video: { hero: { x: 24, y: 16 }, plan: { x: -25, y: 8 } },
    shot: { hero: { x: -22, y: 30 }, plan: { x: 0, y: 8 } },
    web: { hero: { x: 21, y: 38 }, plan: { x: 25, y: 8 } },
    pantry: { hero: { x: -24, y: 8 }, plan: { x: -37, y: 16 } },
  };

  /* ------------------------------- heat ---------------------------------- */

  let heat = REDUCED ? null : createHeatField(canvas);
  if (heat) canvas.classList.add('is-on');

  /* Adaptive quality. Ambition is not an excuse for a page that stutters: if
     frames keep running long, the shimmer loses resolution and then goes away
     entirely, leaving the CSS ground. It never climbs back on its own, so it
     cannot oscillate. */
  const QUALITY_TIERS = [0.85, 0.6, 0.42];
  let qTier = 0;
  let slowFrames = 0;
  let goodFrames = 0;
  let warmup = 2; // seconds — fonts and image decodes make the first frames lie

  function govern(dt) {
    if (!heat) return;
    if (warmup > 0) {
      warmup -= dt;
      return;
    }
    if (dt > 0.024) {
      slowFrames++;
      goodFrames = 0;
    } else if (++goodFrames > 180) {
      slowFrames = 0;
      goodFrames = 0;
    }
    if (slowFrames < 45) return;

    slowFrames = 0;
    qTier += 1;
    if (qTier < QUALITY_TIERS.length) {
      heat.setQuality(QUALITY_TIERS[qTier]);
    } else {
      heat.dispose();
      heat = null;
      canvas.classList.remove('is-on');
    }
  }

  /* ------------------------------ state ---------------------------------- */

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let time = 0;
  let currentScreen = '';
  let toneOut = -1;

  const camHeat = new Damped(0, 2.2);
  const camTone = new Damped(0, 1.8);
  const tiltX = new Damped(0, MASS.phone);
  const tiltY = new Damped(0, MASS.phone);

  const onResize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
  };
  window.addEventListener('resize', onResize, { passive: true });

  function setScreen(name) {
    if (name === currentScreen) return;
    currentScreen = name;
    document.querySelectorAll('.scr').forEach((s) => s.classList.toggle('is-on', s.dataset.scr === name));
    onScreen?.(name);
  }

  /* --------------------------- the choreography --------------------------- */

  function poseFor(p) {
    const K = POSE[isMobile() ? 'mobile' : 'desktop'];

    // fin runs continuously across the run-up and the pin, so the device
    // rises into the last scene instead of cutting to it
    const pose =
      p.fin > 0
        ? p.fin < 0.5
          ? blend(K.finalIn, K.finalA, ease.inOut(p.fin * 2))
          : blend(K.finalA, K.finalB, ease.out((p.fin - 0.5) * 2))
        : p.cook > 0
          ? blend(K.cookA, K.cookB, ease.inOut(p.cook))
          : p.portal > 0
            ? blend(K.portalA, K.portalB, ease.inOut(p.portal))
            : p.plan > 0
              ? blend(K.planA, K.planB, ease.inOut(p.plan))
              : p.save > 0
                ? blend(K.saveA, K.saveB, ease.inOut(p.save))
                : blend(K.heroA, K.heroB, ease.out(p.hero));

    // In the compact band the device barely shrinks but the space around it
    // does, so it is pulled in and scaled down a touch.
    if (!isCompact()) return pose;
    return { ...pose, x: pose.x * 0.9, s: pose.s * 0.94 };
  }

  function fragPose(f, p) {
    const d = f.def;
    const mob = isMobile() ? MOB[d.id] : isCompact() ? CMP[d.id] : null;
    // swap in the mobile keyframes for this fragment, if it has any
    const HERO = mob?.hero ? { ...d.hero, ...mob.hero } : d.hero;
    const PLAN = mob?.plan ? { ...d.plan, ...mob.plan } : d.plan;

    if (d.finaleOnly) {
      // the dish rises only at the very end
      const t = ease.out(range(p.fin, 0.30, 0.86));
      const m = isMobile();
      return {
        x: m ? 15 : 17,
        y: lerp(m ? 30 : 24, m ? 15 : 14, t),
        z: lerp(-400, -140, t),
        r: 0,
        s: lerp(0.62, 1, t) * (m ? 0.55 : 1),
        o: t * 0.96,
      };
    }

    // gone by the finale
    if (p.fin > 0 || p.cook > 0.02) {
      return { ...d.portal, o: 0 };
    }

    if (p.portal > 0) {
      return blendFrag(PLAN, d.portal, ease.inOut(p.portal));
    }

    if (p.plan > 0) {
      const from = d.absorb != null ? ABSORBED : HERO;
      return blendFrag(from, PLAN, ease.inOut(range(p.plan, 0.05, 0.85)));
    }

    if (p.save > 0 && d.absorb != null) {
      // each source type crosses the glass at its own moment
      const t = ease.inOut(range(p.save, d.absorb, d.absorb + 0.2));
      return blendFrag(HERO, ABSORBED, t);
    }

    if (p.save > 0) {
      // everything else drifts back and dims while the imports happen
      const t = ease.out(p.save);
      return {
        x: lerp(HERO.x, HERO.x * 1.22, t),
        y: lerp(HERO.y, HERO.y * 1.1, t),
        z: lerp(HERO.z, HERO.z - 120, t),
        r: HERO.r,
        s: lerp(HERO.s, HERO.s * 0.92, t),
        o: lerp(HERO.o, 0.32, t),
      };
    }

    return { ...HERO };
  }

  /* ------------------------------- frame ---------------------------------- */

  let visible = true;

  function frame(dt) {
    time += dt;
    sample();

    const p = {};
    for (const a of ACTS) p[a] = progressOf(a);
    p.finalActive = isActive('final');
    p.fin = (approachOf('final') + p.final) / 2;

    const anyActive = ACTS.some((a) => isActive(a));
    // stop all rendering once the flat chapters own the screen
    if (!anyActive) {
      if (visible) {
        visible = false;
        worlds.forEach((w) => w.style.setProperty('--world-op', '0'));
      }
      return;
    }
    if (!visible) {
      visible = true;
      worlds.forEach((w) => w.style.setProperty('--world-op', '1'));
    }

    const mobile = isMobile();
    const compact = isCompact();

    /* ---- phone ---- */
    const pose = poseFor(p);
    const px = (pose.x / 100) * vw;
    const py = (pose.y / 100) * vh;

    // pointer parallax: the phone is heavy, so it barely answers
    const ox = hasFinePointer ? pointer.x.value * 14 : 0;
    const oy = hasFinePointer ? pointer.y.value * 9 : 0;

    phone.style.transform =
      `translate3d(${(px + ox).toFixed(1)}px, ${(py + oy).toFixed(1)}px, ${pose.z.toFixed(1)}px) ` +
      `rotateY(${pose.ry.toFixed(2)}deg) rotateX(${pose.rx.toFixed(2)}deg) scale(${pose.s.toFixed(3)})`;

    // we travel through the aperture, so the device goes with the old scene
    const phoneOp =
      p.cook > 0 || p.fin > 0
        ? Math.max(range(p.cook, 0, 0.1), p.fin > 0 ? 1 : 0)
        : 1 - range(p.portal, 0.24, 0.58);
    phone.style.opacity = phoneOp.toFixed(3);

    // a second, softer tilt so the glass has its own inertia
    if (hasFinePointer && !REDUCED) {
      tiltY.set(pointer.x.value * 3.2);
      tiltX.set(-pointer.y.value * 2.2);
      tilt.style.transform = `rotateY(${tiltY.step(dt).toFixed(2)}deg) rotateX(${tiltX.step(dt).toFixed(2)}deg)`;

      // specular sheen tracks the pointer across the glass
      gloss.style.setProperty('--sheen-x', `${(pointer.rawX * 100).toFixed(1)}%`);
      gloss.style.setProperty('--sheen-y', `${(pointer.rawY * 100).toFixed(1)}%`);
      gloss.style.setProperty('--sheen-a', `${(108 + pointer.x.value * 22).toFixed(1)}deg`);
    }

    /* ---- screens ---- */
    if (p.fin > 0 || p.cook > 0.02) setScreen('cook');
    else if (p.portal > 0) setScreen('progress');
    else if (p.plan > 0.62) setScreen('progress');
    else if (p.save > 0.34) setScreen('recipes');
    else setScreen('today');

    /* ---- import ticks ---- */
    if (ticks.length) {
      const marks = [0.18, 0.42, 0.66];
      ticks.forEach((li, i) => li.classList.toggle('is-on', p.save > marks[i] && p.save < 0.94));
    }

    /* ---- fragments ---- */
    const topDown = p.cook > 0 || p.fin > 0 ? 0 : p.portal * 62;
    for (const f of frags) {
      const d = f.def;
      if ((mobile || compact) && !MOBILE_KEEP.has(d.id)) {
        if (f.el.style.display !== 'none') f.el.style.display = 'none';
        continue;
      }
      if (f.el.style.display === 'none') f.el.style.display = '';

      const q = fragPose(f, p);

      // Ambient life on long, unequal cycles — never a synchronised bounce.
      // It quiets as Glutt takes over: by the planning act the drift is almost
      // gone, which is what makes the grid read as actually aligned rather
      // than approximately aligned.
      let dx = 0;
      let dy = 0;
      let dr = 0;
      if (!REDUCED) {
        const s = f.seed;
        const calm = lerp(1, 0.06, ease.out(Math.max(p.plan, p.portal)));
        dx = Math.sin(time * 0.11 + s) * 5 * d.depth * calm;
        dy = Math.cos(time * 0.083 + s * 1.7) * 6 * d.depth * calm;
        dr = Math.sin(time * 0.062 + s * 0.6) * 1.4 * calm;
      }

      // parallax: near objects answer the pointer more than far ones
      const par = hasFinePointer ? (10 + 52 * d.depth) : 0;
      f.x.set((q.x / 100) * vw + dx + pointer.x.value * par * -1);
      f.y.set((q.y / 100) * vh + dy + pointer.y.value * par * -0.6);

      const fx = f.x.step(dt);
      const fy = f.y.step(dt);

      const sc = q.s * (d.finaleOnly ? 1 : mobile ? MOB_SCALE : compact ? CMP_SCALE : 1);
      f.el.style.transform =
        `translate3d(${fx.toFixed(1)}px, ${fy.toFixed(1)}px, ${q.z.toFixed(1)}px) ` +
        `rotateZ(${(q.r + dr).toFixed(2)}deg) rotateX(${topDown.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
      f.el.style.opacity = (q.o * (d.finaleOnly ? 1 : 1 - range(p.portal, 0.3, 0.7))).toFixed(3);

      // the moment it crosses the glass it stops being a screenshot
      if (d.absorb != null) {
        const done = p.save > d.absorb + 0.2 || p.plan > 0;
        if (done !== f.resolved) {
          f.resolved = done;
          f.el.classList.toggle('is-resolved', done);
          // resolved cards share one size so the plan grid actually aligns;
          // the swap happens while the fragment is invisible inside the glass
          if (d.w) f.el.style.setProperty('--fw', done ? '148px' : `${d.w}px`);
        }
      }
    }

    /* ---- the plate portal ----
       The disc grows into a full-screen aperture. Past ~2.5x the photograph
       would only be a wall of pixels, so it dissolves into the warm ground of
       the kitchen — and the shader's tone is ramped to match, so when the disc
       finally un-sticks there is nothing to see change. */
    if (portalDisc) {
      const t = ease.inOut(p.portal);
      const scale = lerp(1, mobile ? 17 : 14, Math.pow(t, 1.9));
      portalDisc.style.transform = `scale(${scale.toFixed(3)}) rotate(${(t * -8).toFixed(2)}deg)`;
      portalEl.style.opacity = (isActive('portal') ? 1 : 0).toFixed(0);

      // The plate goes out of focus and out of sight as we reach it — a 14x
      // photograph is just pixels, and defocus is what actually happens when
      // something passes this close to the lens.
      const img = portalDisc.firstElementChild;
      const fade = range(p.portal, 0.2, 0.55);
      img.style.opacity = (1 - fade).toFixed(3);
      img.style.filter = `blur(${(fade * 3.5).toFixed(2)}px)`;
      if (portalGlow) portalGlow.style.opacity = range(p.portal, 0.14, 0.5).toFixed(3);
    }

    /* ---- steam, only while cooking ---- */
    if (steam) {
      const on = !REDUCED && (p.cook > 0.12 || p.final > 0.1);
      steam.classList.toggle('is-on', on);
    }

    /* ---- heat + tonal arc ---- */
    // heat rhymes: strong at the start, gone through the middle, back at the end
    const heroHeat = 0.55 * (1 - p.save);
    const portalHeat = 0.6 * ease.out(range(p.portal, 0.25, 0.9));
    const cookHeat = 0.9 * ease.out(range(p.cook, 0.05, 0.5));
    const finalHeat = 0.75 * ease.out(range(p.final, 0.0, 0.5));
    camHeat.set(Math.max(heroHeat, portalHeat, cookHeat, finalHeat));

    // 0 = warm night, 1 = kitchen warmth
    camTone.set(
      Math.max(p.cook * 0.92, p.final * 0.5, p.portal * 0.88, p.plan * 0.15)
    );

    const h = camHeat.step(dt);
    const tone = camTone.step(dt);

    if (Math.abs(tone - toneOut) > 0.01) {
      toneOut = tone;
      onTone?.(tone);
    }

    if (heat) {
      // the shimmer sits where the phone is
      const sx = 0.5 + (pose.x / 100) + (mobile ? 0 : 0);
      const sy = 0.5 + (pose.y / 100) + 0.30;
      heat.render({
        time,
        source: [clamp(sx, -0.2, 1.2), clamp(1 - sy, -0.2, 1.2)],
        heat: h,
        pointer: [pointer.rawX, 1 - pointer.rawY],
        energy: pointer.energy.value,
        tone,
      });
    }

    if (finalTitle) finalTitle.classList.toggle('is-in', p.final > 0.02 || isActive('final'));

    govern(dt);
    onCookProgress?.(p.cook, isActive('cook'));
  }

  /* --------------------------- reduced motion ----------------------------
     No camera travel, no continuous loop, no shader. Each act still settles
     into its authored composition, so the page keeps its pictures and loses
     only the movement between them.
     (An IntersectionObserver is the wrong tool here: these acts are 2–3
     viewports tall, so a ratio threshold can never be met.)
  ------------------------------------------------------------------------ */

  if (REDUCED) {
    const SCREENS = {
      hero: 'today',
      save: 'recipes',
      plan: 'progress',
      portal: 'progress',
      cook: 'cook',
      final: 'cook',
    };

    const settle = (name) => {
      const mobile = isMobile();
      const compact = isCompact();
      const K = POSE[mobile ? 'mobile' : 'desktop'];
      const map = {
        hero: K.heroA,
        save: K.saveB,
        plan: K.planB,
        portal: K.portalA,
        cook: K.cookA,
        final: K.finalA,
      };
      let pose = map[name];
      if (compact) pose = { ...pose, x: pose.x * 0.9, s: pose.s * 0.94 };

      phone.style.transform =
        `translate3d(${((pose.x / 100) * window.innerWidth).toFixed(1)}px, ${((pose.y / 100) * window.innerHeight).toFixed(1)}px, ${pose.z}px) ` +
        `rotateY(${pose.ry}deg) rotateX(${pose.rx}deg) scale(${pose.s})`;
      phone.style.opacity = name === 'portal' ? '0.25' : '1';

      setScreen(SCREENS[name]);
      if (steam) steam.classList.toggle('is-on', false);

      for (const f of frags) {
        const d = f.def;
        if ((mobile || compact) && !MOBILE_KEEP.has(d.id)) {
          f.el.style.display = 'none';
          continue;
        }
        f.el.style.display = '';

        const over = mobile ? MOB[d.id] : compact ? CMP[d.id] : null;
        const HERO = over?.hero ? { ...d.hero, ...over.hero } : d.hero;
        const PLAN = over?.plan ? { ...d.plan, ...over.plan } : d.plan;

        let q;
        if (d.finaleOnly) {
          q =
            name === 'final'
              ? { x: mobile ? 15 : 17, y: mobile ? 15 : 14, z: -140, r: 0, s: mobile ? 0.55 : 1, o: 0.96 }
              : { ...d.hero, o: 0 };
        } else if (name === 'hero') {
          q = HERO;
        } else if (name === 'save') {
          q = d.absorb != null ? ABSORBED : { ...HERO, o: 0.32 };
        } else if (name === 'plan' || name === 'portal') {
          q = PLAN;
        } else {
          q = { ...d.portal, o: 0 };
        }

        const sc = q.s * (d.finaleOnly ? 1 : mobile ? MOB_SCALE : compact ? CMP_SCALE : 1);
        f.el.style.transform =
          `translate3d(${((q.x / 100) * window.innerWidth).toFixed(1)}px, ${((q.y / 100) * window.innerHeight).toFixed(1)}px, ${q.z}px) ` +
          `rotateZ(${q.r}deg) scale(${sc.toFixed(3)})`;
        f.el.style.opacity = String(q.o);
        f.el.classList.toggle('is-resolved', d.absorb != null && name !== 'hero');
        if (d.w) f.el.style.setProperty('--fw', d.absorb != null && name !== 'hero' ? '148px' : `${d.w}px`);
      }
    };

    let current = '';
    let raf = 0;

    const pick = () => {
      raf = 0;
      sample();

      // the world only exists while one of the acts owns the screen
      const any = ACTS.some((a) => isActive(a));
      worlds.forEach((w) => w.style.setProperty('--world-op', any ? '1' : '0'));
      if (!any) return;

      let best = '';
      for (const a of ACTS) if (isActive(a)) best = a;
      for (const a of ACTS) {
        const pr = progressOf(a);
        if (pr > 0 && pr < 1) best = a;
      }
      if (best && best !== current) {
        current = best;
        settle(best);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', () => {
      measure();
      pick();
    });

    measure();
    settle('hero');
    current = 'hero';
    pick();

    return { destroy() {} };
  }

  const stop = onTick(frame);
  measure();

  return {
    destroy() {
      stop();
      heat?.dispose();
      window.removeEventListener('resize', onResize);
    },
  };
}
