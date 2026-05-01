import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useBrief } from '@/hooks/useBrief';
import { trackEvent } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { LivingGrain } from '@/components/effects';
import { EASE, MetaLabel, DisplayHeadline } from '@/components/editorial';

import PhaseMission from '@/components/briefing-room/PhaseMission';
import PhaseVibe from '@/components/briefing-room/PhaseVibe';
import PhaseDetails from '@/components/briefing-room/PhaseDetails';

const phases = [
  { label: 'The Project', component: PhaseMission },
  { label: 'The Vibe', component: PhaseVibe },
  { label: 'The Details', component: PhaseDetails },
];

/* ──────────────────────────────────────────────
   CreativeReveal — viewfinder showcase
   Right-side animation for /briefing-room Gateway.
   Cycles through 8 creative directions, each with
   a unique gradient mesh, color palette, and
   decorative motion that matches the mood.
   Apple-grade aesthetic, brand-kinetic, accountable.
   ────────────────────────────────────────────── */
type Decoration =
  | 'lightbeam'
  | 'scanbands'
  | 'chromatic'
  | 'geomline'
  | 'particles'
  | 'scanlines'
  | 'lensflare'
  | 'halftone';

type Scene = {
  base: string;       // base color layer (full bg)
  blob1: string;      // primary radial blob gradient
  blob2: string;      // secondary radial blob gradient
  glow: string;       // accent glow
  scrim: string;      // darkening scrim to keep text readable
  decoration: Decoration;
  textTone: 'bone' | 'pure-bone'; // pure-bone = brighter text on saturated scenes
  // Typography per mood — picks a font that embodies the feeling
  fontFamily: string;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  fontSize: string;       // CSS clamp() for responsive sizing
  letterSpacing: string;
  lineHeight?: number;
  // Snap / texture / camera-feel effects
  grainAmount: number;     // 0-1 · how much LivingGrain to overlay
  cameraEffect?: 'shake' | 'zoom-in' | 'zoom-breath' | 'drift';
  textEffect?: 'glitch' | 'flicker' | 'wave';
};

type Showcase = {
  mood: string;
  phrase: string;       // big display centerpiece (mood + outcome)
  teachLine: string;    // small principle subtitle (educates briefly)
  italic?: boolean;
  artDir: string;
  format: string;
  kpiLabel: string;
  kpiValue: string;
  scene: Scene;
};

/* 3-color palette per mood — applied via color theory:
   [primary, secondary, tertiary]. Primary = hero tint, all 3 wash background. */
const MOOD_PALETTE: Record<string, [string, string, string]> = {
  // Analogous warm — gold + oxblood + amber (luxury family)
  'Quiet Luxury':      ['38 80% 60%',  '358 70% 45%',  '25 60% 50%'],
  // Triadic — cyan + magenta + yellow (high-energy primary triad)
  'Kinetic Pop':       ['190 90% 60%', '330 85% 60%',  '50 100% 60%'],
  // Analogous warm — amber + sienna + cream (documentary earth)
  'Documentary Real':  ['35 60% 55%',  '18 55% 38%',   '40 70% 78%'],
  // Monochromatic — bone tones (high-contrast neutral)
  'Editorial Minimal': ['40 18% 92%',  '0 0% 70%',     '40 18% 75%'],
  // Analogous warm — peach + rose + cream (romantic family)
  'Romantic Slow':     ['15 70% 75%',  '335 65% 65%',  '40 75% 82%'],
  // Split-complement — red + cyan + acid yellow (punk contrast)
  'Punk DIY':          ['0 90% 55%',   '180 80% 50%',  '60 100% 55%'],
  // Cinematic dusk — sunset + indigo + deep blue (warm/cool tension)
  'Epic Cinema':       ['35 90% 65%',  '280 50% 40%',  '210 70% 35%'],
  // Triadic — yellow + violet + cyan (playful primary triad)
  'Lo-fi Playful':     ['50 80% 65%',  '280 70% 65%',  '180 70% 60%'],
};

/* Convenience helper — single accent color for hero tint */
const heroAccentFor = (mood: string) => (MOOD_PALETTE[mood] ?? ['40 18% 92%', '40 18% 92%', '40 18% 92%'])[0];

