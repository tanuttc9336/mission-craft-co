import { Brief } from '@/types/brief';
import { missions, channelOptions, bundles } from '@/data/builder';

export function generateBlueprint(brief: Brief): Record<string, string> {
  const mission = missions.find(m => m.id === brief.mission);
  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const bundle = bundles.find(b => b.id === brief.deliverablesBundle);

  const styleSummary = getStyleSummary(brief.styleDNA);

  const blocks: Record<string, string> = {};

  blocks.objective = `${mission?.label ?? 'TBD'} — ${mission?.description ?? ''}. Funnel position: ${mission?.funnel ?? 'TBD'}.`;

  // Audience: free-text
  blocks.audience = brief.audienceText.trim()
    ? brief.audienceText.trim()
    : 'Audience not yet defined.';

  blocks.channelPlan = selectedChannels.length
    ? selectedChannels.map(c => `${c.label} → ${c.aspectRatios.join(', ')}`).join('\n')
    : 'Channels not yet selected.';

  blocks.deliverables = bundle
    ? `${bundle.label} Package (${bundle.priceHint}):\n${bundle.deliverables.map(d => `• ${d}`).join('\n')}`
    : 'Scope to be defined on discovery call.';

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

  // Simplified offer — just the one-liner
  blocks.offer = brief.offer.keyOffer
    ? `Project: ${brief.offer.keyOffer}`
    : 'Project details not yet provided.';

  blocks.assetChecklist = [
    'Brand guidelines (logo, colors, fonts)',
    'Product/service photography or samples',
    'Access to locations (if applicable)',
    'Key messaging / approved copy',
    'Stakeholder contact for approvals',
  ].map(a => `☐ ${a}`).join('\n');

  // ─── In Scope / Out of Scope ───
  blocks.inScope = generateInScope(brief);
  blocks.outOfScope = generateOutOfScope(brief);

  // Budget display
  const budgetDisplay = brief.budgetRange && brief.budgetRange !== 'not-defined'
    ? `฿${brief.budgetRange === '<100k' ? 'Under 100k' : brief.budgetRange === '500k+' ? '500k+' : brief.budgetRange}`
    : brief.estimatedBudget || 'TBD';

  blocks.terms = [
    '• Go/No-Go: Scope confirmed + contract signed + 50% deposit received',
    '• 2 revision rounds included. Directional changes = Change Order.',
    '• No final files released before final payment.',
    `• Budget range: ${budgetDisplay}`,
    `• Timeline preference: ${brief.timeline ?? 'TBD'}`,
    `• Risk assessment: ${brief.riskLevel.toUpperCase()}`,
  ].join('\n');

  // Additional context
  if (brief.additionalContext?.trim()) {
    blocks.additionalContext = brief.additionalContext.trim();
  }

  return blocks;
}

// ─── In Scope generator ───
function generateInScope(brief: Brief): string {
  const items: string[] = [];
  const mission = missions.find(m => m.id === brief.mission);
  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const bundle = bundles.find(b => b.id === brief.deliverablesBundle);

  if (mission) {
    items.push(`${mission.label} campaign — ${mission.description}`);
  }

  if (bundle && bundle.deliverables.length > 0) {
    bundle.deliverables.forEach(d => items.push(d));
  } else if (mission) {
    // Use starter deliverables as scope indicator
    mission.starterDeliverables.forEach(d => items.push(d));
  }

  if (selectedChannels.length > 0) {
    const ratios = [...new Set(selectedChannels.flatMap(c => c.aspectRatios))];
    items.push(`Platform delivery: ${selectedChannels.map(c => c.label).join(', ')}`);
    items.push(`Aspect ratios: ${ratios.join(', ')}`);
  }

  items.push('2 revision rounds');
  items.push('Final file delivery in production-ready formats');

  return items.map(i => `✓ ${i}`).join('\n');
}

// ─── Out of Scope generator ───
function generateOutOfScope(brief: Brief): string {
  const items: string[] = [];
  const selectedChannelIds = brief.channels;

  // Standard exclusions
  items.push('Additional revision rounds beyond 2 (Change Order required)');
  items.push('Directional changes after approval (Change Order required)');

  // If no photography bundle
  if (brief.deliverablesBundle !== 'production') {
    items.push('Photography / photo library');
  }

  // Platform-specific exclusions
  if (!selectedChannelIds.includes('youtube')) {
    items.push('YouTube long-form content');
  }
  if (!selectedChannelIds.includes('website-hero')) {
    items.push('Website hero video');
  }

  // Common exclusions
  items.push('Media buying / ad spend');
  items.push('Subtitling / localization');
  items.push('Music licensing (unless included in package)');

  return items.map(i => `✗ ${i}`).join('\n');
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
