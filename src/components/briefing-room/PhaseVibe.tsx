import React from 'react';
import { useBrief } from '@/hooks/useBrief';
import { channelOptions, missions } from '@/data/builder';
import { Channel, Mission } from '@/types/brief';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect, useRef } from 'react';
import { matchForVibe, matchForMission } from '@/utils/caseMatch';
import ExploreCard from './ExploreCard';

const sliders: { key: keyof ReturnType<typeof useBrief>['brief']['styleDNA']; left: string; right: string; leftDesc: string; rightDesc: string; explainer: string }[] = [
  { key: 'quietVsLoud',     left: 'Quiet',         right: 'Loud',        leftDesc: 'Pulls people in', rightDesc: 'Holds people in place', explainer: 'Quiet pulls people in. Loud holds them there.' },
  { key: 'cinematicVsUGC',  left: 'Polished',      right: 'Raw',         leftDesc: 'Designed and crafted', rightDesc: 'Real and honest',  explainer: 'Polished feels crafted. Raw feels honest.' },
  { key: 'minimalVsMaximal',left: 'Less',          right: 'More',        leftDesc: 'Trusts the silence', rightDesc: 'Fills the room',     explainer: 'Less trusts silence. More fills the room.' },
  { key: 'funnyVsSerious',  left: 'Funny',         right: 'Serious',     leftDesc: 'Lowers defense',  rightDesc: 'Raises stakes',         explainer: 'Funny earns affection. Serious earns trust.' },
];

function getVibeSentence(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 40 ? 'quiet' : dna.quietVsLoud > 60 ? 'loud' : 'balanced');
  parts.push(dna.cinematicVsUGC < 40 ? 'polished' : dna.cinematicVsUGC > 60 ? 'raw' : 'mixed');
  parts.push(dna.minimalVsMaximal < 40 ? 'minimal' : dna.minimalVsMaximal > 60 ? 'maximal' : 'composed');
  parts.push(dna.funnyVsSerious < 40 ? 'witty' : dna.funnyVsSerious > 60 ? 'serious' : 'flexible');
  return parts.join(' · ') + '.';
}

/* Territory label — wraps getZone for back-compat */
function getTerritory(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): { label: string; archive: number; zone: Zone } {
  const zone = getZone(dna);
  return { label: zone + ' zone', archive: ZONE_ARCHIVE[zone], zone };
}

const filteredChannels = channelOptions.filter(c => c.id !== 'led-screen');

/* Per-channel explainer — educational + plain (Phase 1 pattern) */
const CHANNEL_INFO: Record<Channel, string> = {
  'tiktok':       'Native energy. Speed wins.',
  'ig-reels':     'Quick cuts. Saves matter.',
  'youtube':      'Long form. Cinematic room.',
  'meta-ads':     'Performance. A/B ready.',
  'website-hero': 'Sets the brand temperature.',
  'led-screen':   'OOH presence. Big-format.',
};

/* MOVE A · Channel order per mission — smart reorder so most-likely picks come first */
const CHANNEL_BY_MISSION: Record<Mission, Channel[]> = {
  'launch-film':     ['youtube', 'ig-reels', 'meta-ads', 'tiktok', 'website-hero'],
  'brand-film':      ['youtube', 'website-hero', 'ig-reels', 'meta-ads', 'tiktok'],
  'social-campaign': ['ig-reels', 'tiktok', 'meta-ads', 'youtube', 'website-hero'],
  'ad-spot':         ['meta-ads', 'youtube', 'ig-reels', 'tiktok', 'website-hero'],
  'event-content':   ['ig-reels', 'youtube', 'tiktok', 'meta-ads', 'website-hero'],
  'retainer':        ['ig-reels', 'youtube', 'website-hero', 'meta-ads', 'tiktok'],
};

/* MOVE C · Pattern label v2 — combines mission + zone into richer label */
type Zone = 'cinematic-restrained' | 'cinematic-energy' | 'quiet-real' | 'raw-energy';
function getZone(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): Zone {
  const isQuiet = dna.quietVsLoud < 50;
  const isCinematic = dna.cinematicVsUGC < 50;
  if (isQuiet && isCinematic) return 'cinematic-restrained';
  if (!isQuiet && isCinematic) return 'cinematic-energy';
  if (isQuiet && !isCinematic) return 'quiet-real';
  return 'raw-energy';
}
const PATTERN_V2: Record<Mission, Record<Zone, string>> = {
  'launch-film':     { 'cinematic-restrained': 'patient launch',     'cinematic-energy': 'kinetic launch',     'quiet-real': 'intimate launch',    'raw-energy': 'viral launch' },
  'brand-film':      { 'cinematic-restrained': 'monumental brand',   'cinematic-energy': 'epic brand',         'quiet-real': 'heritage brand',     'raw-energy': 'punk brand' },
  'social-campaign': { 'cinematic-restrained': 'premium social',     'cinematic-energy': 'scroll-stopping social', 'quiet-real': 'community social', 'raw-energy': 'guerrilla social' },
  'ad-spot':         { 'cinematic-restrained': 'elegant ad',         'cinematic-energy': 'performance ad',     'quiet-real': 'honest ad',          'raw-energy': 'punchy ad' },
  'event-content':   { 'cinematic-restrained': 'cinematic capture',  'cinematic-energy': 'festival energy',    'quiet-real': 'documentary capture','raw-energy': 'live-wire capture' },
  'retainer':        { 'cinematic-restrained': 'editorial retainer', 'cinematic-energy': 'always-on energy',   'quiet-real': 'publisher retainer', 'raw-energy': 'scrappy retainer' },
};
const ZONE_ARCHIVE: Record<Zone, number> = {
  'cinematic-restrained': 14,
  'cinematic-energy': 9,
  'quiet-real': 7,
  'raw-energy': 11,
};