const SHOWCASE: Showcase[] = [
  {
    mood: 'Quiet Luxury',
    phrase: 'Slow sells more.',
    teachLine: 'Quiet feels rich.',
    italic: true,
    artDir: 'Anamorphic · slow push · grain',
    format: 'YouTube hero · 60s',
    kpiLabel: 'View-through',
    kpiValue: '87%',
    scene: {
      base: 'hsl(0 0% 5%)',
      blob1: 'radial-gradient(circle at 25% 75%, hsl(358 68% 32%) 0%, transparent 55%)',
      blob2: 'radial-gradient(circle at 75% 25%, hsl(38 70% 28%) 0%, transparent 50%)',
      glow: 'radial-gradient(ellipse at 50% 50%, hsl(38 100% 60% / 0.06), transparent 60%)',
      scrim: 'linear-gradient(180deg, hsl(0 0% 0% / 0.15) 0%, hsl(0 0% 0% / 0.3) 100%)',
      decoration: 'lightbeam',
      textTone: 'bone',
      fontFamily: "'Cormorant Garamond', 'Syne', serif",
      fontWeight: 400,
      fontStyle: 'italic',
      fontSize: 'clamp(28px, 4.4vw, 64px)',
      letterSpacing: '-0.01em',
      lineHeight: 0.95,
      grainAmount: 0.18,
      cameraEffect: 'zoom-breath',
    },
  },
  {
    mood: 'Kinetic Pop',
    phrase: 'Fast wins eyes.',
    teachLine: 'Speed gets saves.',
    artDir: 'Snap cuts · saturated · 1.5×',
    format: 'IG Reels · 15s',
    kpiLabel: 'Save rate',
    kpiValue: '6.1%',
    scene: {
      base: 'hsl(280 35% 12%)',
      blob1: 'radial-gradient(circle at 20% 30%, hsl(190 90% 45%) 0%, transparent 55%)',
      blob2: 'radial-gradient(circle at 80% 70%, hsl(330 85% 55%) 0%, transparent 55%)',
      glow: 'radial-gradient(ellipse at 50% 50%, hsl(45 100% 60% / 0.12), transparent 70%)',
      scrim: 'linear-gradient(180deg, hsl(0 0% 0% / 0.25) 0%, hsl(0 0% 0% / 0.4) 100%)',
      decoration: 'scanbands',
      textTone: 'pure-bone',
      fontFamily: "'Anton', 'Syne', sans-serif",
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 'clamp(34px, 4.8vw, 72px)',
      letterSpacing: '0.02em',
      lineHeight: 0.9,
      grainAmount: 0.06,
      cameraEffect: 'shake',
    },
  },
  {
    mood: 'Documentary Real',
    phrase: 'Real wins trust.',
    teachLine: 'Honest beats nice.',
    italic: true,
    artDir: 'Handheld · natural light · off-mic',
    format: 'TikTok · 45s',
    kpiLabel: 'Comment rate',
    kpiValue: '3.8%',
    scene: {
      base: 'hsl(30 25% 10%)',
      blob1: 'radial-gradient(circle at 50% 100%, hsl(35 55% 32%) 0%, transparent 65%)',
      blob2: 'radial-gradient(circle at 30% 20%, hsl(25 40% 22%) 0%, transparent 50%)',
      glow: 'radial-gradient(ellipse at 50% 80%, hsl(40 80% 60% / 0.1), transparent 60%)',
      scrim: 'linear-gradient(180deg, hsl(30 30% 4% / 0.2) 0%, hsl(30 30% 4% / 0.4) 100%)',
      decoration: 'chromatic',
      textTone: 'bone',
      fontFamily: "'Special Elite', 'JetBrains Mono', monospace",
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 'clamp(26px, 3.6vw, 54px)',
      letterSpacing: '-0.01em',
      lineHeight: 1,
      grainAmount: 0.32,
      cameraEffect: 'drift',
      textEffect: 'flicker',
    },
  },
  {
    mood: 'Editorial Minimal',
    phrase: 'Less says more.',
    teachLine: 'Space helps.',
    artDir: 'Static · symmetry · whitespace',
    format: 'Web hero · 30s loop',
    kpiLabel: 'Completion',
    kpiValue: '91%',
    scene: {
      base: 'hsl(0 0% 8%)',
      blob1: 'radial-gradient(circle at 50% 50%, hsl(0 0% 18%) 0%, transparent 65%)',
      blob2: 'radial-gradient(circle at 90% 10%, hsl(40 18% 92% / 0.06) 0%, transparent 40%)',
      glow: 'radial-gradient(ellipse at 50% 50%, hsl(40 18% 92% / 0.04), transparent 70%)',
      scrim: 'linear-gradient(180deg, hsl(0 0% 0% / 0.1) 0%, hsl(0 0% 0% / 0.2) 100%)',
      decoration: 'geomline',
      textTone: 'bone',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      fontWeight: 300,
      fontStyle: 'normal',
      fontSize: 'clamp(28px, 4vw, 60px)',
      letterSpacing: '-0.04em',
      lineHeight: 0.95,
      grainAmount: 0.04,
    },
  },
  {
    mood: 'Romantic Slow',
    phrase: 'Slow love stays.',
    teachLine: 'Time builds care.',
    italic: true,
    artDir: 'Long take · soft focus · 24fps',
    format: 'YouTube · 90s',
    kpiLabel: 'Avg view',
    kpiValue: '0:54',
    scene: {
      base: 'hsl(330 30% 14%)',
      blob1: 'radial-gradient(circle at 30% 25%, hsl(15 70% 50%) 0%, transparent 55%)',
      blob2: 'radial-gradient(circle at 70% 80%, hsl(330 60% 45%) 0%, transparent 55%)',
      glow: 'radial-gradient(ellipse at 50% 30%, hsl(30 100% 80% / 0.15), transparent 60%)',
      scrim: 'linear-gradient(180deg, hsl(330 40% 8% / 0.2) 0%, hsl(330 40% 8% / 0.35) 100%)',
      decoration: 'particles',
      textTone: 'pure-bone',
      fontFamily: "'Italiana', 'Cormorant Garamond', serif",
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 'clamp(34px, 4.8vw, 72px)',
      letterSpacing: '0.04em',
      lineHeight: 0.95,
      grainAmount: 0.12,
      cameraEffect: 'zoom-in',
      textEffect: 'wave',
    },
  },
  {
    mood: 'Punk DIY',
    phrase: 'Raw gets shared.',
    teachLine: 'Bold beats safe.',
    artDir: 'Collage · VHS · hard cuts',
    format: 'IG Story · 9×15s',
    kpiLabel: 'Share rate',
    kpiValue: '5.7%',
    scene: {
      base: 'hsl(0 0% 4%)',
      blob1: 'radial-gradient(circle at 30% 70%, hsl(0 90% 30%) 0%, transparent 50%)',
      blob2: 'radial-gradient(circle at 80% 30%, hsl(0 0% 14%) 0%, transparent 50%)',
      glow: 'radial-gradient(ellipse at 50% 50%, hsl(0 100% 50% / 0.08), transparent 70%)',
      scrim: 'linear-gradient(180deg, hsl(0 0% 0% / 0.2) 0%, hsl(0 0% 0% / 0.3) 100%)',
      decoration: 'scanlines',
      textTone: 'bone',
      fontFamily: "'VT323', 'JetBrains Mono', monospace",
      fontWeight: 400,
      fontStyle: 'normal',
      fontSize: 'clamp(40px, 5.6vw, 80px)',
      letterSpacing: '0.02em',
      lineHeight: 0.85,
      grainAmount: 0.42,
      cameraEffect: 'shake',
      textEffect: 'glitch',
    },
  },
  {
    mood: 'Epic Cinema',
    phrase: 'Big sticks in mind.',
    teachLine: 'Scale lifts brand.',
    italic: true,
    artDir: 'Wide · drone · score swell',
    format: 'Cinema · 60s',
    kpiLabel: 'Brand lift',
    kpiValue: '+18%',
    scene: {
      base: 'hsl(220 40% 10%)',
      blob1: 'radial-gradient(circle at 80% 30%, hsl(35 80% 45%) 0%, transparent 55%)',
      blob2: 'radial-gradient(circle at 20% 75%, hsl(220 60% 25%) 0%, transparent 60%)',
      glow: 'radial-gradient(ellipse at 80% 25%, hsl(40 100% 70% / 0.2), transparent 50%)',
      scrim: 'linear-gradient(180deg, hsl(220 50% 5% / 0.15) 0%, hsl(220 50% 5% / 0.35) 100%)',
      decoration: 'lensflare',
      textTone: 'pure-bone',
      fontFamily: "'Cinzel', 'Syne', serif",
      fontWeight: 700,
      fontStyle: 'normal',
      fontSize: 'clamp(26px, 3.6vw, 54px)',
      letterSpacing: '0.06em',
      lineHeight: 1,
      grainAmount: 0.14,
      cameraEffect: 'zoom-in',
    },
  },
  {
    mood: 'Lo-fi Playful',
    phrase: 'Fun gets shared.',
    teachLine: 'Smile sells.',
    artDir: 'Mixed media · grain · hand title',
    format: 'Reels · 22s',
    kpiLabel: 'CTR',
    kpiValue: '8.4%',
    scene: {
      base: 'hsl(280 30% 14%)',
      blob1: 'radial-gradient(circle at 25% 25%, hsl(50 80% 50%) 0%, transparent 50%)',
      blob2: 'radial-gradient(circle at 75% 75%, hsl(280 70% 50%) 0%, transparent 50%)',
      glow: 'radial-gradient(circle at 50% 50%, hsl(15 90% 60% / 0.12), transparent 60%)',
      scrim: 'linear-gradient(180deg, hsl(0 0% 0% / 0.2) 0%, hsl(0 0% 0% / 0.35) 100%)',
      decoration: 'halftone',
      textTone: 'pure-bone',
      fontFamily: "'Caveat', 'Comic Sans MS', cursive",
      fontWeight: 700,
      fontStyle: 'normal',
      fontSize: 'clamp(44px, 6vw, 88px)',
      letterSpacing: '-0.01em',
      lineHeight: 0.85,
      grainAmount: 0.08,
      cameraEffect: 'shake',
    },
  },
];

