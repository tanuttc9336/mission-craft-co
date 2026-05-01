import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useChapterCursor } from '@/contexts/CursorContext';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';
import { useDomOpacityKeyframes } from '@/lib/use-dom-opacity';
import GrainOverlay from '@/components/chrome/GrainOverlay';
import ChapterLabel from '@/components/chrome/ChapterLabel';
import FilmStripMarker from '@/components/chrome/FilmStripMarker';

// ── AD tokens (pilot — film-noir, matches Canva deck) ─────────────────────
const AD_BG  = '#000000';  // pure black
const AD_INK = '#FAFAF5';  // warm cream (slightly off-white)

// ── Locked copy — do not paraphrase ─────────────────────────────────────────
const QUOTE = '\u201cGood work isn\u2019t just beautiful \u2014 it makes the brand understood the right way.\u201d';

const PRINCIPLES = [
  {
    num: '01',
    title: 'Visuals must have a reason.',
    body: 'Every element has a function \u2014 never decoration for its own sake.',
  },
  {
    num: '02',
    title: 'Style must support meaning.',
    body: 'Style isn\u2019t the goal. It\u2019s the tool that carries the message.',
  },
  {
    num: '03',
    title: 'Content must serve the business.',
    body: 'Beautiful work without direction is money wasted.',
  },
  {
    num: '04',
    title: 'Premium doesn\u2019t mean complicated.',
    body: 'Clarity is its own kind of luxury.',
  },
] as const;

const MEOW =
  'Every piece is held to the MEOW standard \u2014 Masterful, Engaging, Original, Wow.';

// ── Scroll-linked beat: fade-in, hold, fade-out ──────────────────────────────
function beatY(
  progress: MotionValue<number>,
  start: number,
  end: number,
  last = false
) {
  const fadeIn  = start + (end - start) * 0.25;
  const fadeOut = last ? end : end - (end - start) * 0.25;
  return useTransform(progress, [start, fadeIn, fadeOut, end], [24, 0, 0, last ? 0 : -16]);
}

function beatKeyframes(start: number, end: number, last = false): [number[], number[]] {
  const fadeIn  = start + (end - start) * 0.25;
  const fadeOut = last ? end : end - (end - start) * 0.25;
  return [
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, last ? 1 : 0],
  ];
}

