import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';
import { useDomOpacity } from '@/lib/use-dom-opacity';

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-2 ${className ?? ''}`}>
      <span className="text-[9px] font-mono text-white/25 leading-none break-all">{label}</span>
    </div>
  );
}

const BTS_STILLS = [
  'chapter-03/make-bts-still-01.jpg',
  'chapter-03/make-bts-still-02.jpg',
  'chapter-03/make-bts-still-03.jpg',
  'chapter-03/make-bts-still-04.jpg',
  'chapter-03/make-bts-still-05.jpg',
  'chapter-03/make-bts-still-06.jpg',
];

// Each still: ~11% of chapter progress, starting at 0.15
const STILL_RANGES: [number, number][] = BTS_STILLS.map((_, i) => [
  0.15 + i * 0.1083,
  0.15 + (i + 1) * 0.1083,
]);

function BtsStill({
  label,
  range,
  progress,
}: {
  label: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const scale = useTransform(progress, [range[0], range[1]], [1.06, 1]);
  const ref = useRef<HTMLDivElement>(null);
  useDomOpacity(ref, progress, range);
  return (
    <div className="relative overflow-hidden">
      <motion.div ref={ref} style={{ opacity: 0, scale }} className="absolute inset-0">
        <Placeholder label={label} className="w-full h-full" />
      </motion.div>
    </div>
  );
}

export default function Chapter03_MakeIt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Analytics ───────────────────────────────────────────────────────────
  const reachedRef = useRef(false);
  const completedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !reachedRef.current) {
      reachedRef.current = true;
      trackEvent('chapter_reached', { chapter: 3 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 3 });
    }
  });

  const stepY     = useTransform(scrollYProgress, [0.00, 0.15], [20, 0]);
  const headlineY = useTransform(scrollYProgress, [0.05, 0.15], [20, 0]);
  const bodyY     = useTransform(scrollYProgress, [0.80, 0.95], [16, 0]);

  const stepRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef     = useRef<HTMLParagraphElement>(null);
  useDomOpacity(stepRef,     scrollYProgress, [0.00, 0.15]);
  useDomOpacity(headlineRef, scrollYProgress, [0.05, 0.15]);
  useDomOpacity(bodyRef,     scrollYProgress, [0.80, 0.95]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="03-make-it" pinned height="350vh">
          <div className="absolute inset-0 bg-black flex flex-col gap-6 px-8 py-14 overflow-auto">
            <div className="space-y-2">
              <span className="font-display text-6xl font-bold text-white/15 leading-none block">03</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It</p>
              <h2 className="font-display text-3xl font-bold text-white">Production at the standard the project needs.</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {BTS_STILLS.map((label) => (
                <Placeholder key={label} label={label} className="aspect-video w-full" />
              ))}
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              Never under-delivered. Never over-complicated. The scope comes from the work, not the invoice.
            </p>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="03-make-it" pinned height="350vh">
        {/* Background clip placeholder at 15% opacity */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
          <Placeholder label="chapter-03/make-set-clip.mp4" className="w-full h-full" />
        </div>

        {/* Black base */}
        <div className="absolute inset-0 bg-black/80" />

        {/* Layout */}
        <div className="absolute inset-0 flex flex-col px-8 md:px-12 py-10 gap-4">

          {/* Header row */}
          <motion.div
            ref={stepRef}
            style={{ opacity: 0, y: stepY }}
            className="flex items-baseline gap-5 shrink-0"
          >
            <span className="font-display text-5xl md:text-7xl font-bold text-white/15 leading-none">03</span>
            <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It</p>
          </motion.div>

          <motion.h2
            ref={headlineRef}
            style={{ opacity: 0, y: headlineY }}
            className="font-display text-xl md:text-3xl font-bold text-white leading-tight shrink-0 max-w-2xl"
          >
            Production at the standard the project needs.
          </motion.h2>

          {/* 2×3 BTS grid */}
          <div className="grid grid-cols-2 grid-rows-3 gap-2 md:gap-3 flex-1 min-h-0">
            {BTS_STILLS.map((label, i) => (
              <BtsStill
                key={label}
                label={label}
                range={STILL_RANGES[i]}
                progress={scrollYProgress}
              />
            ))}
          </div>

          {/* Body copy */}
          <motion.p
            ref={bodyRef}
            style={{ opacity: 0, y: bodyY }}
            className="text-white/60 text-sm md:text-base leading-relaxed shrink-0 max-w-lg"
          >
            Never under-delivered. Never over-complicated. The scope comes from the work, not the invoice.
          </motion.p>

        </div>
      </Chapter>
    </div>
  );
}
