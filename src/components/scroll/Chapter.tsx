import { ReactNode, useRef } from 'react';

interface ChapterProps {
  id: string;
  height?: string;
  pinned?: boolean;
  children: ReactNode;
  className?: string;
}

export function Chapter({ id, height = '100vh', pinned = false, children, className = '' }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      id={id}
      ref={ref}
      data-chapter={id}
      style={{ height }}
      className={`relative w-full ${className}`}
    >
      <div className={pinned ? 'sticky top-0 h-screen w-full overflow-hidden' : 'relative w-full h-full'}>
        {children}
      </div>
    </section>
  );
}
