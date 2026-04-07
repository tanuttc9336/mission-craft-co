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

export default function Chapter05_MakeItWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const stepOpacity      = useTransform(scrollYProgress, [0.00, 0.12], [0, 1]);
  const stepY            = useTransform(scrollYProgress, [0.00, 0.12], [20, 0]);
  const headlineOpacity  = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const headlineY        = useTransform(scrollYProgress, [0.05, 0.15], [20, 0]);

  const compositeOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const compositeY       = useTransform(scrollYProgress, [0.15, 0.35], [30, 0]);

  const phoneOpacity     = useTransform(scrollYProgress, [0.40, 0.57], [0, 1]);
  const phoneY           = useTransform(scrollYProgress, [0.40, 0.57], [40, 0]);
  const laptopOpacity    = useTransform(scrollYProgress, [0.57, 0.70], [0, 1]);
  const laptopY          = useTransform(scrollYProgress, [0.57, 0.70], [40, 0]);
  const tvOpacity        = useTransform(scrollYProgress, [0.70, 0.85], [0, 1]);
  const tvY              = useTransform(scrollYProgress, [0.70, 0.85], [40, 0]);

  const bodyOpacity      = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);
  const bodyY            = useTransform(scrollYProgress, [0.85, 0.97], [16, 0]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="05-make-it-work" pinned height="350vh">
          <div className="absolute inset-0 bg-black flex flex-col gap-6 px-8 py-14 overflow-auto">
            <div className="space-y-2">
              <span className="font-display text-6xl font-bold text-white/15 leading-none block">05</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It Work</p>
              <h2 className="font-display text-3xl font-bold text-white">
                Built for the platforms it actually has to live on.
              </h2>
            </div>
            <div className="flex gap-3 items-end">
              <Placeholder label="chapter-05/deliver-multiformat-still.jpg [16:9]" className="aspect-video h-24" />
              <Placeholder label="chapter-05/deliver-multiformat-still.jpg [9:16]" className="aspect-[9/16] h-24" />
              <Placeholder label="chapter-05/deliver-multiformat-still.jpg [1:1]" className="aspect-square h-24" />
            </div>
            <div className="flex gap-3 items-end">
              <Placeholder label="chapter-05/deliver-platform-still-01.jpg — IG Reels" className="aspect-[9/16] h-28" />
              <Placeholder label="chapter-05/deliver-platform-still-02.jpg — YouTube" className="aspect-video h-28" />
              <Placeholder label="chapter-05/deliver-platform-still-03.jpg — Event" className="aspect-video h-28" />
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              We deliver in the formats your channels use, and we stay close enough to keep the work growing after it ships.
            </p>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="05-make-it-work" pinned height="350vh">
        <div className="absolute inset-0 bg-black flex flex-col px-8 md:px-12 py-10 gap-4">

          {/* Header */}
          <div className="shrink-0 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <motion.div style={{ opacity: stepOpacity, y: stepY }} className="flex items-baseline gap-4">
              <span className="font-display text-5xl md:text-7xl font-bold text-white/15 leading-none">05</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It Work</p>
            </motion.div>
            <motion.h2
              style={{ opacity: headlineOpacity, y: headlineY }}
              className="font-display text-xl md:text-3xl font-bold text-white leading-tight max-w-2xl"
            >
              Built for the platforms it actually has to live on.
            </motion.h2>
          </div>

          {/* Multi-format composite — same still in 3 aspect ratios */}
          <motion.div
            style={{ opacity: compositeOpacity, y: compositeY }}
            className="shrink-0 flex items-end justify-center gap-3 md:gap-5"
          >
            <div className="flex flex-col items-center gap-1">
              <Placeholder label="deliver-multiformat-still.jpg" className="h-[18vh] aspect-video" />
              <p className="text-[9px] text-white/25 font-mono">16 : 9</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Placeholder label="deliver-multiformat-still.jpg" className="h-[18vh] aspect-[9/16]" />
              <p className="text-[9px] text-white/25 font-mono">9 : 16</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Placeholder label="deliver-multiformat-still.jpg" className="h-[18vh] aspect-square" />
              <p className="text-[9px] text-white/25 font-mono">1 : 1</p>
            </div>
          </motion.div>

          {/* Device mockups */}
          <div className="flex-1 min-h-0 flex items-end justify-center gap-4 md:gap-8 pb-2">
            {/* Phone — IG Reels */}
            <motion.div style={{ opacity: phoneOpacity, y: phoneY }} className="flex flex-col items-center gap-2 h-full max-h-[22vh]">
              <div className="flex-1 min-h-0 aspect-[9/16] overflow-hidden rounded-lg border border-white/10">
                <Placeholder label="chapter-05/deliver-platform-still-01.jpg" className="w-full h-full" />
              </div>
              <p className="text-[9px] text-white/30 font-mono shrink-0">IG Reels</p>
            </motion.div>
            {/* Laptop — YouTube */}
            <motion.div style={{ opacity: laptopOpacity, y: laptopY }} className="flex flex-col items-center gap-2 h-full max-h-[22vh]">
              <div className="flex-1 min-h-0 aspect-video overflow-hidden rounded border border-white/10">
                <Placeholder label="chapter-05/deliver-platform-still-02.jpg" className="w-full h-full" />
              </div>
              <div className="w-full h-2 bg-white/[0.04] rounded-sm shrink-0" />
              <p className="text-[9px] text-white/30 font-mono shrink-0">YouTube</p>
            </motion.div>
            {/* Event screen / TV */}
            <motion.div style={{ opacity: tvOpacity, y: tvY }} className="flex flex-col items-center gap-2 h-full max-h-[22vh]">
              <div className="flex-1 min-h-0 aspect-[16/9] overflow-hidden rounded border-2 border-white/10">
                <Placeholder label="chapter-05/deliver-platform-still-03.jpg" className="w-full h-full" />
              </div>
              <p className="text-[9px] text-white/30 font-mono shrink-0">Event Screen</p>
            </motion.div>
          </div>

          {/* Body copy */}
          <motion.p
            style={{ opacity: bodyOpacity, y: bodyY }}
            className="text-white/60 text-sm md:text-base leading-relaxed shrink-0 max-w-lg"
          >
            We deliver in the formats your channels use, and we stay close enough to keep the work growing after it ships.
          </motion.p>

        </div>
      </Chapter>
    </div>
  );
}
