import { motion, useSpring, type MotionValue } from 'framer-motion';

/**
 * ScrollProgress — top-of-page hairline that tracks page scroll.
 * Pass `progress` from a `useScroll()` call (scrollYProgress).
 */
export function ScrollProgress({ progress }: { progress: MotionValue<number> }) {
  const scaleX = useSpring(progress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[1px] bg-bone/40 z-[150]"
    />
  );
}
