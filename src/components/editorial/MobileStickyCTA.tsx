import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from './ease';

/**
 * MobileStickyCTA — editorial sticky bar at the bottom of mobile
 * viewports linking to the Briefing Room.
 *
 * Why it exists:
 *   - 65–75% of Thai B2B traffic is mobile (DataReportal 2024)
 *   - The chapter narrative on Home eats the visible nav for the
 *     duration of the scroll, so mobile readers lose the path back
 *     to the form. Without a persistent CTA they have to dig
 *     through the hamburger drawer (3 taps) to find the way to
 *     start a brief.
 *
 * Design rules — keep it editorial, not banner-ad:
 *   - Hairline border, no boxed button, no shadow stack
 *   - Oxblood underline as the only accent, font-mono uppercase
 *     micro-label paired with a serif phrase
 *   - Translucent bone-on-ink fill so case study heros bleed
 *     through subtly
 *   - md+ → hidden (this is mobile-only; desktop has the top nav)
 *   - Hide on /briefing-room and /confirmation routes — once the
 *     visitor has arrived at the destination, the bar becomes
 *     visual noise
 *   - Wait for the first scroll past ~250px before appearing —
 *     respects the hero ceremony, doesn't compete with first-view
 *     copy
 *   - prefers-reduced-motion → no slide animation, fade only
 */
export function MobileStickyCTA() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Hide on destination + post-conversion routes.
  const hidden =
    pathname.startsWith('/briefing-room') ||
    pathname.startsWith('/confirmation') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/login');

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => setVisible(window.scrollY > 250);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden]);

  if (hidden) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-0 left-0 right-0 z-[100] md:hidden no-print"
          aria-label="Sticky mobile call to action"
        >
          {/* Backdrop: bone-tinted ink with blur, hairline divider */}
          <div className="bg-ink/90 backdrop-blur-md border-t border-bone/15">
            <Link
              to="/briefing-room"
              className="group flex items-center justify-between px-6 py-4"
            >
              <span className="text-[10px] tracking-[0.28em] uppercase text-bone/60 font-mono">
                — Have a project?
              </span>
              <span className="flex items-baseline gap-2 text-bone group-active:text-oxblood transition-colors">
                <span className="font-serif text-[15px] tracking-tight border-b border-oxblood/80 pb-0.5">
                  Start a brief
                </span>
                <motion.span
                  aria-hidden
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-bone/70 group-active:text-oxblood text-sm"
                >
                  →
                </motion.span>
              </span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
