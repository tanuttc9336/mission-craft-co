import { CaseStudy } from '@/types/brief';

const gradients = [
  'linear-gradient(135deg, hsl(220 15% 15%), hsl(220 15% 30%))',
  'linear-gradient(135deg, hsl(42 40% 45%), hsl(42 55% 62%))',
  'linear-gradient(135deg, hsl(160 20% 20%), hsl(160 30% 40%))',
  'linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 30%))',
  'linear-gradient(135deg, hsl(200 30% 20%), hsl(200 40% 45%))',
  'linear-gradient(135deg, hsl(340 20% 25%), hsl(340 30% 45%))',
  'linear-gradient(135deg, hsl(30 40% 30%), hsl(30 50% 50%))',
  'linear-gradient(135deg, hsl(270 20% 20%), hsl(270 25% 40%))',
  'linear-gradient(135deg, hsl(180 15% 15%), hsl(180 25% 35%))',
  'linear-gradient(135deg, hsl(10 30% 20%), hsl(10 40% 40%))',
  'linear-gradient(135deg, hsl(140 35% 25%), hsl(140 45% 42%))',
  'linear-gradient(135deg, hsl(15 45% 30%), hsl(15 55% 48%))',
  'linear-gradient(135deg, hsl(210 25% 18%), hsl(210 35% 38%))',
  'linear-gradient(135deg, hsl(50 40% 30%), hsl(50 50% 48%))',
];

