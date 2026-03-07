import React, { createContext, useContext, useState, useCallback } from 'react';
import { LensContext, LensSlide, LensSummary, LensLead, LensSession, createEmptyLensContext } from '@/types/lens';

type LensPhase = 'hero' | 'context' | 'generating' | 'session' | 'summary' | 'lead';

interface LensContextType {
  phase: LensPhase;
  setPhase: (p: LensPhase) => void;
  context: LensContext;
  updateContext: (updates: Partial<LensContext>) => void;
  slides: LensSlide[];
  setSlides: (s: LensSlide[]) => void;
  summary: LensSummary | null;
  setSummary: (s: LensSummary) => void;
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
  lead: LensLead | null;
  setLead: (l: LensLead) => void;
  session: LensSession | null;
  buildSession: () => void;
  resetLens: () => void;
}

const Ctx = createContext<LensContextType | null>(null);

const STORAGE_KEY = 'undercat-lens';

export function LensProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<LensPhase>('hero');
  const [context, setContext] = useState<LensContext>(createEmptyLensContext());
  const [slides, setSlides] = useState<LensSlide[]>([]);
  const [summary, setSummary] = useState<LensSummary | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lead, setLead] = useState<LensLead | null>(null);

  const updateContext = useCallback((updates: Partial<LensContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  const buildSession = useCallback(() => {
    const session: LensSession = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      context,
      generatedSlides: slides,
      summary,
      lead,
    };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch {}
  }, [context, slides, summary, lead]);

  const resetLens = useCallback(() => {
    setPhase('hero');
    setContext(createEmptyLensContext());
    setSlides([]);
    setSummary(null);
    setCurrentSlide(0);
    setLead(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const session: LensSession | null = slides.length > 0 ? {
    id: '',
    createdAt: new Date().toISOString(),
    context,
    generatedSlides: slides,
    summary,
    lead,
  } : null;

  return (
    <Ctx.Provider value={{
      phase, setPhase, context, updateContext, slides, setSlides,
      summary, setSummary, currentSlide, setCurrentSlide,
      lead, setLead, session, buildSession, resetLens,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLens() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLens must be used within LensProvider');
  return ctx;
}