/* MOVE 1 · Cross-phase insight — audience (Phase 1) × vibe zone (Phase 2) = CD wisdom */
const CROSS_INSIGHT: Record<string, Record<Zone, string>> = {
  'New to you': {
    'cinematic-restrained': 'Strangers trust slow. Earn the seat.',
    'cinematic-energy': 'Bright introduces. Loud overwhelms.',
    'quiet-real': 'Honesty unlocks the first yes.',
    'raw-energy': 'Bold introductions, bigger memory.',
  },
  'Already with you': {
    'cinematic-restrained': 'Loyalty rewards depth.',
    'cinematic-energy': 'Celebrate the people who chose you.',
    'quiet-real': 'Insiders need warmth, not pitch.',
    'raw-energy': 'Reward the inner circle with edge.',
  },
  'Still comparing': {
    'cinematic-restrained': 'Refinement separates you. Show craft.',
    'cinematic-energy': 'Stand out fast. Sharpen positioning.',
    'quiet-real': 'Honest comparison wins skeptics.',
    'raw-energy': 'Punk pulls cross-shoppers — if real.',
  },
  'Ready to buy': {
    'cinematic-restrained': 'Confirm the choice. Quiet certainty closes.',
    'cinematic-energy': 'Push energy converts pre-sold.',
    'quiet-real': 'Let truth deliver the final yes.',
    'raw-energy': 'Activation with attitude. Move them now.',
  },
  'Need convincing': {
    'cinematic-restrained': 'Show, don\'t sell. Restraint earns trust.',
    'cinematic-energy': 'High-contrast proof breaks doubt.',
    'quiet-real': 'Honesty is the proof.',
    'raw-energy': 'Skeptics reject polish. Lean raw.',
  },
};

/* MOVE 2 · Channel × Vibe fit — each channel has preferred zones */
const CHANNEL_ZONES: Record<Channel, { ideal: Zone[]; workable: Zone[] }> = {
  'tiktok':       { ideal: ['raw-energy', 'cinematic-energy'], workable: ['quiet-real'] },
  'ig-reels':     { ideal: ['cinematic-energy', 'raw-energy'], workable: ['cinematic-restrained'] },
  'youtube':      { ideal: ['cinematic-restrained', 'cinematic-energy'], workable: ['quiet-real'] },
  'meta-ads':     { ideal: ['cinematic-energy', 'cinematic-restrained'], workable: ['raw-energy'] },
  'website-hero': { ideal: ['cinematic-restrained', 'quiet-real'], workable: ['cinematic-energy'] },
  'led-screen':   { ideal: ['cinematic-energy'], workable: ['cinematic-restrained'] },
};
function channelFit(channelId: Channel, zone: Zone): 'strong' | 'workable' | 'tension' {
  const map = CHANNEL_ZONES[channelId];
  if (!map) return 'workable';
  if (map.ideal.includes(zone)) return 'strong';
  if (map.workable.includes(zone)) return 'workable';
  return 'tension';
}

/* SMART · Meta profile — synthesizes mission + audience + zone into one project name */
function computeMetaProfile(mission: Mission | null, audienceText: string, zone: Zone): string | null {
  if (!mission || !audienceText) return null;
  const missionShape = PATTERN_V2[mission][zone]; // e.g., 'patient launch'
  // Audience modifier — strip first word into adjective
  const audWordMap: Record<string, string> = {
    'New to you': 'first-impression',
    'Already with you': 'loyalty',
    'Still comparing': 'comparison',
    'Ready to buy': 'closing',
    'Need convincing': 'skeptic',
  };
  const audMod = audWordMap[audienceText];
  if (!audMod) return missionShape;
  return `${audMod} · ${missionShape}`;
}

/* SMART · Archive depth — specific production traits when signature recognized */
const ARCHIVE_DEPTH: Record<string, string> = {
  'Cinematic restraint': 'Avg 90s · slow push · deeper grades · 5500K.',
  'Sharp cinema':         'Hard cuts · oxblood + ink · high contrast.',
  'Pop maximalist':       'Snap cuts · 1.5× pace · saturated grade.',
  'Punk maximalist':      'Mixed media · VHS texture · clash colors.',
  'Documentary':          'Long takes · natural light · earth grade.',
  'Layered honesty':      'Mid-takes · soft focus · mixed-format.',
  'Stripped raw':         'Mono-color · brutalist · tight crops.',
  'Quiet wit':            'Soft cuts · pastel grade · breath room.',
};

