import { Brief, Mission } from '@/types/brief';
import { cases } from '@/data/cases';
import type { CaseStudy } from '@/types/brief';

// ─── Style DNA string → numeric mapping ───
// Maps case study's string-based styleDNA to approximate slider values
const styleDNAMap: Record<string, Partial<Record<string, number>>> = {
  'Quiet Luxury':  { quietVsLoud: 20 },
  'Loud Energy':   { quietVsLoud: 80 },
  'Warm':          { quietVsLoud: 45 },
  'Cinematic':     { cinematicVsUGC: 20 },
  'UGC':           { cinematicVsUGC: 80 },
  'Minimal':       { minimalVsMaximal: 20 },
  'Maximal':       { minimalVsMaximal: 80 },
  'Playful':       { funnyVsSerious: 30 },
  'Funny':         { funnyVsSerious: 20 },
  'Serious':       { funnyVsSerious: 80 },
  'Aspirational':  { funnyVsSerious: 65 },
};

function caseToNumericDNA(c: CaseStudy): Brief['styleDNA'] {
  const dna = { quietVsLoud: 50, cinematicVsUGC: 50, minimalVsMaximal: 50, funnyVsSerious: 50 };
  for (const tag of c.styleDNA) {
    const mapped = styleDNAMap[tag];
    if (mapped) Object.assign(dna, mapped);
  }
  return dna;
}

// ─── Industry keyword detection from audience text ───
const industryKeywords: Record<string, string[]> = {
  'Automotive':            ['car', 'auto', 'vehicle', 'motor', 'drive', 'ev', 'suv', 'sedan', 'รถ', 'รถยนต์', 'audi', 'benz', 'bmw', 'ducati', 'motorcycle'],
  'Restaurant / F&B':     ['food', 'restaurant', 'cafe', 'dining', 'bar', 'drink', 'eat', 'chef', 'menu', 'อาหาร', 'ร้านอาหาร', 'เครื่องดื่ม'],
  'Golf / Lifestyle':     ['golf', 'golfer', 'กอล์ฟ', 'swing', 'course', 'club'],
  'Event / Concert':      ['event', 'concert', 'festival', 'show', 'party', 'exhibition', 'expo', 'งาน', 'คอนเสิร์ต'],
  'Education':            ['school', 'education', 'university', 'training', 'learn', 'student', 'academy', 'โรงเรียน'],
  'CSR / Sustainability': ['csr', 'sustainability', 'environment', 'green', 'social responsibility', 'สิ่งแวดล้อม'],
  'Real Estate':          ['property', 'real estate', 'condo', 'house', 'residence', 'living', 'apartment', 'คอนโด', 'บ้าน', 'ที่อยู่อาศัย'],
  'Sports & Entertainment': ['football', 'soccer', 'sports', 'entertainment', 'ฟุตบอล', 'กีฬา', 'muay thai', 'boxing'],
  'Lifestyle / Brand Collab': ['lifestyle', 'collaboration', 'collab', 'fashion', 'brand', 'แฟชั่น'],
};

function detectIndustry(audienceText: string): string | null {
  if (!audienceText.trim()) return null;
  const lower = audienceText.toLowerCase();
  let best: string | null = null;
  let bestCount = 0;
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    const count = keywords.filter(kw => lower.includes(kw)).length;
    if (count > bestCount) { bestCount = count; best = industry; }
  }
  return best;
}

// ─── Vibe distance (Euclidean on 4 axes, normalized 0-1) ───
function vibeDistance(a: Brief['styleDNA'], b: Brief['styleDNA']): number {
  const d = (
    (a.quietVsLoud - b.quietVsLoud) ** 2 +
    (a.cinematicVsUGC - b.cinematicVsUGC) ** 2 +
    (a.minimalVsMaximal - b.minimalVsMaximal) ** 2 +
    (a.funnyVsSerious - b.funnyVsSerious) ** 2
  );
  // Max possible distance: 4 * 100^2 = 40000
  return Math.sqrt(d) / 200;
}

// ─── Main matching function ───
export interface MatchedCase {
  caseStudy: CaseStudy;
  score: number;
  matchReason: string;
}

interface MatchOptions {
  mission?: Mission | null;
  audienceText?: string;
  styleDNA?: Brief['styleDNA'];
  limit?: number;
  excludeIds?: string[];
}

export function matchCases(options: MatchOptions): MatchedCase[] {
  const { mission, audienceText = '', styleDNA, limit = 3, excludeIds = [] } = options;
  const detectedIndustry = detectIndustry(audienceText);

  const scored = cases
    .filter(c => !excludeIds.includes(c.id))
    .map(c => {
      let score = 0;
      const reasons: string[] = [];

      // Factor 1: Mission match (40%)
      if (mission && c.goal.toLowerCase() === missionToGoal(mission).toLowerCase()) {
        score += 0.4;
        reasons.push('Same goal');
      }

      // Factor 2: Industry keyword match (30%)
      if (detectedIndustry && c.industry === detectedIndustry) {
        score += 0.3;
        reasons.push('Same industry');
      }

      // Factor 3: Vibe proximity (30%) — inverted distance
      if (styleDNA) {
        const caseDNA = caseToNumericDNA(c);
        const dist = vibeDistance(styleDNA, caseDNA);
        const vibeScore = (1 - dist) * 0.3;
        score += vibeScore;
        if (dist < 0.3) reasons.push('Similar vibe');
      }

      return { caseStudy: c, score, matchReason: reasons.join(' · ') || 'Related work' };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

// ─── Helper: Mission ID → Case goal string ───
function missionToGoal(mission: Mission): string {
  const map: Record<Mission, string> = {
    'launch-film': 'Launch',
    'brand-film': 'Awareness',
    'social-campaign': 'Awareness',
    'ad-spot': 'Sales',
    'event-content': 'Retention',
    'retainer': 'Retention',
  };
  return map[mission] ?? mission;
}

// ─── Convenience: match for Phase 1 (mission + audience only) ───
export function matchForMission(mission: Mission | null, audienceText: string): MatchedCase[] {
  return matchCases({ mission, audienceText, limit: 2 });
}

// ─── Convenience: match for Phase 2 (vibe focused, exclude Phase 1 results) ───
export function matchForVibe(
  mission: Mission | null,
  audienceText: string,
  styleDNA: Brief['styleDNA'],
  excludeIds: string[] = []
): MatchedCase[] {
  return matchCases({ mission, audienceText, styleDNA, limit: 2, excludeIds });
}
