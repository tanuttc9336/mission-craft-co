/**
 * TWITCH ENGINE v6 — peripheral micro-gestures
 * Stillness is the default. Motion is the event.
 * Cat-in-the-room feel: 5 gestures, variable interval, burst mode.
 *
 * Targets: h1, h2, h3, p, blockquote, [data-twitch]
 * Skips elements near the cursor (10% norm exclusion zone).
 * Freezes 3s after user activity. Halves frequency after 60s idle.
 */
import { useEffect } from 'react';

const SELECTOR = 'h1, h2, h3, p, blockquote, [data-twitch]';
const GESTURE_INTERVAL_MIN = 4000;
const GESTURE_INTERVAL_MAX = 18000;
const BIAS_MIN = 6000;
const BIAS_MAX = 10000;
const BURST_CHANCE = 0.30;
const CURSOR_EXCLUSION_NORM = 0.10;
const FREEZE_AFTER_ACTIVITY = 3000;
const IDLE_HALVE_AFTER = 60000;

type Gesture = 'shift' | 'flicker' | 'tilt' | 'slip' | 'blink';

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function applyGesture(el: HTMLElement, gesture: Gesture) {
  const original = el.getAttribute('style') || '';
  const transition = 'transform 120ms ease-out, opacity 120ms ease-out';

  if (gesture === 'shift') {
    const dx = rand(-3, 3);
    el.style.transition = transition;
    el.style.transform = `translateX(${dx}px)`;
    setTimeout(() => { el.style.transition = 'transform 380ms ease-in-out'; el.style.transform = ''; }, 120);
    setTimeout(() => { el.style.transition = ''; }, 500);

  } else if (gesture === 'flicker') {
    const drop = rand(0.20, 0.35);
    el.style.transition = 'opacity 40ms ease-out';
    el.style.opacity = String(1 - drop);
    setTimeout(() => { el.style.transition = 'opacity 180ms ease-in'; el.style.opacity = ''; }, 40);
    setTimeout(() => { el.style.transition = ''; }, 220);

  } else if (gesture === 'tilt') {
    const deg = rand(0.5, 1.5) * (Math.random() < 0.5 ? 1 : -1);
    el.style.transition = transition;
    el.style.transform = `rotate(${deg}deg)`;
    setTimeout(() => { el.style.transition = 'transform 420ms ease-in-out'; el.style.transform = ''; }, 120);
    setTimeout(() => { el.style.transition = ''; }, 540);

  } else if (gesture === 'slip') {
    const dx = rand(-4.5, 4.5);
    el.style.transition = 'transform 60ms ease-out';
    el.style.transform = `translateX(${dx}px)`;
    setTimeout(() => { el.style.transition = 'transform 480ms cubic-bezier(0.25,1.6,0.5,1)'; el.style.transform = ''; }, 60);
    setTimeout(() => { el.style.transition = ''; }, 540);

  } else if (gesture === 'blink') {
    el.style.transition = 'opacity 20ms ease-out';
    el.style.opacity = '0';
    setTimeout(() => { el.style.transition = 'opacity 80ms ease-in'; el.style.opacity = ''; }, 80);
    setTimeout(() => { el.style.transition = ''; }, 160);
  }
}

export default function TwitchEngine() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lastActivity = 0;
    let lastIdle = performance.now();
    let mx = -1, my = -1;

    function onActivity() { lastActivity = performance.now(); }
    window.addEventListener('mousemove', onActivity, { passive: true });
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    function scheduleNext(delay: number) {
      return setTimeout(tick, delay);
    }

    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const now = performance.now();
      const sinceActivity = now - lastActivity;

      // freeze 3s after activity
      if (sinceActivity < FREEZE_AFTER_ACTIVITY) {
        timer = scheduleNext(500);
        return;
      }

      // re-query every tick — chapters may not be in DOM at mount time
      const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR))
        // skip elements managed by Framer Motion (have data-framer-* or are inside [data-framer-component])
        .filter(el => !el.closest('[data-framer-component-type]'));

      if (targets.length === 0) {
        timer = scheduleNext(1000);
        return;
      }

      // only consider elements visible in the viewport ± 200px
      const vw = window.innerWidth, vh = window.innerHeight;
      const eligible = targets.filter(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return false;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        if (mx < 0) return true;
        const ndx = Math.abs(cx - mx) / vw;
        const ndy = Math.abs(cy - my) / vh;
        return Math.hypot(ndx, ndy) > CURSOR_EXCLUSION_NORM;
      });

      if (eligible.length > 0) {
        const el = eligible[(Math.random() * eligible.length) | 0];
        const gestures: Gesture[] = ['shift', 'flicker', 'tilt', 'slip', 'blink'];
        const g = gestures[(Math.random() * gestures.length) | 0];
        applyGesture(el, g);

        // burst: 30% chance of follow-up gesture quickly
        if (Math.random() < BURST_CHANCE) {
          setTimeout(() => {
            const el2 = eligible[(Math.random() * eligible.length) | 0];
            const g2 = gestures[(Math.random() * gestures.length) | 0];
            applyGesture(el2, g2);
          }, rand(200, 600));
        }
      }

      // idle > 60s → halve frequency
      const idleFactor = (now - lastIdle > IDLE_HALVE_AFTER) ? 2 : 1;
      // bias toward 6–10s range
      const next = Math.random() < 0.6
        ? rand(BIAS_MIN, BIAS_MAX) * idleFactor
        : rand(GESTURE_INTERVAL_MIN, GESTURE_INTERVAL_MAX) * idleFactor;

      timer = scheduleNext(next);
    }

    timer = scheduleNext(rand(GESTURE_INTERVAL_MIN, BIAS_MAX));

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('scroll', onActivity);
    };
  }, []);

  return null;
}
