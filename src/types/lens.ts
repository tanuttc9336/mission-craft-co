export type LensIndustry = 'Automotive' | 'Golf / Lifestyle' | 'Restaurant / F&B' | 'Events / Concerts' | 'Hospitality' | 'Beauty / Wellness' | 'Fashion / Retail' | 'Property / Real Estate' | 'Other';

export type LensOfferType = 'Product' | 'Service' | 'Experience' | 'Venue' | 'Campaign / Launch' | 'Personal Brand';

export type LensBrandStage = 'New / Launching' | 'Growing' | 'Established' | 'Repositioning';

export type LensAudienceType = 'Busy Decision-Makers' | 'Founder-Led Buyers' | 'Premium / Taste-Driven Buyers' | 'Mainstream Consumers' | 'Local Community' | 'Event-Driven Audience' | 'Niche Enthusiasts' | 'Internal Team / Talent';

export type LensBuyingMindset = 'Trust-first' | 'Status-driven' | 'Price-aware' | 'Emotion-led' | 'Convenience-led' | 'Performance-led' | 'Curiosity-led';

export type LensChallenge =
  | 'Not getting enough attention'
  | 'Getting seen but not remembered'
  | 'Looking good but not converting'
  | 'Hard to explain what makes us different'
  | 'Launch pressure'
  | 'Content feels flat'
  | 'Audience trust is weak'
  | 'Brand feels inconsistent'
  | 'We need stronger positioning'
  | 'We're not sure yet';

export type LensCreativeMode = 'Safe / Commercial' | 'Elevated / Distinctive' | 'Bold / Campaign-Led';

export type LensGoal = 'Awareness' | 'Leads' | 'Sales' | 'Launch' | 'Retention' | 'Employer Brand';

export type LensTimeline = 'ASAP' | '2–4 weeks' | '1–2 months' | '3+ months';

export type LensBudgetRange = '<100k' | '100–250k' | '250–500k' | '500k+';

export type LensConstraint =
  | 'Committee approvals'
  | 'Fixed launch date'
  | 'Need talent / actors'
  | 'Need location'
  | 'Brand guidelines ready'
  | 'Need full production support';

export interface LensStyleDNA {
  quietVsLoud: number;
  cinematicVsRaw: number;
  minimalVsExpressive: number;
  seriousVsPlayful: number;
}

export interface LensCreativeAngle {
  title: string;
  conceptSummary: string;
  toneFeeling: string;
  whyItWorks: string;
}

export interface LensResult {
  brandSituation: string;
  audienceNeed: string;
  categoryMistake: string;
  undercatApproach: string;
  recommendedRoute: {
    name: string;
    whyItFits: string;
    nextStep: string;
  };
  creativeAngles: LensCreativeAngle[];
}

export interface LensLead {
  name: string;
  company: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface LensSession {
  id: string;
  createdAt: string;
  industry: LensIndustry | null;
  offerType: LensOfferType | null;
  brandStage: LensBrandStage | null;
  audienceType: LensAudienceType | null;
  buyingMindset: LensBuyingMindset | null;
  desiredAudienceResponse: string;
  currentChallenges: LensChallenge[];
  styleDNA: LensStyleDNA;
  creativeMode: LensCreativeMode | null;
  mainGoal: LensGoal | null;
  timeline: LensTimeline | null;
  budgetRange: LensBudgetRange | null;
  constraints: LensConstraint[];
  result: LensResult | null;
  lead: LensLead;
}

export function createEmptyLensSession(): LensSession {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    industry: null,
    offerType: null,
    brandStage: null,
    audienceType: null,
    buyingMindset: null,
    desiredAudienceResponse: '',
    currentChallenges: [],
    styleDNA: {
      quietVsLoud: 30,
      cinematicVsRaw: 40,
      minimalVsExpressive: 30,
      seriousVsPlayful: 50,
    },
    creativeMode: null,
    mainGoal: null,
    timeline: null,
    budgetRange: null,
    constraints: [],
    result: null,
    lead: { name: '', company: '', email: '', phone: '', consent: false },
  };
}
