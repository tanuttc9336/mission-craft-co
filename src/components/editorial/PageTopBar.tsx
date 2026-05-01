import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, type MotionValue } from 'framer-motion';
import { EASE } from './ease';

type NavChild = { to: string; label: string };
type NavItem = {
  to: string;
  label: string;
  children?: NavChild[];
};

/**
 * Site-wide nav — consolidated to a real funnel:
 *   Work (cold) → Industries (warm specialty) → Briefing Room
 *   (intent) → Credentials (sales asset) → Contact (Pao).
 * Home lives behind the wordmark. Services merged into Industries.
 * No page-level numbering — chapters on Home own the 01-04 system.
 */
const DEFAULT_ITEMS: NavItem[] = [
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
];

/**
 * PageTopBar — fixed editorial top bar shared across every page.
 *
 * Left:    pulsing oxblood radar dot + "Undercat Creatives" wordmark
 *          (links home).
 * Center:  desktop nav with hover underline draw-in. Items with
 *          children render a hover dropdown.
 * Right:   mobile-only hamburger that opens a fullscreen drawer.
 * Bottom:  scroll progress hairline (pass `progress` from useScroll).
 */
export function PageTopBar({
  progress,
  items = DEFAULT_ITEMS,
}: {
  progress?: MotionValue<number>;
  items?: NavItem[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile drawer is open.
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [mobileOpen]);

  const scaleX = useSpring(progress as MotionValue<number>, {
    stiffness: 140,
    damping: 32,
    mass: 0.4,
  });

  return (
    <>
      <motion.div
        animate={{
          paddingTop: scrolled ? 14 : 26,
          paddingBottom: scrolled ? 14 : 26,
          backgroundColor: scrolled ? 'hsla(0, 0%, 5%, 0.72)' : 'hsla(0, 0%, 5%, 0)',
          backdropFilter: scrolled ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed top-0 left-0 right-0 z-[120] px-6 md:px-20 flex items-center justify-between pointer-events-none border-b"
        style={{
          borderColor: scrolled ? 'hsla(40, 18%, 92%, 0.08)' : 'transparent',
        }}
      >
        {/* Scroll progress hairline — fills underneath the bar */}
        {progress && (
          <motion.div
            style={{ scaleX, transformOrigin: 'left' }}
            className="absolute left-0 right-0 bottom-0 h-[1px] bg-oxblood/60 pointer-events-none"
          />
        )}

        {/* Left: wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="pointer-events-auto"
        >
          <Link to="/" className="flex items-center gap-3 group" aria-label="Undercat Creatives — home">
            {/* Breathing REEL indicator — 4s cycle (calm pulse, not alarm).
                Matches Home's top bar so the rhythm is consistent across
                every page. */}
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
              Undercat{' '}
              <span className="text-bone/50 group-hover:text-bone/80 transition-colors duration-500">
                Creatives
              </span>
            </span>
          </Link>
        </motion.div>

        {/* Center nav (desktop) */}
        <nav
          className="pointer-events-auto hidden md:flex items-center gap-0 text-[10px] tracking-[0.24em] uppercase font-mono"
          aria-label="Primary"
        >
          {items.map((item, i) => (
            <TopBarNavLink key={item.to} item={item} index={i} />
          ))}
        </nav>

        {/* Right: mobile hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="pointer-events-auto md:hidden flex flex-col gap-[5px] p-2 group"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <motion.span
            animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="block w-5 h-[1px] bg-bone/70 origin-center"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="block w-5 h-[1px] bg-bone/70"
          />
          <motion.span
            animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="block w-5 h-[1px] bg-bone/70 origin-center"
          />
        </button>

        {/* Invisible mirror to balance center nav on desktop */}
        <div
          aria-hidden
          className="hidden md:flex items-center gap-3 opacity-0 pointer-events-none"
        >
          <div className="w-1.5 h-1.5 rounded-full" />
          <span className="text-[11px] tracking-[0.28em] uppercase">
            Undercat Creatives
          </span>
        </div>
      </motion.div>

      {/* Mobile drawer — fullscreen, dim background, links collapse on tap */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[110] bg-ink/97 backdrop-blur-md flex flex-col pt-24 pb-10 px-8 md:hidden"
          >
            <nav className="flex flex-col gap-1 mt-4" aria-label="Mobile">
              {items.flatMap((item, i) => {
                const rows = [
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 border-b border-bone/10 font-serif text-bone/80 hover:text-bone transition-colors"
                      style={{ fontSize: 'clamp(22px, 4vw, 28px)' }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>,
                ];
                // Render children inline as indented sub-rows under their parent.
                if (item.children?.length) {
                  for (const c of item.children) {
                    rows.push(
                      <motion.div
                        key={`${item.to}::${c.to}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.05 + 0.04, ease: EASE }}
                      >
                        <Link
                          to={c.to}
                          onClick={() => setMobileOpen(false)}
                          className="block py-3 pl-6 border-b border-bone/5 font-mono text-[11px] tracking-[0.24em] uppercase text-bone/55 hover:text-oxblood transition-colors"
                        >
                          — {c.label}
                        </Link>
                      </motion.div>
                    );
                  }
                }
                return rows;
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function TopBarNavLink({ item, index }: { item: NavItem; index: number }) {
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

      {/* Dropdown for nested children */}
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
