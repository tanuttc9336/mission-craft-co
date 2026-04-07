import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Chapter } from '@/components/scroll/Chapter';

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
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const opacity = useTransform(progress, [range[0], range[1]], [0, 1]);
  const scale   = useTransform(progress, [range[0], range[1]], [1.06, 1]);
  return (
    <div className="relative overflow-hidden">
      <motion.div style={{ opacity, scale }} className="absolute inset-0">
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

  const stepOpacity     = useTransform(scrollYProgress, [0.00, 0.15], [0, 1]);
  const stepY           = useTransform(scrollYProgress, [0.00, 0.15], [20, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.05, 0.15], [20, 0]);
  const bodyOpacity     = useTransform(scrollYProgress, [0.80, 0.95], [0, 1]);
  const bodyY           = useTransform(scrollYProgress, [0.80, 0.95], [16, 0]);

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
            style={{ opacity: stepOpacity, y: stepY }}
            className="flex items-baseline gap-5 shrink-0"
          >
            <span className="font-display text-5xl md:text-7xl font-bold text-white/15 leading-none">03</span>
            <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It</p>
          </motion.div>

          <motion.h2
            style={{ opacity: headlineOpacity, y: headlineY }}
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
            style={{ opacity: bodyOpacity, y: bodyY }}
            className="text-white/60 text-sm md:text-base leading-relaxed shrink-0 max-w-lg"
          >
            Never under-delivered. Never over-complicated. The scope comes from the work, not the invoice.
          </motion.p>

        </div>
      </Chapter>
    </div>
  );
}
