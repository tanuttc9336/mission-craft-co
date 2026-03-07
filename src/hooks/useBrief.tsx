import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Brief, createEmptyBrief, RiskLevel } from '@/types/brief';
import { generateBlueprint } from '@/utils/blueprint';

interface BriefContextType {
  brief: Brief;
  currentStep: number;
  totalSteps: number;
  clarityPercent: number;
  updateBrief: (updates: Partial<Brief>) => void;
  updateOffer: (updates: Partial<Brief['offer']>) => void;
  updateStyleDNA: (updates: Partial<Brief['styleDNA']>) => void;
  updateLead: (updates: Partial<Brief['lead']>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetBrief: () => void;
  prefillFromCase: (caseId: string) => void;
  finalizeBrief: () => Brief;
}

const BriefContext = createContext<BriefContextType | null>(null);

const STORAGE_KEY = 'undercat-brief';
const STEP_KEY = 'undercat-step';

function calcRisk(brief: Brief): RiskLevel {
  let flags = 0;
  if (brief.timeline === 'asap') flags++;
  if (brief.constraints.includes('approvals-committee')) flags++;
  if (brief.constraints.includes('fixed-launch-date')) flags++;
  if (brief.budgetRange === '<100k') flags++;
  if (flags >= 3) return 'red';
  if (flags >= 2) return 'yellow';
  return 'green';
}

function calcClarity(brief: Brief): number {
  let filled = 0;
  const total = 7;
  if (brief.mission) filled++;
  if (brief.audiencePersonas.length > 0) filled++;
  if (brief.offer.productName || brief.offer.keyOffer) filled++;
  filled++; // styleDNA always has defaults
  if (brief.channels.length > 0) filled++;
  if (brief.deliverablesBundle) filled++;
  if (brief.budgetRange && brief.timeline) filled++;
  return Math.round((filled / total) * 100);
}

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [brief, setBrief] = useState<Brief>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : createEmptyBrief();
    } catch { return createEmptyBrief(); }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      return parseInt(localStorage.getItem(STEP_KEY) ?? '0', 10);
    } catch { return 0; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
  }, [brief]);

  useEffect(() => {
    localStorage.setItem(STEP_KEY, String(currentStep));
  }, [currentStep]);

  const updateBrief = useCallback((updates: Partial<Brief>) => {
    setBrief(prev => {
      const next = { ...prev, ...updates };
      next.riskLevel = calcRisk(next);
      return next;
    });
  }, []);

  const updateOffer = useCallback((updates: Partial<Brief['offer']>) => {
    setBrief(prev => ({ ...prev, offer: { ...prev.offer, ...updates } }));
  }, []);

  const updateStyleDNA = useCallback((updates: Partial<Brief['styleDNA']>) => {
    setBrief(prev => ({ ...prev, styleDNA: { ...prev.styleDNA, ...updates } }));
  }, []);

  const updateLead = useCallback((updates: Partial<Brief['lead']>) => {
    setBrief(prev => ({ ...prev, lead: { ...prev.lead, ...updates } }));
  }, []);

  const nextStep = useCallback(() => setCurrentStep(s => Math.min(s + 1, 7)), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((step: number) => setCurrentStep(step), []);

  const resetBrief = useCallback(() => {
    setBrief(createEmptyBrief());
    setCurrentStep(0);
  }, []);

  const prefillFromCase = useCallback((caseId: string) => {
    const { cases } = require('@/data/cases');
    const c = cases.find((x: any) => x.id === caseId);
    if (!c) return;
    setBrief(prev => ({
      ...prev,
      templateCaseId: caseId,
      mission: c.goal.toLowerCase() === 'launch' ? 'launch' :
               c.goal.toLowerCase() === 'leads' ? 'leads' :
               c.goal.toLowerCase() === 'sales' ? 'sales' :
               c.goal.toLowerCase() === 'awareness' ? 'awareness' :
               c.goal.toLowerCase() === 'retention' ? 'retention' :
               c.goal.toLowerCase() === 'employer brand' ? 'employer-brand' : null,
    }));
    setCurrentStep(0);
  }, []);

  const finalizeBrief = useCallback(() => {
    const blocks = generateBlueprint(brief);
    const final = { ...brief, blueprintTextBlocks: blocks };
    setBrief(final);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    return final;
  }, [brief]);

  return (
    <BriefContext.Provider value={{
      brief, currentStep, totalSteps: 7, clarityPercent: calcClarity(brief),
      updateBrief, updateOffer, updateStyleDNA, updateLead,
      nextStep, prevStep, goToStep, resetBrief, prefillFromCase, finalizeBrief,
    }}>
      {children}
    </BriefContext.Provider>
  );
}

export function useBrief() {
  const ctx = useContext(BriefContext);
  if (!ctx) throw new Error('useBrief must be used within BriefProvider');
  return ctx;
}
