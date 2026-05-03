// ─────────────────────────────────────────────────────────────────────────────
// Notion API client — insert lead → Pipeline DB (Deals)
// Sprint 1 · 2026-05
// ─────────────────────────────────────────────────────────────────────────────

import type { Brief } from '../../src/types/brief.js';

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const PIPELINE_DATA_SOURCE_ID = '1cf730bc-09ea-4567-b767-1cc7d2851d12';
const NOTION_VERSION = '2022-06-28';

export interface NotionInsertResult {
  pageId: string;
  url: string;
}

function estimateValue(bundle: string | null): number | null {
  switch (bundle) {
    case 'starter': return 175_000;
    case 'signature': return 375_000;
    case 'production': return 750_000;
    case 'custom':
    default:
      return null;
  }
}

function dealName(brief: Brief): string {
  const company = brief.lead.company?.trim() || brief.lead.name?.split(' ')[0] || 'Unknown';
  const mission = brief.mission || 'New brief';
  return `${company} — ${mission}`;
}

const MISSION_TO_TYPE: Record<string, string> = {
  'launch-film': 'Video Production',
  'brand-film': 'Video Production',
  'social-campaign': 'Social Media',
  'ad-spot': 'Video Production',
  'event-content': 'Video Production',
  'retainer': 'Retainer',
};

function buildNotes(brief: Brief): string {
  const lines: string[] = [
    `📥 Brief from undercatcreatives.com`,
    ``,
    `LEAD`,
    `Name: ${brief.lead.name}`,
    `Company: ${brief.lead.company || '—'}`,
    `Email: ${brief.lead.email}`,
    `Phone: ${brief.lead.phone || '—'}`,
    ``,
    `BRIEF`,
    `Mission: ${brief.mission || '—'}`,
    `Audience: ${brief.audienceText || '—'}`,
    `Channels: ${brief.channels.join(', ') || '—'}`,
    `Bundle: ${brief.deliverablesBundle || '—'}`,
    `Budget: ${brief.budgetRange || '—'}`,
    `Timeline: ${brief.timeline || '—'}`,
    ``,
    `STYLE`,
    `Quiet→Loud: ${brief.styleDNA.quietVsLoud}`,
    `Cinematic→UGC: ${brief.styleDNA.cinematicVsUGC}`,
    `Minimal→Maximal: ${brief.styleDNA.minimalVsMaximal}`,
    `Funny→Serious: ${brief.styleDNA.funnyVsSerious}`,
    ``,
  ];
  if (brief.constraints.length > 0) {
    lines.push(`CONSTRAINTS`, brief.constraints.join(', '), ``);
  }
  if (brief.additionalContext) {
    lines.push(`ADDITIONAL CONTEXT`, brief.additionalContext, ``);
  }
  lines.push(`Risk: ${brief.riskLevel}`);
  lines.push(`Brief ID: ${brief.id}`);
  return lines.join('\n');
}

export async function insertLeadToPipeline(brief: Brief): Promise<NotionInsertResult> {
  if (!NOTION_API_KEY) {
    throw new Error('NOTION_API_KEY env var not configured');
  }

  const today = new Date().toISOString().split('T')[0];
  const value = estimateValue(brief.deliverablesBundle);
  const dealType = brief.mission ? MISSION_TO_TYPE[brief.mission] : null;

  const properties: Record<string, unknown> = {
    'ชื่อ Deal': { title: [{ text: { content: dealName(brief) } }] },
    'Stage': { select: { name: 'Lead' } },
    'แหล่งที่มา': { select: { name: 'Inbound' } },
    'ผู้ติดต่อ': {
      rich_text: [{
        text: {
          content: [
            brief.lead.name,
            brief.lead.email,
            brief.lead.phone,
          ].filter(Boolean).join(' · '),
        },
      }],
    },
    'วันที่เข้า': { date: { start: today } },
    'อัพเดทล่าสุด': { date: { start: today } },
    'อัพเดทโดย': { select: { name: 'Claude' } },
    'หมายเหตุ': { rich_text: [{ text: { content: buildNotes(brief).slice(0, 2000) } }] },
  };

  if (value !== null) properties['มูลค่า'] = { number: value };
  if (dealType) properties['ประเภทงาน'] = { select: { name: dealType } };

  const resp = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { type: 'data_source_id', data_source_id: PIPELINE_DATA_SOURCE_ID },
      properties,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Notion API ${resp.status}: ${errText.slice(0, 500)}`);
  }

  const data = await resp.json();
  return {
    pageId: data.id as string,
    url: (data.url as string) || `https://www.notion.so/${(data.id as string).replace(/-/g, '')}`,
  };
}