/* SMART · Next step suggestion — proactive guidance */
function computeNextStep(
  mission: Mission | null,
  audienceText: string,
  keyOffer: string,
  channels: Channel[],
  conviction: number,
  zone: Zone,
): string | null {
  if (!mission) return null; // nothing to suggest yet
  if (!audienceText) return 'Pick audience back in Phase 1 — it sharpens the vibe.';
  if (!keyOffer) return 'Lock the one-liner — Phase 1 still pending.';
  if (conviction < 25) return 'Move a slider — the studio responds live.';
  if (channels.length === 0) {
    // Suggest best-fit channel for current zone
    const bestChannel = (Object.keys(CHANNEL_ZONES) as Channel[]).find(c =>
      CHANNEL_ZONES[c].ideal.includes(zone)
    );
    const chMap: Record<Channel, string> = {
      'tiktok': 'TikTok',
      'ig-reels': 'IG Reels',
      'youtube': 'YouTube',
      'meta-ads': 'Meta Ads',
      'website-hero': 'Website hero',
      'led-screen': 'LED Screen',
    };
    return bestChannel ? `Pick channels — ${chMap[bestChannel]} fits this zone.` : 'Pick channels next.';
  }
  return null; // complete
}

/* ─── VibeStudio · live kinetic panel reacting to sliders (Gateway-grade visual) ─── */
type VibeSection = 'vibe' | 'channels';

/* ─── User-experience logic: conviction, signature, tension, studio note ─── */

/* Conviction = how far sliders are from neutral (50). 0-100. */
function computeConviction(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): number {
  const distances = [
    Math.abs(dna.quietVsLoud - 50),
    Math.abs(dna.cinematicVsUGC - 50),
    Math.abs(dna.minimalVsMaximal - 50),
    Math.abs(dna.funnyVsSerious - 50),
  ];
  const avg = distances.reduce((a, b) => a + b, 0) / 4;
  return Math.min(100, Math.round((avg / 50) * 100));
}

/* Alignment — direction agreement across sliders. 0 = balanced, 1 = aligned, -1 = tension. */
function computeAlignment(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): { state: 'aligned' | 'tension' | 'balanced'; label: string } {
  const sides = [
    dna.quietVsLoud < 50 ? -1 : 1,
    dna.cinematicVsUGC < 50 ? -1 : 1,
    dna.minimalVsMaximal < 50 ? -1 : 1,
    dna.funnyVsSerious < 50 ? -1 : 1,
  ];
  const conviction = computeConviction(dna);
  if (conviction < 25) return { state: 'balanced', label: 'Balanced — pick a stronger lean.' };
  const sum = Math.abs(sides.reduce((a, b) => a + b, 0));
  if (sum >= 3) return { state: 'aligned', label: 'Aligned — strong direction.' };
  if (sum === 0 && conviction > 60) return { state: 'tension', label: 'Bold tension — unusual but workable.' };
  return { state: 'balanced', label: 'Settling in.' };
}

/* Signature — recognized 4-slider combo with conviction > 60. Returns name or null. */
function computeSignature(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): string | null {
  const conviction = computeConviction(dna);
  if (conviction < 60) return null;
  const Q = dna.quietVsLoud < 50;       // quiet
  const P = dna.cinematicVsUGC < 50;    // polished
  const L = dna.minimalVsMaximal < 50;  // less
  const F = dna.funnyVsSerious < 50;    // funny

  if (Q && P && L && !F) return 'Cinematic restraint';
  if (!Q && P && !L && F) return 'Pop maximalist';
  if (Q && !P && L && !F) return 'Documentary';
  if (!Q && !P && !L && F) return 'Punk maximalist';
  if (Q && P && L && F) return 'Quiet wit';
  if (!Q && P && L && !F) return 'Sharp cinema';
  if (Q && !P && !L && !F) return 'Layered honesty';
  if (!Q && !P && L && !F) return 'Stripped raw';
  return null;
}

/* Studio live note — cross-phase wisdom > signature > alignment > base */
function computeStudioNote(
  dna: ReturnType<typeof useBrief>['brief']['styleDNA'],
  alignment: { state: string; label: string },
  signature: string | null,
  audienceText: string,
  zone: Zone,
): string {
  // Tier 1: Cross-phase insight if audience matches a known archetype
  const insight = CROSS_INSIGHT[audienceText]?.[zone];
  if (insight) return insight;
  // Tier 2: Recognized signature
  if (signature) return `${signature} signature — recognized.`;
  // Tier 3: Alignment state
  return alignment.label;
}

/* Color logic anchored to color psychology + design theory research.
   References:
   - Munsell color system (1905-1915) — value × chroma × hue perceptual mapping
   - Itten's color contrast (Bauhaus, 1961) — 7 contrast types
   - Mark Vargo (ASC) — cinema color temperature psychology
   - Pearson/Mark "The Hero and the Outlaw" (2001) — 12 brand archetypes
   - Eva Heller "Wie Farben wirken" (2009) — color emotion empirical research
   - Japanese aesthetics: Kanso (simplicity), Shibui (subtle), Wabi-sabi (weathered)
   - Pantone Color Institute trend research
   - Adobe Color theory (analogous, triadic, complementary, mono modes) */