export const cases: CaseStudy[] = [
  // ═══════════════════════════════════════════════════════
  // 1. Audi Thailand — Launch Films
  // ═══════════════════════════════════════════════════════
  {
    id: 'audi-launch-films',
    title: 'Audi Thailand — Launch Films',
    industry: 'Automotive',
    goal: 'Launch',
    outputs: ['Brand Film', 'Launch Film', 'Social Content'],
    styleDNA: ['Cinematic', 'Quiet Luxury', 'Minimal'],
    thumbnail: 'https://i.ytimg.com/vi/Obl9-pHXK94/hqdefault.jpg',
    gradient: gradients[0],
    description: 'A series of cinematic launch films for Audi Thailand — from the S6 Avant to the Q8 edition one and the all-new A5. Each film captures the precision and presence of the vehicle through restrained, high-end visuals.',
    deliverables: ['S6 Avant Launch Film', 'Q8 Edition One Launch Film', 'A5 Bangkok First Run', 'S6 Launch Feature'],
    approach: [
      'Developed a consistent cinematic language across multiple model launches',
      'Captured each vehicle\'s character through location, pacing, and light',
      'Delivered hero films for YouTube and social cutdowns for IG/TikTok',
      'Maintained Audi\'s premium brand identity across all outputs',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Obl9-pHXK94',
    videoIds: ['Obl9-pHXK94', '9tR8KgiJETM', 'qK0JDB5fqiw', 'XvX0OE81G9A'],
    platforms: ['YouTube', 'Website', 'IG Reels'],
    scale: 'Production',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 2. Audi x BENZILLA — Special Collaboration
  // ═══════════════════════════════════════════════════════
  {
    id: 'audi-benzilla',
    title: 'Audi x BENZILLA — TT Coupé Collaboration',
    industry: 'Automotive',
    goal: 'Awareness',
    outputs: ['Brand Film', 'Social Content'],
    styleDNA: ['Cinematic', 'Loud Energy', 'Maximal'],
    thumbnail: 'https://i.ytimg.com/vi/aq2tCtQQQes/hqdefault.jpg',
    gradient: gradients[4],
    description: 'A special collaboration film featuring Audi TT Coupé x BENZILLA — blending automotive precision with street art culture. Bold, loud, and unapologetically creative.',
    deliverables: ['Collaboration Film', 'Social Cutdowns', 'BTS Content'],
    approach: [
      'Merged two worlds — luxury automotive meets Bangkok street culture',
      'Shot with a raw, energetic visual style to match the collaboration spirit',
      'Created content that stands out from typical automotive campaigns',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=aq2tCtQQQes',
    videoIds: ['aq2tCtQQQes'],
    platforms: ['YouTube', 'IG Reels'],
    scale: 'Signature',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 3. Audi Thailand — Events & Activations
  // ═══════════════════════════════════════════════════════
  {
    id: 'audi-events',
    title: 'Audi Thailand — Events & Activations',
    industry: 'Automotive',
    goal: 'Awareness',
    outputs: ['Event Recap', 'Social Content', 'IG Reels'],
    styleDNA: ['Cinematic', 'Quiet Luxury', 'Warm'],
    thumbnail: 'https://i.ytimg.com/vi/q8iuo8YNpWw/hqdefault.jpg',
    gradient: gradients[5],
    description: 'Event coverage and activation recaps for Audi Thailand — from the FC Bayern partnership to the Tom Ford luxury collaboration and the EmQuartier showcase. Capturing the energy and exclusivity of each moment.',
    deliverables: ['FC Bayern x Audi Recap', 'Tom Ford Event Recap', 'EmQuartier Showcase Content'],
    approach: [
      'Captured the atmosphere and exclusivity of each event',
      'Quick-turnaround delivery for same-week social posting',
      'Mixed cinematic shots with candid moments for authenticity',
      'Delivered vertical cuts optimized for IG Reels',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=q8iuo8YNpWw',
    videoIds: ['pHKzpUHoGbU', 'q8iuo8YNpWw', 'DdDlLGjp8PY'],
    platforms: ['IG Reels', 'YouTube', 'TikTok'],
    scale: 'Signature',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 4. Audi Thailand — Social Campaigns
  // ═══════════════════════════════════════════════════════
  {
    id: 'audi-social-campaigns',
    title: 'Audi Thailand — Social Campaigns',
    industry: 'Automotive',
    goal: 'Sales',
    outputs: ['Social Content', 'Meta Ads', 'IG Reels'],
    styleDNA: ['Cinematic', 'Playful', 'Warm'],
    thumbnail: 'https://i.ytimg.com/vi/eUQJyLCGt5k/hqdefault.jpg',
    gradient: gradients[7],
    description: 'Social campaign content for Audi Thailand — including brand collaborations with K Yoghurt, lifestyle-driven TT campaign content, and clearance sale promotions. Designed to drive engagement and conversion across social platforms.',
    deliverables: ['K Yoghurt x Audi Campaign', 'K Yo x Audi TT Campaign', 'Clearance Sale 2023 Promo'],
    approach: [
      'Blended lifestyle storytelling with product features',
      'Created platform-native content for each social channel',
      'Balanced brand prestige with approachable, shareable content',
      'Optimized cuts for Meta Ads performance',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=eUQJyLCGt5k',
    videoIds: ['eUQJyLCGt5k', 'b9GzODn3rc8', 'SFJOaBexGi8'],
    platforms: ['IG Reels', 'Meta Ads', 'TikTok'],
    scale: 'Signature',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 5. Benz Starflag — Motor Expo 2024
  // ═══════════════════════════════════════════════════════
  {
    id: 'benz-starflag-motorexpo',
    title: 'Benz Starflag — Motor Expo 2024',
    industry: 'Automotive',
    goal: 'Awareness',
    outputs: ['Event Recap', 'Brand Film'],
    styleDNA: ['Cinematic', 'Warm', 'Quiet Luxury'],
    thumbnail: 'https://i.ytimg.com/vi/4RNy8HnQ-cs/hqdefault.jpg',
    gradient: gradients[1],
    description: 'A cinematic event recap of Benz Starflag at Motor Expo 2024, Bangkok — capturing the scale, atmosphere, and showcase highlights of one of Thailand\'s biggest automotive events.',
    deliverables: ['Motor Expo Recap Film', 'Social Highlights'],
    approach: [
      'Covered the full event with a multi-camera setup',
      'Focused on booth experience, vehicle reveals, and crowd energy',
      'Delivered fast-turnaround content for post-event social push',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=4RNy8HnQ-cs',
    videoIds: ['4RNy8HnQ-cs'],
    platforms: ['YouTube', 'IG Reels'],
    scale: 'Signature',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 6. Ducati Thailand — XDiavel Nera Launch
  // ═══════════════════════════════════════════════════════
  {
    id: 'ducati-xdiavel-nera',
    title: 'Ducati Thailand — XDiavel Nera Launch',
    industry: 'Automotive',
    goal: 'Launch',
    outputs: ['Launch Film', 'Brand Film'],
    styleDNA: ['Cinematic', 'Quiet Luxury', 'Minimal'],
    thumbnail: 'https://i.ytimg.com/vi/aTl18DpUEks/hqdefault.jpg',
    gradient: gradients[3],
    description: 'A launch film for the Ducati XDiavel Nera in Thailand — dark, cinematic, and dripping with Italian luxury. Every frame designed to feel as powerful as the bike itself.',
    deliverables: ['XDiavel Nera Launch Film', 'Social Cutdowns'],
    approach: [
      'Built a visual narrative around darkness, power, and craftsmanship',
      'Used dramatic lighting to emphasize the Nera\'s black-on-black design',
      'Delivered a hero film that matches Ducati\'s global brand standard',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=aTl18DpUEks',
    videoIds: ['aTl18DpUEks'],
    platforms: ['YouTube', 'Website'],
    scale: 'Signature',
    audience: 'Luxury Buyer',
  },

  // ═══════════════════════════════════════════════════════
  // 7. Hin\'s Cup 2023 — Golf Tournament
  // ═══════════════════════════════════════════════════════
  {
    id: 'hins-cup-golf',
    title: 'Hin\'s Cup 2023 — Golf Tournament',
    industry: 'Golf / Lifestyle',
    goal: 'Awareness',
    outputs: ['Event Recap', 'Aftermovie', 'Social Content'],
    styleDNA: ['Warm', 'Cinematic', 'Aspirational'],
    thumbnail: 'https://i.ytimg.com/vi/XggtePX3enI/hqdefault.jpg',
    gradient: gradients[6],
    description: 'Event coverage and aftermovie for the Hin\'s Cup 2023 golf tournament — capturing the competitive spirit, the lush course, and the social atmosphere of the day.',
    deliverables: ['Tournament Aftermovie', 'Social Highlights', 'Photo Coverage'],
    approach: [
      'Balanced action shots on the course with lifestyle moments off it',
      'Captured the social and networking atmosphere alongside the competition',
      'Delivered a recap film that works as both highlight and promotional tool',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=XggtePX3enI',
    videoIds: ['XggtePX3enI'],
    platforms: ['YouTube', 'IG Reels'],
    scale: 'Starter',
    audience: 'Golf Serious Improver',
  },

  // ═══════════════════════════════════════════════════════
  // 8. Rajadamnern World Series 2022
  // ═══════════════════════════════════════════════════════
  {
    id: 'rajadamnern-world-series',
    title: 'Rajadamnern World Series 2022 — Recap',
    industry: 'Event / Concert',
    goal: 'Awareness',
    outputs: ['Event Recap', 'Aftermovie', 'Social Highlights'],
    styleDNA: ['Loud Energy', 'Cinematic', 'Maximal'],
    thumbnail: 'https://i.ytimg.com/vi/Y_Q5f7uTGKs/hqdefault.jpg',
    gradient: gradients[8],
    description: 'A high-energy recap of the Rajadamnern World Series 2022 — Thailand\'s legendary Muay Thai stadium meets world-class production. Raw power, electric atmosphere, iconic venue.',
    deliverables: ['Event Recap Film', 'Social Highlights Package'],
    approach: [
      'Captured the raw intensity of world-class Muay Thai',
      'Multi-camera coverage across the venue for maximum impact',
      'Fast-paced edit style matching the energy of the sport',
      'Delivered content that celebrates Thai cultural heritage',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=Y_Q5f7uTGKs',
    videoIds: ['Y_Q5f7uTGKs'],
    platforms: ['YouTube', 'IG Reels', 'TikTok'],
    scale: 'Signature',
    audience: 'Event Organizer',
  },

  // ═══════════════════════════════════════════════════════
  // 9. LKP Corporate School Film
  // ═══════════════════════════════════════════════════════
  {
    id: 'lkp-corporate-film',
    title: 'LKP Corporate School — Brand Film',
    industry: 'Education',
    goal: 'Employer Brand',
    outputs: ['Corporate Film', 'Brand Film'],
    styleDNA: ['Warm', 'Minimal', 'Serious'],
    thumbnail: 'https://i.ytimg.com/vi/pZ2Uh5YgCAA/hqdefault.jpg',
    gradient: gradients[2],
    description: 'A corporate brand film for LKP Corporate School — telling the story of the institution through its people, spaces, and purpose. Professional, warm, and trustworthy.',
    deliverables: ['Corporate Brand Film', 'Website Hero Video'],
    approach: [
      'Focused on people and environment to convey trust and quality',
      'Used warm, natural lighting to create an approachable feel',
      'Balanced institutional credibility with human storytelling',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=pZ2Uh5YgCAA',
    videoIds: ['pZ2Uh5YgCAA'],
    platforms: ['YouTube', 'Website'],
    scale: 'Signature',
    audience: 'Founder / Owner',
  },

  // ═══════════════════════════════════════════════════════
  // 10. Sierra Tequila Bangkok — Lead the Party
  // ═══════════════════════════════════════════════════════
  {
    id: 'sierra-tequila-party',
    title: 'Sierra Tequila Bangkok — Lead the Party',
    industry: 'Restaurant / F&B',
    goal: 'Awareness',
    outputs: ['Social Content', 'IG Reels', 'Event Recap'],
    styleDNA: ['Loud Energy', 'Playful', 'Maximal'],
    thumbnail: 'https://i.ytimg.com/vi/6b0kVBu6R98/hqdefault.jpg',
    gradient: gradients[9],
    description: 'Social content for Sierra Tequila Bangkok\'s "Lead the Party" campaign — vibrant, energetic, and built to make people want to be there. Party energy meets brand storytelling.',
    deliverables: ['Party Recap Content', 'IG Reels Pack', 'Social Highlights'],
    approach: [
      'Captured the energy and vibe of Bangkok nightlife',
      'Created shareable, FOMO-driven content for social',
      'Matched Sierra\'s bold brand personality with dynamic visuals',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=6b0kVBu6R98',
    videoIds: ['6b0kVBu6R98'],
    platforms: ['IG Reels', 'TikTok'],
    scale: 'Starter',
    audience: 'Foodie Local',
  },

  // ═══════════════════════════════════════════════════════
  // 11. Greenline Golf Lab — Media Strategy & Content
  // ═══════════════════════════════════════════════════════
  {
    id: 'greenline-golf-lab',
    title: 'Greenline Golf Lab — Media Strategy & Content',
    industry: 'Golf / Lifestyle',
    goal: 'Awareness',
    outputs: ['Social Content', 'IG Reels', 'YouTube Series', 'Brand Strategy'],
    styleDNA: ['Cinematic', 'Minimal', 'Serious'],
    thumbnail: 'https://i.ytimg.com/vi/k1g3pGY5_FE/hqdefault.jpg',
    gradient: gradients[10],
    description: 'A full media strategy and content production partnership with Greenline Golf Lab — Thailand\'s premium, data-driven golf performance destination. Undercat plans and produces the entire media output, turning complex biomechanics into simple, actionable feelings for every golfer. From the DNA Talk series to private session films and live lesson recaps, every piece is designed to position Greenline as the authority in golf performance.',
    deliverables: ['DNA Talk YouTube Series (Ep.1–12)', 'Private Session Films', 'Live Lesson Recaps', 'Social Media Strategy', 'IG Reels Content Pack'],
    approach: [
      'Developed a complete media strategy to position Greenline as a premium golf performance brand',
      'Created the DNA Talk series — translating biomechanics data into cinematic, educational content',
      'Produced private session films that showcase Greenline\'s 1-on-1 coaching experience',
      'Designed content for multiple platforms: YouTube long-form, IG Reels, and TikTok shorts',
      'Every piece drives home one message: data-driven coaching that golfers can feel',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=k1g3pGY5_FE',
    videoIds: ['k1g3pGY5_FE', 'WHKnWnvq92o', 'JAPJ6WXCP84', '2dV6_RprHNM', 'mv7mWNTjlWE', 'ySxp3brtxa4', 'LjlAApGIXYQ'],
    platforms: ['YouTube', 'IG Reels', 'TikTok'],
    scale: 'Production',
    audience: 'Golf Serious Improver',
  },

  // ═══════════════════════════════════════════════════════
  // 12. Audi x Everwave — Cleanup Mission Thailand
  // ═══════════════════════════════════════════════════════
  {
    id: 'audi-cleanup-mission',
    title: 'Audi x Everwave — Cleanup Mission Thailand',
    industry: 'CSR / Sustainability',
    goal: 'Awareness',
    outputs: ['Documentary', 'Brand Film', 'Social Content'],
    styleDNA: ['Cinematic', 'Warm', 'Serious'],
    thumbnail: 'https://i.ytimg.com/vi/2n2Iy_UJtN0/hqdefault.jpg',
    gradient: gradients[11],
    description: 'A documentary-style film for the Cleanup Mission Thailand — a collaboration between Everwave, AEF, and TerraCycle, supported by Audi. Capturing the mission to clean Thailand\'s waterways and raise awareness about ocean-bound plastic. Purpose-driven storytelling at its most impactful.',
    deliverables: ['Documentary Film', 'Social Cutdowns', 'Campaign Recap Content'],
    approach: [
      'Followed the cleanup mission from preparation to execution',
      'Balanced environmental storytelling with brand presence',
      'Created emotionally compelling content that drives awareness and action',
      'Delivered a documentary that works for both CSR reporting and public engagement',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=2n2Iy_UJtN0',
    videoIds: ['2n2Iy_UJtN0'],
    platforms: ['YouTube', 'Website', 'Social Media'],
    scale: 'Signature',
    audience: 'Brand Manager',
  },

  // ═══════════════════════════════════════════════════════
  // 13. FC Bayern Bangkok — Event Cinematics
  // ═══════════════════════════════════════════════════════
  {
    id: 'fc-bayern-bangkok',
    title: 'FC Bayern Bangkok — Event Cinematics',
    industry: 'Sports & Entertainment',
    goal: 'Awareness',
    outputs: ['Event Recap', 'IG Reels', 'Social Content'],
    styleDNA: ['Loud Energy', 'Cinematic', 'Warm'],
    thumbnail: 'https://i.ytimg.com/vi/pHKzpUHoGbU/hqdefault.jpg',
    gradient: gradients[12],
    description: 'Event cinematics for the Audi x FC Bayern activation in Bangkok — capturing the energy of one of the world\'s biggest football clubs meeting Thai fans. From VIP moments to crowd reactions, every frame delivers the excitement.',
    deliverables: ['Event Recap Reel', 'Social Highlights', 'IG Reels Pack'],
    approach: [
      'Captured the full energy of a premium sports brand activation',
      'Mixed VIP and crowd perspectives for a complete event narrative',
      'Fast-turnaround delivery for social posting within 48 hours',
      'Delivered vertical-first content optimized for IG Reels and TikTok',
    ],
    videoUrl: 'https://www.youtube.com/shorts/pHKzpUHoGbU',
    videoIds: ['pHKzpUHoGbU'],
    platforms: ['IG Reels', 'TikTok', 'YouTube'],
    scale: 'Signature',
    audience: 'Event Organizer',
  },

  // ═══════════════════════════════════════════════════════
  // 14. Ranee's Restaurant — Social Content
  // ═══════════════════════════════════════════════════════
  {
    id: 'ranees-restaurant',
    title: 'Ranee\'s Restaurant — Social Content',
    industry: 'Restaurant / F&B',
    goal: 'Awareness',
    outputs: ['Social Content', 'IG Reels', 'Food Films'],
    styleDNA: ['Warm', 'Playful', 'Aspirational'],
    thumbnail: 'https://i.ytimg.com/vi/X3-hbS_wKLg/hqdefault.jpg',
    gradient: gradients[13],
    description: 'Social content production for Ranee\'s Restaurant — from signature dishes to pasta close-ups, every reel is crafted to make you hungry and want to visit. Warm, inviting, and designed to drive foot traffic.',
    deliverables: ['IG Reels Pack', 'Food Feature Shorts', 'Social Content Calendar'],
    approach: [
      'Styled and shot food content that feels premium yet approachable',
      'Created short-form vertical content optimized for IG Reels discovery',
      'Focused on texture, steam, and motion to trigger cravings',
      'Delivered content that works as both organic posts and paid promotion',
    ],
    videoUrl: 'https://www.youtube.com/shorts/X3-hbS_wKLg',
    videoIds: ['X3-hbS_wKLg', 'Oq5BZdMwz40'],
    platforms: ['IG Reels', 'TikTok'],
    scale: 'Starter',
    audience: 'Foodie Local',
  },
];

export const industries = [...new Set(cases.map(c => c.industry))];
export const goals = [...new Set(cases.map(c => c.goal))];
export const allOutputs = [...new Set(cases.flatMap(c => c.outputs))];
export const allStyleDNA = [...new Set(cases.flatMap(c => c.styleDNA))];
