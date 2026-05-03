// ─────────────────────────────────────────────────────────────────────────────
// LINE Messaging API client — push to specific User IDs (private)
// Falls back to broadcast if no User IDs configured.
// Sprint 1.6 · 2026-05
// ─────────────────────────────────────────────────────────────────────────────

import type { Brief } from '../../src/types/brief.js';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_PUSH_URL = 'https://api.line.me/v2/bot/message/push';
const LINE_BROADCAST_URL = 'https://api.line.me/v2/bot/message/broadcast';

// Whitelist of User IDs that should receive lead notifications.
// LINE_USER_IDS = "Uxxx,Uyyy,Uzzz" (comma-separated, no spaces required)
// LINE_USER_ID  = "Uxxx" (single — accepted for convenience)
function getAllowedUserIds(): string[] {
  const raw = process.env.LINE_USER_IDS || process.env.LINE_USER_ID || '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function buildText(brief: Brief, notionUrl: string): string {
  const company = brief.lead.company?.trim() || brief.lead.name?.split(' ')[0] || 'Unknown';
  const mission = brief.mission || 'New brief';

  const lines: (string | null)[] = [
    `🔔 Brief ใหม่จาก ${company}`,
    ``,
    `Mission: ${mission}`,
    brief.deliverablesBundle ? `Package: ${brief.deliverablesBundle}` : null,
    brief.budgetRange ? `Budget: ${brief.budgetRange}` : null,
    brief.timeline ? `Timeline: ${brief.timeline}` : null,
    brief.riskLevel === 'red'
      ? `⚠️ Risk: red`
      : brief.riskLevel === 'yellow'
      ? `Risk: yellow`
      : null,
    ``,
    `Lead: ${brief.lead.name}`,
    `Email: ${brief.lead.email}`,
    brief.lead.phone ? `Phone: ${brief.lead.phone}` : null,
    ``,
    `Notion: ${notionUrl}`,
  ];

  return lines.filter((line): line is string => line !== null).join('\n');
}

async function pushToUser(userId: string, text: string): Promise<void> {
  const resp = await fetch(LINE_PUSH_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: 'text', text: text.slice(0, 5000) }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`LINE Push to ${userId.slice(0, 8)}… ${resp.status}: ${errText.slice(0, 300)}`);
  }
}

async function sendBroadcast(text: string): Promise<void> {
  const resp = await fetch(LINE_BROADCAST_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ type: 'text', text: text.slice(0, 5000) }],
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    if (resp.status === 400 && errText.includes('no recipients')) {
      console.warn('[LINE] No bot followers yet — skipping broadcast');
      return;
    }
    throw new Error(`LINE Broadcast ${resp.status}: ${errText.slice(0, 300)}`);
  }
}

export async function broadcastLineMessage(brief: Brief, notionUrl: string): Promise<void> {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    throw new Error('LINE_CHANNEL_ACCESS_TOKEN env var not configured');
  }

  const text = buildText(brief, notionUrl);
  const allowedUserIds = getAllowedUserIds();

  if (allowedUserIds.length > 0) {
    // Push API — send only to whitelisted User IDs (private)
    let firstError: Error | null = null;
    for (const userId of allowedUserIds) {
      try {
        await pushToUser(userId, text);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        console.error(`[LINE] push to ${userId.slice(0, 8)}… failed:`, e.message);
        if (!firstError) firstError = e;
      }
    }
    // If every push failed, surface the first error so caller knows
    if (firstError && allowedUserIds.length === 1) throw firstError;
    return;
  }

  // Fallback: broadcast to all followers (no whitelist configured)
  console.warn('[LINE] No LINE_USER_IDS set — falling back to Broadcast (all followers)');
  await sendBroadcast(text);
}