function computePalette(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): [string, string, string] {
  const Q = dna.quietVsLoud / 100;
  const P = dna.cinematicVsUGC / 100;
  const L = dna.minimalVsMaximal / 100;
  const F = dna.funnyVsSerious / 100;

  // ─── HUE — Vargo cinema theory + 4-quadrant matrix with sub-curves ─
  // F-curve refined for emotional precision:
  //   < 0.25 very funny: pure reds/oranges (passion, energy)
  //   0.25-0.5 mild funny: corals/ambers (comfort, warm)
  //   0.5-0.75 mild serious: blue-violets (introspection)
  //   > 0.75 very serious: deep navy (authority)
  let hue: number;
  if (F < 0.5) {
    // FUNNY — warm range, polished/raw split
    if (P < 0.5) {
      // Polished funny — red-coral jewel (Glossier, Aēsop)
      hue = F < 0.25
        ? 0 + F * 60                           // 0°-15°: pure reds (very funny + polished)
        : 15 + (F - 0.25) * 100;               // 15°-40°: coral (mild funny + polished)
      hue += (1 - P) * 12;                     // sharper polish pulls toward jewel
    } else {
      // Raw funny — orange-amber-sienna (Patagonia)
      hue = F < 0.25
        ? 25 + F * 80                          // 25°-45°: orange (very funny + raw)
        : 35 + (F - 0.25) * 100;               // 35°-60°: amber (mild funny + raw)
      hue += P * 8;                            // raw shift slight warmer
    }
  } else {
    // SERIOUS — cool range, polished/raw split
    if (P < 0.5) {
      // Polished serious — navy-indigo (Apple, Bottega)
      hue = F < 0.75
        ? 240 + (F - 0.5) * 100                // 240°-265°: indigo (mild serious)
        : 200 + (F - 0.75) * 100;              // 200°-225°: deep navy (very serious)
      hue += (1 - P) * 8;
    } else {
      // Raw serious — sage-olive (A24, Aesop heritage)
      hue = F < 0.75
        ? 100 + (F - 0.5) * 60                 // 100°-130°: forest (mild serious + raw)
        : 80 + (F - 0.75) * 80;                // 80°-100°: olive (very serious + raw)
    }
  }

  // ─── SATURATION — Munsell chroma · empirical research from Heller ──
  // Quiet/loud primary · polished sharpens · raw mutes 25% · serious dampens 8%
  let sat = 35 + Q * 55;
  sat *= P < 0.5 ? (1 + (1 - P) * 0.06) : (1 - P * 0.25);
  sat *= (1 - F * 0.08);

  // ─── LIGHTNESS — Munsell value bands ────────────────────────────
  // Value 3-4 (somber/dramatic): luxury depth
  // Value 5-6 (grounded): everyday premium
  // Value 7-8 (airy): lifestyle/optimistic
  let light = 48 + L * 14 - F * 5 + Q * 4;
  if (P < 0.5) light -= 4;       // polished jewel-depth (deeper Munsell value)
  else light += 2;               // raw earth-airiness

  // ─── COLOR MODE (3-tier by L) — Adobe theory ──────────────────
  let h2: number, h3: number, sat2: number, sat3: number, light2: number, light3: number;

  if (L < 0.30) {
    // MONOCHROMATIC — Kanso simplicity (Japanese)
    h2 = hue;
    h3 = hue;
    sat2 = sat * 0.65;
    sat3 = sat * 1.10;
    light2 = light - 13;
    light3 = light + 13;
  } else if (L < 0.70) {
    // ANALOGOUS — harmonic (Itten secondary contrast)
    const spread = 25 + (L - 0.30) * 35;
    h2 = (hue + spread) % 360;
    h3 = (hue - spread + 360) % 360;
    sat2 = sat * 0.85;
    sat3 = sat * 0.75;
    light2 = light - 4;
    light3 = light + 7;
  } else {
    // TRIADIC — Bauhaus primary triad (variety + tension)
    h2 = (hue + 120) % 360;
    h3 = (hue + 240) % 360;
    sat2 = sat * 0.82;
    sat3 = sat * 0.70;
    light2 = light - 4;
    light3 = light + 6;
  }

  // ─── ARCHETYPE ANCHORS (Pearson/Mark) — 8 signatures nudged for fidelity ─
  const isQuiet = Q < 0.4, isLoud = Q > 0.6;
  const isPolished = P < 0.4, isRaw = P > 0.6;
  const isLess = L < 0.4, isMore = L > 0.6;
  const isFunny = F < 0.4, isSerious = F > 0.6;

  // Cinematic restraint (Sage archetype) — Apple Pro / Bottega depth
  if (isQuiet && isPolished && isLess && isSerious) {
    light = Math.min(light, 36);
    sat = Math.max(sat, 38);
  }
  // Sharp cinema (Hero/Ruler) — Apple Pro: oxblood + ink + bone
  if (isLoud && isPolished && isLess && isSerious) {
    hue = 358;                                    // pure oxblood
    sat = Math.min(80, Math.max(sat, 60));
    light = 28;
  }
  // Pop maximalist (Jester/Creator) — Spotify Wrapped saturation punch
  if (isLoud && isPolished && isMore && isFunny) {
    sat = Math.min(95, sat * 1.18);
    sat2 = Math.min(92, sat2 * 1.15);
    sat3 = Math.min(90, sat3 * 1.12);
  }
  // Punk maximalist (Outlaw) — Margiela clash
  if (isLoud && isRaw && isMore && isFunny) {
    sat = Math.min(95, sat * 1.20);
    sat2 = Math.min(92, sat2 * 1.18);
  }
  // Documentary (Sage/Caregiver) — Patagonia earth
  if (isQuiet && isRaw && isLess && isSerious) {
    sat = Math.min(48, sat);
    light = Math.max(40, Math.min(50, light));
  }
  // Layered honesty (Sage) — A24: olive + umber + slate
  if (isQuiet && isRaw && isMore && isSerious) {
    sat = Math.min(55, sat);
    sat2 = Math.min(50, sat2);
    sat3 = Math.min(45, sat3);
  }
  // Stripped raw (Outlaw) — brutalist warm-concrete mono
  if (isLoud && isRaw && isLess && isSerious) {
    sat = Math.min(50, sat);
    hue = 25;                                     // warm concrete
    light = 35;
  }
  // Quiet wit (Innocent/Lover) — Aēsop pastel
  if (isQuiet && isPolished && isLess && isFunny) {
    light = Math.max(light, 58);
    sat = Math.min(58, sat);
  }

  // ─── ITTEN COMPLEMENTARY contrast for ultra-extreme combos ─────
  // When extremeness > 0.95 AND in triadic mode, swap one secondary to true 180° complement
  const extremeness = Math.max(
    Math.abs(Q - 0.5) * 2,
    Math.abs(P - 0.5) * 2,
    Math.abs(L - 0.5) * 2,
    Math.abs(F - 0.5) * 2,
  );
  if (extremeness > 0.95 && L >= 0.70) {
    h2 = (hue + 180) % 360;        // pure complement (Itten max contrast)
    sat2 = Math.min(95, sat * 0.95);
  }
  if (extremeness > 0.85) {
    sat = Math.min(95, sat * 1.08);
    sat2 = Math.min(92, sat2 * 1.08);
    sat3 = Math.min(88, sat3 * 1.08);
  }

  // ─── Centered combo soften ────────────────────────────────────
  const isCentered = Math.abs(Q - 0.5) < 0.15 && Math.abs(P - 0.5) < 0.15 && Math.abs(L - 0.5) < 0.15 && Math.abs(F - 0.5) < 0.15;
  if (isCentered) {
    sat *= 0.9;
    sat2 *= 0.9;
    sat3 *= 0.9;
  }

  // ─── CLAMP — Munsell-inspired bands ───────────────────────────
  const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));
  sat = clamp(sat, 28, 92);
  sat2 = clamp(sat2, 22, 88);
  sat3 = clamp(sat3, 18, 85);
  light = clamp(light, 26, 62);
  light2 = clamp(light2, 22, 64);
  light3 = clamp(light3, 28, 70);
  hue = (hue + 360) % 360;

  return [
    `${Math.round(hue)} ${Math.round(sat)}% ${Math.round(light)}%`,
    `${Math.round(h2)} ${Math.round(sat2)}% ${Math.round(light2)}%`,
    `${Math.round(h3)} ${Math.round(sat3)}% ${Math.round(light3)}%`,
  ];
}

