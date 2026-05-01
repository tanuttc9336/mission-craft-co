import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface RevealTextProps {
  children: ReactNode;
  start?: number;
  end?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

export function RevealText({ children, start = 0, end = 0.3, className = '', as = 'div' }: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [24, 0]);
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <div ref={ref}>
      <MotionTag
        style={reduce ? undefined : { opacity, y }}
        className={className}
      >
        {children}
      </MotionTag>
    </div>
  );
}
