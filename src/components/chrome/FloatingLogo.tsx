import { useState } from 'react';
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function FloatingLogo() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setVisible(v > 0.05);
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Scroll to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: 'easeOut' }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
      className="fixed top-5 left-5 z-50 font-display text-sm tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-sm px-2 py-1"
    >
      Undercat
    </motion.button>
  );
}
