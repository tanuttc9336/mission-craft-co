import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface StickyCaptionProps {
  children: ReactNode;
  start: number;
  end: number;
  className?: string;
}

export function StickyCaption({ children, start, end, className = '' }: StickyCaptionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const midStart = (end - start) * 0.1 + start;
  const midEnd = end - (end - start) * 0.1;
  const opacity = useTransform(
    scrollYProgress,
    [start, midStart, midEnd, end],
    [0, 1, 1, 0]
  );
  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none">
      <motion.div
        style={reduce ? undefined : { opacity }}
        className={`sticky top-1/2 -translate-y-1/2 ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
