import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { cases } from '@/data/cases';
import { LivingGrain } from '@/components/effects';

/* ──────────────────────────────────────────────
   Exo Ape–ported skeleton for Undercat
   01 Intro → 02 Selected Work → 03 Studio → 04 Contact
   Motion grammar: masked line reveals, blur cursor,
   scroll-linked color breathing, pinned horizontal rail.
   ────────────────────────────────────────────── */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const hiRes = (url?: string) =>
  url?.includes('i.ytimg.com') && url.includes('hqdefault')
    ? url.replace('hqdefault', 'maxresdefault')
    : url;

/* ────────────────────────────────
   LineReveal — single motion verb
   Uses IntersectionObserver with a safety timer so nothing
   ever stays stuck at y:110% if the observer misfires.
   ──────────────────────────────── */
function LineReveal({
  children,
  delay = 0,
  duration = 1.1,
  once = true,
  asView = false,
  className = '',
  block = false,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  asView?: boolean;
  className?: string;
  /**
   * Render as <div>/<motion.div> instead of <span>/<motion.span>.
   * Use when wrapping block-level children (divs, p, etc). Prevents
   * invalid HTML nesting (div-inside-span) that breaks layout.
   */
  block?: boolean;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(!asView);

  useEffect(() => {
    if (!asView || revealed) return;
    const el = wrapRef.current;
    if (!el) return;

    // Safety fallback — guarantee reveal even if observer misses.
    const safetyTimer = window.setTimeout(() => setRevealed(true), 1500);

    // Immediate reveal if already on-screen at mount.
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      setRevealed(true);
      window.clearTimeout(safetyTimer);
      return () => {};
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -5% 0px' }
    );
    io.observe(el);

    return () => {
      window.clearTimeout(safetyTimer);
      io.disconnect();
    };
  }, [asView, once, revealed]);

  if (block) {
    return (
      <div
        ref={wrapRef as React.RefObject<HTMLDivElement>}
        className={`overflow-hidden ${className}`}
      >
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: revealed ? '0%' : '110%' }}
          transition={{ duration, delay, ease: EASE }}
          className="will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <span
      ref={wrapRef as React.RefObject<HTMLSpanElement>}
      className={`inline-block overflow-hidden align-bottom ${className}`}
    >
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: revealed ? '0%' : '110%' }}
        transition={{ duration, delay, ease: EASE }}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ────────────────────────────────
   Blur cursor
   ──────────────────────────────── */
function BlurCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden md:block will-change-transform"
    >
      <div
        className="w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: 'hsla(0, 0%, 100%, 0.04)',
          border: '1px solid hsla(40, 18%, 92%, 0.15)',
        }}
      />
      <div className="absolute top-0 left-0 w-1 h-1 rounded-full bg-oxblood -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

/* ────────────────────────────────
   Scroll progress hairline
   ──────────────────────────────── */
function ScrollProgress({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useSpring(progress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[1px] bg-bone/40 z-[150]"
    />
  );
}

/* ────────────────────────────────
   Chapter label
   ──────────────────────────────── */
function Chapter({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-bone/55">
      <span className="font-mono">{index}</span>
      <span className="w-6 h-[1px] bg-bone/30" />
      <span>{label}</span>
    </div>
  );
}

/* ────────────────────────────────
   Preloader — 350ms ceremony
   Uses requestAnimationFrame so we only hold the veil long
   enough for first paint — no dead air.
   ──────────────────────────────── */
function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    let cancelled = false;
    const fire = () => {
      if (!cancelled) onDone();
    };
    const raf = requestAnimationFrame(() => {
      const t = window.setTimeout(fire, 350);
      // cleanup bound to outer scope via closure below
      (fire as any)._t = t;
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if ((fire as any)._t) clearTimeout((fire as any)._t);
    };
  }, [onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-[300] bg-ink flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="w-2 h-2 rounded-full bg-bone"
      />
    </motion.div>
  );
}

/* ────────────────────────────────
   Rail layout — absolute asymmetric tiles
   ──────────────────────────────── */
type RailItem = {
  caseId: string;
  left: string;
  top: string;
  width: string;
  height: string;
};

const railIds = [
  'audi-launch-films',
  'greenline-golf-lab',
  'ducati-xdiavel-nera',
  'audi-cleanup-mission',
  'audi-benzilla',
  'rajadamnern-world-series',
  'lkp-corporate-film',
  'fc-bayern-bangkok',
];

const railLayout: RailItem[] = [
  // Act I — opener & first counterpoint
  { caseId: railIds[0], left: '8vw',   top: '18%', width: '34vw', height: '54vh' },
  { caseId: railIds[1], left: '46vw',  top: '48%', width: '22vw', height: '34vh' },
  // ↓ Interlude panel lives in the 68–104vw gap ↓
  // Act II — core reel (alternating top/bottom rows)
  { caseId: railIds[2], left: '104vw', top: '12%', width: '30vw', height: '46vh' },
  { caseId: railIds[3], left: '138vw', top: '50%', width: '26vw', height: '38vh' },
  { caseId: railIds[4], left: '168vw', top: '14%', width: '32vw', height: '50vh' },
  { caseId: railIds[5], left: '204vw', top: '52%', width: '24vw', height: '36vh' },
  { caseId: railIds[6], left: '232vw', top: '18%', width: '28vw', height: '44vh' },
  { caseId: railIds[7], left: '264vw', top: '50%', width: '22vw', height: '34vh' },
  // ↓ Closing panel lives past 286vw ↓
];

const RAIL_TRAVEL_VW = 220;

/* ────────────────────────────────
   Live GMT+7 clock — editorial detail
   ──────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setTime(
        `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

/* ────────────────────────────────
   Mouse parallax hook — smoothed motion values
   ──────────────────────────────── */
function useMouseParallax(range = 8) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 20, mass: 1 });
  const y = useSpring(my, { stiffness: 40, damping: 20, mass: 1 });
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(nx * range);
      my.set(ny * range);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [range, mx, my]);
  return { x, y };
}