/* Decoration overlays — small SVG/CSS effects per mood */
function DecorationLayer({ kind }: { kind: Decoration }) {
  switch (kind) {
    case 'lightbeam':
      return (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(115deg, transparent 30%, hsl(38 100% 70% / 0.08) 50%, transparent 70%)',
          }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      );
    case 'scanbands':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-[2px]"
              style={{
                background:
                  i === 0
                    ? 'hsl(190 100% 70% / 0.4)'
                    : i === 1
                    ? 'hsl(330 100% 70% / 0.35)'
                    : 'hsl(45 100% 70% / 0.4)',
                boxShadow: '0 0 20px currentColor',
                top: `${20 + i * 30}%`,
              }}
              animate={{ y: ['-100%', '600%'] }}
              transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
            />
          ))}
        </div>
      );
    case 'chromatic':
      return (
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 30% 50%, hsl(0 100% 50% / 0.4), transparent 30%), radial-gradient(circle at 70% 50%, hsl(200 100% 50% / 0.4), transparent 30%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
      );
    case 'geomline':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-px bg-bone/30"
            animate={{ y: [80, 460, 80] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 bottom-0 w-px bg-bone/15"
            animate={{ x: [60, 380, 60] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      );
    case 'particles':
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? 'hsl(30 100% 85%)' : 'hsl(330 80% 80%)',
                left: `${(i * 8.3) % 100}%`,
                bottom: '-10%',
                boxShadow: '0 0 8px currentColor',
              }}
              animate={{ y: ['0%', '-700%'], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 8 + (i % 5) * 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      );
    case 'scanlines':
      return (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, hsl(0 100% 50% / 0.08) 2px, hsl(0 100% 50% / 0.08) 3px)',
            }}
          />
          <motion.div
            className="absolute left-0 right-0 h-12 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent, hsl(0 100% 50% / 0.15), transparent)',
            }}
            animate={{ y: ['-15%', '120%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
        </>
      );
    case 'lensflare':
      return (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute"
            style={{
              top: '20%',
              right: '15%',
              width: 60,
              height: 60,
              background: 'radial-gradient(circle, hsl(40 100% 80% / 0.7), transparent 60%)',
              filter: 'blur(2px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{
              top: '55%',
              left: '40%',
              width: 20,
              height: 20,
              background: 'radial-gradient(circle, hsl(40 100% 80% / 0.4), transparent 70%)',
              filter: 'blur(1px)',
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>
      );
    case 'halftone':
      return (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
          style={{
            backgroundImage:
              'radial-gradient(circle, hsl(40 18% 92% / 0.3) 1px, transparent 1.5px)',
            backgroundSize: '8px 8px',
          }}
          animate={{ backgroundPosition: ['0px 0px', '8px 8px'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      );
    default:
      return null;
  }
}

function SceneBackdrop({ scene, sceneKey }: { scene: Scene; sceneKey: string }) {
  return (
    <motion.div
      key={sceneKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="absolute inset-0"
    >
      {/* Base color */}
      <div className="absolute inset-0" style={{ background: scene.base }} />
      {/* Blob 1 */}
      <div className="absolute inset-0" style={{ background: scene.blob1 }} />
      {/* Blob 2 */}
      <div className="absolute inset-0" style={{ background: scene.blob2 }} />
      {/* Glow */}
      <div className="absolute inset-0" style={{ background: scene.glow }} />
      {/* Decoration */}
      <DecorationLayer kind={scene.decoration} />
      {/* Film grain — per-scene intensity */}
      {scene.grainAmount > 0 && (
        <div
          className="absolute inset-0 mix-blend-overlay pointer-events-none"
          style={{ opacity: scene.grainAmount }}
        >
          <LivingGrain />
        </div>
      )}
      {/* Darkening scrim — keeps text readable */}
      <div className="absolute inset-0" style={{ background: scene.scrim }} />
    </motion.div>
  );
}

/* Camera-feel effects — DISABLED per Pao 2026-04-27 (too much motion) */
function getCameraAnim(_effect?: Scene['cameraEffect']) {
  return {};
}

/* Text effects on the kinetic word — chromatic glitch, flicker, wave */
function getTextStyle(effect?: Scene['textEffect']): React.CSSProperties {
  switch (effect) {
    case 'glitch':
      return {
        textShadow:
          '1.5px 0 hsl(0 100% 55% / 0.7), -1.5px 0 hsl(190 100% 60% / 0.7), 0 1px hsl(45 100% 60% / 0.4)',
      };
    default:
      return {};
  }
}

function getTextAnim(_effect?: Scene['textEffect']) {
  /* Text motion (glitch wiggle, flicker, wave) DISABLED per Pao 2026-04-27 */
  return {};
}

function CreativeReveal({ index }: { index: number }) {
  const current = SHOWCASE[index];
  const total = SHOWCASE.length;
  const frameNum = String(index + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');
  const cameraAnim = getCameraAnim(current.scene.cameraEffect);
  const textAnim = getTextAnim(current.scene.textEffect);
  const textStyle = getTextStyle(current.scene.textEffect);

  return (
    <div className="relative aspect-[3/4] w-full max-w-[480px] mx-auto overflow-hidden">
      {/* ── Animated scene backdrop (color + blobs + decoration + grain) ── */}
      <AnimatePresence>
        <SceneBackdrop key={`scene-${index}`} scene={current.scene} sceneKey={String(index)} />
      </AnimatePresence>

      {/* ── Camera-feel wrapper (shake / zoom / drift per scene) ── */}
      <motion.div
        key={`cam-${index}`}
        className="absolute inset-0"
        {...cameraAnim}
      >

      {/* ── Composition guides (always visible) ── */}
      <svg viewBox="0 0 400 533" className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
        <rect x="20" y="20" width="360" height="493" stroke="hsl(40 18% 92% / 0.18)" strokeWidth="1" />
        <rect x="56" y="68" width="288" height="397" stroke="hsl(40 18% 92% / 0.1)" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="140" y1="20" x2="140" y2="513" stroke="hsl(40 18% 92% / 0.08)" strokeWidth="0.5" />
        <line x1="260" y1="20" x2="260" y2="513" stroke="hsl(40 18% 92% / 0.08)" strokeWidth="0.5" />
        <line x1="20" y1="184" x2="380" y2="184" stroke="hsl(40 18% 92% / 0.08)" strokeWidth="0.5" />
        <line x1="20" y1="349" x2="380" y2="349" stroke="hsl(40 18% 92% / 0.08)" strokeWidth="0.5" />
        <line x1="195" y1="266" x2="205" y2="266" stroke="hsl(40 18% 92% / 0.35)" strokeWidth="1" />
        <line x1="200" y1="261" x2="200" y2="271" stroke="hsl(40 18% 92% / 0.35)" strokeWidth="1" />
        {[
          'M28,40 L28,28 L40,28',
          'M360,28 L372,28 L372,40',
          'M28,493 L28,505 L40,505',
          'M360,505 L372,505 L372,493',
        ].map((d, i) => (
          <path key={i} d={d} stroke="hsl(40 18% 92% / 0.4)" strokeWidth="1" fill="none" />
        ))}
      </svg>

      {/* Mono header — frame index + REC indicator */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/40">
          FRM {frameNum} / {totalNum}
        </p>
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-oxblood"
          />
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/40">REC</p>
        </div>
      </div>

      {/* MOOD — top third */}
      <div className="absolute top-[14%] left-8 right-8">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/35 mb-1">
          MOOD
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`mood-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="font-mono text-xs tracking-[0.18em] uppercase text-bone/85"
          >
            {current.mood}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* KINETIC WORD — center · per-mood typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`word-${index}`}
            initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="text-center"
          >
            <motion.p
              className="text-bone"
              style={{
                fontFamily: current.scene.fontFamily,
                fontWeight: current.scene.fontWeight,
                fontStyle: current.scene.fontStyle,
                fontSize: current.scene.fontSize,
                letterSpacing: current.scene.letterSpacing,
                lineHeight: current.scene.lineHeight ?? 0.95,
                ...textStyle,
              }}
              {...textAnim}
            >
              {current.phrase}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        <motion.div
          key={`line-${index}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
          className="h-px w-16 bg-oxblood mt-5 origin-left"
        />
        {/* Teach line — small principle that educates */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`teach-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="font-mono text-[10px] tracking-[0.18em] uppercase text-bone/55 mt-4 text-center"
          >
            {current.teachLine}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ART DIRECTION — lower-mid */}
      <div className="absolute bottom-[26%] left-8 right-8">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/35 mb-1">
          ART DIR
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={`art-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
            className="font-mono text-[11px] tracking-wide text-bone/70 leading-snug"
          >
            {current.artDir}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* KPI + FORMAT — lower */}
      <div className="absolute bottom-[14%] left-8 right-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/35 mb-1">
              {current.kpiLabel}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`kpi-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                className="font-display text-xl text-oxblood tracking-tight"
              >
                {current.kpiValue}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/35 mb-1">
              FORMAT
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`fmt-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
                className="font-mono text-[11px] tracking-wide text-bone/70"
              >
                {current.format}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer — slate */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/40">
          UNDERCAT — BR
        </p>
        <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-bone/40">
          24 FPS · 16:9
        </p>
      </div>
      </motion.div>
    </div>
  );
}

export default function BriefingRoom() {
  const navigate = useNavigate();
  const { currentStep, totalSteps, clarityPercent, nextStep, prevStep, goToStep, resetBrief, finalizeBrief, brief } = useBrief();
  const [showGateway, setShowGateway] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Scene cycle drives BOTH the right-side reveal AND the subtle hero accent
  const [sceneIndex, setSceneIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSceneIndex(i => (i + 1) % SHOWCASE.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);
  const currentMood = SHOWCASE[sceneIndex].mood;
  const palette = MOOD_PALETTE[currentMood] ?? ['40 18% 92%', '40 18% 92%', '40 18% 92%'];
  const heroAccent = palette[0];


  useEffect(() => {
    trackEvent('page_view', { page: 'briefing-room' });
    // If brief already has data (returning user), skip gateway
    if (brief.mission || brief.audienceText || brief.channels.length > 0) {
      setShowGateway(false);
    }
  }, []);

  useEffect(() => {
    if (!showGateway) {
      trackEvent('briefing_room_phase', { phase: currentStep, label: phases[currentStep]?.label });
    }
  }, [currentStep, showGateway]);

  const handleGenerate = () => {
    trackEvent('generate_blueprint');
    finalizeBrief();
    navigate('/blueprint');
  };

  const handleStart = () => {
    resetBrief();
    setShowGateway(false);
    trackEvent('briefing_room_entry', { path: 'fresh' });
  };

  const handleReset = () => setShowResetConfirm(true);

  const confirmReset = () => {
    resetBrief();
    setShowResetConfirm(false);
    setShowGateway(true);
  };

  const PhaseComponent = phases[currentStep]?.component;
  const isLast = currentStep === totalSteps - 1;
  const clarityBlocks = Math.round((clarityPercent / 100) * 4);

  // === GATEWAY ===
  if (showGateway) {
    return (
      <section className="relative min-h-screen bg-ink text-bone overflow-hidden">
        {/* ── Google Fonts for per-mood typography in CreativeReveal ── */}
        <Helmet>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Anton&family=Special+Elite&family=Italiana&family=VT323&family=Cinzel:wght@400;600;700&family=Caveat:wght@400;700&family=Inter:wght@200;300;400&display=swap"
          />
        </Helmet>

        {/* Grain overlay */}
        <div className="absolute inset-0 mix-blend-overlay opacity-50 pointer-events-none">
          <LivingGrain />
        </div>

        {/* Subtle gradient scrim */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-ink/40 via-transparent to-ink" />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, hsl(0 0% 4% / 0.55) 100%)',
          }}
        />

        {/* Mood wash — soft scene-color bleed across the page (lively, not loud) */}
        <AnimatePresence>
          <motion.div
            key={`wash-${sceneIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 90% 80% at 82% 45%, hsl(${palette[0]} / 0.42) 0%, transparent 70%),
                radial-gradient(ellipse 70% 70% at 10% 28%, hsl(${palette[1]} / 0.34) 0%, transparent 65%),
                radial-gradient(ellipse 85% 60% at 35% 110%, hsl(${palette[2]} / 0.30) 0%, transparent 70%)
              `,
            }}
          />
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 min-h-screen px-6 md:px-20 py-24 flex items-center">
          <div className="max-w-[1400px] mx-auto w-full grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-center">

            {/* ── Left column — copy + CTA ── */}
            <div>
              {/* Meta label */}
              <MetaLabel className="mb-6 md:mb-10">
                Undercat Creatives — Briefing Room
              </MetaLabel>

              {/* Hero headline */}
              <DisplayHeadline
                lines={[
                  'Plan your',
                  <span
                    key="next"
                    className="italic"
                    style={{
                      color: `color-mix(in oklch, hsl(40 18% 92%) 75%, hsl(${heroAccent}) 25%)`,
                      transition: 'color 1s ease',
                    }}
                  >
                    next move.
                  </span>,
                ]}
                size="hero"
                startDelay={0.3}
                stagger={0.15}
                className="mb-8 md:mb-12"
              />

              {/* Hashtag strip — social caption feel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.95, ease: EASE }}
                className="flex flex-wrap gap-x-4 gap-y-1 mb-6 max-w-[480px]"
              >
                {['launch', 'brand', 'social', 'film', '2026'].map(tag => (
                  <span key={tag} className="font-mono text-[10px] tracking-[0.2em] text-bone/45 lowercase">
                    #{tag}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-bone/40 text-sm font-mono tracking-wide mb-10"
              >
                Takes about 3 minutes.
              </motion.p>

              {/* Value props — title + body description, BEFORE CTA */}
              <div className="space-y-7 mb-12 max-w-[480px]">
                {[
                  { num: '01', title: 'Clear scope', body: "Define what's in — and what's out — before we start." },
                  { num: '02', title: 'Relevant references', body: 'See our work that matches your brief as you build it.' },
                  { num: '03', title: 'Instant Blueprint', body: 'Get a production-ready brief you can download and share.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.num}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 1.2 + i * 0.12, ease: EASE }}
                    className="grid grid-cols-[auto_auto_1fr] gap-x-5 items-baseline group"
                  >
                    <span className="font-mono text-[11px] tracking-[0.32em] uppercase text-bone/45 shrink-0">
                      {item.num}
                    </span>
                    <span className="h-px w-8 bg-bone/20 group-hover:bg-oxblood transition-colors duration-500 self-center shrink-0" />
                    <div>
                      <h3 className="font-display italic text-2xl md:text-[26px] text-bone leading-none tracking-[-0.01em] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-bone/65 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.85, ease: EASE }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
                className="group inline-flex items-center gap-3 border border-bone/30 hover:border-oxblood hover:bg-oxblood/10 px-10 py-4 text-sm font-mono tracking-[0.22em] uppercase text-bone transition-colors"
              >
                Start your brief
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* LINE alt path */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.7 }}
                className="text-bone/35 text-xs mt-6 font-mono tracking-wide"
              >
                Or DM us on LINE — <a href="https://line.me/R/ti/p/@undercatcreatives" target="_blank" rel="noopener noreferrer" className="underline hover:text-bone/70 transition-colors">@undercatcreatives</a>
              </motion.p>


            </div>

            {/* ── Right column — kinetic creative reveal ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
              className="hidden md:flex items-center justify-center"
            >
              <CreativeReveal index={sceneIndex} />
            </motion.div>

          </div>
        </div>
      </section>
    );
  }

  // === PHASE VIEW (paper aesthetic — blank page, ink text) ===
  return (
    <section
      className="relative min-h-screen"
      style={{ backgroundColor: 'hsl(40 32% 95%)' }}
    >
      {/* Paper grain texture — multiply for warm fiber feel */}
      <div className="absolute inset-0 opacity-[0.22] mix-blend-multiply pointer-events-none">
        <LivingGrain />
      </div>
      {/* Subtle warm vignette — paper edge feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, hsl(35 25% 75% / 0.18) 100%)',
        }}
      />
      {/* Top + bottom margin rules — like a notebook */}
      <div className="absolute left-0 right-0 top-16 h-px bg-ink/[0.06] pointer-events-none" />
      <div className="absolute left-0 right-0 bottom-16 h-px bg-ink/[0.06] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-8 pt-24 md:pt-28 pb-20 text-ink">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-2">
                Briefing Room — Phase {String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
              </p>
              <h1 className="font-display italic text-3xl md:text-4xl text-ink leading-tight tracking-tight">
                {phases[currentStep]?.label}.
              </h1>
            </div>
            <button
              onClick={handleReset}
              className="text-ink/40 hover:text-ink transition-colors p-2"
              title="Start over"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Phase indicator blocks (clickable) */}
          <div className="flex gap-1.5 mb-4">
            {phases.map((phase, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`h-0.5 flex-1 transition-colors cursor-pointer hover:opacity-80 ${
                  i === currentStep ? 'bg-oxblood' : i < currentStep ? 'bg-ink/70' : 'bg-ink/15'
                }`}
                title={phase.label}
              />
            ))}
          </div>

          {/* Clarity blocks */}
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] text-ink/45 tracking-[0.22em] uppercase">Brief clarity</p>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 transition-colors ${
                    i < clarityBlocks ? 'bg-ink/85' : 'bg-ink/15'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="min-h-[400px]"
          >
            {PhaseComponent && <PhaseComponent />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16 pt-6 border-t border-ink/12">
          <button
            onClick={currentStep === 0 ? () => setShowGateway(true) : prevStep}
            className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink/55 hover:text-ink transition-colors flex items-center gap-2 px-2 py-2"
          >
            <ArrowLeft size={14} /> {currentStep === 0 ? 'Gateway' : 'Back'}
          </button>

          {isLast ? (
            <button
              onClick={handleGenerate}
              className="group inline-flex items-center gap-3 border border-ink/30 hover:border-oxblood hover:bg-oxblood/10 px-8 py-4 text-sm font-mono tracking-[0.22em] uppercase text-ink transition-colors"
            >
              View My Blueprint
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="group inline-flex items-center gap-3 border border-ink/30 hover:border-oxblood hover:bg-oxblood/10 px-8 py-4 text-sm font-mono tracking-[0.22em] uppercase text-ink transition-colors"
            >
              Continue
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

      </div>

      {/* Reset confirmation dialog — paper card on dim overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="border border-ink/15 p-8 max-w-sm w-full mx-4 text-ink"
              style={{ backgroundColor: 'hsl(40 32% 95%)' }}
            >
              <h3 className="font-display italic text-xl text-ink mb-3">Start over?</h3>
              <p className="text-sm text-ink/60 mb-6 leading-relaxed">This clears your brief. You'll go back to the gateway.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 border border-ink/20 hover:border-ink/40 px-4 py-3 text-xs font-mono tracking-[0.22em] uppercase text-ink/70 hover:text-ink transition-colors">
                  Cancel
                </button>
                <button onClick={confirmReset} className="flex-1 border border-oxblood bg-oxblood/10 hover:bg-oxblood/20 px-4 py-3 text-xs font-mono tracking-[0.22em] uppercase text-oxblood transition-colors">
                  Start over
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
