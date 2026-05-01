import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { cases } from '@/data/cases';
import { LivingGrain } from '@/components/effects';
import {
  EASE,
  BlurCursor,
  ScrollProgress,
  MetaLabel,
  DisplayHeadline,
  EditorialSection,
  LineReveal,
  Chapter,
  PageTopBar,
  PageFooter,
} from '@/components/editorial';

/* ──────────────────────────────────────────────
   CREDENTIALS — Sales page experience
   Hybrid: brand story → case studies → pricing → CTA
   DNA: dark mode, editorial scroll, Undercat voice
   ────────────────────────────────────────────── */

const FEATURED_CASE_IDS = ['greenline-golf-lab', 'audi-launch-films', 'audi-benzilla', 'lim-lao-ngow', 'sonle-residences', 'rajadamnern-world-series'];

const hiRes = (url?: string) =>
  url?.includes('i.ytimg.com') && url.includes('hqdefault')
    ? url.replace('hqdefault', 'maxresdefault')
    : url;

/* ── Stagger reveal ── */
function StaggerReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Parallax wrapper — scroll-linked vertical drift ── */
function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ── Float — subtle floating animation ── */
function Float({
  children,
  duration = 6,
  distance = 8,
  className = '',
}: {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ y: [-distance, distance, -distance] }}
      transition={{ repeat: Infinity, duration, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Section Divider ── */
function Divider() {
  return <div className="w-full h-px bg-white/10 my-0" />;
}

/* ── Hero — YouTube video background ── */
const HERO_VIDEO_ID = 'cSWjRHb03G4';

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  return (
    <section ref={ref} className="relative h-[130vh] overflow-hidden">
      {/* Video layer — scroll parallax */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 -top-[12vh] -bottom-[12vh]"
      >
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(177.77vh+40px)] h-[calc(56.25vw+40px)] min-w-[calc(100%+40px)] min-h-[calc(100%+40px)] pointer-events-none"
          src={`https://www.youtube.com/embed/${HERO_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${HERO_VIDEO_ID}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
          allow="autoplay; encrypted-media"
          title="Undercat showreel"
        />
        {/* Scrim layers */}
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink" />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, hsl(0 0% 4% / 0.55) 100%)',
          }}
        />
      </motion.div>

      {/* Grain overlay */}
      <div className="absolute inset-0 mix-blend-overlay opacity-50 pointer-events-none">
        <LivingGrain />
      </div>

      {/* Text overlay — centered */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-6 md:px-20 z-10">
        <motion.div style={{ opacity: textOpacity, y: textY }} className="max-w-[1200px] mx-auto text-center">
          {/* Meta label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[11px] tracking-[0.22em] uppercase text-bone/55 mb-8 md:mb-12"
          >
            Undercat Creatives — Credentials 2026
          </motion.p>

          {/* Hero headline */}
          <DisplayHeadline
            lines={[
              'Content with',
              'direction.',
              <span key="taste" className="italic">
                Production with taste.
              </span>,
            ]}
            size="hero"
            startDelay={0.3}
            stagger={0.15}
            className="mb-8 md:mb-12"
          />

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-body text-bone/60 text-lg md:text-xl max-w-[640px] mx-auto leading-relaxed"
          >
            A Bangkok studio that builds image and meaning for brands that take both seriously.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-16 md:mt-24"
          >
            <Float duration={2.5} distance={6}>
              <div className="w-px h-12 bg-bone/20 mx-auto" />
            </Float>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Who We Are ── */
/*
 * Scroll-linked animation (The Pass style):
 * Each word/element reveals as the user scrolls — not timer-based.
 * useScroll + useTransform = user controls the pacing.
 * Underline draws, strikethrough, accent line all scroll-driven.
 */
type FragStyle = 'display' | 'italic' | 'tracked' | 'body';
type FragEffect = 'none' | 'underline' | 'strikethrough';
type FragEmphasis = 'none' | 'direction' | 'focus' | 'glow';

const WHO_FRAGMENTS: { text: string; style: FragStyle; effect?: FragEffect; emphasis?: FragEmphasis }[] = [
  { text: 'We see',                   style: 'display' },
  { text: 'production',               style: 'italic',  effect: 'underline' },
  { text: 'as',                       style: 'display' },
  { text: 'DIRECTION,',               style: 'tracked', effect: 'underline', emphasis: 'direction' },
  { text: 'craft,',                   style: 'italic',  effect: 'underline', emphasis: 'focus' },
  { text: 'and',                      style: 'display' },
  { text: 'meaning',                  style: 'italic',  effect: 'underline', emphasis: 'glow' },
  { text: '\u2014 not',               style: 'display' },
  { text: '\u201Ctake the brief,',    style: 'body',    effect: 'strikethrough' },
  { text: 'deliver the file.\u201D',  style: 'body',    effect: 'strikethrough' },
];

/*
 * DIRECTION font/color cycling — communicates art direction & creative direction.
 * As the user scrolls, the word morphs through different typeface personalities
 * and color accents. Each state = a different creative "direction".
 * The scroll range is stretched wider than other words for a slow, lingering feel.
 */
const DIRECTION_FACES = [
  { font: '"Bebas Neue", sans-serif',            color: '#E8DCC8', tracking: '0.18em', weight: 400, italic: false },  // Stark, bold — default
  { font: '"Playfair Display", serif',           color: '#F2C57C', tracking: '0.04em', weight: 700, italic: false },  // Warm gold — editorial
  { font: '"Cormorant Garamond", serif',         color: '#C4B5A0', tracking: '0.08em', weight: 300, italic: true },   // Elegant whisper
  { font: '"Syne", sans-serif',                  color: '#A8C4D6', tracking: '0.12em', weight: 800, italic: false },  // Cool tech blue
  { font: '"DM Serif Display", serif',           color: '#D4A0A0', tracking: '0.02em', weight: 400, italic: true },   // Warm rose — classic
  { font: '"Space Grotesk", monospace',          color: '#E8DCC8', tracking: '0.18em', weight: 500, italic: false },  // Settle back — geometric
];

const fragmentClass: Record<FragStyle, string> = {
  display: 'font-display uppercase',
  italic:  'font-display italic',
  tracked: 'font-body tracking-[0.18em] uppercase',
  body:    'font-body text-bone/40',
};

/*
 * ── ScrollDirection — special component for DIRECTION word ──
 * Font + color cycling on scroll. Each "face" = a different creative direction.
 * Uses useMotionValueEvent to read scroll progress and pick a discrete face index,
 * then CSS transition handles the smooth interpolation between states.
 * The effect is intentionally slow and lingering — wider scroll range than other words.
 */
function ScrollDirection({
  text,
  effect,
  scrollYProgress,
  wordStart,
  wordEnd,
  fxStart,
  fxEnd,
}: {
  text: string;
  effect?: FragEffect;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  wordStart: number;
  wordEnd: number;
  fxStart: number;
  fxEnd: number;
}) {
  const [faceIdx, setFaceIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const y = useTransform(scrollYProgress, [wordStart, wordEnd], ['110%', '0%']);
  const fxScale = useTransform(scrollYProgress, [fxStart, fxEnd], [0, 1]);

  /* Map scroll progress → face index + reveal state */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setRevealed(v >= wordStart + (wordEnd - wordStart) * 0.3);
    if (v < fxStart || v > fxEnd) return;
    const t = (v - fxStart) / (fxEnd - fxStart); // 0→1 within fx range
    const idx = Math.min(Math.floor(t * DIRECTION_FACES.length), DIRECTION_FACES.length - 1);
    setFaceIdx(idx);
  });

  const face = DIRECTION_FACES[faceIdx];

  /*
   * Fixed-size container prevents layout jumps when font changes.
   * The invisible "ghost" text in the base font reserves the exact space.
   * The visible text is absolutely positioned on top, centered.
   * overflow-y: clip masks the initial slide-up reveal without clipping
   * wider fonts horizontally.
   */
  return (
    <span
      className="inline-block align-bottom mr-[0.3em] relative"
      style={{
        overflowY: 'clip',
        overflowX: 'visible',
        opacity: revealed ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <motion.span
        style={{ y }}
        className="inline-block will-change-transform relative"
      >
        {/* Ghost text — invisible, holds the layout size steady */}
        <span
          className="font-body tracking-[0.25em] uppercase invisible"
          aria-hidden
        >
          {text}
        </span>

        {/* Visible cycling text — positioned on top of ghost, left-aligned */}
        <span
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center uppercase"
          style={{
            fontFamily: face.font,
            color: face.color,
            letterSpacing: face.tracking,
            fontWeight: face.weight,
            fontStyle: face.italic ? 'italic' : 'normal',
            transition: `font-family 1.1s cubic-bezier(0.16, 1, 0.3, 1),
                         color 1.4s cubic-bezier(0.22, 1, 0.36, 1),
                         letter-spacing 1.2s cubic-bezier(0.22, 1, 0.36, 1),
                         font-weight 1.0s cubic-bezier(0.16, 1, 0.3, 1),
                         font-style 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>

        {/* Underline — color-matched, synced with face cycling */}
        {effect === 'underline' && (
          <motion.span
            aria-hidden
            style={{
              scaleX: fxScale,
              transformOrigin: 'left',
              backgroundColor: face.color,
              opacity: 0.55,
              transition: 'background-color 1.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
            }}
            className="absolute left-0 -bottom-[0.06em] w-full h-[2px]"
          />
        )}
      </motion.span>
    </span>
  );
}

/* ── Scroll-linked word fragment (for all other words) ── */
function ScrollWord({
  text,
  fragStyle,
  effect,
  emphasis = 'none',
  scrollYProgress,
  wordStart,
  wordEnd,
  fxStart,
  fxEnd,
}: {
  text: string;
  fragStyle: FragStyle;
  effect?: FragEffect;
  emphasis?: FragEmphasis;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  wordStart: number;
  wordEnd: number;
  fxStart: number;
  fxEnd: number;
}) {
  /* Word reveal: translate Y 110% → 0% */
  const y = useTransform(scrollYProgress, [wordStart, wordEnd], ['110%', '0%']);
  /* Opacity — state-driven for reliability (useTransform has issues at tight ranges) */
  const [revealed, setRevealed] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setRevealed(v >= wordStart + (wordEnd - wordStart) * 0.3);
    /* Strikethrough: direct scroll-linked scaleX (state-driven, no useTransform) */
    if (effect === 'strikethrough') {
      if (v <= fxStart) setStrikeScale(0);
      else if (v >= fxEnd) setStrikeScale(1);
      else setStrikeScale((v - fxStart) / (fxEnd - fxStart));
    }
  });
  /* Effect: scaleX 0 → 1 (underline uses useTransform, strikethrough uses state-driven) */
  const fxScale = useTransform(scrollYProgress, [fxStart, fxEnd], [0, 1]);
  /* Strikethrough — state-driven for reliability (bypasses useTransform tight-range issue) */
  const [strikeScale, setStrikeScale] = useState(0);

  /* ── Per-word emphasis effects ── */

  /*
   * CRAFT — multi-layer "craftsmanship" effect (emphasis === 'focus'):
   *   Phase 0: ghost outline — stroke visible, no fill, blurred, light weight, wide spacing
   *   Phase 1: chisel-in — blur clears, weight builds, spacing tightens
   *   Phase 2: golden fill — color warms, stroke fades, full weight
   *   Phase 3: settled — final state, warm gold, bold, tight
   * Each phase is driven by scroll progress through the FX range.
   */
  const [craftPhase, setCraftPhase] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (emphasis !== 'focus') return;
    if (v < fxStart) { setCraftPhase(0); return; }
    if (v >= fxEnd) { setCraftPhase(4); return; }
    const t = (v - fxStart) / (fxEnd - fxStart);
    setCraftPhase(t < 0.15 ? 0 : t < 0.35 ? 1 : t < 0.6 ? 2 : t < 0.85 ? 3 : 4);
  });

  /* Craft phase → visual properties (5 phases for smoother progression) */
  const craftStyles = emphasis === 'focus' ? (() => {
    const phases = {
      0: { // Ghost outline — chisel hasn't started
        color: 'transparent',
        WebkitTextStroke: '1px rgba(232,220,200,0.35)',
        filter: 'blur(5px)',
        fontWeight: 300,
        letterSpacing: '0.06em',
        textShadow: 'none',
      },
      1: { // Etch begins — faint fill, still soft
        color: 'rgba(232,220,200,0.3)',
        WebkitTextStroke: '1px rgba(232,220,200,0.3)',
        filter: 'blur(2.5px)',
        fontWeight: 400,
        letterSpacing: '0.04em',
        textShadow: 'none',
      },
      2: { // Chisel-in — sharpening, weight building
        color: 'rgba(232,220,200,0.7)',
        WebkitTextStroke: '0.5px rgba(232,220,200,0.15)',
        filter: 'blur(0.5px)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        textShadow: 'none',
      },
      3: { // Golden warmth — fill completes, color warms
        color: '#F2C57C',
        WebkitTextStroke: '0px transparent',
        filter: 'blur(0px)',
        fontWeight: 600,
        letterSpacing: '0.005em',
        textShadow: '0 0 12px hsla(40,60%,70%,0.2)',
      },
      4: { // Settled — final warm gold, tight
        color: '#E8C872',
        WebkitTextStroke: '0px transparent',
        filter: 'blur(0px)',
        fontWeight: 600,
        letterSpacing: '0em',
        textShadow: '0 0 8px hsla(40,55%,65%,0.15), 0 0 24px hsla(40,50%,60%,0.06)',
      },
    };
    return phases[craftPhase as keyof typeof phases];
  })() : null;

  // meaning → warm glow intensifies
  const glowIntensity = useTransform(
    scrollYProgress,
    [fxStart, fxEnd],
    emphasis === 'glow' ? [0, 1] : [0, 0],
  );
  const glowShadow = useTransform(
    glowIntensity,
    (v) => v > 0
      ? `0 0 ${10 * v}px hsla(40,60%,80%,${0.4 * v}), 0 0 ${24 * v}px hsla(40,50%,70%,${0.18 * v}), 0 0 ${40 * v}px hsla(40,40%,60%,${0.06 * v})`
      : 'none',
  );

  /* Build dynamic style object */
  const emphasisStyle: Record<string, unknown> = { y };
  if (emphasis === 'glow') emphasisStyle.textShadow = glowShadow;

  return (
    <span
      className="inline-block overflow-hidden align-bottom mr-[0.3em]"
      style={{
        opacity: revealed ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <motion.span
        style={emphasisStyle}
        className={`inline-block will-change-transform relative ${fragmentClass[fragStyle]}`}
      >
        {/* Craft emphasis — state-driven with CSS transitions for smooth phase morphing */}
        {emphasis === 'focus' && craftStyles ? (
          <span
            style={{
              ...craftStyles,
              transition: `color 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                           -webkit-text-stroke 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                           filter 0.8s cubic-bezier(0.22, 1, 0.36, 1),
                           font-weight 1.0s cubic-bezier(0.22, 1, 0.36, 1),
                           letter-spacing 1.1s cubic-bezier(0.22, 1, 0.36, 1),
                           text-shadow 1.0s cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            {text}
          </span>
        ) : (
          text
        )}

        {/* Underline draw — scroll-driven */}
        {effect === 'underline' && (
          <motion.span
            aria-hidden
            style={{ scaleX: fxScale, transformOrigin: 'left' }}
            className="absolute left-0 -bottom-[0.06em] w-full h-[2px] bg-bone/50"
          />
        )}

        {/* Strikethrough — state-driven scroll-linked for reliability */}
        {effect === 'strikethrough' && (
          <span
            aria-hidden
            style={{
              transform: `scaleX(${strikeScale})`,
              transformOrigin: 'left',
              backgroundColor: 'hsl(0 60% 25% / 0.85)',
            }}
            className="absolute left-0 top-[53%] w-full h-[2px]"
          />
        )}
      </motion.span>
    </span>
  );
}

/*
 * Apple-style sticky scroll section.
 * Outer container is 250vh for a tighter, snappier scroll experience.
 * Inner container is position:sticky + 100vh, locked in the viewport.
 * Each word snaps in fast (25% of its slot) then FX play out.
 * DIRECTION gets 3× weight for its font cycling.
 *
 * Timeline (scrollYProgress 0→1 across the 250vh container):
 *   0.05 → 0.70  : word reveals — sequential, snap-in (25% of slot)
 *   0.74 → 0.82  : strategic paragraph fade-in
 *   0.82 → 0.90  : quote + accent line
 *   0.90 → 1.00  : scroll-out (sticky releases)
 */

/*
 * Weight per fragment — DIRECTION gets 3× to slow down its font cycling.
 * Last 3 words ("— not", "take the brief,", "deliver the file.") get 0 weight
 * so they share the same start time → reveal together as a single beat.
 */
const FRAG_WEIGHTS = WHO_FRAGMENTS.map((f, i) =>
  f.emphasis === 'direction' ? 3 : (i >= 7 ? 0 : 1),
);
const TOTAL_WEIGHT = FRAG_WEIGHTS.reduce((a, b) => a + b, 0);

function WhoWeAreSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end'], // start tracking when section is still below viewport — words appear while hero is visible
  });

  /* ── Sequential timeline — each word owns a slot, no overlap ── */
  const SEQ_START = 0.0;
  const SEQ_END = 0.68;
  const SEQ_RANGE = SEQ_END - SEQ_START;
  const BREATH_GAP = 0.06; // breathing pause after "meaning" before the negation

  /* Build slot boundaries from weights.
   * Words 0–6 (We see … meaning) get weighted slots across [SEQ_START, SEQ_END - BREATH_GAP - negation_slot].
   * Words 7–9 (— not, "take the brief,", "deliver the file.") share ONE slot after the gap. */
  const negationSlot = 0.04; // narrow slot — they snap in together fast
  const mainEnd = SEQ_END - BREATH_GAP - negationSlot; // where "meaning" finishes
  const mainRange = mainEnd - SEQ_START;

  const slotStarts: number[] = [];
  const slotEnds: number[] = [];
  const negStart = mainEnd + BREATH_GAP;
  const negEnd = negStart + negationSlot; // 0.68 — words finish revealing here
  const STRIKE_FX_START = negEnd;         // strikethrough begins AFTER words appear
  const STRIKE_FX_END = 0.72;            // draws across 0.68→0.72 (where paragraph starts)
  let cursor = SEQ_START;
  for (let i = 0; i < WHO_FRAGMENTS.length; i++) {
    if (i >= 7) {
      // Negation group — all share the same start (after the gap)
      slotStarts.push(negStart);
      slotEnds.push(negEnd);
    } else {
      const slotSize = (FRAG_WEIGHTS[i] / TOTAL_WEIGHT) * mainRange;
      slotStarts.push(cursor);
      slotEnds.push(cursor + slotSize);
      cursor += slotSize;
    }
  }

  /* Supporting elements — state-driven via useMotionValueEvent (reliable at high scroll %) */
  const [showPara, setShowPara] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowPara(v >= 0.72);
    setShowQuote(v >= 0.82);
  });

  return (
    <section className="relative px-6 md:px-20 pt-20 md:pt-24">
      {/* Chapter header — outside the sticky container */}
      <div className="max-w-[1600px] mx-auto w-full relative z-10 mb-10 md:mb-14">
        <LineReveal asView>
          <Chapter index="01" label="Who we are" />
        </LineReveal>
      </div>

      {/* Tall scroll runway — sticky child locks in viewport */}
      <div ref={sectionRef} className="relative" style={{ height: '250vh' }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center items-center text-center px-6 md:px-20">

          {/* ── Main statement — sequential scroll-linked word reveals ── */}
          <h2
            className="leading-[1.15] md:leading-[1.1] text-bone max-w-5xl mx-auto"
            style={{ fontSize: 'clamp(28px, 5.5vw, 68px)' }}
          >
            {WHO_FRAGMENTS.map((frag, i) => {
              const wordStart = slotStarts[i];
              const slotSize = slotEnds[i] - slotStarts[i];
              const wordEnd = wordStart + slotSize * 0.25; // snap reveal — fast 25% of slot

              /* FX timing: strikethrough words get separate LATER range */
              const isNegation = i >= 7;
              const fxStart = isNegation ? STRIKE_FX_START : wordStart + slotSize * 0.20;
              const fxEnd = isNegation ? STRIKE_FX_END : slotEnds[i];

              /* DIRECTION — font cycling spans its entire (wider) slot */
              if (frag.emphasis === 'direction') {
                return (
                  <ScrollDirection
                    key={i}
                    text={frag.text}
                    effect={frag.effect}
                    scrollYProgress={scrollYProgress}
                    wordStart={wordStart}
                    wordEnd={wordEnd}
                    fxStart={wordStart}
                    fxEnd={slotEnds[i]}
                  />
                );
              }

              return (
                <ScrollWord
                  key={i}
                  text={frag.text}
                  fragStyle={frag.style}
                  effect={frag.effect}
                  emphasis={frag.emphasis}
                  scrollYProgress={scrollYProgress}
                  wordStart={wordStart}
                  wordEnd={wordEnd}
                  fxStart={fxStart}
                  fxEnd={fxEnd}
                />
              );
            })}
          </h2>

          {/* ── Strategic paragraph — state-driven with CSS transition + blur ── */}
          <p
            className="font-body text-bone/50 text-sm md:text-base tracking-wide mt-14 md:mt-18 max-w-2xl mx-auto leading-relaxed will-change-[opacity,transform,filter]"
            style={{
              opacity: showPara ? 1 : 0,
              transform: showPara ? 'translateY(0)' : 'translateY(22px)',
              filter: showPara ? 'blur(0px)' : 'blur(4px)',
              transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            We shape positioning, hold credibility, and sell the actual service — starting
            from what the brand needs to say, who should hear it, and where the work will live.
          </p>

          {/* ── Quote with accent line — state-driven + blur entrance ── */}
          <div
            className="mt-10 md:mt-14 relative pl-6 max-w-xl mx-auto text-left will-change-[opacity,transform,filter]"
            style={{
              opacity: showQuote ? 1 : 0,
              transform: showQuote ? 'translateY(0)' : 'translateY(16px)',
              filter: showQuote ? 'blur(0px)' : 'blur(3px)',
              transition: 'opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.15s, filter 1.3s cubic-bezier(0.22, 1, 0.36, 1) 0.15s',
            }}
          >
            {/* Vertical accent line — draws down from top */}
            <span
              aria-hidden
              className="absolute left-0 top-0 w-[2px] h-full bg-bone/25 overflow-hidden"
              style={{
                transform: showQuote ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'top',
                transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s',
              }}
            >
              {/* Breathing pulse — timer-based for life */}
              <motion.span
                animate={{ y: ['-100%', '100%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', times: [0, 0.15, 0.85, 1] }}
                className="absolute inset-0 bg-bone/40"
              />
            </span>

            <p className="font-display italic text-bone/35 text-sm md:text-base leading-relaxed">
              &ldquo;Good work isn&rsquo;t just beautiful — it makes the brand understood the right way.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── What We Do ── */
const SERVICES = [
  {
    no: '01',
    title: 'Brand & campaign video',
    body: 'Films that shape brand image, communicate positioning, and hold attention long after the campaign ends.',
  },
  {
    no: '02',
    title: 'Social media content',
    body: 'Monthly content held to the same standard as the brand work — IG, FB, TikTok, YouTube. Not filler. Business assets.',
  },
  {
    no: '03',
    title: 'Photography',
    body: 'Professional stills for automotive, product, lifestyle, event and branded content.',
  },
  {
    no: '04',
    title: 'Event & concert recap',
    body: 'Capturing the atmosphere, the energy, the moment — and turning a one-night event into months of content.',
  },
  {
    no: '05',
    title: 'Creative direction',
    body: 'Setting the direction before production starts — for brands that know what they want, but not yet how to say it.',
  },
  {
    no: '06',
    title: 'Digital & web support',
    body: 'Website, landing pages and visual support so the brand stays cohesive across online and offline.',
  },
];

/* Gallery — curated portfolio, masonry layout, natural aspect ratios */
const GALLERY = [
  { src: '/gallery/porsche-golf.jpg',      alt: 'Porsche 911 ST — Redline x Omazz',     w: 1599, h: 1066 },
  { src: '/gallery/jeeno-laugh.jpg',       alt: 'Jeeno — Redline x Omazz Event',        w: 600,  h: 900  },
  { src: '/gallery/lambo-huracan.jpg',     alt: 'Lamborghini Huracán — Architecture',    w: 599,  h: 900  },
  { src: '/gallery/lexus-lc500.jpg',       alt: 'Lexus LC 500 — Redline',                w: 1600, h: 1066 },
  { src: '/gallery/golf-ball.jpg',         alt: 'Golf Ball — Motion Study',               w: 900,  h: 506  },
  { src: '/gallery/aerial-island.jpg',     alt: 'Aerial — Island Dusk',                   w: 900,  h: 898  },
  { src: '/gallery/aerial-golf.jpg',       alt: 'Aerial — Golf Course Golden Hour',       w: 1600, h: 897  },
] as const;

function GalleryDropdown() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-16 md:mt-20">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 text-bone/40 hover:text-bone/70 transition-colors duration-300 group cursor-pointer"
      >
        <span className="text-[11px] tracking-[0.2em] uppercase font-mono">
          View selected work
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pt-8 columns-2 md:columns-3 gap-2 md:gap-3"
              style={{ columnFill: 'balance' }}
            >
              {GALLERY.map((img, i) => (
                <motion.div
                  key={img.alt}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 md:mb-3 break-inside-avoid overflow-hidden group"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    loading="lazy"
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ aspectRatio: `${img.w}/${img.h}` }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WhatWeDoSection() {
  return (
    <EditorialSection index="02" label="What we do" hideNumeral>
      <StaggerReveal>
        <h2
          className="font-display text-bone leading-[0.95] tracking-[-0.028em] uppercase mb-16 md:mb-20"
          style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
        >
          Six disciplines,
          <br />
          one standard.
        </h2>
      </StaggerReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14 mb-20 md:mb-28">
        {SERVICES.map((svc, i) => (
          <StaggerReveal key={svc.no} delay={i * 0.08}>
            <div className="group">
              <span className="text-[11px] tracking-[0.2em] text-bone/30 font-mono block mb-3">
                {svc.no}
              </span>
              <h3 className="font-display text-bone text-lg md:text-xl uppercase tracking-[-0.02em] mb-3">
                {svc.title}
              </h3>
              <p className="font-body text-bone/55 text-sm md:text-base leading-relaxed">
                {svc.body}
              </p>
            </div>
          </StaggerReveal>
        ))}
      </div>

      {/* ── Gallery dropdown ── */}
      <GalleryDropdown />
    </EditorialSection>
  );
}

/* ── Industries ── */
const INDUSTRIES = [
  'Luxury Automotive',
  'Golf & Sports Lifestyle',
  'Clinic / Beauty',
  'Restaurant / F&B',
  'Event / Concert',
  'Real Estate',
  'Corporate',
];

function IndustriesSection() {
  return (
    <EditorialSection index="03" label="Industries we understand" hideNumeral>
      <div className="relative rounded-sm overflow-hidden">
        {/* Audi background */}
        <div className="absolute inset-0">
          <img
            src="/gallery/audi-dark.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 py-16 md:py-24 px-8 md:px-14">
          <p className="font-body text-bone/50 text-sm md:text-base mb-8 max-w-[520px] leading-relaxed">
            Every industry has its own visual language. We learn it before we shoot it.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {INDUSTRIES.map((ind, i) => (
              <StaggerReveal key={ind} delay={i * 0.06}>
                <motion.span
                  whileHover={{ scale: 1.05, borderColor: 'hsl(40 18% 92% / 0.5)' }}
                  transition={{ duration: 0.25 }}
                  className="inline-block border border-bone/25 text-bone/80 font-body text-sm md:text-base px-5 py-2.5 tracking-wide cursor-default backdrop-blur-sm"
                >
                  {ind}
                </motion.span>
              </StaggerReveal>
            ))}
          </div>
        </div>
      </div>
    </EditorialSection>
  );
}

/* ── Case Studies ── */
function CaseStudiesSection() {
  const featured = FEATURED_CASE_IDS.map((id) => cases.find((c) => c.id === id)).filter(Boolean);

  return (
    <EditorialSection index="04" label="Selected work" hideNumeral>
      <StaggerReveal>
        <h2
          className="font-display text-bone leading-[0.95] tracking-[-0.028em] uppercase mb-16 md:mb-20"
          style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
        >
          Work that earns
          <br />
          the room it plays in.
        </h2>
      </StaggerReveal>
      <StaggerReveal delay={0.08}>
        <p className="font-body text-bone/45 text-sm md:text-base mb-16 md:mb-20 max-w-[600px] leading-relaxed -mt-8 md:-mt-12">
          Real clients. Real briefs. Every project started with a conversation — and ended with work
          the brand still uses.
        </p>
      </StaggerReveal>

      <div className="flex flex-col gap-24 md:gap-32">
        {featured.map((cs, i) =>
          cs ? (
            <StaggerReveal key={cs.id} delay={0.1}>
              <Link to={`/work/${cs.id}`} className="group block">
                <div className={`grid md:grid-cols-2 gap-8 md:gap-16 ${i % 2 === 1 ? 'md:direction-rtl' : ''}`}>
                  {/* Image — parallax */}
                  <div className="relative overflow-hidden aspect-video bg-black">
                    {cs.thumbnail?.startsWith('/thumbnails/') ? (
                      <>
                        <img
                          src={hiRes(cs.thumbnail) || ''}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
                        />
                        <motion.img
                          src={hiRes(cs.thumbnail) || ''}
                          alt={cs.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </>
                    ) : (
                    <Parallax speed={0.12} className="absolute inset-[-15%]">
                      <motion.img
                        src={hiRes(cs.thumbnail) || ''}
                        alt={cs.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Parallax>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>

                  {/* Info */}
                  <div className={`flex flex-col justify-center ${i % 2 === 1 ? 'md:order-first' : ''}`}>
                    <span className="text-[11px] tracking-[0.2em] text-bone/30 font-mono block mb-3">
                      {cs.industry}
                    </span>
                    <h3 className="font-display text-bone text-2xl md:text-3xl lg:text-4xl uppercase tracking-[-0.02em] leading-[0.95] mb-4">
                      {cs.title}
                    </h3>
                    <p className="font-body text-bone/55 text-sm md:text-base leading-relaxed mb-6 max-w-[480px]">
                      {cs.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cs.outputs.map((o) => (
                        <span
                          key={o}
                          className="text-[10px] tracking-[0.15em] uppercase text-bone/35 border border-bone/10 px-3 py-1"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-2 text-bone/40 text-sm font-body group-hover:text-bone/70 transition-colors">
                      View project <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </StaggerReveal>
          ) : null,
        )}
      </div>

      {/* See all work */}
      <StaggerReveal delay={0.2}>
        <div className="mt-20 md:mt-28 text-center">
          <Link
            to="/work"
            className="inline-flex items-center gap-3 text-bone/50 font-body text-base hover:text-bone/80 transition-colors"
          >
            See all work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </StaggerReveal>
    </EditorialSection>
  );
}

/* ── How We Work ── */
const STEPS = [
  {
    no: '01',
    title: 'Listen First',
    body: 'Before any brief, before any camera — we listen until we understand what the brand wants to say, to whom, and to what end.',
  },
  {
    no: '02',
    title: 'Point the Direction',
    body: 'We set the creative direction, visual language, and intended outputs before production begins — so nothing is built on guesswork.',
  },
  {
    no: '03',
    title: 'Make It',
    body: 'We produce at the standard the project actually needs — never under-delivered, never over-complicated.',
  },
  {
    no: '04',
    title: 'Make It Right',
    body: 'We refine until both the image and the message are sharp — we don\u2019t finish at \u201Cgood enough,\u201D we finish at \u201Cright.\u201D',
  },
  {
    no: '05',
    title: 'Make It Work',
    body: 'We deliver in formats that work on the client\u2019s real platforms — and we stay close enough to keep the work growing.',
  },
];

function HowWeWorkSection() {
  return (
    <EditorialSection index="05" label="How we work" hideNumeral>
      <StaggerReveal>
        <h2
          className="font-display text-bone leading-[0.95] tracking-[-0.028em] uppercase mb-16 md:mb-20"
          style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
        >
          Five steps.
          <br />
          No guesswork.
        </h2>
      </StaggerReveal>

      <div className="flex flex-col gap-0">
        {STEPS.map((step, i) => (
          <StaggerReveal key={step.no} delay={i * 0.08}>
            <div className="border-t border-bone/10 py-8 md:py-12 grid md:grid-cols-[80px_1fr_2fr] gap-4 md:gap-8 items-baseline">
              <span className="text-[11px] tracking-[0.2em] text-bone/25 font-mono">
                {step.no}
              </span>
              <h3 className="font-display text-bone text-lg md:text-xl uppercase tracking-[-0.02em]">
                {step.title}
              </h3>
              <p className="font-body text-bone/50 text-sm md:text-base leading-relaxed">
                {step.body}
              </p>
            </div>
          </StaggerReveal>
        ))}
        <div className="border-t border-bone/10" />
      </div>
    </EditorialSection>
  );
}

/* ── Rate Card ── */
const PACKAGES = [
  {
    scope: 'Single Production',
    desc: 'One deliverable. One clear objective.',
    price: '49,000',
    cycle: 'per project',
    includes: [
      'Photography or short-form video',
      'Event documentation & recap',
      'Social content pack (stills + cuts)',
    ],
    ideal: 'Events, launches, or social packs that need one focused shoot day and a clear deliverable.',
  },
  {
    scope: 'Full Production',
    desc: 'Concept to final cut — nothing in between is guesswork.',
    price: '79,000',
    cycle: 'per production',
    includes: [
      'Brand film or campaign video',
      'Creative direction + treatment',
      'Multi-platform delivery & formats',
    ],
    ideal: 'Campaigns, brand stories, or launches that need a complete production pipeline.',
    featured: true,
  },
  {
    scope: 'Monthly Retainer',
    desc: 'Ongoing creative partnership, not a content factory.',
    price: '109,000',
    cycle: 'per month',
    includes: [
      'Social content strategy + production',
      'Creative direction & art direction',
      'Monthly planning + performance review',
    ],
    ideal: 'Brands building long-term positioning — where every post, every video, every campaign compounds into brand equity.',
  },
];

function RateCardSection() {
  return (
    <EditorialSection index="06" label="Pricing" hideNumeral>
      {/* ── Header ── */}
      <StaggerReveal>
        <p className="text-[11px] tracking-[0.22em] uppercase text-bone/40 font-mono mb-6">
          Indicative pricing — not a final quote
        </p>
        <h2
          className="font-display text-bone leading-[0.95] tracking-[-0.028em] uppercase mb-6"
          style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
        >
          Clear starting points.
        </h2>
      </StaggerReveal>
      <StaggerReveal delay={0.1}>
        <p className="font-body text-bone/50 text-sm md:text-base mb-16 md:mb-20 max-w-[640px] leading-relaxed">
          Every project is scoped individually. These figures represent where conversations
          typically begin&mdash;not where they end. Final pricing is always confirmed in a
          written quotation after we understand your brief.
        </p>
      </StaggerReveal>

      {/* ── Cards ── */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {PACKAGES.map((pkg, i) => (
          <Parallax key={pkg.scope} speed={0.04 + i * 0.025}>
          <StaggerReveal delay={i * 0.12}>
            <div
              className={`border ${
                pkg.featured ? 'border-bone/25' : 'border-bone/10'
              } p-8 md:p-10 flex flex-col h-full relative group hover:border-bone/30 transition-colors duration-500`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-8 bg-black px-3 text-[10px] tracking-[0.2em] uppercase text-bone/50">
                  Most requested
                </span>
              )}

              {/* Scope name */}
              <h3 className="font-display text-bone text-base md:text-lg uppercase tracking-[-0.02em] mb-1.5">
                {pkg.scope}
              </h3>
              <p className="font-body text-bone/40 text-xs md:text-sm leading-relaxed mb-6">
                {pkg.desc}
              </p>

              {/* Price block — "from" prefix */}
              <div className="mb-8 pb-6 border-b border-bone/8">
                <span className="text-[11px] tracking-[0.18em] uppercase text-bone/35 font-body block mb-2">
                  From
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display text-bone leading-none"
                    style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
                  >
                    {pkg.price}
                  </span>
                  <span className="text-bone/30 font-body text-xs tracking-wide uppercase">
                    THB
                  </span>
                </div>
                <span className="text-bone/25 font-body text-xs mt-1.5 block">
                  {pkg.cycle}
                </span>
              </div>

              {/* Includes */}
              <p className="text-[10px] tracking-[0.18em] uppercase text-bone/30 font-mono mb-3">
                Includes
              </p>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {pkg.includes.map((item) => (
                  <li
                    key={item}
                    className="font-body text-bone/55 text-sm flex items-start gap-2.5"
                  >
                    <span className="text-bone/20 mt-1 text-[6px]">{'\u25CF'}</span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Ideal for */}
              <div className="pt-5 border-t border-bone/6">
                <p className="text-[10px] tracking-[0.18em] uppercase text-bone/25 font-mono mb-2">
                  Ideal for
                </p>
                <p className="font-body text-bone/35 text-xs leading-relaxed italic">
                  {pkg.ideal}
                </p>
              </div>
            </div>
          </StaggerReveal>
          </Parallax>
        ))}
      </div>

      {/* ── Disclaimer ── */}
      <StaggerReveal delay={0.35}>
        <div className="mt-12 md:mt-16 pt-8 border-t border-bone/8 max-w-[720px]">
          <p className="font-body text-bone/30 text-xs leading-relaxed mb-3">
            Final quotation depends on scope, production complexity, timeline, crew size,
            deliverables, and usage rights. Every project starts with a conversation.
          </p>
          <p className="font-body text-bone/20 text-xs leading-relaxed">
            All prices exclude VAT 7%. Payment terms and production timeline are confirmed
            in the project quotation.
          </p>
        </div>
      </StaggerReveal>
    </EditorialSection>
  );
}

/* ── CTA / Contact ── */
function CTASection() {
  return (
    <section className="px-6 md:px-20 pt-20 md:pt-24 pb-32 md:pb-40">
      <div className="max-w-[1200px] mx-auto text-center">
        <StaggerReveal>
          <p className="text-[11px] tracking-[0.22em] uppercase text-bone/40 mb-8">
            07 / Let&rsquo;s work together
          </p>
        </StaggerReveal>
        <StaggerReveal delay={0.1}>
          <h2
            className="font-display text-bone leading-[0.95] tracking-[-0.028em] uppercase mb-8"
            style={{ fontSize: 'clamp(36px, 6vw, 96px)' }}
          >
            Every project starts
            <br />
            with a conversation.
          </h2>
        </StaggerReveal>
        <StaggerReveal delay={0.2}>
          <p className="font-body text-bone/50 text-base md:text-lg mb-12 max-w-[480px] mx-auto leading-relaxed">
            Tell us what you&rsquo;re working on. We&rsquo;ll tell you what we see, what it takes, and whether we&rsquo;re the right fit.
          </p>
        </StaggerReveal>

        <StaggerReveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/briefing-room"
              className="inline-flex items-center gap-3 bg-bone text-ink font-display text-sm uppercase tracking-[0.12em] px-8 py-4 hover:bg-white transition-colors"
            >
              Send a brief <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://line.me/R/ti/p/@undercatcreatives"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#06C755] text-white font-display text-sm uppercase tracking-[0.12em] px-8 py-4 hover:bg-[#05b34d] transition-colors"
            >
              LINE @undercatcreatives
            </a>
            <a
              href="mailto:undercat.creatives@gmail.com"
              className="inline-flex items-center gap-3 border border-bone/20 text-bone/60 font-display text-sm uppercase tracking-[0.12em] px-8 py-4 hover:border-bone/40 hover:text-bone/80 transition-colors"
            >
              Email us
            </a>
          </div>
        </StaggerReveal>

        <StaggerReveal delay={0.5}>
          <div className="mt-16 flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center text-bone/30 font-body text-sm">
            <span>undercat.creatives@gmail.com</span>
            <span>Bangkok, Thailand</span>
          </div>
        </StaggerReveal>
      </div>
    </section>
  );
}

/* ── Principles (bonus — compact) ── */
const PRINCIPLES = [
  { title: 'Visuals must have a reason', body: 'Every element has a function\u2014never just decoration.' },
  { title: 'Style must support meaning', body: 'Style isn\u2019t the goal. It\u2019s the tool that carries the message.' },
  { title: 'Content must serve the business', body: 'Beautiful work without direction is money wasted.' },
  { title: 'Premium doesn\u2019t mean complicated', body: 'Clarity is its own kind of luxury.' },
];

function PrinciplesSection() {
  return (
    <section className="px-6 md:px-20 py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto">
        <StaggerReveal>
          <p className="text-[11px] tracking-[0.22em] uppercase text-bone/40 mb-12 md:mb-16 text-center">
            What we hold true
          </p>
        </StaggerReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {PRINCIPLES.map((p, i) => (
            <Parallax key={i} speed={0.04 + i * 0.03}>
              <StaggerReveal delay={i * 0.08}>
                <div>
                  <h3 className="font-display text-bone text-base md:text-lg uppercase tracking-[-0.02em] leading-tight mb-3">
                    {p.title}
                  </h3>
                  <p className="font-body text-bone/40 text-sm leading-relaxed">{p.body}</p>
                </div>
              </StaggerReveal>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ── */
export default function Credentials() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pageRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <Helmet>
        <title>Credentials — Undercat Creatives | Video Production Bangkok</title>
        <meta name="description" content="Video production studio & creative agency in Bangkok. Brand films, social content, retainer packages from 49,000 THB. Trusted by Audi Thailand, Greenline Golf Academy." />
        <link rel="canonical" href="https://www.undercatcreatives.com/credentials" />
        <meta property="og:title" content="Credentials — Undercat Creatives | Video Production Bangkok" />
        <meta property="og:description" content="Bangkok video production studio. Brand films, social content, retainer packages from 49,000 THB. Trusted by Audi Thailand & Greenline Golf." />
        <meta property="og:url" content="https://www.undercatcreatives.com/credentials" />
        <meta name="twitter:title" content="Credentials — Undercat Creatives | Video Production Bangkok" />
        <meta name="twitter:description" content="Bangkok video production studio. Brand films, social content, retainer packages from 49,000 THB." />
      </Helmet>
      <BlurCursor />
      <ScrollProgress progress={scrollYProgress} />
      <div ref={pageRef} className="bg-black text-white min-h-screen">
        <LivingGrain />

        <HeroSection />
        <Divider />
        <WhoWeAreSection />
        <Divider />
        <WhatWeDoSection />
        <Divider />
        <IndustriesSection />
        <PrinciplesSection />
        <Divider />
        <CaseStudiesSection />
        <Divider />
        <HowWeWorkSection />
        <Divider />
        <RateCardSection />
        <Divider />
        <CTASection />

        <PageFooter />
      </div>
    </>
  );
}
