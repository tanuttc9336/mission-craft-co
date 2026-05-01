/**
 * FilmStripMarker — vertical editorial rule at the right edge of a chapter.
 * Thin line + subtle tick marks, evoking film-strip / ruler / frame counter.
 * Zero interaction, zero cost — pure SVG, absolutely positioned.
 */
interface FilmStripMarkerProps {
  tone?: 'ink' | 'paper';
  className?: string;
}

export default function FilmStripMarker({ tone = 'ink', className = '' }: FilmStripMarkerProps) {
  const color = tone === 'ink' ? '#0A0A0A' : '#FAFAFA';
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute right-4 md:right-6 top-[8%] h-[84%] w-3 z-20 ${className}`}
      viewBox="0 0 12 800"
      preserveAspectRatio="none"
    >
      {/* Main vertical line */}
      <line x1="6" y1="0" x2="6" y2="800" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
      {/* Tick marks every 40px — 20 ticks */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line
          key={i}
          x1="3"
          y1={i * 40 + 20}
          x2="9"
          y2={i * 40 + 20}
          stroke={color}
          strokeOpacity={i % 5 === 0 ? '0.5' : '0.18'}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
