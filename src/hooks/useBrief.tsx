import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Brief, createEmptyBrief, RiskLevel, Mission, EntryPath } from '@/types/brief';
import { generateBlueprint } from '@/utils/blueprint';
import { estimateBudgetFromBundle } from '@/data/builder';
import { cases } from '@/data/cases';

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

// New: 4 factors × 25% each
function calcClarity(brief: Brief): number {
  let filled = 0;
  const total = 4;
  // Factor 1: Mission selected
  if (brief.mission) filled++;
  // Factor 2: Audience (text OR persona)
  if (brief.audienceText.trim() || brief.audiencePersonas.length > 0) filled++;
  // Factor 3: Style DNA + at least 1 channel
  if (brief.channels.length > 0) filled++;
  // Factor 4: Package + Timeline selected
  if (brief.deliverablesBundle && brief.timeline) filled++;
  return Math.round((filled / total) * 100);
}

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [brief, setBrief] = useState<Brief>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old briefs that might lack new fields
        return {
          ...createEmptyBrief(),
          ...parsed,
          audienceText: parsed.audienceText ?? '',
          estimatedBudget: parsed.estimatedBudget ?? '',
          entryPath: parsed.entryPath ?? 'fresh',
          // Migrate old black-panther to production
          deliverablesBundle: parsed.deliverablesBundle === 'black-panther' ? 'production' : parsed.deliverablesBundle,
          // Migrate old timeline values
          timeline: (parsed.timeline === '1-2-months' || parsed.timeline === '3+-months') ? 'flexible' : parsed.timeline,
        };
      }
      return createEmptyBrief();
    } catch { return createEmptyBrief(); }
  });

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const stored = parseInt(localStorage.getItem(STEP_KEY) ?? '0', 10);
      // Clamp old values (0-6) to new range (0-2)
      return Math.min(stored, 2);
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
      // Auto-compute estimated budget from package
      if (updates.deliverablesBundle !== undefined) {
        next.estimatedBudget = estimateBudgetFromBundle(next.deliverablesBundle);
        // Derive budgetRange from bundle
        switch (next.deliverablesBundle) {
          case 'starter': next.budgetRange = '100-250k'; break;
          case 'signature': next.budgetRange = '250-500k'; break;
          case 'production': next.budgetRange = '500k+'; break;
          default: next.budgetRange = null;
        }
      }
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

  // 3 phases now
  const nextStep = useCallback(() => setCurrentStep(s => Math.min(s + 1, 2)), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((step: number) => setCurrentStep(Math.max(0, Math.min(step, 2))), []);

  const resetBrief = useCallback(() => {
    setBrief(createEmptyBrief());
    setCurrentStep(0);
  }, []);

  const prefillFromCase = useCallback((caseId: string) => {
    const c = cases.find((x) => x.id === caseId);
    if (!c) return;
    const goalMap: Record<string, Mission> = {
      'Launch': 'launch', 'Leads': 'leads', 'Sales': 'sales',
      'Awareness': 'awareness', 'Retention': 'retention', 'Employer Brand': 'employer-brand',
    };

    // Template prefills based on case study
    const templateMap: Record<string, Partial<Brief>> = {
      'audi-thailand': {
        mission: 'launch',
        styleDNA: { quietVsLoud: 25, cinematicVsUGC: 20, minimalVsMaximal: 30, funnyVsSerious: 70 },
        channels: ['youtube', 'meta-ads', 'website-hero'],
        deliverablesBundle: 'signature',
        audienceText: 'Automotive enthusiasts and luxury car buyers in Thailand',
      },
      'greenline-golf-lab': {
        mission: 'awareness',
        styleDNA: { quietVsLoud: 30, cinematicVsUGC: 40, minimalVsMaximal: 25, funnyVsSerious: 65 },
        channels: ['youtube', 'ig-reels', 'tiktok'],
        deliverablesBundle: 'production',
        audienceText: 'Serious golfers who want data-driven improvement',
      },
      'ranees-restaurant': {
        mission: 'awareness',
        styleDNA: { quietVsLoud: 35, cinematicVsUGC: 30, minimalVsMaximal: 35, funnyVsSerious: 50 },
        channels: ['ig-reels', 'tiktok'],
        deliverablesBundle: 'starter',
        audienceText: 'Bangkok foodies who discover restaurants on social media',
      },
      'fc-bayern-bangkok': {
        mission: 'awareness',
        styleDNA: { quietVsLoud: 70, cinematicVsUGC: 30, minimalVsMaximal: 60, funnyVsSerious: 45 },
        channels: ['youtube', 'ig-reels', 'meta-ads'],
        deliverablesBundle: 'signature',
        audienceText: 'Football fans and event-goers in Bangkok',
      },
    };

    const template = templateMap[caseId];

    setBrief(prev => ({
      ...prev,
      templateCaseId: caseId,
      entryPath: 'template' as EntryPath,
      mission: template?.mission ?? goalMap[c.goal] ?? null,
      ...(template ?? {}),
      estimatedBudget: estimateBudgetFromBundle(template?.deliverablesBundle ?? null),
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
      brief, currentStep, totalSteps: 3, clarityPercent: calcClarity(brief),
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
