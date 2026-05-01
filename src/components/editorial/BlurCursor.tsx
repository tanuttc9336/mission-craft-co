import { useEffect, useRef } from 'react';

/**
 * BlurCursor — editorial cursor companion.
 * A frosted disc + oxblood dot that follows the mouse. Desktop only.
 */
export function BlurCursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[200] hidden md:block will-change-transform"
    >
      <div
        className="w-10 h-10 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundColor: 'hsla(0, 0%, 100%, 0.04)',
          border: '1px solid hsla(40, 18%, 92%, 0.15)',
        }}
      />
      <div className="absolute top-0 left-0 w-1 h-1 rounded-full bg-oxblood -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
