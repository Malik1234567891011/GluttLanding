/* ---------------------------------------------------------------------------
   cook.js — the scripted live-cooking demonstration.

   Everything shown here is a real capability of the app: guided steps, a
   hands-free timer, and asking Chef a question out loud mid-cook. The
   sequence is entirely client-side and deterministic — no model is called,
   no audio is played, nothing is recorded. Scrubbing the scroll backwards
   rewinds it cleanly.
--------------------------------------------------------------------------- */

import { onTick, REDUCED, range, clamp } from '../core/motion.js';

const LINE_IDLE = 'Nice sear starting. Give it one more minute, then flip and we glaze.';
const LINE_ANSWER = 'Not yet — the edges are still pale. Two more minutes, then we check together.';

export function createCookScene() {
  const say = document.getElementById('ck-say');
  const chef = document.getElementById('ck-chef');
  const user = document.getElementById('ck-user');
  const wave = document.getElementById('ck-wave');
  const bars = wave ? [...wave.querySelectorAll('i')] : [];
  const pill = document.getElementById('ck-pill');
  const mic = document.getElementById('ck-mic');
  const timer = document.getElementById('ck-timer');

  if (!chef) return { update() {} };

  chef.textContent = LINE_IDLE;

  let progress = 0;
  let active = false;
  let phase = '';
  let t = 0;
  let countdown = null;

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  function setPhase(next) {
    if (next === phase) return;
    phase = next;

    switch (next) {
      case 'idle':
        chef.textContent = LINE_IDLE;
        say.textContent = 'Say “Hey Chef” to talk';
        say.classList.remove('is-listening');
        user.classList.remove('is-on');
        wave.classList.remove('is-active');
        mic.classList.remove('is-hot');
        pill.classList.remove('is-on');
        timer.classList.remove('is-live');
        timer.textContent = '04:12';
        countdown = null;
        break;

      case 'listening':
        say.textContent = 'Listening';
        say.classList.add('is-listening');
        user.classList.add('is-on');
        wave.classList.add('is-active');
        mic.classList.add('is-hot');
        pill.classList.remove('is-on');
        timer.classList.remove('is-live');
        timer.textContent = '04:12';
        countdown = null;
        break;

      case 'answering':
        chef.textContent = LINE_ANSWER;
        say.textContent = 'Chef is talking';
        say.classList.add('is-listening');
        user.classList.add('is-on');
        wave.classList.add('is-active');
        mic.classList.remove('is-hot');
        pill.classList.remove('is-on');
        countdown = null;
        break;

      case 'timer':
        say.textContent = 'Say “Hey Chef” to talk';
        say.classList.remove('is-listening');
        wave.classList.remove('is-active');
        pill.classList.add('is-on');
        timer.classList.add('is-live');
        countdown = 180;
        break;
    }
  }

  setPhase('idle');

  if (!REDUCED) {
    onTick((dt) => {
      if (!active) return;
      t += dt;

      // the waveform answers the conversation, not a microphone
      if (wave.classList.contains('is-active')) {
        const speaking = phase === 'answering';
        for (let i = 0; i < bars.length; i++) {
          const s = Math.sin(t * (speaking ? 7.5 : 5.2) + i * 0.72) * 0.5 + 0.5;
          const s2 = Math.sin(t * 3.1 - i * 0.31) * 0.5 + 0.5;
          const env = Math.sin((i / bars.length) * Math.PI); // taper at the ends
          const h = 0.16 + s * s2 * env * (speaking ? 0.92 : 0.6);
          bars[i].style.transform = `scaleY(${h.toFixed(3)})`;
        }
      } else {
        for (let i = 0; i < bars.length; i++) bars[i].style.transform = 'scaleY(0.16)';
      }

      if (countdown !== null) {
        countdown = Math.max(0, countdown - dt);
        timer.textContent = fmt(countdown);
      }
    });
  }

  return {
    /** Driven by the cook act's scroll progress. */
    update(p, isActive) {
      progress = clamp(p);
      active = isActive;
      if (!isActive) return;

      if (progress < 0.16) setPhase('idle');
      else if (progress < 0.34) setPhase('listening');
      else if (progress < 0.54) setPhase('answering');
      else setPhase('timer');
    },
  };
}
