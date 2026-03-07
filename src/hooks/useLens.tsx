import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  type LensSession,
  type LensStyleDNA,
  type LensResult,
  type LensLead,
  type LensChallenge,
  type LensConstraint,
  createEmptyLensSession,
} from '@/types/lens';

interface LensContextType {
  session: LensSession;
  currentStep: number;
  totalSteps: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSession: (partial: Partial<LensSession>) => void;
  updateStyleDNA: (partial: Partial<LensStyleDNA>) => void;
  toggleChallenge: (c: LensChallenge) => void;
  toggleConstraint: (c: LensConstraint) => void;
  setResult: (result: LensResult) => void;
  updateLead: (partial: Partial<LensLead>) => void;
  resetSession: () => void;
}

const LensContext = createContext<LensContextType | null>(null);

const STORAGE_KEY = 'undercat-lens-session';

function loadSession(): LensSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return createEmptyLensSession();
}

function saveSession(s: LensSession) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function LensProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LensSession>(loadSession);
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  const update = useCallback((fn: (prev: LensSession) => LensSession) => {
    setSession(prev => {
      const next = fn(prev);
      saveSession(next);
      return next;
    });
  }, []);

  const updateSession = useCallback((partial: Partial<LensSession>) => {
    update(prev => ({ ...prev, ...partial }));
  }, [update]);

  const updateStyleDNA = useCallback((partial: Partial<LensStyleDNA>) => {
    update(prev => ({ ...prev, styleDNA: { ...prev.styleDNA, ...partial } }));
  }, [update]);

  const toggleChallenge = useCallback((c: LensChallenge) => {
    update(prev => {
      const has = prev.currentChallenges.includes(c);
      if (has) return { ...prev, currentChallenges: prev.currentChallenges.filter(x => x !== c) };
      if (prev.currentChallenges.length >= 2) return prev;
      return { ...prev, currentChallenges: [...prev.currentChallenges, c] };
    });
  }, [update]);

  const toggleConstraint = useCallback((c: LensConstraint) => {
    update(prev => {
      const has = prev.constraints.includes(c);
      return { ...prev, constraints: has ? prev.constraints.filter(x => x !== c) : [...prev.constraints, c] };
    });
  }, [update]);

  const setResult = useCallback((result: LensResult) => {
    update(prev => ({ ...prev, result }));
  }, [update]);

  const updateLead = useCallback((partial: Partial<LensLead>) => {
    update(prev => ({ ...prev, lead: { ...prev.lead, ...partial } }));
  }, [update]);

  const resetSession = useCallback(() => {
    const fresh = createEmptyLensSession();
    setSession(fresh);
    setCurrentStep(0);
    saveSession(fresh);
  }, []);

  const nextStep = useCallback(() => setCurrentStep(s => Math.min(s + 1, totalSteps - 1)), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(s - 1, 0)), []);

  return (
    <LensContext.Provider value={{
      session, currentStep, totalSteps, setStep: setCurrentStep,
      nextStep, prevStep, updateSession, updateStyleDNA,
      toggleChallenge, toggleConstraint, setResult, updateLead, resetSession,
    }}>
      {children}
    </LensContext.Provider>
  );
}

export function useLens() {
  const ctx = useContext(LensContext);
  if (!ctx) throw new Error('useLens must be used within LensProvider');
  return ctx;
}