/* Map slider values → scene config (palette computed continuously, fonts/decoration discrete) */
function studioScene(dna: ReturnType<typeof useBrief>['brief']['styleDNA']) {
  const isQuiet = dna.quietVsLoud < 50;
  const isLess = dna.minimalVsMaximal < 50;
  const isFunny = dna.funnyVsSerious < 50;

  // Palette: continuous from all 4 sliders
  const palette = computePalette(dna);

  // Font by funny × less (4 distinct typefaces — discrete by design)
  const fontFamily =
    isFunny && isLess         ? "'Caveat', cursive" :
    isFunny && !isLess        ? "'Anton', sans-serif" :
    !isFunny && isLess        ? "'Cormorant Garamond', serif" :
                                "'Cinzel', serif";
  const fontStyle = (!isFunny && isLess) ? 'italic' : 'normal';
  const fontWeight = isFunny && !isLess ? 400 : !isFunny && !isLess ? 700 : 400;

  // Decoration by less × quiet (4 discrete moods)
  const decoration =
    isLess && isQuiet     ? 'lightbeam' :
    isLess && !isQuiet    ? 'scanbands' :
    !isLess && isQuiet    ? 'particles' :
                            'halftone';

  return { palette, fontFamily, fontStyle, fontWeight, decoration };
}

