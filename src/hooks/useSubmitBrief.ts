// ─────────────────────────────────────────────────────────────────────────────
// useSubmitBrief — submits a finalized Brief to the Briefing Worker
// 2026-04-26 — BriefingRoom v3 Sprint 1
//
// Architecture (Notion-backed v1):
//   Form → useSubmitBrief.submit() → POST {WORKER_URL}/submit →
//   Cloudflare Worker validates + maps → Notion API pages.create →
//   row appears in "📥 Briefing Room Inbox" DB → Notion Automation emails Pao
//
// Worker source: apps/briefing-worker/worker.js
// Worker URL set via VITE_BRIEFING_WORKER_URL env var
//   (default: https://briefing-worker.<subdomain>.workers.dev — override per env)
//
// The earlier Supabase-direct path is parked at supabase/migrations/20260426*.sql +
// supabase/functions/notify-on-brief/. Keep for v2 backend when Notion DB capacity
// or rate limit becomes the bottleneck.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import type { Brief } from '@/types/brief';

export interface SubmitResult {
  id: string;          // Notion page ID (UUID)
  briefIdShort: number | null; // Auto-incremented Brief ID (e.g. 1, 2, 3...)
  url: string;         // Notion page URL
  sessionToken: string;        // Same as id for compatibility with magic-link path later
  submittedAt: string;
}

export interface SubmitState {
  loading: boolean;
  error: string | null;
  result: SubmitResult | null;
}

interface SubmitParams {
  brief: Brief;
  entryPath: 'new' | 'audi' | 'greenline' | 'driveline' | 'other-existing';
  locale?: 'th' | 'en';
}

const DEFAULT_WORKER_URL = 'https://briefing-worker.tanut-tc9336.workers.dev';

function getWorkerUrl(): string {
  const fromEnv = import.meta.env.VITE_BRIEFING_WORKER_URL;
  if (typeof fromEnv === 'string' && fromEnv.length) return fromEnv.replace(/\/$/, '');
  return DEFAULT_WORKER_URL;
}

export function useSubmitBrief() {
  const [state, setState] = useState<SubmitState>({
    loading: false,
    error: null,
    result: null,
  });

  const submit = useCallback(async ({ brief, entryPath, locale = 'en' }: SubmitParams) => {
    setState({ loading: true, error: null, result: null });

    try {
      // Validate minimum required fields up front (better UX than 400 from Worker)
      if (!brief.lead.email?.trim()) {
        throw new Error('Email is required to submit a brief');
      }
      if (!brief.lead.name?.trim()) {
        throw new Error('Name is required to submit a brief');
      }

      const workerUrl = getWorkerUrl();

      // Slim payload — Worker maps to Notion props server-side.
      const payload = {
        brief,
        lead: {
          name: brief.lead.name.trim(),
          company: brief.lead.company?.trim() ?? '',
          email: brief.lead.email.trim().toLowerCase(),
          phone: brief.lead.phone?.trim() ?? '',
          consent: brief.lead.consent ?? false,
        },
        entryPath,
        locale,
        // Honeypot (must remain empty for real submissions). Bots fill all fields.
        // Form should NOT render an input named "website" or "_gotcha".
        // If a hidden field is added later for honeypot, send its value here.
      };

      const resp = await fetch(`${workerUrl}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data?.ok) {
        const detail = (data?.error as string) || `HTTP ${resp.status}`;
        throw new Error(`Submit failed: ${detail}`);
      }

      const result: SubmitResult = {
        id: data.brief_id,
        briefIdShort: data.brief_id_short ?? null,
        url: data.url ?? '',
        sessionToken: data.brief_id, // alias for future magic-link path
        submittedAt: new Date().toISOString(),
      };

      setState({ loading: false, error: null, result });
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[useSubmitBrief] failed:', msg);
      setState({ loading: false, error: msg, result: null });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return { ...state, submit, reset };
}
