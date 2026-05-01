import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './ease';

/**
 * LineReveal — single motion verb.
 * Masked line reveal (overflow:hidden + translateY 110%→0%) — Exo Ape grammar.
 * Use `asView` to trigger on scroll-in, otherwise triggers on mount.
 *
 * Uses IntersectionObserver with a safety-timer fallback so nothing
 * stays stuck at y:110% if the observer misfires (a known issue with
 * deeply nested small elements + framer-motion's whileInView).
 */
export function LineReveal({
  children,
  delay = 0,
  duration = 1.1,
  once = true,
  asView = false,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  asView?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [revealed, setRevealed] = useState(!asView);

  useEffect(() => {
    if (!asView || revealed) return;
    const el = wrapRef.current;
    if (!el) return;

    // Safety fallback — guarantee reveal even if observer misses.
    const safetyTimer = window.setTimeout(() => setRevealed(true), 1500);

    // Immediate reveal if already on-screen at mount.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setRevealed(true);
      window.clearTimeout(safetyTimer);
      return () => {};
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);

    return () => {
      window.clearTimeout(safetyTimer);
      io.disconnect();
    };
  }, [asView, once, revealed]);

  return (
    <span
      ref={wrapRef}
      className={`inline-block overflow-hidden align-bottom ${className}`}
    >
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: revealed ? '0%' : '110%' }}
        transition={{ duration, delay, ease: EASE }}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}
