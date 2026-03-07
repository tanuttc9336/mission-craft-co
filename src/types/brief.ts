export type Mission = 'awareness' | 'leads' | 'sales' | 'launch' | 'retention' | 'employer-brand';

export type PersonaId = 'busy-marketer' | 'founder-owner' | 'luxury-buyer' | 'golf-beginner' | 'golf-serious' | 'foodie-local' | 'event-organizer' | 'hr-employer';

export type Channel = 'tiktok' | 'ig-reels' | 'youtube' | 'meta-ads' | 'website-hero' | 'led-screen';

export type BundleId = 'starter' | 'signature' | 'black-panther' | 'custom';

export type BudgetRange = '<100k' | '100-250k' | '250-500k' | '500k+';

export type Timeline = 'asap' | '2-4-weeks' | '1-2-months' | '3+-months';

export type Constraint = 'approvals-committee' | 'fixed-launch-date' | 'need-actors' | 'need-location' | 'brand-guidelines-ready';

export type RiskLevel = 'green' | 'yellow' | 'red';

export interface StyleDNA {
  quietVsLoud: number;       // 0-100: 0=Quiet Luxury, 100=Loud Energy
  cinematicVsUGC: number;    // 0-100
  minimalVsMaximal: number;  // 0-100
  funnyVsSerious: number;    // 0-100
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
  templateCaseId?: string;
  mission: Mission | null;
  audiencePersonas: PersonaId[];
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
  timeline: Timeline | null;
  constraints: Constraint[];
  riskLevel: RiskLevel;
  blueprintTextBlocks: Record<string, string>;
  lead: Lead;
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
}

export function createEmptyBrief(): Brief {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    mission: null,
    audiencePersonas: [],
    offer: { productName: '', keyOffer: '', proofPoints: ['', '', ''], ctaType: '' },
    styleDNA: { quietVsLoud: 30, cinematicVsUGC: 40, minimalVsMaximal: 30, funnyVsSerious: 60 },
    channels: [],
    deliverablesBundle: null,
    customDeliverables: [],
    budgetRange: null,
    timeline: null,
    constraints: [],
    riskLevel: 'green',
    blueprintTextBlocks: {},
    lead: { name: '', company: '', email: '', phone: '', projectLocation: '', notes: '', consent: false },
  };
}
