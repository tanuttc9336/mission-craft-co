/**
 * ChapterLabel — tiny editorial metadata marker, top-left of a chapter.
 * Renders as "03 / OUR PHILOSOPHY" — zero-padded number, slash, all-caps title.
 * Uses mono feel via wide letter-spacing; designed to be quiet but present.
 */
interface ChapterLabelProps {
  number: string | number;  // e.g. "08" or 8
  title: string;             // e.g. "THE STANDARD"
  tone?: 'ink' | 'paper';    // ink = dark label on light bg; paper = light label on dark bg
  className?: string;
}

export default function ChapterLabel({
  number,
  title,
  tone = 'ink',
  className = '',
}: ChapterLabelProps) {
  const num = typeof number === 'number' ? String(number).padStart(2, '0') : number;
  const color = tone === 'ink' ? 'text-[#0A0A0A]/80' : 'text-[#FAFAFA]/70';
  return (
    <div
      className={`absolute left-6 md:left-10 top-6 md:top-8 z-30 select-none font-body text-[10px] md:text-[11px] tracking-[0.18em] uppercase ${color} ${className}`}
    >
      {num} / {title}
    </div>
  );
}
