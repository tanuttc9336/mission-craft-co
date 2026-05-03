// ─────────────────────────────────────────────────────────────────────────────
// POST /api/brief-submit — accept brief from /briefing-room → /blueprint flow
// Sprint 1 · 2026-05
//
// Architecture:
//   Form → useSubmitBrief.submit() → POST /api/brief-submit (this file) →
//   1) Insert Notion Pipeline DB (stage=Lead, source=Inbound)
//   2) Broadcast LINE notification to bot followers (Pao + team)
//   3) Return { ok, leadId, url } to client
//
// Replaces the Cloudflare Worker path (briefing-worker.tanut-tc9336.workers.dev)
// for v4 main. Worker source remains parked at apps/briefing-worker/worker.js.
// ─────────────────────────────────────────────────────────────────────────────

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertLeadToPipeline } from './_lib/notion';
import { broadcastLineMessage } from './_lib/line';
import type { Brief } from '../src/types/brief';

const ALLOWED_ORIGINS = new Set([
  'https://www.undercatcreatives.com',
  'https://undercatcreatives.com',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function applyCors(req: VercelRequest, res: VercelResponse): void {
  const origin = (req.headers.origin as string) || '';
  if (ALLOWED_ORIGINS.has(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

interface BriefSubmitPayload {
  brief?: Brief;
  // Honeypot — must remain empty for real submissions
  website?: string;
  // Compatibility with old Cloudflare Worker payload (entryPath, lead, locale)
  entryPath?: string;
  lead?: Brief['lead'];
  locale?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = (req.body || {}) as BriefSubmitPayload;

    // Honeypot — silently accept bot submissions, don't insert
    if (typeof body.website === 'string' && body.website.length > 0) {
      res.status(200).json({ ok: true, leadId: 'spam-ignored', url: '' });
      return;
    }

    const brief = body.brief;
    if (!brief) {
      res.status(400).json({ ok: false, error: 'Missing brief payload' });
      return;
    }

    // Allow lead override from compat payload (old Worker shape)
    if (body.lead && !brief.lead?.email) {
      brief.lead = body.lead;
    }

    if (!brief.lead?.email?.trim()) {
      res.status(400).json({ ok: false, error: 'Email is required' });
      return;
    }
    if (!brief.lead?.name?.trim()) {
      res.status(400).json({ ok: false, error: 'Name is required' });
      return;
    }

    // 1) Insert into Notion Pipeline DB (must succeed)
    const notionResult = await insertLeadToPipeline(brief);

    // 2) Broadcast LINE notification — fire-and-forget (don't block response on LINE)
    broadcastLineMessage(brief, notionResult.url).catch((err) => {
      console.error('[brief-submit] LINE broadcast failed:', err instanceof Error ? err.message : err);
    });

    // 3) Respond — match useSubmitBrief expected shape
    res.status(200).json({
      ok: true,
      brief_id: notionResult.pageId,
      brief_id_short: null, // Notion auto-incremented short ID — not implemented yet
      url: notionResult.url,
      leadId: notionResult.pageId,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[brief-submit] failed:', msg);
    res.status(500).json({ ok: false, error: msg });
  }
}