export default function Chapter08_TheStandard() {
  const containerRef = useRef<HTMLDivElement>(null);
  useChapterCursor(containerRef, 'default');
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Analytics + Stamp triggers ─────────────────────────────────────────
  const reachedRef = useRef(false);
  const completedRef = useRef(false);

  // Stamp: each principle numeral gets a one-off press animation when its
  // beat window opens. Refs point at the big numeral <span> for each principle.
  const stampRefs = [
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
    useRef<HTMLSpanElement>(null),
  ];
  const stampFiredRef = useRef<[boolean, boolean, boolean, boolean]>([false, false, false, false]);
  // Fire slightly after the beat's in-edge so the numeral has faded in enough
  // to be visible when the stamp lands.
  const STAMP_THRESHOLDS = [0.195, 0.355, 0.515, 0.675];

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v > 0.05 && !reachedRef.current) {
      reachedRef.current = true;
      trackEvent('chapter_reached', { chapter: 8 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 8 });
    }
    for (let i = 0; i < 4; i++) {
      if (!stampFiredRef.current[i] && v > STAMP_THRESHOLDS[i]) {
        const node = stampRefs[i].current;
        if (node) {
          stampFiredRef.current[i] = true;
          // restart animation if class somehow already present
          node.classList.remove('stamp-fire');
          // force reflow to allow re-trigger
          void node.offsetWidth;
          node.classList.add('stamp-fire');
        }
      }
    }
  });

  // Each beat spans 0.16 of progress; MEOW spans 0.20
  const quoteY = beatY(scrollYProgress, 0.00, 0.16);
  const p1Y    = beatY(scrollYProgress, 0.16, 0.32);
  const p2Y    = beatY(scrollYProgress, 0.32, 0.48);
  const p3Y    = beatY(scrollYProgress, 0.48, 0.64);
  const p4Y    = beatY(scrollYProgress, 0.64, 0.80);
  const meowY  = beatY(scrollYProgress, 0.80, 1.00, true);

  const beatYs = [p1Y, p2Y, p3Y, p4Y];

  const quoteRef = useRef<HTMLDivElement>(null);
  const p1Ref    = useRef<HTMLDivElement>(null);
  const p2Ref    = useRef<HTMLDivElement>(null);
  const p3Ref    = useRef<HTMLDivElement>(null);
  const p4Ref    = useRef<HTMLDivElement>(null);
  const meowRef  = useRef<HTMLDivElement>(null);
  const beatRefs = [p1Ref, p2Ref, p3Ref, p4Ref];

  const [quoteIn, quoteOut] = beatKeyframes(0.00, 0.16);
  const [p1In, p1Out]       = beatKeyframes(0.16, 0.32);
  const [p2In, p2Out]       = beatKeyframes(0.32, 0.48);
  const [p3In, p3Out]       = beatKeyframes(0.48, 0.64);
  const [p4In, p4Out]       = beatKeyframes(0.64, 0.80);
  const [meowInArr, meowOutArr] = beatKeyframes(0.80, 1.00, true);

  useDomOpacityKeyframes(quoteRef, scrollYProgress, quoteIn, quoteOut);
  useDomOpacityKeyframes(p1Ref,    scrollYProgress, p1In,    p1Out);
  useDomOpacityKeyframes(p2Ref,    scrollYProgress, p2In,    p2Out);
  useDomOpacityKeyframes(p3Ref,    scrollYProgress, p3In,    p3Out);
  useDomOpacityKeyframes(p4Ref,    scrollYProgress, p4In,    p4Out);
  useDomOpacityKeyframes(meowRef,  scrollYProgress, meowInArr, meowOutArr);

  // ── Reduced-motion fallback ─────────────────────────────────────────────
  if (reduce) {
    return (
      <div ref={containerRef}>
        <Chapter id="08-the-standard" pinned={false} height="600vh">
          <div
            className="relative px-8 md:px-16 py-24 space-y-24 max-w-4xl mx-auto"
            style={{ backgroundColor: AD_BG, color: AD_INK }}
          >
            <ChapterLabel number={8} title="THE STANDARD" tone="paper" />
            <FilmStripMarker tone="paper" />

            {/* Philosophy quote */}
            <blockquote className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {QUOTE}
            </blockquote>

            {/* 4 Principles */}
            {PRINCIPLES.map((p) => (
              <div key={p.num} className="space-y-3">
                <span className="font-display text-6xl font-bold leading-none block" style={{ color: `${AD_INK}26` }}>
                  {p.num}
                </span>
                <h3 className="font-display text-2xl md:text-4xl font-bold">
                  {p.title}
                </h3>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: `${AD_INK}99` }}>{p.body}</p>
              </div>
            ))}

            {/* MEOW footer */}
            <p className="text-sm md:text-base tracking-wide" style={{ color: `${AD_INK}80` }}>{MEOW}</p>

            <GrainOverlay intensity={0.10} scale={0.9} blend="screen" />
          </div>
        </Chapter>
      </div>
    );
  }

  // ── Animated path ───────────────────────────────────────────────────────
  return (
    <div ref={containerRef}>
      <Chapter id="08-the-standard" pinned height="600vh">
        {/* Pure black paper — film-noir base */}
        <div className="absolute inset-0" style={{ backgroundColor: AD_BG }} />

        {/* Editorial chrome (light on dark) */}
        <ChapterLabel number={8} title="THE STANDARD" tone="paper" />
        <FilmStripMarker tone="paper" />

        {/* ── Philosophy quote — 0.00 → 0.16 ── */}
        <motion.div
          ref={quoteRef}
          style={{ opacity: 0, y: quoteY }}
          className="absolute inset-0 flex items-center justify-center px-8 md:px-16 pointer-events-none"
        >
          <blockquote
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-tight tracking-tight text-center max-w-5xl"
            style={{ color: AD_INK }}
          >
            {QUOTE}
          </blockquote>
        </motion.div>

        {/* ── Principles 01–04 — 0.16 → 0.80 ── */}
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.num}
            ref={beatRefs[i]}
            style={{ opacity: 0, y: beatYs[i] }}
            className="absolute inset-0 flex items-center justify-center px-8 md:px-16 pointer-events-none"
          >
            <div className="text-center max-w-3xl space-y-4">
              <span
                ref={stampRefs[i]}
                className="font-display text-[5rem] md:text-[8rem] font-bold leading-none block"
                style={{ color: `${AD_INK}1A` }}
              >
                {p.num}
              </span>
              <h2
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
                style={{ color: AD_INK }}
              >
                {p.title}
              </h2>
              <p
                className="text-base md:text-xl leading-relaxed"
                style={{ color: `${AD_INK}99` }}
              >
                {p.body}
              </p>
            </div>
          </motion.div>
        ))}

        {/* ── MEOW footer — 0.80 → 1.00 ── */}
        <motion.div
          ref={meowRef}
          style={{ opacity: 0, y: meowY }}
          className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 px-8 pointer-events-none"
        >
          <p
            className="text-xs md:text-sm tracking-[0.2em] uppercase text-center max-w-2xl"
            style={{ color: `${AD_INK}73` }}
          >
            {MEOW}
          </p>
        </motion.div>

        {/* MEOW Stamp Seal — rotating quality mark */}
        {(() => {
          const sealOpacity = useTransform(scrollYProgress, [0.6, 0.75, 0.95, 1.0], [0, 0.5, 0.5, 0]);
          return (
            <motion.div
              className="absolute bottom-10 right-10 md:bottom-16 md:right-16 pointer-events-none z-10"
              style={{ opacity: sealOpacity }}
            >
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                className="animate-[spin_25s_linear_infinite]"
              >
                <defs>
                  <path
                    id="meow-circle"
                    d="M 70,70 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0"
                    fill="none"
                  />
                </defs>
                <circle cx="70" cy="70" r="58" fill="none" stroke={AD_INK} strokeWidth="0.5" strokeOpacity="0.3" />
                <text fill={AD_INK} fontSize="11" fontFamily="monospace" letterSpacing="5" fillOpacity="0.7">
                  <textPath href="#meow-circle">
                    M · E · O · W · M · E · O · W ·
                  </textPath>
                </text>
              </svg>
            </motion.div>
          );
        })()}

        {/* Film-grain texture (screen blend lifts dark plate) */}
        <GrainOverlay intensity={0.10} scale={0.9} blend="screen" />
      </Chapter>
    </div>
  );
}
