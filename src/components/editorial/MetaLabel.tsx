/**
 * MetaLabel — mono uppercase hairline label.
 * The editorial atom: used for chapter meta, captions, footer meta strips,
 * "Now playing" tags, and any small detail that wants quiet authority.
 *
 * Variants tune tracking + opacity. Default: 10px / 0.28em / bone/50.
 */
type Variant = 'default' | 'loud' | 'quiet' | 'ghost';

const variantClass: Record<Variant, string> = {
  default: 'text-[10px] tracking-[0.28em] text-bone/50',
  loud: 'text-[11px] tracking-[0.24em] text-bone/80',
  quiet: 'text-[10px] tracking-[0.22em] text-bone/35',
  ghost: 'text-[10px] tracking-[0.22em] text-bone/25',
};

export function MetaLabel({
  children,
  variant = 'default',
  className = '',
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  as?: 'span' | 'div' | 'p';
}) {
  return (
    <Tag
      className={`uppercase font-mono ${variantClass[variant]} ${className}`}
    >
      {children}
    </Tag>
  );
}
