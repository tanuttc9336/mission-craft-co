import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import { useChapterCursor } from '@/contexts/CursorContext';
import { ScrollSequence } from '@/components/scroll/ScrollSequence';
import { StickyCaption } from '@/components/scroll/StickyCaption';
import { asset } from '@/lib/asset-urls';
import { trackEvent } from '@/lib/analytics';

// TODO: swap placeholder URLs for real R2 frames once chapter-06-audi/ assets are uploaded
const FRAMES = Array.from({ length: 80 }, (_, i) =>
  asset(`chapter-06-audi/audi-frame-${String(i + 1).padStart(3, '0')}.webp`)
);

const POSTER = asset('chapter-06-audi/audi-poster.webp');

function PlaceholderPoster({ className }: { className?: string }) {
  return (
    <div className={`bg-white/[0.06] border border-white/10 flex items-end p-4 ${className ?? ''}`}>
      <span className="text-[10px] font-mono text-white/30 leading-none">
        chapter-06-audi/audi-poster.webp
      </span>
    </div>
  );
}

export default function Chapter06_AudiCaseStudy() {
  const sectionRef = useRef<HTMLElement>(null);
  useChapterCursor(sectionRef, 'default');
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // ── Analytics ───────────────────────────────────────────────────────────
  const reachedRef = useRef(false);
  const completedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !reachedRef.current) {
      reachedRef.current = true;
      trackEvent('chapter_reached', { chapter: 6 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 6 });
    }
  });

  // ── Reduced-motion fallback ───────────────────────────────────────────────
  if (reduce) {
    return (
      <section
        ref={sectionRef}
        id="06-the-work-audi"
        data-chapter="06-the-work-audi"
        className="relative w-full bg-black"
      >
        {/* Static poster */}
        <div className="relative w-full aspect-video max-h-screen overflow-hidden">
          <PlaceholderPoster className="absolute inset-0 w-full h-full" />
        </div>
        {/* All captions stacked statically */}
        <div className="px-8 md:px-12 py-12 space-y-6 bg-black">
          <p className="text-[11px] text-white/50 tracking-[0.25em] uppercase">
            Case 01 · Audi Thailand
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold text-white">
            Audi Thailand
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            A launch film built for the brand's quietest, most confident moment.
          </p>
          <p className="text-white/70 text-base md:text-lg max-w-md leading-relaxed">
            Delivered across launch event, social, and brand library.
          </p>
        </div>
      </section>
    );
  }

  // ── Animated path ─────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="06-the-work-audi"
      data-chapter="06-the-work-audi"
      className="relative w-full"
    >
      {/* Case label — sticky at viewport top throughout chapter */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="sticky top-0 px-8 py-5 md:px-12 md:py-7">
          <p className="text-[11px] text-white/50 tracking-[0.25em] uppercase">
            Case 01 · Audi Thailand
          </p>
        </div>
      </div>

      {/* Parallax Diagonal Lines — cinematic depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[
          { x: '15%', rotate: 35, speed: 0.3, opacity: 0.04 },
          { x: '75%', rotate: -25, speed: 0.5, opacity: 0.03 },
          { x: '45%', rotate: 45, speed: 0.2, opacity: 0.025 },
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

      {/* Canvas image sequence — manages its own 500vh sticky container */}
      {/* With placeholder URLs: renders black canvas until real frames are uploaded */}
      <ScrollSequence
        frames={FRAMES}
        containerHeight="500vh"
        posterSrc={POSTER}
      />

      {/* Sticky captions — each tracks its own scroll progress */}
      {/* Caption 1: 0.15 → 0.25 */}
      <StickyCaption
        start={0.15}
        end={0.25}
        className="px-8 md:px-12"
      >
        <p className="font-display text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          Audi Thailand
        </p>
      </StickyCaption>

      {/* Caption 2: 0.45 → 0.55 */}
      <StickyCaption
        start={0.45}
        end={0.55}
        className="px-8 md:px-12"
      >
        <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed drop-shadow-lg">
          A launch film built for the brand's quietest, most confident moment.
        </p>
      </StickyCaption>

      {/* Caption 3: 0.75 → 0.85 */}
      <StickyCaption
        start={0.75}
        end={0.85}
        className="px-8 md:px-12"
      >
        <p className="text-white/85 text-base md:text-lg max-w-sm leading-relaxed drop-shadow-lg">
          Delivered across launch event, social, and brand library.
        </p>
      </StickyCaption>
    </section>
  );
}
