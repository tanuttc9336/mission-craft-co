import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LineReveal } from './LineReveal';
import { Chapter } from './Chapter';

/**
 * EditorialSection — the wrapper for every editorial section on non-hero pages.
 *
 * - Consistent padding: `px-6 md:px-20 pt-20 md:pt-24 pb-32 md:pb-40`
 * - Optional parallax ghosted numeral watermark (absolute, low-opacity serif)
 * - Chapter header row (index + label) via LineReveal
 * - Optional aside slot for a right-aligned meta strip
 * - Max-width inner container `max-w-[1600px]`
 *
 * This is the single building block for CaseDetail, Work, BriefingRoom, Lens, etc.
 */
export function EditorialSection({
  index,
  label,
  numeral,
  numeralPosition = 'right-bottom',
  numeralDrift = 'up',
  aside,
  children,
  className = '',
  bare = false,
  hideNumeral = false,
  id,
}: {
  index: string;
  label: string;
  /** The giant ghosted numeral. If omitted, defaults to `index`. */
  numeral?: string;
  numeralPosition?: 'right-bottom' | 'right-top' | 'left-bottom' | 'left-top';
  /** Parallax drift direction. `up` = ghost numeral drifts up as section scrolls in. */
  numeralDrift?: 'up' | 'down' | 'none';
  /** Right-aligned chapter-row aside (e.g. On-the-work meta hairline). */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Skip the default padding / container — caller manages layout entirely. */
  bare?: boolean;
  /** Hide the ghosted numeral watermark entirely. */
  hideNumeral?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const driftRange: [string, string] =
    numeralDrift === 'up'
      ? ['15%', '-15%']
      : numeralDrift === 'down'
      ? ['-15%', '15%']
      : ['0%', '0%'];
  const numeralY = useTransform(scrollYProgress, [0, 1], driftRange);

  const numeralAnchor =
    numeralPosition === 'right-bottom'
      ? '-right-[5vw] -bottom-[10vh]'
      : numeralPosition === 'right-top'
      ? '-right-[5vw] -top-[10vh]'
      : numeralPosition === 'left-bottom'
      ? '-left-[5vw] -bottom-[10vh]'
      : '-left-[5vw] -top-[10vh]';

  const paddingCls = bare ? '' : 'px-6 md:px-20 pt-20 md:pt-24 pb-32 md:pb-40';

  return (
    <section
      ref={ref}
      id={id}
      className={`relative ${paddingCls} overflow-hidden ${className}`}
    >
      {/* Ghosted numeral watermark */}
      {!hideNumeral && (
        <motion.div
          aria-hidden
          style={{ y: numeralY }}
          className={`absolute ${numeralAnchor} font-serif text-bone/[0.028] leading-none pointer-events-none select-none will-change-transform`}
        >
          <span style={{ fontSize: 'clamp(300px, 58vw, 960px)' }}>
            {numeral ?? index}
          </span>
        </motion.div>
      )}

      <div className="max-w-[1600px] mx-auto w-full relative z-10">
        {/* Chapter header row */}
        <div className="mb-10 md:mb-14 flex items-center justify-between gap-10">
          <LineReveal asView>
            <Chapter index={index} label={label} />
          </LineReveal>
          {aside && <div className="hidden md:block">{aside}</div>}
        </div>

        {children}
      </div>
    </section>
  );
}
