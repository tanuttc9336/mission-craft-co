import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-3 ${className ?? ''}`}>
      <span className="text-[10px] font-mono text-white/30 leading-none break-all">{label}</span>
    </div>
  );
}

interface MoodboardProps {
  imgLabel: string;
  paletteLabel: string;
  palette: string[];
  caption: string;
  opacity: ReturnType<typeof useTransform>;
  x: ReturnType<typeof useTransform>;
}

function Moodboard({ imgLabel, paletteLabel, palette, caption, opacity, x }: MoodboardProps) {
  return (
    <motion.div style={{ opacity, x }} className="w-full">
      <Placeholder label={imgLabel} className="aspect-video w-full" />
      <div className="mt-2 flex gap-1 h-2">
        {palette.map((c, i) => (
          <div key={i} className="flex-1 h-full" style={{ background: c }} />
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-[10px] font-mono text-white/30">{caption}</p>
        <p className="text-[9px] font-mono text-white/20">{paletteLabel}</p>
      </div>
    </motion.div>
  );
}

export default function Chapter02_PointTheDirection() {
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
      trackEvent('chapter_reached', { chapter: 2 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 2 });
    }
  });

  const stepOpacity     = useTransform(scrollYProgress, [0.00, 0.15], [0, 1]);
  const stepY           = useTransform(scrollYProgress, [0.00, 0.15], [20, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.20], [0, 1]);
  const headlineY       = useTransform(scrollYProgress, [0.05, 0.20], [20, 0]);

  const mb1Opacity = useTransform(scrollYProgress, [0.20, 0.45], [0, 1]);
  const mb1X       = useTransform(scrollYProgress, [0.20, 0.45], [100, 0]);
  const mb2Opacity = useTransform(scrollYProgress, [0.45, 0.70], [0, 1]);
  const mb2X       = useTransform(scrollYProgress, [0.45, 0.70], [100, 0]);
  const mb3Opacity = useTransform(scrollYProgress, [0.70, 0.90], [0, 1]);
  const mb3X       = useTransform(scrollYProgress, [0.70, 0.90], [100, 0]);

  const bodyOpacity = useTransform(scrollYProgress, [0.90, 1.00], [0, 1]);
  const bodyY       = useTransform(scrollYProgress, [0.90, 1.00], [20, 0]);

  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="02-point-the-direction" pinned height="400vh">
          <div className="absolute inset-0 bg-black flex flex-col md:flex-row items-start gap-10 px-8 py-16 overflow-auto">
            <div className="md:w-[38%] space-y-5 pt-4">
              <span className="font-display text-7xl font-bold text-white/15 leading-none block">02</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase">Point the Direction</p>
              <h2 className="font-display text-3xl font-bold text-white">Creative direction before anyone rolls camera.</h2>
              <p className="text-white/60 text-base leading-relaxed">
                Visual language, palette, references, thumbnails. The work isn't built on guesswork — it's built on a direction the brand already agreed to.
              </p>
            </div>
            <div className="md:w-[62%] flex flex-col gap-6">
              {[
                { img: 'direction-moodboard-01.jpg', pal: 'direction-palette-01.png', caption: 'Audi Q8 Launch',     palette: ['#0d0d0d','#5c5c5c','#8c0000','#d4d4d4','#f0f0f0'] },
                { img: 'direction-moodboard-02.jpg', pal: 'direction-palette-02.png', caption: 'Greenline Academy',  palette: ['#0a1a0a','#1a4a1a','#2e7d32','#81c784','#f0f4f0'] },
                { img: 'direction-moodboard-03.jpg', pal: 'direction-palette-03.png', caption: 'Redline Retainer',   palette: ['#0a0a0a','#880000','#cc0000','#cccccc','#ffffff'] },
              ].map((m, i) => (
                <div key={i}>
                  <Placeholder label={`chapter-02/${m.img}`} className="aspect-video w-full" />
                  <div className="mt-2 flex gap-1 h-2">
                    {m.palette.map((c, j) => <div key={j} className="flex-1" style={{ background: c }} />)}
                  </div>
                  <p className="text-[10px] font-mono text-white/30 mt-1">{m.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </Chapter>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <Chapter id="02-point-the-direction" pinned height="400vh">
        <div className="absolute inset-0 bg-black grid grid-cols-1 md:grid-cols-[38%_62%]">

          {/* Left — text */}
          <div className="flex flex-col justify-center px-8 md:px-12 py-14 gap-6">
            <motion.div style={{ opacity: stepOpacity, y: stepY }}>
              <span className="font-display text-[7rem] md:text-[9rem] font-bold text-white/15 leading-none block">02</span>
              <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase mt-1">Point the Direction</p>
            </motion.div>

            <motion.h2
              style={{ opacity: headlineOpacity, y: headlineY }}
              className="font-display text-2xl md:text-4xl font-bold text-white leading-tight"
            >
              Creative direction before anyone rolls camera.
            </motion.h2>

            <motion.p
              style={{ opacity: bodyOpacity, y: bodyY }}
              className="text-white/60 text-base leading-relaxed max-w-xs"
            >
              Visual language, palette, references, thumbnails. The work isn't built on guesswork — it's built on a direction the brand already agreed to.
            </motion.p>
          </div>

          {/* Right — cascading moodboards */}
          <div className="relative overflow-hidden py-8 px-6 md:px-8">
            <div className="absolute inset-y-0 left-6 right-6 md:left-8 md:right-8 flex flex-col justify-center gap-4">
              <Moodboard
                imgLabel="chapter-02/direction-moodboard-01.jpg"
                paletteLabel="direction-palette-01.png"
                palette={['#0d0d0d','#5c5c5c','#8c0000','#d4d4d4','#f0f0f0']}
                caption="Audi Q8 Launch"
                opacity={mb1Opacity}
                x={mb1X}
              />
              <Moodboard
                imgLabel="chapter-02/direction-moodboard-02.jpg"
                paletteLabel="direction-palette-02.png"
                palette={['#0a1a0a','#1a4a1a','#2e7d32','#81c784','#f0f4f0']}
                caption="Greenline Academy"
                opacity={mb2Opacity}
                x={mb2X}
              />
              <Moodboard
                imgLabel="chapter-02/direction-moodboard-03.jpg"
                paletteLabel="direction-palette-03.png"
                palette={['#0a0a0a','#880000','#cc0000','#cccccc','#ffffff']}
                caption="Redline Retainer"
                opacity={mb3Opacity}
                x={mb3X}
              />
            </div>
          </div>

        </div>
      </Chapter>
    </div>
  );
}
