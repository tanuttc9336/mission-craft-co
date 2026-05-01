import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';
import { useChapterCursor } from '@/contexts/CursorContext';
import { ScrollSequence } from '@/components/scroll/ScrollSequence';
import { StickyCaption } from '@/components/scroll/StickyCaption';
import { asset } from '@/lib/asset-urls';
import { trackEvent } from '@/lib/analytics';

// TODO: swap placeholder URLs for real R2 frames once chapter-07-greenline/ assets are uploaded
const FRAMES = Array.from({ length: 80 }, (_, i) =>
  asset(`chapter-07-greenline/greenline-frame-${String(i + 1).padStart(3, '0')}.webp`)
);

const POSTER = asset('chapter-07-greenline/greenline-poster.webp');

const LAB_STILLS = [
  'chapter-07-greenline/greenline-lab-still-01.jpg',
  'chapter-07-greenline/greenline-lab-still-02.jpg',
  'chapter-07-greenline/greenline-lab-still-03.jpg',
];

function Placeholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-3 ${className ?? ''}`}>
      <span className="text-[10px] font-mono text-white/30 leading-none break-all">{label}</span>
    </div>
  );
}

// Lab still overlay: fades in, holds briefly, fades out
function LabStillOverlay({
  label,
  progress,
  inAt,
  outAt,
}: {
  label: string;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  inAt: [number, number];
  outAt: [number, number];
}) {
  const opacity = useTransform(
    progress,
    [inAt[0], inAt[1], outAt[0], outAt[1]],
    [0, 1, 1, 0]
  );
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 pointer-events-none"
    >
      {/* Sticky container so the still is viewport-aligned while it's visible */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Placeholder label={label} className="w-full h-full" />
      </div>
    </motion.div>
  );
}

export default function Chapter07_GreenlineCaseStudy() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChapterCursor(containerRef, 'default');
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
      trackEvent('chapter_reached', { chapter: 7 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 7 });
    }
  });

  // ── Reduced-motion fallback ───────────────────────────────────────────────
  if (reduce) {
    return (
      <div
        id="07-the-work-greenline"
        data-chapter="07-the-work-greenline"
        className="relative w-full bg-black"
      >
        {/* Static poster */}
        <div className="relative w-full aspect-video max-h-screen overflow-hidden">
          <Placeholder label="chapter-07-greenline/greenline-poster.webp" className="absolute inset-0 w-full h-full" />
        </div>
        {/* All captions + lab stills stacked statically */}
        <div className="px-8 md:px-12 py-12 space-y-6 bg-black">
          <p className="text-[11px] text-white/50 tracking-[0.25em] uppercase">
            Case 02 · Greenline Golf Academy
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold text-white">
            Greenline Golf Academy
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            A golf lab that teaches through footage the coach can point at.
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            A content system built around the lab's real advantage — data.
          </p>
          <div className="flex gap-3 flex-wrap pt-4">
            {LAB_STILLS.map((l) => (
              <Placeholder key={l} label={l} className="aspect-video w-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Animated path ─────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      id="07-the-work-greenline"
      data-chapter="07-the-work-greenline"
      className="relative w-full"
    >
      {/* Canvas image sequence — base layer */}
      <ScrollSequence
        frames={FRAMES}
        containerHeight="500vh"
        posterSrc={POSTER}
      />

      {/* Parallax Diagonal Lines — cinematic depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[
          { x: '25%', rotate: -30, speed: 0.4, opacity: 0.035 },
          { x: '65%', rotate: 40, speed: 0.25, opacity: 0.03 },
        ].map((line, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-white"
            style={{
              left: line.x,
              top: '-20%',
              height: '140%',
              rotate: line.rotate,
              opacity: line.opacity,
              y: useTransform(scrollYProgress, [0, 1], [0, -200 * line.speed]),
            }}
          />
        ))}
      </div>

      {/* Lab still overlays — cut in between caption beats */}
      {/* Lab 1: between caption 1 end (0.25) and caption 2 start (0.45) */}
      <LabStillOverlay
        label={LAB_STILLS[0]}
        progress={scrollYProgress}
        inAt={[0.28, 0.34]}
        outAt={[0.40, 0.45]}
      />
      {/* Lab 2: between caption 2 end (0.55) and caption 3 start (0.75) */}
      <LabStillOverlay
        label={LAB_STILLS[1]}
        progress={scrollYProgress}
        inAt={[0.58, 0.63]}
        outAt={[0.69, 0.74]}
      />
      {/* Lab 3: after caption 3 end (0.85) */}
      <LabStillOverlay
        label={LAB_STILLS[2]}
        progress={scrollYProgress}
        inAt={[0.88, 0.92]}
        outAt={[0.96, 1.00]}
      />

      {/* Sticky captions — on top of lab stills by DOM order */}
      {/* Caption 1: 0.15 → 0.25 */}
      <StickyCaption
        start={0.15}
        end={0.25}
        className="px-8 md:px-12"
      >
        <p className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          Greenline Golf Academy
        </p>
      </StickyCaption>

      {/* Caption 2: 0.45 → 0.55 */}
      <StickyCaption
        start={0.45}
        end={0.55}
        className="px-8 md:px-12"
      >
        <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed drop-shadow-lg">
          A golf lab that teaches through footage the coach can point at.
        </p>
      </StickyCaption>

      {/* Caption 3: 0.75 → 0.85 */}
      <StickyCaption
        start={0.75}
        end={0.85}
        className="px-8 md:px-12"
      >
        <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed drop-shadow-lg">
          A content system built around the lab's real advantage — data.
        </p>
      </StickyCaption>

      {/* Case label — last in DOM = topmost stacking order */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 px-8 py-5 md:px-12 md:py-7">
          <p className="text-[11px] text-white/50 tracking-[0.25em] uppercase">
            Case 02 · Greenline Golf Academy
          </p>
        </div>
      </div>
    </div>
  );
}
