import { Brief } from '@/types/brief';
import { missions, personas, channelOptions, bundles } from '@/data/builder';

export function generateBlueprint(brief: Brief): Record<string, string> {
  const mission = missions.find(m => m.id === brief.mission);
  const selectedPersonas = personas.filter(p => brief.audiencePersonas.includes(p.id));
  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const bundle = bundles.find(b => b.id === brief.deliverablesBundle);

  const styleSummary = getStyleSummary(brief.styleDNA);

  const blocks: Record<string, string> = {};

  blocks.objective = `${mission?.label ?? 'TBD'} — ${mission?.description ?? ''}. Funnel position: ${mission?.funnel ?? 'TBD'}.`;

  blocks.audience = selectedPersonas.length
    ? selectedPersonas.map(p => `${p.label}: ${p.description}. Recommended tone: ${p.tone}.`).join('\n')
    : 'Audience not yet defined.';

  blocks.channelPlan = selectedChannels.length
    ? selectedChannels.map(c => `${c.label} → ${c.aspectRatios.join(', ')}`).join('\n')
    : 'Channels not yet selected.';

  blocks.deliverables = bundle
    ? `${bundle.label} Package:\n${bundle.deliverables.map(d => `• ${d}`).join('\n')}`
    : 'Custom scope — to be defined on scoping call.';

  blocks.timeline = [
    '1. Discovery & Strategy Alignment',
    '2. Pre-production & Planning',
    '3. Production / Shoot',
    '4. Post-production & Edits',
    '5. Launch & Handover',
  ].join('\n');

  blocks.creativeDirections = [
    `Direction A: ${getCreativeAngle(brief, 'A')}`,
    `Direction B: ${getCreativeAngle(brief, 'B')}`,
  ].join('\n');

  blocks.styleSummary = styleSummary;

  blocks.offer = brief.offer.productName
    ? `Product/Service: ${brief.offer.productName}\nKey Offer: ${brief.offer.keyOffer}\nCTA: ${brief.offer.ctaType}`
    : 'Offer details not yet provided.';

  blocks.assetChecklist = [
    'Brand guidelines (logo, colors, fonts)',
    'Product/service photography or samples',
    'Access to locations (if applicable)',
    'Key messaging / approved copy',
    'Stakeholder contact for approvals',
  ].map(a => `☐ ${a}`).join('\n');

  blocks.terms = [
    '• Go/No-Go: Scope confirmed + contract signed + 50% deposit received',
    '• 2 revision rounds included. Directional changes = Change Order.',
    '• No final files released before final payment.',
    `• Budget range: ${brief.budgetRange ?? 'TBD'}`,
    `• Timeline preference: ${brief.timeline ?? 'TBD'}`,
    `• Risk assessment: ${brief.riskLevel.toUpperCase()}`,
  ].join('\n');

  return blocks;
}

function getStyleSummary(dna: Brief['styleDNA']): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 40 ? 'Quiet luxury' : dna.quietVsLoud > 60 ? 'Bold energy' : 'Balanced presence');
  parts.push(dna.cinematicVsUGC < 40 ? 'cinematic' : dna.cinematicVsUGC > 60 ? 'UGC-authentic' : 'mixed format');
  parts.push(dna.minimalVsMaximal < 40 ? 'minimal' : dna.minimalVsMaximal > 60 ? 'maximal' : 'clean');
  parts.push(dna.funnyVsSerious < 40 ? 'with humor' : dna.funnyVsSerious > 60 ? 'serious tone' : 'balanced tone');
  return parts.join(', ') + '.';
}

function getCreativeAngle(brief: Brief, variant: 'A' | 'B'): string {
  const mission = brief.mission ?? 'awareness';
  if (variant === 'A') {
    const angles: Record<string, string> = {
      awareness: 'Emotionally-led brand story that builds connection before conversion.',
      leads: 'Value-first approach — lead with the transformation, gate with a clear offer.',
      sales: 'Proof-driven narrative with social proof and urgency.',
      launch: 'Cinematic reveal sequence building anticipation through pacing and restraint.',
      retention: 'Community-centric content that rewards loyalty and invites participation.',
      'employer-brand': 'Employee-narrated culture story showcasing growth and belonging.',
    };
    return angles[mission] ?? 'Concept to be explored in discovery session.';
  } else {
    const angles: Record<string, string> = {
      awareness: 'Pattern-interrupt content designed for thumb-stopping first impressions.',
      leads: 'Problem-agitation-solution framework with platform-native delivery.',
      sales: 'Comparison-style content positioning the offer as the obvious choice.',
      launch: 'Behind-the-scenes narrative that humanizes the launch process.',
      retention: 'Serialized format that creates appointment viewing or ongoing engagement.',
      'employer-brand': 'Day-in-the-life format with cinematic production value.',
    };
    return angles[mission] ?? 'Alternative direction to be developed collaboratively.';
  }
}
