export interface LensSlide {
  title: string;
  lead: string;
  body: string;
  toneVariant?: string;
  slideType: 'brand-read' | 'audience-reality' | 'category-trap' | 'what-missing' | 'route' | 'undercat-take' | 'next-move';
}

export interface LensSummary {
  brandSituation: string;
  audienceReality: string;
  categoryTrap: string;
  whatMayBeMissing: string;
  recommendedRoute: string;
  undercatTake: string;
}

export interface LensLead {
  name: string;
  company: string;
  email: string;
  phone: string;
  consent: boolean;
}

export interface LensContext {
  businessName: string;
  industry: string;
  offerDescription: string;
  targetAudience: string;
  mainGoal: string;
  desiredFeel: string[];
  currentChallenges: string[];
  extraNotes: string;
}

export interface LensSession {
  id: string;
  createdAt: string;
  context: LensContext;
  generatedSlides: LensSlide[];
  summary: LensSummary | null;
  lead: LensLead | null;
}

export const LENS_INDUSTRIES = [
  'Automotive', 'Golf / Lifestyle', 'Restaurant / F&B', 'Events / Concerts',
  'Hospitality', 'Beauty / Wellness', 'Fashion / Retail', 'Property / Real Estate',
  'Personal Brand', 'Other',
];

export const LENS_GOALS = [
  'Awareness', 'Leads', 'Sales', 'Launch', 'Retention', 'Employer Brand', 'Not sure yet',
];

export const LENS_FEELS = [
  'premium', 'cinematic', 'playful', 'bold', 'calm', 'youthful', 'elevated', 'raw', 'minimal',
];

export const LENS_CHALLENGES = [
  'Not getting enough attention',
  'Getting seen but not remembered',
  'Looking good but not converting',
  'Hard to explain what makes us different',
  'Content feels flat',
  'Weak trust',
  'Inconsistent brand feel',
  'Launch pressure',
  'Not sure',
];

export function createEmptyLensContext(): LensContext {
  return {
    businessName: '',
    industry: '',
    offerDescription: '',
    targetAudience: '',
    mainGoal: '',
    desiredFeel: [],
    currentChallenges: [],
    extraNotes: '',
  };
}
