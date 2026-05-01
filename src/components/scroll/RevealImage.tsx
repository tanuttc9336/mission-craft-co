import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface RevealImageProps {
  src: string;
  alt: string;
  start?: number;
  end?: number;
  className?: string;
}

export function RevealImage({ src, alt, start = 0, end = 0.4, className = '' }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const scale = useTransform(scrollYProgress, [start, end], [1.05, 1]);
  return (
    <div ref={ref} className={className}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { opacity, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