function StudioDecoration({ kind }: { kind: string }) {
  if (kind === 'lightbeam') {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(115deg, transparent 30%, hsl(38 100% 70% / 0.12) 50%, transparent 70%)' }}
        animate={{ x: ['-10%', '10%', '-10%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    );
  }
  if (kind === 'scanbands') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 h-[2px]"
            style={{
              background: i === 0 ? 'hsl(190 100% 70% / 0.45)' : i === 1 ? 'hsl(330 100% 70% / 0.4)' : 'hsl(45 100% 70% / 0.45)',
              boxShadow: '0 0 20px currentColor',
              top: `${20 + i * 30}%`,
            }}
            animate={{ y: ['-100%', '600%'] }}
            transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'particles') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 2 === 0 ? 'hsl(30 100% 85%)' : 'hsl(330 80% 80%)',
              left: `${(i * 9.5) % 100}%`,
              bottom: '-10%',
              boxShadow: '0 0 8px currentColor',
            }}
            animate={{ y: ['0%', '-700%'], opacity: [0, 0.85, 0] }}
            transition={{ duration: 8 + (i % 4) * 1.5, repeat: Infinity, ease: 'easeOut', delay: i * 0.45 }}
          />
        ))}
      </div>
    );
  }
  if (kind === 'halftone') {
    return (
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(40 18% 92% / 0.35) 1px, transparent 1.5px)',
          backgroundSize: '8px 8px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '8px 8px'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    );
  }
  return null;
}

