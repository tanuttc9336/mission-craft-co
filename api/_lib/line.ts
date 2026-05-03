// ─────────────────────────────────────────────────────────────────────────────
// LINE Messaging API client — broadcast notification to bot followers
// Sprint 1 · 2026-05
// ─────────────────────────────────────────────────────────────────────────────

import type { Brief } from '../../src/types/brief.js';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_BROADCAST_URL = 'https://api.line.me/v2/bot/message/broadcast';

export async function broadcastLineMessage(brief: Brief, notionUrl: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN env var not configured');
  }

  const company = brief.lead.company?.trim() || brief.lead.name?.split(' ')[0] || 'Unknown';
  const mission = brief.mission || 'New brief';

  const lines = [
    `🔔 Brief ใหม่จาก ${company}`,
    ``,
    `Mission: ${mission}`,
    brief.deliverablesBundle ? `Package: ${brief.deliverablesBundle}` : null,
    brief.budgetRange ? `Budget: ${brief.budgetRange}` : null,
    brief.timeline ? `Timeline: ${brief.timeline}` : null,
    brief.riskLevel === 'red' ? `⚠️ Risk: red` : brief.riskLevel === 'yellow' ? `Risk: yellow` : null,
    ``,
    `Lead: ${brief.lead.name}`,
    `Email: ${brief.lead.email}`,
    brief.lead.phone ? `Phone: ${brief.lead.phone}` : null,
    ``,
    `Notion: ${notionUrl}`,
  ].filter(Boolean).join('\n');

  const resp = await fetch(LINE_BROADCAST_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ type: 'text', text: lines.slice(0, 5000) }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    // 400 with "There are no recipients" = no one followed bot yet → not a fatal error
    if (resp.status === 400 && errText.includes('no recipients')) {
      console.warn('[LINE] No bot followers yet — skipping broadcast');
      return;
    }
    throw new Error(`LINE Broadcast ${resp.status}: ${errText.slice(0, 500)}`);
  }
}
