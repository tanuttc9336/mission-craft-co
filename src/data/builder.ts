import { Mission, PersonaId, Channel, BundleId } from '@/types/brief';

export const missions: { id: Mission; label: string; description: string; funnel: string; starterDeliverables: string[] }[] = [
  { id: 'launch-film',     label: 'Launch film',       description: "A new product, brand, or chapter the world hasn't seen.", funnel: 'Full-Funnel',    starterDeliverables: ['Hero film', 'Teaser series', 'Launch event'] },
  { id: 'brand-film',      label: 'Brand film',        description: "One piece of work that holds the brand's story.",        funnel: 'Top-of-Funnel',  starterDeliverables: ['Brand film', 'Manifesto', 'Anthem'] },
  { id: 'social-campaign', label: 'Social campaign',   description: 'A burst of content, multi-format, multi-channel.',         funnel: 'Mid-Funnel',     starterDeliverables: ['Social cutdowns', 'Reels', 'Story pack'] },
  { id: 'ad-spot',         label: 'Ad spot',           description: 'A 15-60s film with budget against media.',                 funnel: 'Bottom-of-Funnel', starterDeliverables: ['Ad creatives', 'A/B variants', 'Retargeting cuts'] },
  { id: 'event-content',   label: 'Event content',     description: 'Capture, then turn one night into months.',                funnel: 'Post-Event',     starterDeliverables: ['Event recap', 'Highlight reel', 'Social cutdowns'] },
  { id: 'retainer',        label: 'Retainer / monthly', description: 'Ongoing creative partnership.',                            funnel: 'Always-On',      starterDeliverables: ['Monthly content slate', 'Always-on social', 'BTS series'] },
];

export const personas: { id: PersonaId; label: string; description: string; tone: string; channels: string[]; keywords: string[] }[] = [
  { id: 'busy-marketer', label: 'Busy Marketer', description: 'Time-poor, needs results fast', tone: 'Direct, data-backed', channels: ['Meta Ads', 'LinkedIn'], keywords: ['marketing', 'brand', 'marketer', 'advertising'] },
  { id: 'founder-owner', label: 'Founder / Owner', description: 'Vision-driven, wears many hats', tone: 'Inspiring, clear ROI', channels: ['YouTube', 'Website'], keywords: ['founder', 'owner', 'ceo', 'startup', 'business'] },
  { id: 'luxury-buyer', label: 'Luxury Buyer', description: 'Values quality and exclusivity', tone: 'Refined, understated', channels: ['IG', 'Website', 'Events'], keywords: ['luxury', 'premium', 'high-end', 'exclusive'] },
  { id: 'golf-beginner', label: 'Golf Beginner', description: 'Curious, looking for approachable entry', tone: 'Friendly, encouraging', channels: ['TikTok', 'IG Reels', 'YouTube'], keywords: ['golf', 'beginner', 'new', 'learn'] },
  { id: 'golf-serious', label: 'Golf Serious Improver', description: 'Dedicated, wants performance-focused content', tone: 'Expert, credible', channels: ['YouTube', 'IG', 'Email'], keywords: ['golf', 'serious', 'improve', 'performance', 'data'] },
  { id: 'foodie-local', label: 'Foodie Local', description: 'Explores local dining, shares on social', tone: 'Warm, mouth-watering', channels: ['IG Reels', 'TikTok', 'Google'], keywords: ['food', 'restaurant', 'cafe', 'dining', 'eat'] },
  { id: 'event-organizer', label: 'Event Organizer', description: 'Needs content that sells tickets', tone: 'Energetic, FOMO-driven', channels: ['TikTok', 'Meta Ads', 'LED'], keywords: ['event', 'concert', 'festival', 'ticket'] },
  { id: 'hr-employer', label: 'HR / Employer Brand', description: 'Seeks authentic culture storytelling', tone: 'Human, genuine', channels: ['LinkedIn', 'Careers Page', 'YouTube'], keywords: ['hr', 'recruit', 'hire', 'talent', 'employer', 'culture'] },
];

export const channelOptions: { id: Channel; label: string; aspectRatios: string[] }[] = [
  { id: 'tiktok', label: 'TikTok', aspectRatios: ['9:16'] },
  { id: 'ig-reels', label: 'IG Reels', aspectRatios: ['9:16', '1:1'] },
  { id: 'youtube', label: 'YouTube', aspectRatios: ['16:9'] },
  { id: 'meta-ads', label: 'Meta Ads', aspectRatios: ['1:1', '4:5', '9:16'] },
  { id: 'website-hero', label: 'Website Hero', aspectRatios: ['16:9', '21:9'] },
  { id: 'led-screen', label: 'LED Screen', aspectRatios: ['16:9', '32:9'] },
];

export const bundles: { id: BundleId; label: string; tagline: string; priceHint: string; deliverables: string[]; note: string }[] = [
  {
    id: 'starter',
    label: 'Starter',
    tagline: 'Fast and focused',
    priceHint: '~80–150k',
    deliverables: ['1x Hero Video (30-60s)', '3x Social Cutdowns', '1x Revision Round (2 included)'],
    note: 'Ideal for testing a concept or a single platform push.',
  },
  {
    id: 'signature',
    label: 'Signature',
    tagline: 'The sweet spot',
    priceHint: '~150–300k',
    deliverables: ['1x Brand/Campaign Film (60-90s)', '6x Social Cutdowns', '2x Ad Creatives', 'Photo Selects (20+)', '2 Revision Rounds Included'],
    note: 'Our most popular package. Covers your core campaign needs.',
  },
  {
    id: 'production',
    label: 'Production',
    tagline: 'Fully loaded, fully custom',
    priceHint: '~300k+',
    deliverables: ['Multi-day Production', 'Full Video Suite (hero + cutdowns + ads)', 'Photography Library', 'Platform Strategy Guidance', 'Extended Edit Support', '2 Revision Rounds Included'],
    note: 'For brands that need it all. Tailored scope, premium execution.',
  },
  {
    id: 'custom',
    label: 'Custom',
    tagline: 'Build your own',
    priceHint: "Let's talk",
    deliverables: [],
    note: 'Tell us what you need. We\'ll scope it together on a call.',
  },
];

export const constraintOptions: { id: string; label: string }[] = [
  { id: 'fixed-launch-date', label: 'Fixed launch date' },
  { id: 'approvals-committee', label: 'Approvals committee involved' },
  { id: 'international-approvals', label: 'International / HQ approvals required' },
  { id: 'need-actors', label: 'Need actors / talent' },
  { id: 'need-location', label: 'Need location scouting' },
  { id: 'multi-location', label: 'Multi-location shoot' },
];

export const ctaTypes = ['Book Now', 'Learn More', 'Shop Now', 'Sign Up', 'Get a Quote', 'Watch More', 'Visit Us'];

// Budget estimated from package selection
export function estimateBudgetFromBundle(bundleId: BundleId | null): string {
  switch (bundleId) {
    case 'starter': return '80–150k';
    case 'signature': return '150–300k';
    case 'production': return '300k+';
    case 'custom': return 'TBD';
    default: return '';
  }
}
