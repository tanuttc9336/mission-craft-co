import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject } from 'react';

export function useChapterProgress(ref: RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  return useTransform(scrollYProgress, [0, 1], [0, 1]);
}
