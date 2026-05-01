import { LineReveal } from './LineReveal';

/**
 * DisplayHeadline — serif display headline with masked line reveals.
 * Pass `lines` (array of strings or ReactNodes — one per line) to get the
 * Home-hero treatment: clamped size, tight leading, per-line stagger.
 *
 * Use `size` to tune the clamp. `hero` = giant (44→184px), `section` = large
 * (36→96px), `minor` = medium (28→56px).
 */
type Size = 'hero' | 'section' | 'minor';

const sizeStyle: Record<Size, string> = {
  hero: 'clamp(44px, 10vw, 184px)',
  section: 'clamp(36px, 6.5vw, 96px)',
  minor: 'clamp(28px, 4vw, 56px)',
};

export function DisplayHeadline({
  lines,
  size = 'section',
  startDelay = 0,
  stagger = 0.18,
  asView = false,
  className = '',
  as: Tag = 'h1',
}: {
  lines: React.ReactNode[];
  size?: Size;
  startDelay?: number;
  stagger?: number;
  asView?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag
      className={`font-serif text-bone leading-[0.9] tracking-[-0.028em] ${className}`}
      style={{ fontSize: sizeStyle[size] }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          <LineReveal
            asView={asView}
            delay={startDelay + i * stagger}
            duration={1.15 + i * 0.05}
          >
            {line}
          </LineReveal>
        </div>
      ))}
    </Tag>
  );
}
