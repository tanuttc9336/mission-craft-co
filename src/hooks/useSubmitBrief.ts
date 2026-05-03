// ─────────────────────────────────────────────────────────────────────────────
// useSubmitBrief — submits a finalized Brief to the brief-submit endpoint
// 2026-05 · Sprint 1 (Vercel function backend)
//
// Architecture (current):
//   Form → useSubmitBrief.submit() → POST /api/brief-submit (Vercel function) →
//   1) Insert Notion Pipeline DB (Deals, stage=Lead, source=Inbound)
//   2) Broadcast LINE notification to bot followers
//   3) Return { ok, brief_id, url } to client
//
// Vercel function source: api/brief-submit.ts (+ api/_lib/notion.ts, api/_lib/line.ts)
//
// Parked alternatives (kept for reference, not used):
//   - apps/briefing-worker/worker.js (Cloudflare Worker → "Briefing Room Inbox" DB)
//   - supabase/functions/notify-on-brief/ (Supabase Edge Function)
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

const DEFAULT_SUBMIT_URL = '/api/brief-submit';

function getSubmitUrl(): string {
  // Allow override via env (e.g. point preview deploys at production API, or
  // point local dev at a deployed preview while developing the form).
  const fromEnv = import.meta.env.VITE_BRIEF_SUBMIT_URL;
  if (typeof fromEnv === 'string' && fromEnv.length) return fromEnv.replace(/\/$/, '');
  return DEFAULT_SUBMIT_URL;
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

      const submitUrl = getSubmitUrl();

      // Normalise lead onto brief — server maps brief.lead → Notion props.
      const briefWithLead: Brief = {
        ...brief,
        lead: {
          ...brief.lead,
          name: brief.lead.name.trim(),
          company: brief.lead.company?.trim() ?? '',
          email: brief.lead.email.trim().toLowerCase(),
          phone: brief.lead.phone?.trim() ?? '',
          consent: brief.lead.consent ?? false,
        },
      };

      const payload = {
        brief: briefWithLead,
        entryPath,
        locale,
        // Honeypot (must remain empty for real submissions). Bots fill all fields.
        // The form should NOT render an input named "website" — but if one is added
        // later for honeypot, pass its value here. Server returns ok+spam-ignored
        // when this field is non-empty, without inserting anything.
        website: '',
      };

      const resp = await fetch(submitUrl, {
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
