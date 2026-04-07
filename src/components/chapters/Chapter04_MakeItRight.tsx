import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Chapter } from '@/components/scroll/Chapter';

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-2 ${className ?? ''}`}>
      <span className="text-[9px] font-mono text-white/25 leading-none break-all">{label}</span>
    </div>
  );
}

function BeforeAfterWipe({
  beforeLabel,
  afterLabel,
  clipPath,
  opacity,
  className,
}: {
  beforeLabel: string;
  afterLabel: string;
  clipPath: MotionValue<string>;
  opacity: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div style={{ opacity }} className={`relative overflow-hidden ${className ?? ''}`}>
      {/* Before — base layer */}
      <div className="absolute inset-0">
        <Placeholder label={beforeLabel} className="w-full h-full" />
      </div>
      {/* After — scroll-linked wipe reveal */}
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <Placeholder label={afterLabel} className="w-full h-full" />
      </motion.div>
      {/* Wipe edge indicator */}
      <motion.div
        className="absolute inset-y-0 w-px bg-white/30 pointer-events-none"
        style={{ left: useTransform(clipPath, (v: string) => {
          const match = v.match(/inset\(0 ([\d.]+)%/);
          return match ? `${100 - parseFloat(match[1])}%` : '0%';
        }) }}
      />
    </motion.div>
  );
}

export default function Chapter04_MakeItRight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const stepOpacity     = useTransform(scrollYProgress, [0.00, 0.12], [0, 1]);
  const stepY           = useTransform(scrollYProgress, [0.00, 0.12], [20, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.04, 0.15], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.04, 0.15], [20, 0]);

  // Grade pair 01
  const pair1Opacity = useTransform(scrollYProgress, [0.10, 0.20], [0, 1]);
  const wipe1Raw     = useTransform(scrollYProgress, [0.15, 0.40], [0, 100]);
  const clip1        = useTransform(wipe1Raw, (v: number): string => `inset(0 ${(100 - v).toFixed(2)}% 0 0)`);

  // Timeline still
  const timelineOpacity = useTransform(scrollYProgress, [0.40, 0.55], [0, 1]);
  const timelineY       = useTransform(scrollYProgress, [0.40, 0.55], [20, 0]);

  // Grade pair 02
  const pair2Opacity = useTransform(scrollYProgress, [0.50, 0.60], [0, 1]);
  const wipe2Raw     = useTransform(scrollYProgress, [0.55, 0.85], [0, 100]);
  const clip2        = useTransform(wipe2Raw, (v: number): string => `inset(0 ${(100 - v).toFixed(2)}% 0 0)`);

  // Body copy
  const bodyOpacity = useTransform(scrollYProgress, [0.85, 0.97], [0, 1]);
  const bodyY       = useTransform(scrollYProgress, [0.85, 0.97], [16, 0]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="04-make-it-right" pinned height="400vh">
          <div className="absolute inset-0 bg-black flex flex-col gap-6 px-8 py-14 overflow-auto">
            <div className="space-y-2">
              <span className="font-display text-6xl font-bold text-white/15 leading-none block">04</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It Right</p>
              <h2 className="font-display text-3xl font-bold text-white">Refine until it lands.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <div className="flex flex-col gap-2">
                <Placeholder label="chapter-04/grade-before-01.jpg" className="aspect-video w-full" />
                <Placeholder label="chapter-04/grade-after-01.jpg" className="aspect-video w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Placeholder label="chapter-04/grade-timeline-still.jpg" className="aspect-video w-full" />
                <Placeholder label="chapter-04/grade-before-02.jpg" className="aspect-video w-full" />
                <Placeholder label="chapter-04/grade-after-02.jpg" className="aspect-video w-full" />
              </div>
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              We don't finish at &#8220;good enough.&#8221; We finish at right &#8212; when the image and the message are both sharp.
            </p>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="04-make-it-right" pinned height="400vh">
        <div className="absolute inset-0 bg-black flex flex-col px-8 md:px-12 py-10 gap-4">

          {/* Header */}
          <div className="flex items-baseline gap-5 shrink-0">
            <motion.div style={{ opacity: stepOpacity, y: stepY }} className="flex items-baseline gap-4">
              <span className="font-display text-5xl md:text-7xl font-bold text-white/15 leading-none">04</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Make It Right</p>
            </motion.div>
            <motion.h2
              style={{ opacity: headlineOpacity, y: headlineY }}
              className="font-display text-xl md:text-3xl font-bold text-white leading-tight"
            >
              Refine until it lands.
            </motion.h2>
          </div>

          {/* Content grid */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[55%_45%] gap-4">

            {/* Left — two grade pair wipes stacked */}
            <div className="flex flex-col gap-3 min-h-0">
              <BeforeAfterWipe
                beforeLabel="chapter-04/grade-before-01.jpg"
                afterLabel="chapter-04/grade-after-01.jpg"
                clipPath={clip1}
                opacity={pair1Opacity}
                className="flex-1 min-h-0"
              />
              <BeforeAfterWipe
                beforeLabel="chapter-04/grade-before-02.jpg"
                afterLabel="chapter-04/grade-after-02.jpg"
                clipPath={clip2}
                opacity={pair2Opacity}
                className="flex-1 min-h-0"
              />
            </div>

            {/* Right — timeline still + body */}
            <div className="flex flex-col gap-4 min-h-0">
              <motion.div
                style={{ opacity: timelineOpacity, y: timelineY }}
                className="flex-1 min-h-0 overflow-hidden"
              >
                <Placeholder label="chapter-04/grade-timeline-still.jpg" className="w-full h-full" />
              </motion.div>
              <motion.p
                style={{ opacity: bodyOpacity, y: bodyY }}
                className="text-white/60 text-sm md:text-base leading-relaxed shrink-0"
              >
                We don't finish at &#8220;good enough.&#8221; We finish at right &#8212; when the image and the message are both sharp.
              </motion.p>
            </div>

          </div>
        </div>
      </Chapter>
    </div>
  );
}
