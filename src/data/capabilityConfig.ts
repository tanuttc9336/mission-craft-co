import { Film, Smartphone, Camera, BarChart3, LucideIcon } from 'lucide-react';

export interface CapabilityConfig {
  slug: string;
  label: string;
  /** Case IDs that belong to this capability (a case can appear in multiple) */
  caseIds: string[];
  headline: string;
  highlightLine: string;
  subtext: string;
  services: { icon: LucideIcon; title: string; description: string }[];
  ctaHeadline: string;
  ctaSubtext: string;
}

export const capabilityConfigs: CapabilityConfig[] = [
  // ─────────────────────────────────────────────
  // 1. Brand & Launch Films
  // ─────────────────────────────────────────────
  {
    slug: 'brand-films',
    label: 'Brand & Launch Films',
    caseIds: [
      'audi-launch-films',
      'ducati-xdiavel-nera',
      'audi-benzilla',
      'audi-cleanup-mission',
      'lkp-corporate-film',
      'benz-starflag-motorexpo',
      'sonle-residences',
    ],
    headline: 'A brand film\nisn\'t a video.',
    highlightLine: 'It\'s a first impression.',
    subtext:
      'Cinematic brand films and launch content — from concept to final cut. Built to make your audience feel something before they even know what you\'re selling.',
    services: [
      {
        icon: Film,
        title: 'Launch Films',
        description:
          'Product launches, model reveals, property unveilings — captured with a cinematic language that matches the scale of the moment.',
      },
      {
        icon: Film,
        title: 'Brand Films',
        description:
          'Your brand story, told through people, places, and purpose. Corporate, employer, or consumer-facing — we make them all worth watching.',
      },
      {
        icon: Film,
        title: 'Documentary & CSR',
        description:
          'Purpose-driven storytelling — environmental campaigns, community projects, and brand missions that deserve real depth.',
      },
      {
        icon: Smartphone,
        title: 'Social Cutdowns',
        description:
          'Every hero film comes with platform-ready cutdowns — vertical, square, and landscape — optimized for the feed.',
      },
    ],
    ctaHeadline: 'Make the first impression count',
    ctaSubtext:
      'A great brand film earns attention, builds trust, and sets the tone for everything that follows.',
  },

  // ─────────────────────────────────────────────
  // 2. Social Content & Reels
  // ─────────────────────────────────────────────
  {
    slug: 'social-content',
    label: 'Social Content & Reels',
    caseIds: [
      'ranees-restaurant',
      'lim-lao-ngow',
      'sierra-tequila-party',
      'greenline-golf-lab',
      'audi-social-campaigns',
      'audi-launch-films',
      'audi-benzilla',
      'fc-bayern-bangkok',
      'audi-cleanup-mission',
      'hins-cup-golf',
      'jeeno-omazz-redline',
    ],
    headline: 'Scroll-stopping\ncontent',
    highlightLine: 'that actually converts.',
    subtext:
      'Short-form video, reels, and platform-native content — designed to perform on IG, TikTok, YouTube Shorts, and Meta Ads.',
    services: [
      {
        icon: Smartphone,
        title: 'IG Reels & TikTok',
        description:
          'Vertical-first content crafted for discovery — food close-ups, product reveals, lifestyle moments — built to trigger saves and shares.',
      },
      {
        icon: Smartphone,
        title: 'Content Packs',
        description:
          'Batch-produced content for consistent posting — planned around your calendar, shot efficiently, delivered ready to publish.',
      },
      {
        icon: BarChart3,
        title: 'Meta Ads & Paid Social',
        description:
          'Performance-driven content — A/B-ready variations, hook-first edits, and platform specs baked into every cut.',
      },
      {
        icon: Film,
        title: 'Food & Product Films',
        description:
          'Texture, steam, motion, detail — cinematic short-form content that makes people hungry, curious, and ready to act.',
      },
    ],
    ctaHeadline: 'Feed the algorithm something worth watching',
    ctaSubtext:
      'The best social content doesn\'t just fill a calendar — it earns attention, drives action, and builds a brand people follow.',
  },

  // ─────────────────────────────────────────────
  // 3. Event Coverage
  // ─────────────────────────────────────────────
  {
    slug: 'event-coverage',
    label: 'Event Coverage',
    caseIds: [
      'audi-events',
      'benz-starflag-motorexpo',
      'rajadamnern-world-series',
      'fc-bayern-bangkok',
      'hins-cup-golf',
      'sierra-tequila-party',
      'sonle-residences',
      'jeeno-omazz-redline',
    ],
    headline: 'Your event\nhappens once.',
    highlightLine: 'The content lives forever.',
    subtext:
      'Multi-camera event coverage, recap films, and aftermovies — delivered fast, produced to a standard your brand can be proud of.',
    services: [
      {
        icon: Camera,
        title: 'Event Recap Films',
        description:
          'The definitive piece — a cinematic recap that captures the energy, the highlights, and the atmosphere of the day.',
      },
      {
        icon: Smartphone,
        title: 'Same-Week Social Delivery',
        description:
          'Fast-turnaround vertical content for social — delivered within 48 hours so you can ride the post-event momentum.',
      },
      {
        icon: Camera,
        title: 'Multi-Camera Coverage',
        description:
          'Stage, crowd, VIP, backstage — covered from every angle with a team built for live environments.',
      },
      {
        icon: Film,
        title: 'Aftermovies',
        description:
          'A long-form recap that works as both highlight reel and promotional tool for the next edition.',
      },
    ],
    ctaHeadline: 'Capture the moment. Extend the impact.',
    ctaSubtext:
      'Great events deserve content that keeps the energy alive long after the lights go down.',
  },

  // ─────────────────────────────────────────────
  // 4. Campaign & Strategy
  // ─────────────────────────────────────────────
  {
    slug: 'campaign-strategy',
    label: 'Campaign & Strategy',
    caseIds: [
      'greenline-golf-lab',
      'audi-social-campaigns',
      'audi-benzilla',
      'lim-lao-ngow',
      'ranees-restaurant',
    ],
    headline: 'Content without\nstrategy is noise.',
    highlightLine: 'We plan the signal.',
    subtext:
      'Full media strategy, content planning, and multi-channel campaign production — not just making content, but making it work.',
    services: [
      {
        icon: BarChart3,
        title: 'Media Strategy',
        description:
          'Content planning from the ground up — platform selection, content pillars, posting cadence, and audience targeting.',
      },
      {
        icon: Film,
        title: 'Campaign Production',
        description:
          'Multi-channel campaigns — from brand collaborations to social pushes — produced as a cohesive body of work, not one-offs.',
      },
      {
        icon: Smartphone,
        title: 'YouTube Series',
        description:
          'Serialized content designed for long-term audience building — educational, entertainment, or brand storytelling.',
      },
      {
        icon: BarChart3,
        title: 'Content Partnerships',
        description:
          'Ongoing production relationships — we plan and produce your entire media output so you can focus on running your brand.',
      },
    ],
    ctaHeadline: 'Stop posting. Start building.',
    ctaSubtext:
      'The brands people follow have a plan. We help you build one — and produce the content to match.',
  },
];

export function getCapabilityBySlug(slug: string): CapabilityConfig | undefined {
  return capabilityConfigs.find(c => c.slug === slug);
}
