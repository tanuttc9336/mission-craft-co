import React, { createContext, useContext, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';

export type CursorVariant = 
  | 'default'
  | 'spark'
  | 'ring'
  | 'crosshair'
  | 'square'
  | 'line'
  | 'velocity'
  | 'typing';

interface CursorContextType {
  cursorVariant: CursorVariant;
  setCursorVariant: (v: CursorVariant) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorVariant, setCursorVariant] = useState<CursorVariant>('default');

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) throw new Error('useCursor must be used within CursorProvider');
  return ctx;
}

/**
 * Hook to automatically update global cursor variant when an element is in view.
 */
export function useChapterCursor(ref: React.RefObject<HTMLElement | null>, variant: CursorVariant) {
  const { setCursorVariant } = useCursor();
  
  // margin "-40% 0px" means the element must penetrate 40% from top or bottom of viewport to trigger
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView) {
      setCursorVariant(variant);
    }
  }, [isInView, variant, setCursorVariant]);
}
