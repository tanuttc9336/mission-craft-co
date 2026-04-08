import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Chapter } from '@/components/scroll/Chapter';
import { trackEvent } from '@/lib/analytics';
import { useDomOpacityKeyframes } from '@/lib/use-dom-opacity';

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
      trackEvent('chapter_reached', { chapter: 8 });
    }
    if (v > 0.95 && !completedRef.current) {
      completedRef.current = true;
      trackEvent('chapter_completed', { chapter: 8 });
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
          <div className="bg-black text-white px-8 md:px-16 py-24 space-y-24 max-w-4xl mx-auto">
            {/* Philosophy quote */}
            <blockquote className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {QUOTE}
            </blockquote>

            {/* 4 Principles */}
            {PRINCIPLES.map((p) => (
              <div key={p.num} className="space-y-3">
                <span className="font-display text-6xl font-bold text-white/15 leading-none block">
                  {p.num}
                </span>
                <h3 className="font-display text-2xl md:text-4xl font-bold text-white">
                  {p.title}
                </h3>
                <p className="text-white/60 text-base md:text-lg leading-relaxed">{p.body}</p>
              </div>
            ))}

            {/* MEOW footer */}
            <p className="text-white/50 text-sm md:text-base tracking-wide">{MEOW}</p>
          </div>
        </Chapter>
      </div>
    );
  }

  // ── Animated path ───────────────────────────────────────────────────────
  return (
    <div ref={containerRef}>
      <Chapter id="08-the-standard" pinned height="600vh">
        {/* Black background */}
        <div className="absolute inset-0 bg-black" />

        {/* ── Philosophy quote — 0.00 → 0.16 ── */}
        <motion.div
          ref={quoteRef}
          style={{ opacity: 0, y: quoteY }}
          className="absolute inset-0 flex items-center justify-center px-8 md:px-16 pointer-events-none"
        >
          <blockquote className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-tight tracking-tight text-white text-center max-w-5xl">
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
              <span className="font-display text-[5rem] md:text-[8rem] font-bold text-white/10 leading-none block">
                {p.num}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                {p.title}
              </h2>
              <p className="text-white/55 text-base md:text-xl leading-relaxed">{p.body}</p>
            </div>
          </motion.div>
        ))}

        {/* ── MEOW footer — 0.80 → 1.00 ── */}
        <motion.div
          ref={meowRef}
          style={{ opacity: 0, y: meowY }}
          className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 px-8 pointer-events-none"
        >
          <p className="text-white/45 text-xs md:text-sm tracking-[0.2em] uppercase text-center max-w-2xl">
            {MEOW}
          </p>
        </motion.div>

      </Chapter>
    </div>
  );
}
