import { Mission, PersonaId, Channel, BundleId } from '@/types/brief';

export const missions: { id: Mission; label: string; description: string; funnel: string; starterDeliverables: string[] }[] = [
  { id: 'awareness', label: 'Awareness', description: 'Get seen by new audiences', funnel: 'Top-of-Funnel', starterDeliverables: ['Brand Film', 'Social Content', 'Paid Ads'] },
  { id: 'leads', label: 'Lead Generation', description: 'Capture interest and build pipeline', funnel: 'Mid-Funnel', starterDeliverables: ['Lead Magnet Video', 'Landing Page Content', 'Ad Creatives'] },
  { id: 'sales', label: 'Sales / Conversion', description: 'Turn interest into action', funnel: 'Bottom-of-Funnel', starterDeliverables: ['Product Demo', 'Testimonials', 'Retargeting Ads'] },
  { id: 'launch', label: 'Launch', description: 'Introduce something new to the world', funnel: 'Full-Funnel', starterDeliverables: ['Launch Film', 'Teaser Series', 'Event Content'] },
  { id: 'retention', label: 'Retention', description: 'Keep your community engaged', funnel: 'Post-Purchase', starterDeliverables: ['Social Series', 'Community Content', 'BTS'] },
  { id: 'employer-brand', label: 'Employer Brand', description: 'Attract top talent through culture', funnel: 'Talent Funnel', starterDeliverables: ['Recruitment Film', 'Employee Spotlights', 'Culture Content'] },
];

export const personas: { id: PersonaId; label: string; description: string; tone: string; channels: string[] }[] = [
  { id: 'busy-marketer', label: 'Busy Marketer', description: 'Time-poor, needs results fast', tone: 'Direct, data-backed', channels: ['Meta Ads', 'LinkedIn'] },
  { id: 'founder-owner', label: 'Founder / Owner', description: 'Vision-driven, wears many hats', tone: 'Inspiring, clear ROI', channels: ['YouTube', 'Website'] },
  { id: 'luxury-buyer', label: 'Luxury Buyer', description: 'Values quality and exclusivity', tone: 'Refined, understated', channels: ['IG', 'Website', 'Events'] },
  { id: 'golf-beginner', label: 'Golf Beginner', description: 'Curious, looking for approachable entry', tone: 'Friendly, encouraging', channels: ['TikTok', 'IG Reels', 'YouTube'] },
  { id: 'golf-serious', label: 'Golf Serious Improver', description: 'Dedicated, wants performance-focused content', tone: 'Expert, credible', channels: ['YouTube', 'IG', 'Email'] },
  { id: 'foodie-local', label: 'Foodie Local', description: 'Explores local dining, shares on social', tone: 'Warm, mouth-watering', channels: ['IG Reels', 'TikTok', 'Google'] },
  { id: 'event-organizer', label: 'Event Organizer', description: 'Needs content that sells tickets', tone: 'Energetic, FOMO-driven', channels: ['TikTok', 'Meta Ads', 'LED'] },
  { id: 'hr-employer', label: 'HR / Employer Brand', description: 'Seeks authentic culture storytelling', tone: 'Human, genuine', channels: ['LinkedIn', 'Careers Page', 'YouTube'] },
];

export const channelOptions: { id: Channel; label: string; aspectRatios: string[] }[] = [
  { id: 'tiktok', label: 'TikTok', aspectRatios: ['9:16'] },
  { id: 'ig-reels', label: 'IG Reels', aspectRatios: ['9:16', '1:1'] },
  { id: 'youtube', label: 'YouTube', aspectRatios: ['16:9'] },
  { id: 'meta-ads', label: 'Meta Ads', aspectRatios: ['1:1', '4:5', '9:16'] },
  { id: 'website-hero', label: 'Website Hero', aspectRatios: ['16:9', '21:9'] },
  { id: 'led-screen', label: 'LED Screen', aspectRatios: ['16:9', '32:9'] },
];

export const bundles: { id: BundleId; label: string; tagline: string; deliverables: string[]; note: string }[] = [
  {
    id: 'starter',
    label: 'Starter',
    tagline: 'Fast and focused',
    deliverables: ['1x Hero Video (30-60s)', '3x Social Cutdowns', '1x Revision Round (2 included)'],
    note: 'Ideal for testing a concept or a single platform push.',
  },
  {
    id: 'signature',
    label: 'Signature',
    tagline: 'The sweet spot',
    deliverables: ['1x Brand/Campaign Film (60-90s)', '6x Social Cutdowns', '2x Ad Creatives', 'Photo Selects (20+)', '2 Revision Rounds Included'],
    note: 'Our most popular package. Covers your core campaign needs.',
  },
  {
    id: 'black-panther',
    label: 'Black Panther',
    tagline: 'Fully loaded, fully custom',
    deliverables: ['Multi-day Production', 'Full Video Suite (hero + cutdowns + ads)', 'Photography Library', 'Platform Strategy Guidance', 'Extended Edit Support', '2 Revision Rounds Included'],
    note: 'For brands that need it all. Tailored scope, premium execution.',
  },
  {
    id: 'custom',
    label: 'Custom',
    tagline: 'Build your own',
    deliverables: [],
    note: 'Tell us what you need. We\'ll scope it together on a call.',
  },
];

export const constraintOptions: { id: string; label: string }[] = [
  { id: 'approvals-committee', label: 'Approvals committee involved' },
  { id: 'fixed-launch-date', label: 'Fixed launch date' },
  { id: 'need-actors', label: 'Need actors / talent' },
  { id: 'need-location', label: 'Need location scouting' },
  { id: 'brand-guidelines-ready', label: 'Brand guidelines ready' },
];

export const ctaTypes = ['Book Now', 'Learn More', 'Shop Now', 'Sign Up', 'Get a Quote', 'Watch More', 'Visit Us'];
