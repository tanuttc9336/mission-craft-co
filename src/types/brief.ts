export type Mission = 'awareness' | 'leads' | 'sales' | 'launch' | 'retention' | 'employer-brand';
export type PersonaId = 'busy-marketer' | 'founder-owner' | 'luxury-buyer' | 'golf-beginner' | 'golf-serious' | 'foodie-local' | 'event-organizer' | 'hr-employer';
export type Channel = 'tiktok' | 'ig-reels' | 'youtube' | 'meta-ads' | 'website-hero' | 'led-screen';
export type BundleId = 'starter' | 'signature' | 'production' | 'custom';
export type BudgetRange = '<100k' | '100-250k' | '250-500k' | '500k+' | 'not-defined';
export type Timeline = 'asap' | '2-4-weeks' | 'flexible';
export type Constraint = 'approvals-committee' | 'fixed-launch-date' | 'need-actors' | 'need-location' | 'international-approvals' | 'multi-location';
export type RiskLevel = 'green' | 'yellow' | 'red';
export type EntryPath = 'fresh' | 'template' | 'existing-brief';

export interface StyleDNA {
  quietVsLoud: number;
  cinematicVsUGC: number;
  minimalVsMaximal: number;
  funnyVsSerious: number;
}

export interface Lead {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectLocation: string;
  notes: string;
  consent: boolean;
}

export interface Brief {
  id: string;
  createdAt: string;
  mission: Mission | null;
  audiencePersonas: PersonaId[];
  audienceText: string;
  offer: {
    productName: string;
    keyOffer: string;
    proofPoints: string[];
    ctaType: string;
  };
  styleDNA: StyleDNA;
  channels: Channel[];
  deliverablesBundle: BundleId | null;
  customDeliverables: string[];
  budgetRange: BudgetRange | null;
  estimatedBudget: string;
  timeline: Timeline | null;
  constraints: Constraint[];
  riskLevel: RiskLevel;
  blueprintTextBlocks: Record<string, string>;
  lead: Lead;
  additionalContext: string;
  entryPath: EntryPath;
  templateCaseId?: string;
  matchedCaseIds: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  goal: string;
  outputs: string[];
  styleDNA: string[];
  thumbnail: string;
  description: string;
  deliverables: string[];
  approach: string[];
  gradient: string;
  videoUrl?: string;
  videoIds?: string[];
  platforms?: string[];
  scale?: string;
  audience?: string;
}

export function createEmptyBrief(): Brief {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mission: null,
    audiencePersonas: [],
    audienceText: '',
    offer: { productName: '', keyOffer: '', proofPoints: ['', '', ''], ctaType: '' },
    styleDNA: { quietVsLoud: 30, cinematicVsUGC: 40, minimalVsMaximal: 30, funnyVsSerious: 60 },
    channels: [],
    deliverablesBundle: null,
    customDeliverables: [],
    budgetRange: null,
    estimatedBudget: '',
    timeline: null,
    constraints: [],
    riskLevel: 'green',
    blueprintTextBlocks: {},
    additionalContext: '',
    lead: { name: '', company: '', email: '', phone: '', projectLocation: '', notes: '', consent: false },
    entryPath: 'fresh',
    matchedCaseIds: [],
  };
}