/* ────────────────────────────────
   Main
   ──────────────────────────────── */
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pageP } = useScroll({ target: pageRef });
  const smoothProgress = useSpring(pageP, { stiffness: 140, damping: 32, mass: 0.4 });

  // Mouse parallax for hero (smoothed motion values)
  const { x: heroMouseX, y: heroMouseY } = useMouseParallax(10);
  // Counter-parallax for headline (text moves opposite to video, quieter)
  const headlineX = useTransform(heroMouseX, (v) => v * -0.15);
  const headlineY = useTransform(heroMouseY, (v) => v * -0.15);
  const subtitleX = useTransform(heroMouseX, (v) => v * -0.08);

  // Studio section — parallax on ghosted numeral
  const studioRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: studioP } = useScroll({
    target: studioRef,
    offset: ['start end', 'end start'],
  });
  const studioNumeralY = useTransform(studioP, [0, 1], ['15%', '-15%']);

  // Contact section — parallax on ghosted numeral
  const contactRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: contactP } = useScroll({
    target: contactRef,
    offset: ['start end', 'end start'],
  });
  const contactNumeralY = useTransform(contactP, [0, 1], ['-15%', '15%']);

  const pageBg = useTransform(
    pageP,
    [0, 0.2, 0.5, 0.8, 1],
    ['hsl(0 0% 6%)', 'hsl(0 0% 7%)', 'hsl(15 8% 9%)', 'hsl(12 10% 8%)', 'hsl(0 0% 6%)']
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroVideoY = useTransform(heroP, [0, 1], ['0%', '22%']);
  const heroContentY = useTransform(heroP, [0, 1], ['0%', '-10%']);
  const heroOpacity = useTransform(heroP, [0, 0.8], [1, 0]);

  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: railP } = useScroll({
    target: railRef,
    offset: ['start start', 'end end'],
  });
  const railSmoothP = useSpring(railP, { stiffness: 120, damping: 30, mass: 0.5 });
  const railX = useTransform(railSmoothP, [0, 1], ['0vw', `-${RAIL_TRAVEL_VW}vw`]);
  const railProgressScale = useTransform(railSmoothP, [0, 1], [0, 1]);

  // Live counter 01 → 08 based on rail progress
  const [railIndex, setRailIndex] = useState(1);
  useMotionValueEvent(railSmoothP, 'change', (v) => {
    const i = Math.min(railLayout.length, Math.max(1, Math.ceil(v * railLayout.length)));
    setRailIndex(i);
  });

  // Active tile — derived from railIndex
  const activeRailItem = railLayout[Math.min(railIndex - 1, railLayout.length - 1)];
  const activeCase = cases.find((c) => c.id === activeRailItem.caseId);

  // Drag hint visibility — fades out after 5% scroll into rail
  const dragHintOpacity = useTransform(railSmoothP, [0, 0.04, 0.08], [1, 1, 0]);

  const hero = cases.find(c => c.id === 'audi-launch-films') ?? cases[0];
  const heroVideoId = hero.videoIds?.[0] ?? 'Obl9-pHXK94';

  return (
    <>
      <Helmet>
        <title>Undercat Creatives — Brand films, social, direction · Bangkok</title>
        <meta
          name="description"
          content="A small Bangkok studio that owns the whole thing — brief to final cut. Brand films, social content, creative direction for brands that treat image as a business decision. Worked with Audi Thailand, Greenline Golf, Ducati, FC Bayern."
        />
        <meta property="og:title" content="Undercat Creatives — Content with direction. Production with taste." />
        <meta property="og:description" content="A small Bangkok studio for founders who treat image as part of the product, not the wrapper around it." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.undercatcreatives.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Undercat Creatives" />
        <meta name="twitter:description" content="Content with direction. Production with taste." />
        <link rel="canonical" href="https://www.undercatcreatives.com/" />
      </Helmet>
      <AnimatePresence>
        {loading && <Preloader onDone={() => setLoading(false)} />}
      </AnimatePresence>

      <BlurCursor />
      <ScrollProgress progress={pageP} />

      <motion.div
        ref={pageRef}
        style={{ backgroundColor: pageBg }}
        className="relative text-bone"
      >
        {/* Fixed top bar — scroll reactive */}
        <motion.div
          animate={{
            paddingTop: scrolled ? 14 : 26,
            paddingBottom: scrolled ? 14 : 26,
            backgroundColor: scrolled ? 'hsla(0, 0%, 5%, 0.72)' : 'hsla(0, 0%, 5%, 0)',
            backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.5, ease: EASE }}
          className="fixed top-0 left-0 right-0 z-[120] px-6 md:px-20 flex items-center justify-between pointer-events-none border-b"
          style={{ borderColor: scrolled ? 'hsla(40, 18%, 92%, 0.08)' : 'transparent' }}
        >
          {/* Scroll progress hairline — fills underneath the bar */}
          <motion.div
            style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
            className="absolute left-0 right-0 bottom-0 h-[1px] bg-oxblood/60 pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="pointer-events-auto"
          >
            <Link to="/" className="flex items-center gap-3 group">
              {/* Breathing REEL indicator — slowed to a calmer 4s cycle
                  so it reads as "pulse" not "alarm". A long pause at peak
                  makes it feel intentional rather than nervy. */}
              <div className="relative flex items-center" aria-hidden>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.18, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 1] }}
                  className="w-1.5 h-1.5 rounded-full bg-oxblood"
                />
                <motion.div
                  animate={{ scale: [1, 2.1, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', times: [0, 0.45, 1] }}
                  className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-oxblood"
                />
              </div>
              <span className="text-[11px] tracking-[0.28em] uppercase text-bone/85 group-hover:text-bone transition-colors duration-500">
                Undercat <span className="text-bone/50 group-hover:text-bone/80 transition-colors duration-500">Creatives</span>
              </span>
            </Link>
          </motion.div>

          {/* Center nav — page-level numbering removed to avoid clash
              with chapter indices (01-04) on the page itself.
              Order reflects the real funnel: Work (cold) → Industries
              (warm specialty) → Briefing Room (intent) → Contact (Pao). */}
          <nav
            className="pointer-events-auto hidden md:flex items-center gap-0 text-[10px] tracking-[0.24em] uppercase font-mono"
            aria-label="Primary"
          >
            {[
              { to: '/work', label: 'Work' },
              {
                to: '/golf',
                label: 'Industries',
                children: [
                  { to: '/golf', label: 'Golf' },
                  { to: '/drone', label: 'Drone' },
                ],
              },
              { to: '/briefing-room', label: 'Briefing Room' },
              { to: '/credentials', label: 'Credentials' },
              { to: '/contact', label: 'Contact' },
            ].map((item, i) => (
              <NavLink key={item.to} item={item} index={i} />
            ))}
          </nav>

          {/* Invisible mirror to balance center nav — desktop only */}
          <div aria-hidden className="hidden md:flex items-center gap-3 opacity-0 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full" />
            <span className="text-[11px] tracking-[0.28em] uppercase">Undercat Creatives</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            className="pointer-events-auto md:hidden flex flex-col gap-[5px] p-2 group"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: mobileNavOpen ? 45 : 0, y: mobileNavOpen ? 8 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="block w-5 h-[1px] bg-bone/70 origin-center"
            />
            <motion.span
              animate={{ opacity: mobileNavOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="block w-5 h-[1px] bg-bone/70"
            />
            <motion.span
              animate={{ rotate: mobileNavOpen ? -45 : 0, y: mobileNavOpen ? -8 : 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="block w-5 h-[1px] bg-bone/70 origin-center"
            />
          </button>
        </motion.div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed inset-0 z-[110] bg-ink/97 backdrop-blur-md flex flex-col pt-24 pb-10 px-8 md:hidden"
            >
              <nav className="flex flex-col gap-1 mt-4" aria-label="Mobile">
                {[
                  { to: '/work', label: 'Work' },
                  { to: '/golf', label: 'Golf' },
                  { to: '/drone', label: 'Drone' },
                  { to: '/briefing-room', label: 'Briefing Room' },
                  { to: '/credentials', label: 'Credentials' },
                  { to: '/contact', label: 'Contact' },
                ].map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileNavOpen(false)}
                      className="block py-4 border-b border-bone/10 font-serif text-bone/80 hover:text-bone transition-colors"
                      style={{ fontSize: 'clamp(22px, 5vw, 32px)' }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto text-[10px] tracking-[0.28em] uppercase text-bone/30 font-mono">
                tanut.tc9336@gmail.com
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════
            01 — INTRO
            ══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-[138vh] overflow-hidden">
          {/* Video layer — scroll parallax + mouse parallax */}
          <motion.div
            style={{ y: heroVideoY }}
            className="absolute inset-0 -top-[12vh] -bottom-[12vh]"
          >
            <motion.div
              style={{ x: heroMouseX, y: heroMouseY }}
              className="absolute inset-0 will-change-transform"
            >
              <iframe
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(177.77vh+40px)] h-[calc(56.25vw+40px)] min-w-[calc(100%+40px)] min-h-[calc(100%+40px)] pointer-events-none"
                src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1`}
                allow="autoplay; encrypted-media"
                title="Hero reel"
              />
            </motion.div>
            {/* Scrim layers */}
            <div className="absolute inset-0 bg-ink/62" />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-transparent to-ink" />
            {/* Stronger corner vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 35%, hsl(0 0% 4% / 0.6) 100%)',
              }}
            />
          </motion.div>

          {/* Dual grain layers */}
          <div className="absolute inset-0 mix-blend-overlay opacity-65 pointer-events-none">
            <LivingGrain />
          </div>
          <div className="absolute inset-0 mix-blend-soft-light opacity-40 pointer-events-none">
            <LivingGrain />
          </div>

          {/* Left vertical stamp — Exo Ape signature with draw-in hairline */}
          <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 z-10 hidden md:block">
            <div
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              className="flex items-center gap-5 text-[10px] tracking-[0.34em] uppercase text-bone/55 font-mono"
            >
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.35, ease: EASE }}
              >
                Featured reel
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.55, ease: EASE }}
                style={{ display: 'inline-block', transformOrigin: 'left' }}
                className="h-[1px] w-10 bg-bone/35"
              />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.75, ease: EASE }}
              >
                Audi Thailand — Launch Film
              </motion.span>
            </div>
          </div>

          {/* Content — sticky with mouse parallax offset on text */}
          <motion.div
            style={{ y: heroContentY, opacity: heroOpacity }}
            className="sticky top-0 h-screen flex flex-col justify-between px-6 md:px-20 py-28 md:py-32"
          >
            {/* Top row — chapter + side marker */}
            <div className="pt-6 flex items-center justify-between">
              <LineReveal delay={1.1}>
                <Chapter index="01" label="Intro" />
              </LineReveal>
              <LineReveal delay={1.1}>
                <div className="hidden md:flex items-center gap-4 text-[10px] tracking-[0.28em] uppercase text-bone/45 font-mono">
                  <span>Reel 2026</span>
                  <span className="h-3 w-[1px] bg-bone/20" />
                  <span className="text-bone/30">v.01</span>
                </div>
              </LineReveal>
            </div>

            {/* Center — headline with subtle mouse parallax */}
            <motion.div
              style={{ x: headlineX, y: headlineY }}
              className="max-w-[1500px]"
            >
              <h1
                className="font-serif text-bone leading-[0.86] tracking-[-0.028em]"
                style={{ fontSize: 'clamp(44px, 10vw, 184px)' }}
              >
                <div>
                  <LineReveal delay={0.25} duration={1.15}>
                    Content with direction.
                  </LineReveal>
                </div>
                <div>
                  <LineReveal delay={0.45} duration={1.2}>
                    Production with{' '}
                    <span className="italic font-light text-bone/85">taste.</span>
                  </LineReveal>
                </div>
              </h1>
            </motion.div>

            {/* Bottom — subtitle left, metadata right */}
            <div className="flex items-end justify-between gap-10">
              {/* Left: scroll indicator + subtitle */}
              <div className="flex items-end gap-10 md:gap-16">
                <div className="flex flex-col items-start gap-5">
                  <div className="flex items-center gap-3">
                    <LineReveal delay={1.15}>
                      <span className="text-[11px] tracking-[0.24em] uppercase text-bone/65">
                        Scroll
                      </span>
                    </LineReveal>
                    <LineReveal delay={1.2}>
                      <span className="text-[10px] tracking-[0.22em] uppercase text-bone/35 font-mono tabular-nums">
                        01 / 04
                      </span>
                    </LineReveal>
                  </div>
                  {/* Breathing hairline — slower, gentler */}
                  <motion.div
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 1.4, ease: EASE }}
                    className="h-12 w-[1px] bg-bone/25 origin-top relative overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        y: ['-100%', '100%'],
                        opacity: [0, 1, 1, 0],
                      }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2.5,
                        times: [0, 0.2, 0.8, 1],
                      }}
                      className="absolute inset-0 bg-bone"
                    />
                  </motion.div>
                </div>

                <motion.div
                  style={{ x: subtitleX }}
                  className="max-w-xs hidden md:block pb-1"
                >
                  <LineReveal delay={0.95}>
                    <p className="text-bone/70 text-sm tracking-wide leading-[1.75]">
                      A small Bangkok studio for founders who treat image as part
                      of the product, not the wrapper around it.
                    </p>
                  </LineReveal>
                </motion.div>
              </div>

              {/* Right: now playing + title */}
              <div className="text-right pb-1">
                <div className="flex items-center justify-end gap-2 mb-1.5">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-1 h-1 rounded-full bg-oxblood"
                  />
                  <LineReveal delay={1.15}>
                    <div className="text-[10px] tracking-[0.28em] uppercase text-bone/50 font-mono">
                      Now playing
                    </div>
                  </LineReveal>
                </div>
                <LineReveal delay={1.25} block>
                  <div className="text-[11px] tracking-[0.22em] uppercase text-bone/80 font-mono">
                    Audi S6 Avant — Launch Film
                  </div>
                </LineReveal>
                <LineReveal delay={1.35} block>
                  <div className="text-[10px] tracking-[0.22em] uppercase text-bone/30 font-mono mt-1">
                    Automotive · 2024
                  </div>
                </LineReveal>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════════════════════════════════
            02 — SELECTED WORK (pinned rail)
            ══════════════════════════════════════════ */}
        <section
          ref={railRef}
          className="relative"
          style={{ height: `${RAIL_TRAVEL_VW * 1.3}vh` }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Top UI — chapter + live active tile + counter */}
            <div className="absolute top-24 left-6 md:left-20 right-6 md:right-20 z-10 flex items-start justify-between gap-10">
              <LineReveal asView>
                <Chapter index="02" label="Selected work" />
              </LineReveal>

              {/* Live active title display */}
              <div className="text-right min-w-0 flex-1 max-w-md">
                <LineReveal asView>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono mb-2">
                    Now viewing
                  </div>
                </LineReveal>
                <div className="relative h-6 overflow-hidden">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={activeCase?.id}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="absolute inset-0 flex items-center justify-end"
                    >
                      <span
                        className="font-serif text-bone truncate"
                        style={{ fontSize: 'clamp(14px, 1.15vw, 18px)' }}
                      >
                        {activeCase?.title}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="relative h-4 overflow-hidden mt-1">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={`${activeCase?.id}-meta`}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
                      className="absolute inset-0 flex items-center justify-end"
                    >
                      <span className="text-[10px] tracking-[0.24em] uppercase text-bone/45 font-mono tabular-nums">
                        {String(railIndex).padStart(2, '0')}
                        <span className="text-bone/25">
                          {' '}
                          / {String(railLayout.length).padStart(2, '0')}
                        </span>
                        <span className="text-bone/25"> · </span>
                        {activeCase?.industry}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Velocity hairlines — horizontal scroll signifiers */}
            <motion.div
              style={{ opacity: dragHintOpacity }}
              className="absolute top-[42%] left-0 right-0 h-[1px] bg-bone/5 z-[1] pointer-events-none"
            />
            <motion.div
              style={{ opacity: dragHintOpacity }}
              className="absolute top-[58%] left-0 right-0 h-[1px] bg-bone/5 z-[1] pointer-events-none"
            />

            {/* Drag hint — fades out after first scroll */}
            <motion.div
              style={{ opacity: dragHintOpacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <motion.div
                animate={{ x: [-6, 6, -6] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-3 text-[10px] tracking-[0.32em] uppercase text-bone/40 font-mono backdrop-blur-sm bg-ink/20 px-4 py-2 rounded-full"
              >
                <span>←</span>
                <span>Scroll to advance</span>
                <span>→</span>
              </motion.div>
            </motion.div>

            {/* Rail strip */}
            <motion.div
              style={{ x: railX }}
              className="absolute top-0 left-0 h-full flex items-center will-change-transform"
            >
              <div className="relative h-full" style={{ width: '320vw' }}>
                {railLayout.map((item, i) => {
                  const c = cases.find(x => x.id === item.caseId);
                  if (!c) return null;
                  return <RailTile key={c.id} item={item} caseData={c} index={i} />;
                })}

                {/* Typographic panel — lives in the dedicated gap between tiles 2-3 */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: '70vw', width: '30vw' }}
                >
                  {/* Interlude marker */}
                  <LineReveal asView block>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40 font-mono tabular-nums">
                        02.5
                      </span>
                      <span className="h-[1px] w-10 bg-bone/25" />
                      <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40 font-mono">
                        Interlude
                      </span>
                    </div>
                  </LineReveal>

                  <div
                    className="font-serif text-bone leading-[0.9] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(32px, 4.4vw, 72px)' }}
                  >
                    <div>
                      <LineReveal asView delay={0.1}>Every piece,</LineReveal>
                    </div>
                    <div>
                      <LineReveal asView delay={0.2}>
                        <span className="italic font-light text-bone/70">on purpose.</span>
                      </LineReveal>
                    </div>
                  </div>
                  <LineReveal asView delay={0.3} block>
                    <div className="mt-8 text-bone/50 text-sm leading-[1.7] tracking-wide">
                      A sampling, not the full shelf. Every frame above
                      was decided before anyone hit record.
                    </div>
                  </LineReveal>
                </div>

                {/* Closing panel — end of rail */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: '290vw', width: '28vw' }}
                >
                  <LineReveal asView block>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40 font-mono tabular-nums">
                        02.F
                      </span>
                      <span className="h-[1px] w-10 bg-bone/25" />
                      <span className="text-[10px] tracking-[0.32em] uppercase text-bone/40 font-mono">
                        End of reel
                      </span>
                    </div>
                  </LineReveal>
                  <div
                    className="font-serif text-bone leading-[0.9] tracking-[-0.02em] pointer-events-none"
                    style={{ fontSize: 'clamp(32px, 4.4vw, 72px)' }}
                  >
                    <div>
                      <LineReveal asView delay={0.1}>See the</LineReveal>
                    </div>
                    <div>
                      <LineReveal asView delay={0.2}>
                        <span className="italic font-light text-bone/70">full shelf.</span>
                      </LineReveal>
                    </div>
                  </div>
                  <LineReveal asView delay={0.35}>
                    <Link
                      to="/work"
                      className="group mt-10 inline-flex items-center gap-4 text-[11px] tracking-[0.24em] uppercase text-bone/75 hover:text-oxblood transition-colors"
                    >
                      <span className="border-b border-bone/30 group-hover:border-oxblood pb-1 transition-colors">
                        View full reel
                      </span>
                      <motion.span
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-block"
                      >
                        →
                      </motion.span>
                    </Link>
                  </LineReveal>
                </div>
              </div>
            </motion.div>

            {/* Bottom UI — location + progress bar */}
            <div className="absolute bottom-10 left-6 md:left-20 right-6 md:right-20 z-10">
              <div className="flex items-end justify-between mb-4">
                <LineReveal asView>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono">
                    Bangkok — Ongoing
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.05}>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono">
                    Scroll to advance →
                  </div>
                </LineReveal>
              </div>
              {/* Progress hairline */}
              <div className="relative h-[1px] w-full bg-bone/10">
                <motion.div
                  style={{ scaleX: railProgressScale, transformOrigin: '0% 50%' }}
                  className="absolute inset-0 bg-bone/60"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            03 — STUDIO
            ══════════════════════════════════════════ */}
        <section
          ref={studioRef}
          className="relative px-6 md:px-20 pt-20 md:pt-24 pb-32 md:pb-40 overflow-hidden"
        >
          {/* Ghosted numeral watermark — parallax drift */}
          <motion.div
            aria-hidden
            style={{ y: studioNumeralY }}
            className="absolute -right-[5vw] -bottom-[10vh] font-serif text-bone/[0.028] leading-none pointer-events-none select-none will-change-transform"
          >
            <span style={{ fontSize: 'clamp(180px, 34vw, 520px)' }}>03</span>
          </motion.div>

          {/* Faint left-edge oxblood hairline */}
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-oxblood/20 to-transparent pointer-events-none hidden md:block" />

          <div className="max-w-[1600px] mx-auto w-full relative z-10">
            {/* Top labels row */}
            <div className="mb-6 flex items-center justify-between gap-10">
              <LineReveal asView>
                <Chapter index="03" label="Studio" />
              </LineReveal>
              <div className="hidden md:flex items-center gap-4">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                  style={{ display: 'inline-block', transformOrigin: 'right' }}
                  className="h-[1px] w-16 bg-bone/25"
                />
                <LineReveal asView delay={0.15}>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/45 font-mono">
                    On the work
                  </div>
                </LineReveal>
              </div>
            </div>

            {/* Chapter intro micro copy + hairline */}
            <div className="mb-10 md:mb-14 flex items-center gap-4">
              <LineReveal asView delay={0.1}>
                <div className="text-[10px] tracking-[0.28em] uppercase text-bone/30 font-mono">
                  — A note from the studio
                </div>
              </LineReveal>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
                style={{ display: 'inline-block', transformOrigin: 'left' }}
                className="h-[1px] flex-1 bg-bone/10 max-w-[400px]"
              />
            </div>

            {/* Headline */}
            <h2
              className="font-serif text-bone leading-[0.94] tracking-[-0.02em] max-w-[1500px]"
              style={{ fontSize: 'clamp(36px, 6.8vw, 124px)' }}
            >
              <div>
                <LineReveal asView>Gear and software</LineReveal>
              </div>
              <div>
                <LineReveal asView delay={0.1}>are only tools</LineReveal>
              </div>
              <div>
                <LineReveal asView delay={0.2}>
                  of{' '}
                  <span className="italic font-light text-bone/85">expression.</span>
                </LineReveal>
              </div>
            </h2>

            {/* Body row */}
            <div className="mt-20 md:mt-28 grid md:grid-cols-12 gap-10">
              <div className="md:col-span-7 md:col-start-2">
                <LineReveal asView delay={0.35}>
                  <p
                    className="text-bone/80 leading-[1.7] tracking-wide"
                    style={{ fontSize: 'clamp(18px, 1.5vw, 26px)' }}
                  >
                    What sets our work apart is{' '}
                    <span className="italic text-bone/95">direction</span> — and
                    the small team behind every frame. A Bangkok studio that owns
                    the whole thing,{' '}
                    <span className="italic text-bone/95">brief to final cut</span>
                    , for brands that treat image as a{' '}
                    <span className="italic text-bone/95">business decision</span>
                    , not a finishing touch.
                  </p>
                </LineReveal>

                <LineReveal asView delay={0.55}>
                  <Link
                    to="/credentials"
                    className="group mt-10 inline-flex items-center gap-4 text-[11px] tracking-[0.24em] uppercase text-bone/80 hover:text-oxblood transition-colors"
                  >
                    <span className="border-b border-bone/40 group-hover:border-oxblood pb-1 transition-colors">
                      Read our approach
                    </span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </Link>
                </LineReveal>
              </div>
            </div>

            {/* Discipline grid — 3 cols with ghosted numerals */}
            <div className="mt-24 md:mt-32 pt-10 border-t border-bone/10 grid md:grid-cols-12 gap-10">
              <div className="md:col-span-2">
                <LineReveal asView delay={0.2} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono">
                    What we do
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.3} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/25 font-mono mt-2">
                    — Three disciplines,
                    <br />
                    one hand
                  </div>
                </LineReveal>
              </div>
              <div className="md:col-span-10 grid md:grid-cols-3 md:gap-0 gap-12">
                {[
                  {
                    i: '01',
                    label: 'Direction',
                    body: 'Brief to boards. The thinking before anyone touches a camera — the reason every frame exists.',
                  },
                  {
                    i: '02',
                    label: 'Production',
                    body: 'Small crew, full ownership. We shoot our own work, with the people who wrote the brief in the room.',
                  },
                  {
                    i: '03',
                    label: 'Post',
                    body: 'Edit, grade, sound. Finishing decisions that protect the first decision — restraint over polish.',
                  },
                ].map((d, i) => (
                  <DisciplineCard key={d.label} d={d} index={i} isLast={i === 2} />
                ))}
              </div>
            </div>

            {/* Editorial signature */}
            <div className="mt-20 pt-10 border-t border-bone/10 grid md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-6">
                <LineReveal asView block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono mb-2">
                    — Studio note
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.08} block>
                  <div
                    className="font-serif text-bone/80 italic leading-tight"
                    style={{ fontSize: 'clamp(16px, 1.4vw, 22px)' }}
                  >
                    Founder · Creative Director
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.15} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono mt-1">
                    Undercat Creatives · Bangkok
                  </div>
                </LineReveal>
              </div>
              <div className="md:col-span-6 md:text-right">
                <LineReveal asView delay={0.1} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono">
                    Small studio · full ownership · since 2568
                  </div>
                </LineReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            04 — CONTACT
            ══════════════════════════════════════════ */}
        <section ref={contactRef} className="relative min-h-screen flex flex-col justify-between px-6 md:px-20 py-32 overflow-hidden">
          {/* Ghosted numeral watermark — scroll-linked parallax drift */}
          <motion.div
            aria-hidden
            style={{ y: contactNumeralY }}
            className="absolute -left-[5vw] -top-[10vh] font-serif text-bone/[0.028] leading-none pointer-events-none select-none will-change-transform"
          >
            <span style={{ fontSize: 'clamp(180px, 34vw, 520px)' }}>04</span>
          </motion.div>

          {/* Faint right-edge oxblood hairline */}
          <div className="absolute right-0 top-[18%] bottom-[18%] w-[1px] bg-gradient-to-b from-transparent via-oxblood/20 to-transparent pointer-events-none hidden md:block" />

          <div className="max-w-[1600px] mx-auto w-full relative z-10">
            {/* Top labels */}
            <div className="mb-16 flex items-center justify-between">
              <LineReveal asView>
                <Chapter index="04" label="Contact" />
              </LineReveal>
              <div className="flex items-center gap-4">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1, ease: EASE }}
                  style={{ transformOrigin: 'right', display: 'inline-block' }}
                  className="h-[1px] w-12 bg-bone/20 hidden md:inline-block"
                />
                <LineReveal asView delay={0.05}>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono hidden md:block">
                    — Talk to us
                  </div>
                </LineReveal>
              </div>
            </div>

            {/* Lead-in with italic emphasis */}
            <div className="mb-10 md:mb-14 max-w-2xl">
              <LineReveal asView>
                <p
                  className="text-bone/65 leading-[1.7] tracking-wide"
                  style={{ fontSize: 'clamp(15px, 1.15vw, 18px)' }}
                >
                  Every brief lands with the{' '}
                  <span className="italic text-bone/90">people making the film</span>. No
                  account layer, no relay race.
                </p>
              </LineReveal>
            </div>

            {/* Headline */}
            <h2
              className="font-serif text-bone leading-[0.88] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(48px, 11.5vw, 208px)' }}
            >
              <div>
                <LineReveal asView>Let's make</LineReveal>
              </div>
              <div>
                <LineReveal asView delay={0.1}>something</LineReveal>
              </div>
              <div>
                <LineReveal asView delay={0.2}>
                  <span className="italic font-light text-bone/85">directed.</span>
                </LineReveal>
              </div>
            </h2>

            {/* Availability indicator — breathing pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="mt-16 md:mt-20 inline-flex items-center gap-3 px-4 py-2 border border-bone/15 rounded-full"
            >
              <div className="relative flex items-center">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-2 h-2 rounded-full bg-oxblood"
                />
                <motion.div
                  animate={{ scale: [1, 2.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 w-2 h-2 rounded-full bg-oxblood"
                />
              </div>
              <div className="text-[10px] tracking-[0.28em] uppercase text-bone/75 font-mono">
                Now booking <span className="text-bone/50">·</span> Q3 2026 onwards
              </div>
            </motion.div>

            {/* Email row */}
            <div className="mt-12 md:mt-16 border-t border-bone/10 pt-10">
              <div className="flex items-center gap-3 mb-5">
                <LineReveal asView>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/40 font-mono">
                    Write to us
                  </div>
                </LineReveal>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
                  style={{ transformOrigin: 'left', display: 'inline-block' }}
                  className="h-[1px] w-16 bg-bone/20"
                />
                <LineReveal asView delay={0.2}>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/30 font-mono">
                    One reply from the founder, usually same day
                  </div>
                </LineReveal>
              </div>
              <LineReveal asView delay={0.08}>
                <a
                  href="mailto:tanut.tc9336@gmail.com"
                  className="group inline-flex items-baseline gap-4 md:gap-6 font-serif text-bone hover:text-oxblood transition-colors duration-500"
                  style={{ fontSize: 'clamp(26px, 3.6vw, 60px)' }}
                >
                  <span>tanut.tc9336@gmail.com</span>
                  <motion.span
                    className="inline-block text-bone/40 group-hover:text-oxblood"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    →
                  </motion.span>
                </a>
              </LineReveal>
            </div>

            {/* 3-col meta grid */}
            <div className="mt-20 md:mt-28 pt-10 border-t border-bone/10 grid md:grid-cols-12 gap-10">
              {/* Studio */}
              <div className="md:col-span-4">
                <LineReveal asView block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono mb-4">
                    Studio
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.08} block>
                  <div className="text-bone/70 text-sm leading-[1.85] tracking-wide">
                    Undercat Creatives Co., Ltd.
                    <br />
                    Bangkok, Thailand
                    <br />
                    <span className="text-bone/45">GMT+7 · Daylight to late</span>
                  </div>
                </LineReveal>
              </div>

              {/* Reach */}
              <div className="md:col-span-4">
                <LineReveal asView delay={0.05} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono mb-4">
                    Reach
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.13} block>
                  <div className="flex flex-col gap-2 text-bone/70 text-sm leading-[1.85] tracking-wide">
                    <a
                      href="mailto:tanut.tc9336@gmail.com"
                      className="hover:text-bone transition-colors"
                    >
                      tanut.tc9336@gmail.com
                    </a>
                    <a
                      href="tel:+66949869882"
                      className="hover:text-bone transition-colors"
                    >
                      +66 (0) 94-986-9882
                    </a>
                    <span className="text-bone/45">LINE: @undercatcreatives</span>
                  </div>
                </LineReveal>
              </div>

              {/* Elsewhere */}
              <div className="md:col-span-4">
                <LineReveal asView delay={0.1} block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono mb-4">
                    Elsewhere
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.18} block>
                  <div className="flex flex-col gap-2 text-bone/70 text-sm leading-[1.85] tracking-wide">
                    <a
                      href="https://instagram.com/undercatcreatives"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-bone transition-colors"
                    >
                      Instagram ↗
                    </a>
                    <a
                      href="https://www.youtube.com/@undercatcreatives"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-bone transition-colors"
                    >
                      YouTube ↗
                    </a>
                    <Link to="/work" className="hover:text-bone transition-colors">
                      Full reel →
                    </Link>
                  </div>
                </LineReveal>
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="max-w-[1600px] mx-auto w-full mt-24 pt-8 border-t border-bone/10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <LineReveal asView block>
                  <div className="text-[10px] tracking-[0.28em] uppercase text-bone/30 font-mono mb-2">
                    — Tagline
                  </div>
                </LineReveal>
                <LineReveal asView delay={0.08} block>
                  <div
                    className="font-serif text-bone/90 italic"
                    style={{ fontSize: 'clamp(15px, 1.35vw, 22px)' }}
                  >
                    Content with direction. Production with taste.
                  </div>
                </LineReveal>
              </div>
              <LineReveal asView delay={0.12} block>
                <div className="flex items-center gap-6">
                  <motion.button
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group text-[10px] tracking-[0.28em] uppercase text-bone/55 hover:text-bone transition-colors font-mono inline-flex items-center gap-2"
                  >
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ↑
                    </motion.span>
                    Back to top
                  </motion.button>
                  <span className="text-[10px] tracking-[0.28em] uppercase text-bone/35 font-mono tabular-nums">
                    © 2568–2569 Undercat Creatives Co., Ltd.
                  </span>
                </div>
              </LineReveal>
            </div>

            {/* Meta strip — Bangkok · clock · coordinates
                Items are plain so adjacent separators never orphan. */}
            <div className="mt-8 pt-6 border-t border-bone/5 flex flex-wrap items-center gap-x-3 md:gap-x-5 gap-y-2 text-[10px] tracking-[0.28em] uppercase text-bone/30 font-mono">
              <span>Bangkok · GMT+7</span>
              <span aria-hidden className="text-bone/15">·</span>
              <span className="tabular-nums">
                <LiveClock />
              </span>
              <span aria-hidden className="text-bone/15">·</span>
              <span>13.7563° N · 100.5018° E</span>
              <span aria-hidden className="text-bone/15 hidden md:inline">·</span>
              <span className="hidden md:inline">Small studio · full ownership · since 2568</span>
            </div>

            {/* End marker */}
            <div className="mt-10 pt-6 border-t border-bone/5 flex items-center justify-center gap-3">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE }}
                style={{ transformOrigin: 'right' }}
                className="h-[1px] w-16 bg-bone/15"
              />
              <LineReveal asView>
                <div className="text-[10px] tracking-[0.32em] uppercase text-bone/30 font-mono flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-oxblood"
                  />
                  04.F <span className="text-bone/15">|</span> — <span className="text-bone/15">|</span> End of reel
                </div>
              </LineReveal>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE }}
                style={{ transformOrigin: 'left' }}
                className="h-[1px] w-16 bg-bone/15"
              />
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}

/* ────────────────────────────────
   Rail tile
   ──────────────────────────────── */
function RailTile({
  item,
  caseData,
  index,
}: {
  item: RailItem;
  caseData: (typeof cases)[number];
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const thumb = hiRes(caseData.thumbnail) ?? caseData.thumbnail;

  return (
    <Link
      to={`/work/${caseData.id}`}
      className="absolute group block"
      style={{
        left: item.left,
        top: item.top,
        width: item.width,
        height: item.height,
        transform: 'translateY(-50%)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Top metadata row — index + hairline + industry */}
      <div className="absolute -top-8 left-0 right-0 flex items-center gap-3 text-[10px] tracking-[0.24em] uppercase text-bone/45 font-mono">
        <LineReveal asView delay={index * 0.04}>
          <span className="tabular-nums">
            {String(index + 1).padStart(2, '0')} / {String(railLayout.length).padStart(2, '0')}
          </span>
        </LineReveal>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: index * 0.04 + 0.1, ease: EASE }}
          style={{ transformOrigin: 'left', display: 'inline-block' }}
          className="h-[1px] flex-1 bg-bone/20"
        />
        <LineReveal asView delay={index * 0.04 + 0.15}>
          <span>{caseData.industry}</span>
        </LineReveal>
      </div>

      {/* Image */}
      <div className="relative w-full h-full overflow-hidden bg-ink/40">
        <motion.img
          src={thumb}
          alt={caseData.title}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          initial={{ scale: 1.1 }}
          animate={{
            scale: hover ? 1.0 : 1.1,
            filter: hover
              ? 'brightness(1) grayscale(0)'
              : 'brightness(0.68) grayscale(0.2)',
          }}
          transition={{ duration: 1.2, ease: EASE }}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (el.src.includes('maxresdefault')) {
              el.src = el.src.replace('maxresdefault', 'hqdefault');
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="absolute inset-0 mix-blend-overlay opacity-30">
          <LivingGrain />
        </div>
        {/* Hover border accent */}
        <motion.div
          className="absolute inset-0 border border-bone/0 pointer-events-none"
          animate={{ borderColor: hover ? 'hsla(40, 18%, 92%, 0.25)' : 'hsla(40, 18%, 92%, 0)' }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      {/* Bottom metadata — title + disciplines + micro CTA */}
      <div className="absolute -bottom-14 left-0 right-0 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <LineReveal asView delay={index * 0.04 + 0.1} block>
            <div
              className="font-serif text-bone leading-[1.1] truncate"
              style={{ fontSize: 'clamp(14px, 1.15vw, 19px)' }}
            >
              {caseData.title}
            </div>
          </LineReveal>
          <LineReveal asView delay={index * 0.04 + 0.15} block>
            <div className="mt-1.5 text-[10px] tracking-[0.24em] uppercase text-bone/40 font-mono">
              {caseData.styleDNA.slice(0, 2).join(' · ')}
            </div>
          </LineReveal>
        </div>
        <motion.div
          animate={{ opacity: hover ? 1 : 0.35, x: hover ? 4 : 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-[10px] tracking-[0.24em] uppercase text-bone/60 font-mono shrink-0 pt-0.5"
        >
          View →
        </motion.div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────
   Nav link (top bar center nav)
   ──────────────────────────────── */
function NavLink({
  item,
  index,
}: {
  item: {
    to: string;
    label: string;
    children?: { to: string; label: string }[];
  };
  index: number;
}) {
  const [hover, setHover] = useState(false);
  const hasChildren = !!item.children && item.children.length > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 + index * 0.08, ease: EASE }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative"
    >
      <Link
        to={item.to}
        className="relative block px-3 py-2 text-bone/65 hover:text-bone transition-colors duration-500"
      >
        <span>{item.label}</span>

        {/* Hover underline — draw from left */}
        <motion.span
          initial={false}
          animate={{ scaleX: hover ? 1 : 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{ transformOrigin: hover ? 'left' : 'right' }}
          className="absolute left-3 right-3 bottom-1 h-[1px] bg-oxblood/80"
        />
      </Link>

      {/* Dropdown */}
      {hasChildren && (
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute top-full left-1/2 -translate-x-1/2 pt-2 min-w-[180px]"
            >
              <div className="bg-ink/95 backdrop-blur-md border border-bone/10 py-2">
                {item.children!.map((child) => (
                  <Link
                    key={child.to}
                    to={child.to}
                    className="block px-5 py-2.5 text-[10px] tracking-[0.24em] uppercase text-bone/60 hover:text-oxblood hover:bg-bone/[0.03] transition-colors duration-300"
                  >
                    — {child.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* ────────────────────────────────
   Discipline card (Section 03)
   ──────────────────────────────── */
function DisciplineCard({
  d,
  index,
  isLast,
}: {
  d: { i: string; label: string; body: string };
  index: number;
  isLast: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative group px-0 md:px-8 pb-2 ${
        isLast ? '' : 'md:border-r md:border-bone/10'
      }`}
    >
      {/* Ghosted numeral watermark */}
      <div
        aria-hidden
        className="absolute right-2 top-0 font-serif text-bone/[0.035] leading-none pointer-events-none select-none"
        style={{ fontSize: 'clamp(90px, 9vw, 150px)' }}
      >
        {d.i}
      </div>

      {/* Hairline border that breathes on hover */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[1px] origin-left"
        animate={{
          backgroundColor: hover
            ? 'hsla(40, 18%, 92%, 0.32)'
            : 'hsla(40, 18%, 92%, 0.08)',
        }}
        transition={{ duration: 0.6, ease: EASE }}
      />

      <div className="relative z-10 pt-6">
        {/* Index + hairline */}
        <div className="flex items-center gap-3 text-[10px] tracking-[0.28em] uppercase font-mono text-bone/45 mb-5">
          <LineReveal asView delay={0.1 + index * 0.06}>
            <span className="tabular-nums">{d.i}</span>
          </LineReveal>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, delay: 0.15 + index * 0.06, ease: EASE }}
            style={{ transformOrigin: 'left', display: 'inline-block' }}
            className="h-[1px] w-8 bg-bone/20"
          />
        </div>

        {/* Serif label */}
        <LineReveal asView delay={0.18 + index * 0.06} block>
          <motion.h3
            className="font-serif leading-[1.05] mb-4"
            animate={{
              color: hover ? 'hsl(0, 55%, 30%)' : 'hsla(40, 18%, 92%, 0.95)',
            }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ fontSize: 'clamp(22px, 2.4vw, 34px)' }}
          >
            {d.label}
          </motion.h3>
        </LineReveal>

        {/* Descriptor */}
        <LineReveal asView delay={0.26 + index * 0.06} block>
          <motion.p
            animate={{ y: hover ? -2 : 0, color: hover ? 'hsla(40, 18%, 92%, 0.78)' : 'hsla(40, 18%, 92%, 0.6)' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="leading-[1.7] tracking-wide"
            style={{ fontSize: 'clamp(13px, 1vw, 15px)' }}
          >
            {d.body}
          </motion.p>
        </LineReveal>
      </div>
    </motion.div>
  );
}
