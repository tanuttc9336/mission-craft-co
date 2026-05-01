/**
 * SOUND OF LOOKING
 * Dwell on any content element for 1.8s → faint outline appears.
 * Move away → fade out. The site returns your gaze.
 * Uses a delayed re-query so it works with late-rendering chapters.
 */
import { useEffect } from 'react';

const SELECTOR = 'h1, h2, h3, p, blockquote, figure, [data-look]';
const DWELL = 1800;
const FADE_OUT = 320;

export default function SoundOfLooking() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let current: HTMLElement | null = null;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;
    const handlers: Array<{ el: HTMLElement; enter: () => void; leave: (e: MouseEvent) => void }> = [];

    function clearLook(el: HTMLElement) {
      el.classList.add('sol-fading');
      setTimeout(() => {
        el.classList.remove('sol-looked', 'sol-fading');
      }, FADE_OUT);
    }

    function attach(el: HTMLElement) {
      // prevent double-attaching
      if (el.dataset.solAttached) return;
      el.dataset.solAttached = '1';

      const enter = () => {
        if (current && current !== el) clearLook(current);
        current = el;
        if (dwellTimer) clearTimeout(dwellTimer);
        dwellTimer = setTimeout(() => {
          if (current === el) el.classList.add('sol-looked');
        }, DWELL);
      };
      const leave = (e: MouseEvent) => {
        const rt = e.relatedTarget as Node | null;
        if (rt && el.contains(rt)) return;
        if (dwellTimer) clearTimeout(dwellTimer);
        if (current === el) { clearLook(el); current = null; }
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave as EventListener);
      handlers.push({ el, enter, leave });
    }

    // initial attach + re-attach after chapters have had time to render
    function attachAll() {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);
    }
    attachAll();
    const t1 = setTimeout(attachAll, 800);
    const t2 = setTimeout(attachAll, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (dwellTimer) clearTimeout(dwellTimer);
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave as EventListener);
        el.classList.remove('sol-looked', 'sol-fading');
        delete el.dataset.solAttached;
      });
    };
  }, []);

  return null;
}
