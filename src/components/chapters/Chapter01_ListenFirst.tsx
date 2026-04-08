import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-3 ${className ?? ''}`}>
      <span className="text-[10px] font-mono text-white/30 leading-none break-all">{label}</span>
    </div>
  );
}

export default function Chapter01_ListenFirst() {
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
      trackEvent('chapter_reached', { chapter: 1 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 1 });
    }
  });

  const stepOpacity     = useTransform(scrollYProgress, [0.00, 0.15], [0, 1]);
  const stepY           = useTransform(scrollYProgress, [0.00, 0.15], [20, 0]);
  const still1Opacity   = useTransform(scrollYProgress, [0.15, 0.40], [0, 1]);
  const still1Scale     = useTransform(scrollYProgress, [0.15, 0.40], [1.04, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [0.20, 0.38], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.20, 0.38], [20, 0]);
  const still2Opacity   = useTransform(scrollYProgress, [0.40, 0.65], [0, 1]);
  const still2Scale     = useTransform(scrollYProgress, [0.40, 0.65], [1.04, 1]);
  const bodyOpacity     = useTransform(scrollYProgress, [0.65, 0.82], [0, 1]);
  const bodyY           = useTransform(scrollYProgress, [0.65, 0.82], [20, 0]);
  const ctaOpacity      = useTransform(scrollYProgress, [0.76, 0.90], [0, 1]);
  const ctaY            = useTransform(scrollYProgress, [0.76, 0.90], [20, 0]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="01-listen-first" pinned height="300vh">
          <div className="absolute inset-0 bg-black flex flex-col md:flex-row items-center gap-10 px-8 py-16 overflow-auto">
            <div className="flex flex-col gap-4 md:w-[40%]">
              <Placeholder label="chapter-01/listen-brief-still.jpg" className="aspect-[4/3] w-full" />
              <Placeholder label="chapter-01/listen-conversation-still.jpg" className="aspect-[4/3] w-full" />
            </div>
            <div className="md:w-[60%] space-y-5">
              <span className="font-display text-7xl font-bold text-white/15 leading-none block">01</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Listen First</p>
              <h2 className="font-display text-3xl font-bold text-white">Before the brief. Before the camera.</h2>
              <p className="text-white/60 text-base leading-relaxed">
                We listen until we understand what the brand wants to say, to whom, and to what end. Every answer that comes after this starts here.
              </p>
              <Link to="/briefing-room" className="inline-block text-sm text-white/50 hover:text-white transition-colors">
                Start a brief →
              </Link>
            </div>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="01-listen-first" pinned height="300vh">
        <div className="absolute inset-0 bg-black grid grid-cols-1 md:grid-cols-[40%_60%]">

          {/* Left — stills */}
          <div className="flex flex-col gap-4 justify-center px-8 md:px-10 py-14">
            <motion.div style={{ opacity: still1Opacity }} className="overflow-hidden">
              <motion.div style={{ scale: still1Scale }}>
                <Placeholder label="chapter-01/listen-brief-still.jpg" className="aspect-[4/3] w-full" />
              </motion.div>
            </motion.div>
            <motion.div style={{ opacity: still2Opacity }} className="overflow-hidden">
              <motion.div style={{ scale: still2Scale }}>
                <Placeholder label="chapter-01/listen-conversation-still.jpg" className="aspect-[4/3] w-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — text */}
          <div className="flex flex-col justify-center px-8 md:px-14 py-14 gap-6">
            <motion.div style={{ opacity: stepOpacity, y: stepY }}>
              <span className="font-display text-[7rem] md:text-[9rem] font-bold text-white/15 leading-none block">01</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase mt-1">Listen First</p>
            </motion.div>

            <motion.h2
              style={{ opacity: headlineOpacity, y: headlineY }}
              className="font-display text-2xl md:text-4xl font-bold text-white leading-tight"
            >
              Before the brief. Before the camera.
            </motion.h2>

            <motion.p
              style={{ opacity: bodyOpacity, y: bodyY }}
              className="text-white/60 text-base leading-relaxed max-w-sm"
            >
              We listen until we understand what the brand wants to say, to whom, and to what end. Every answer that comes after this starts here.
            </motion.p>

            <motion.div style={{ opacity: ctaOpacity, y: ctaY }}>
              <Link
                to="/briefing-room"
                className="text-sm text-white/50 hover:text-white transition-colors tracking-wide"
              >
                Start a brief →
              </Link>
            </motion.div>
          </div>

        </div>
      </Chapter>
    </div>
  );
}
