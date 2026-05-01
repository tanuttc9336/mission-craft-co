/**
 * GrainOverlay — editorial film-grain texture layer.
 * SVG turbulence + feColorMatrix → monochrome noise, GPU-rendered.
 * Use inside a relative container; sits at top layer with mix-blend-multiply.
 *
 * Props:
 *  - intensity:  0–1, default 0.12 (opacity of overlay)
 *  - scale:      noise base frequency, default 0.9 (higher = finer grain)
 *  - blend:      mix-blend-mode, default 'multiply' (for light bg); use 'screen' for dark bg
 */
interface GrainOverlayProps {
  intensity?: number;
  scale?: number;
  blend?: 'multiply' | 'screen' | 'overlay' | 'soft-light';
  className?: string;
}

export default function GrainOverlay({
  intensity = 0.12,
  scale = 0.9,
  blend = 'multiply',
  className = '',
}: GrainOverlayProps) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity: intensity, mixBlendMode: blend }}
    >
      <filter id="ad-grain">
        <feTurbulence type="fractalNoise" baseFrequency={scale} numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#ad-grain)" />
    </svg>
  );
}