function VibeStudio({ activeSection }: { activeSection: VibeSection }) {
  const { brief } = useBrief();
  const truncate = (s: string, n = 28) => s.length <= n ? s + '.' : s.slice(0, n).trim() + '…';

  const scene = studioScene(brief.styleDNA);
  const vibeText = getVibeSentence(brief.styleDNA);
  const territory = getTerritory(brief.styleDNA);
  const conviction = computeConviction(brief.styleDNA);
  const alignment = computeAlignment(brief.styleDNA);
  const signature = computeSignature(brief.styleDNA);
  const studioNote = computeStudioNote(brief.styleDNA, alignment, signature, brief.audienceText, territory.zone);

  // Atmosphere debug values (mirror PhaseVibe computations)
  const Qv = brief.styleDNA.quietVsLoud / 100;
  const Pv = brief.styleDNA.cinematicVsUGC / 100;
  const Lv = brief.styleDNA.minimalVsMaximal / 100;
  const Fv = brief.styleDNA.funnyVsSerious / 100;
  const tempoSec = 0.20 + (Qv < 0.5 ? (1 - Qv) * 0.7 : 0) + (Fv > 0.5 ? Fv * 0.7 : 0);
  const sectionGap = 24 + (1 - Lv) * 56 - Qv * 12;
  const vignetteAlpha = 0.05 + Fv * 0.55;
  const textureAlpha = 0.10 + Pv * 0.55;

  // MOVE 3 · Brief readiness — completeness % across phases
  let readiness = 0;
  if (brief.mission) readiness += 22;
  if (brief.audienceText.trim()) readiness += 18;
  if (brief.offer.keyOffer.trim()) readiness += 18;
  if (conviction >= 25) readiness += 22;       // sliders dialed in
  if (brief.channels.length > 0) readiness += 20;

  // SMART layers
  const metaProfile = computeMetaProfile(brief.mission, brief.audienceText, territory.zone);
  const archiveDepth = signature ? ARCHIVE_DEPTH[signature] : null;
  const nextStep = computeNextStep(
    brief.mission,
    brief.audienceText,
    brief.offer.keyOffer,
    brief.channels,
    conviction,
    territory.zone,
  );

  // Phase 1 carry-over
  const phase1Lines: string[] = [];
  if (brief.mission) {
    const m = missions.find(x => x.id === brief.mission);
    if (m) phase1Lines.push(m.label + '.');
  }
  if (brief.audienceText.trim()) phase1Lines.push(truncate(brief.audienceText.split(/[,.;\n]/)[0].trim()));
  if (brief.offer.keyOffer.trim()) phase1Lines.push(truncate(brief.offer.keyOffer.trim(), 32));

  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));

  return (
    <aside className="hidden md:block">
      <div className="sticky top-24">

        {/* ── Listening panel ── */}
        <div className="border border-ink/15 p-4" style={{ backgroundColor: 'hsl(40 32% 97%)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/45">Listening</p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-oxblood">
              ready {readiness}%
            </p>
          </div>
          {/* TEMP debug: shows live atmosphere values · remove when verified */}
          <div className="mb-3 pb-2 border-b border-ink/10 font-mono text-[9px] text-ink/40 leading-[1.5]">
            <p>tempo {tempoSec.toFixed(2)}s · gap {Math.round(sectionGap)}px</p>
            <p>vignette {vignetteAlpha.toFixed(2)} · texture {textureAlpha.toFixed(2)}</p>
          </div>

          {/* Phase 1 carry-over */}
          <div className="font-mono text-[11px] text-ink/30 leading-[1.6] mb-3 space-y-0">
            {phase1Lines.length === 0 ? <span>—</span> : phase1Lines.map((l, i) => <p key={i}>{l}</p>)}
          </div>

          {/* META PROFILE — synthesized project name */}
          {metaProfile && (
            <div className="border-t border-ink/10 pt-2.5 mb-2.5">
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1">Profile</p>
              <p className="font-mono text-[11px] text-oxblood leading-[1.4]">
                {metaProfile}
              </p>
              <p className="font-mono text-[10px] text-ink/45 leading-[1.4]">
                {territory.archive} briefs sat here.
              </p>
            </div>
          )}

          {/* ARCHIVE DEPTH — production traits when signature recognized */}
          {archiveDepth && (
            <div className="border-t border-ink/10 pt-2.5 mb-2.5">
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1">Archive depth</p>
              <p className="font-mono text-[11px] text-ink/60 leading-[1.5] italic">
                {archiveDepth}
              </p>
            </div>
          )}

          {/* Studio note — live read of state */}
          <div className="border-t border-ink/10 pt-2.5 mb-2.5">
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1">Studio note</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={studioNote}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
                className={`font-mono text-[11px] leading-[1.4] italic ${signature ? 'text-oxblood' : 'text-ink/65'}`}
              >
                {studioNote}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Channels — fit score per channel against current vibe zone */}
          {selectedChannels.length > 0 && (
            <div className="border-t border-ink/10 pt-2.5">
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1">Channels × Vibe fit</p>
              <div className="space-y-0.5">
                {selectedChannels.map(c => {
                  const fit = channelFit(c.id, territory.zone);
                  const mark = fit === 'strong' ? '✓' : fit === 'workable' ? '⚠' : '⚡';
                  const color = fit === 'strong' ? 'text-oxblood' : fit === 'workable' ? 'text-ink/65' : 'text-ink/45';
                  return (
                    <p key={c.id} className={`font-mono text-[11px] leading-[1.5] ${color}`}>
                      <span className="inline-block w-3">{mark}</span> {c.label}
                      <span className="text-ink/40 ml-1">· {fit}</span>
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* NEXT STEP — proactive guidance from the studio */}
        {nextStep && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="border border-ink/15 p-4 mt-3"
            style={{ backgroundColor: 'hsl(40 32% 97%)' }}
          >
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ink/40 mb-1">Next</p>
            <p className="font-mono text-[11px] text-ink/75 leading-[1.5]">
              {nextStep}
            </p>
          </motion.div>
        )}
      </div>
    </aside>
  );
}

export default function PhaseVibe() {
  const { brief, updateStyleDNA, updateBrief } = useBrief();

  // Section tracking
  const [activeSection, setActiveSection] = useState<VibeSection>('vibe');
  const sectionVibeRef = useRef<HTMLElement | null>(null);
  const sectionChannelsRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const compute = () => {
      const probeY = window.innerHeight * 0.35;
      const sections: { id: VibeSection; el: HTMLElement | null }[] = [
        { id: 'vibe', el: sectionVibeRef.current },
        { id: 'channels', el: sectionChannelsRef.current },
      ];
      let active: VibeSection = 'vibe';
      sections.forEach(s => {
        if (!s.el) return;
        const top = s.el.getBoundingClientRect().top;
        if (top <= probeY) active = s.id;
      });
      setActiveSection(active);
    };
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const initTimer = setTimeout(compute, 100);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(initTimer);
    };
  }, []);

  const toggleChannel = (id: Channel) => {
    const next = brief.channels.includes(id)
      ? brief.channels.filter(c => c !== id)
      : [...brief.channels, id];
    updateBrief({ channels: next });
  };

  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const allRatios = [...new Set(selectedChannels.flatMap(c => c.aspectRatios))];

  // MOVE A · Smart channel reorder by mission — most-likely first
  const orderedChannels = useMemo(() => {
    if (brief.mission && CHANNEL_BY_MISSION[brief.mission]) {
      const order = CHANNEL_BY_MISSION[brief.mission];
      return order.map(id => filteredChannels.find(c => c.id === id)).filter((c): c is typeof filteredChannels[0] => Boolean(c));
    }
    return filteredChannels;
  }, [brief.mission]);

  const phase1Matches = useMemo(
    () => matchForMission(brief.mission, brief.audienceText),
    [brief.mission, brief.audienceText]
  );
  const phase1Ids = phase1Matches.map(m => m.caseStudy.id);
  const vibeMatches = useMemo(
    () => matchForVibe(brief.mission, brief.audienceText, brief.styleDNA, phase1Ids),
    [brief.mission, brief.audienceText, brief.styleDNA, phase1Ids]
  );

  // Compute palette for the whole-page atmosphere wash
  const pagePalette = computePalette(brief.styleDNA);

  // === ATMOSPHERE DIMENSIONS — research-backed multi-sensory drivers ===
  const Qv = brief.styleDNA.quietVsLoud / 100;
  const Pv = brief.styleDNA.cinematicVsUGC / 100;
  const Lv = brief.styleDNA.minimalVsMaximal / 100;
  const Fv = brief.styleDNA.funnyVsSerious / 100;

  // Animation tempo · DRAMATIC RANGE so it's visible
  const tempoSec = 0.20 + (Qv < 0.5 ? (1 - Qv) * 0.7 : 0) + (Fv > 0.5 ? Fv * 0.7 : 0);  // 0.2-1.6s

  // Spacing rhythm · DRAMATIC RANGE
  const sectionGap = 24 + (1 - Lv) * 56 - Qv * 12;    // 12-80px (was 36-64)
  const formMaxW = 560 + (1 - Lv) * 220;              // 560-780px (was 640-720)

  // Vignette intensity · DRAMATIC
  const vignetteAlpha = 0.05 + Fv * 0.55;              // 0.05 - 0.60 (was 0.05-0.37)

  // Texture density · DRAMATIC
  const textureAlpha = 0.10 + Pv * 0.55;               // 0.10 - 0.65 (was 0.08-0.38)

  return (
    <>
      {/* ── Page-wide vibe wash — color atmosphere ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: `
            radial-gradient(ellipse 80% 70% at 78% 25%, hsl(${pagePalette[0]} / 0.34) 0%, transparent 60%),
            radial-gradient(ellipse 70% 80% at 12% 60%, hsl(${pagePalette[1]} / 0.28) 0%, transparent 60%),
            radial-gradient(ellipse 90% 60% at 50% 100%, hsl(${pagePalette[2]} / 0.24) 0%, transparent 60%)
          `,
        }}
        transition={{ duration: tempoSec, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Vignette intensity overlay (Vargo cinema theory · F slider) ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: `radial-gradient(ellipse at center, transparent 35%, hsl(0 0% 4% / ${vignetteAlpha}) 100%)`,
        }}
        transition={{ duration: tempoSec, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ── Texture density layer (Wabi-sabi · P slider) ── */}
      <motion.div
        aria-hidden
        className="fixed inset-0 pointer-events-none mix-blend-multiply z-0"
        animate={{ opacity: textureAlpha }}
        transition={{ duration: tempoSec, ease: [0.22, 1, 0.36, 1] }}
      >
        <LivingGrain />
      </motion.div>

      <motion.div
        className="relative z-10 grid md:grid-cols-[1fr_300px]"
        animate={{ columnGap: 32 + (1 - Lv) * 16 }}
        transition={{ duration: tempoSec, ease: [0.22, 1, 0.36, 1] }}
      >
      <motion.div
        animate={{ rowGap: sectionGap, maxWidth: formMaxW }}
        transition={{ duration: tempoSec, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* Section A: Style DNA Sliders */}
        <section ref={sectionVibeRef as React.RefObject<HTMLElement>}>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-3">A · Vibe</p>
          <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-2 leading-tight">Dial in the vibe.</h2>
          <p className="text-ink/55 text-sm mb-8 max-w-lg leading-relaxed">
            How should this feel? Four directions, four answers.
          </p>

          <div className="space-y-8 max-w-2xl">
            {sliders.map(s => (
              <div key={s.key} className="border border-ink/15 bg-white/40 p-5">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink">{s.left}</span>
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/50">{s.right}</span>
                </div>
                <div className="flex justify-between text-[10px] text-ink/40 mb-4">
                  <span>{s.leftDesc}</span>
                  <span>{s.rightDesc}</span>
                </div>
                <Slider
                  value={[brief.styleDNA[s.key]]}
                  onValueChange={([v]) => updateStyleDNA({ [s.key]: v })}
                  max={100}
                  step={5}
                  className="w-full mb-3"
                />
                <p className="text-[11px] text-ink/55 italic leading-relaxed">{s.explainer}</p>
              </div>
            ))}
          </div>

          {/* Live vibe sentence */}
          <div className="mt-6 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/45 mb-2">Sounds like</p>
            <p className="font-display italic text-2xl text-ink">{getVibeSentence(brief.styleDNA)}</p>
          </div>
        </section>

        <div className="h-px bg-ink/10" />

        {/* Section B: Channels */}
        <section ref={sectionChannelsRef as React.RefObject<HTMLElement>}>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/50 mb-3">B · Channels</p>
          <h2 className="font-display italic text-2xl md:text-3xl text-ink mb-2 leading-tight">Where will this live?</h2>
          <p className="text-ink/55 text-sm mb-6 max-w-lg leading-relaxed">
            First pick is where we cut for. The rest get adapted from it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
            {orderedChannels.map(c => {
              const active = brief.channels.includes(c.id);
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleChannel(c.id)}
                  className={`text-left p-4 border transition-colors ${
                    active
                      ? 'border-oxblood bg-oxblood/8'
                      : 'border-ink/15 bg-white/60 hover:border-ink/45 hover:bg-white/90'
                  }`}
                >
                  <p className={`text-sm font-medium mb-1.5 ${active ? 'text-ink' : 'text-ink/85'}`}>
                    {c.label}
                  </p>
                  <p className={`text-xs leading-relaxed ${active ? 'text-ink/70' : 'text-ink/55'}`}>
                    {CHANNEL_INFO[c.id]}
                  </p>
                </motion.button>
              );
            })}
          </div>

          {allRatios.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 max-w-2xl"
            >
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/45 mb-2">Aspect ratios needed</p>
              <div className="flex flex-wrap gap-2">
                {allRatios.map(r => (
                  <span key={r} className="font-mono text-xs px-3 py-1 border border-ink/15 bg-white/40 text-ink/70 tracking-wide">{r}</span>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {/* Vibe-matched explore */}
        <AnimatePresence>
          {vibeMatches.length > 0 && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 border-t border-ink/10">
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ink/45 mb-5">
                  Your vibe matches
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vibeMatches.map(mc => (
                    <ExploreCard
                      key={mc.caseStudy.id}
                      caseStudy={mc.caseStudy}
                      matchReason={mc.matchReason}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </motion.div>
      <VibeStudio activeSection={activeSection} />
      </motion.div>
    </>
  );
}
