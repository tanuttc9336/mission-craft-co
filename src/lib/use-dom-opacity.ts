import { useEffect, type RefObject } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * Workaround for Framer Motion v12 bug where `opacity` MotionValues
 * created via `useTransform(scrollYProgress, ...)` do not propagate to
 * inline style on `motion.div` when the element lives inside a
 * `position: sticky` parent (our Chapter pinned primitive).
 *
 * Symptom: x/y/rotate transforms work, but opacity stays stuck at its
 * initial value, even though the underlying scrollYProgress is firing
 * (verified via useMotionValueEvent).
 *
 * Fix: bypass motion's style binding entirely. Subscribe to scrollYProgress
 * via useMotionValueEvent, compute opacity manually, and write directly
 * to `ref.current.style.opacity`. This works in pinned chapters.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useDomOpacity(ref, scrollYProgress, [0.20, 0.35]);
 *   // <motion.div ref={ref} style={{ opacity: 0, y: someYMV }}>
 *
 * The element MUST start with inline `opacity: 0` (or whatever your
 * desired initial value is) so the first frame matches.
 */
export function useDomOpacity(
  ref: RefObject<HTMLElement>,
  progress: MotionValue<number>,
  range: [number, number],
  output: [number, number] = [0, 1]
) {
  const [start, end] = range;
  const [from, to] = output;
  const span = end - start || 1;

  // Set initial opacity once on mount based on current progress value
  useEffect(() => {
    if (!ref.current) return;
    const v = progress.get();
    const t = Math.max(0, Math.min(1, (v - start) / span));
    const op = from + (to - from) * t;
    ref.current.style.opacity = String(op);
  }, [ref, progress, start, span, from, to]);

  useMotionValueEvent(progress, 'change', (v) => {
    if (!ref.current) return;
    const t = Math.max(0, Math.min(1, (v - start) / span));
    const op = from + (to - from) * t;
    ref.current.style.opacity = String(op);
  });
}

/**
 * Multi-keyframe variant of useDomOpacity. Same DOM-bypass workaround,
 * but interpolates linearly across an arbitrary set of (input, output)
 * pairs. Useful for fade-in / hold / fade-out beat patterns.
 *
 *   useDomOpacityKeyframes(ref, progress,
 *     [0.00, 0.04, 0.12, 0.16],
 *     [0,    1,    1,    0]);
 */
export function useDomOpacityKeyframes(
  ref: RefObject<HTMLElement>,
  progress: MotionValue<number>,
  inputs: number[],
  outputs: number[]
) {
  const compute = (v: number): number => {
    if (v <= inputs[0]) return outputs[0];
    if (v >= inputs[inputs.length - 1]) return outputs[outputs.length - 1];
    for (let i = 0; i < inputs.length - 1; i++) {
      const a = inputs[i];
      const b = inputs[i + 1];
      if (v >= a && v <= b) {
        const t = (v - a) / (b - a || 1);
        return outputs[i] + (outputs[i + 1] - outputs[i]) * t;
      }
    }
    return outputs[outputs.length - 1];
  };

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.opacity = String(compute(progress.get()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, progress]);

  useMotionValueEvent(progress, 'change', (v) => {
    if (!ref.current) return;
    ref.current.style.opacity = String(compute(v));
  });
}
