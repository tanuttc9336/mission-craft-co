// ─────────────────────────────────────────────────────────────────────────────
// notify-on-brief — Supabase Edge Function
// 2026-04-26 — BriefingRoom v3 Sprint 1 (Task #2)
//
// Triggered by Supabase Database Webhook on INSERT into brief_requests
// (configure in Supabase Dashboard → Database → Webhooks).
//
// Flow:
//   1. Receive webhook payload { type: 'INSERT', record: {...} }
//      OR explicit invocation { brief_id: '...' } as fallback.
//   2. Skip if status === 'draft' (only notify on real submissions).
//   3. Format email summary in Pao's voice.
//   4. Send via Resend API → hello@undercatcreatives.com.
//   5. UPDATE brief_requests.pao_notified = true.
//
// ENV required (set via supabase secrets set):
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY
//   - RESEND_API_KEY
//   - NOTIFY_TO_EMAIL          (default: hello@undercatcreatives.com)
//   - NOTIFY_FROM_EMAIL        (default: brief@undercatcreatives.com — needs Resend domain verify)
// ─────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Types ────────────────────────────────────────────────────────────────
interface BriefRecord {
  id: string;
  entry_path: string;
  locale: "th" | "en";
  status: string;
  lead_name: string;
  lead_company: string;
  lead_email: string;
  lead_phone: string;
  brief: Record<string, unknown>;
  mission: string | null;
  timeline: string | null;
  budget_range: string | null;
  risk_level: string | null;
  channels: string[];
  created_at: string;
  submitted_at: string | null;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: BriefRecord;
  old_record?: BriefRecord | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const ENTRY_LABEL: Record<string, string> = {
  new: "New lead",
  audi: "Audi (existing retainer)",
  greenline: "Greenline (existing)",
  driveline: "Driveline (existing)",
  "other-existing": "Other existing client",
};

const RISK_EMOJI: Record<string, string> = {
  green: "🟢",
  yellow: "🟡",
  red: "🔴",
};

function escape(s: string | null | undefined): string {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function bahtRange(budget: string | null): string {
  if (!budget) return "Not specified";
  const map: Record<string, string> = {
    "<100k": "Under ฿100K",
    "100-250k": "฿100K – ฿250K",
    "250-500k": "฿250K – ฿500K",
    "500k+": "฿500K+",
    "not-defined": "Not yet defined",
  };
  return map[budget] ?? budget;
}

function timelineLabel(t: string | null): string {
  if (!t) return "Not specified";
  const map: Record<string, string> = {
    asap: "ASAP (within 2 weeks)",
    "2-4-weeks": "2–4 weeks",
    flexible: "Flexible",
  };
  return map[t] ?? t;
}

function buildSubject(rec: BriefRecord): string {
  const tag = rec.entry_path === "new" ? "New brief" : `${ENTRY_LABEL[rec.entry_path] ?? "Brief"}`;
  const company = rec.lead_company || rec.lead_name || "Unknown";
  const risk = rec.risk_level ? ` ${RISK_EMOJI[rec.risk_level] ?? ""}` : "";
  return `[Briefing Room] ${tag} — ${company}${risk}`.trim();
}

function buildHtml(rec: BriefRecord): string {
  const brief = rec.brief as Record<string, unknown>;
  const offer = (brief.offer ?? {}) as Record<string, string>;
  const audience = (brief.audienceText as string) ?? "—";
  const additionalContext = (brief.additionalContext as string) ?? "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; color: #111; line-height: 1.5; max-width: 640px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 18px; margin: 0 0 8px; letter-spacing: -0.01em; }
  h2 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #888; margin: 24px 0 8px; }
  .meta { font-size: 12px; color: #666; margin-bottom: 24px; }
  .row { display: flex; gap: 16px; margin: 4px 0; font-size: 14px; }
  .row .k { width: 120px; color: #666; flex-shrink: 0; }
  .row .v { flex: 1; }
  .pill { display: inline-block; padding: 2px 8px; border: 1px solid #ddd; border-radius: 2px; font-size: 11px; margin-right: 4px; }
  .quote { border-left: 2px solid #111; padding: 8px 12px; margin: 8px 0; font-size: 14px; color: #333; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 11px; color: #888; }
  a { color: #111; }
</style></head><body>

<h1>${escape(buildSubject(rec).replace("[Briefing Room] ", ""))}</h1>
<p class="meta">Submitted ${new Date(rec.submitted_at ?? rec.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Bangkok" })} · ${rec.locale.toUpperCase()}</p>

<h2>Lead</h2>
<div class="row"><div class="k">Name</div><div class="v">${escape(rec.lead_name) || "—"}</div></div>
<div class="row"><div class="k">Company</div><div class="v">${escape(rec.lead_company) || "—"}</div></div>
<div class="row"><div class="k">Email</div><div class="v"><a href="mailto:${escape(rec.lead_email)}">${escape(rec.lead_email)}</a></div></div>
<div class="row"><div class="k">Phone</div><div class="v">${escape(rec.lead_phone) || "—"}</div></div>
<div class="row"><div class="k">Entry path</div><div class="v">${escape(ENTRY_LABEL[rec.entry_path] ?? rec.entry_path)}</div></div>

<h2>Project snapshot</h2>
<div class="row"><div class="k">Mission</div><div class="v">${escape(rec.mission) || "—"}</div></div>
<div class="row"><div class="k">One-liner</div><div class="v">${escape(offer.keyOffer as string) || "—"}</div></div>
<div class="row"><div class="k">Timeline</div><div class="v">${escape(timelineLabel(rec.timeline))}</div></div>
<div class="row"><div class="k">Budget</div><div class="v">${escape(bahtRange(rec.budget_range))}</div></div>
<div class="row"><div class="k">Channels</div><div class="v">${
    rec.channels.length
      ? rec.channels.map((c) => `<span class="pill">${escape(c)}</span>`).join("")
      : "—"
  }</div></div>
<div class="row"><div class="k">Risk</div><div class="v">${RISK_EMOJI[rec.risk_level ?? ""] ?? ""} ${escape(rec.risk_level) || "—"}</div></div>

<h2>Audience</h2>
<div class="quote">${escape(audience) || "—"}</div>

${additionalContext ? `<h2>Additional context</h2><div class="quote">${escape(additionalContext)}</div>` : ""}

<h2>Next move</h2>
<p style="font-size: 13px;">📹 Record 90-sec Loom reply within 24h · 📅 Send Cal.com link · 📝 Tag in Notion CRM</p>

<div class="footer">
  Brief ID: <code>${escape(rec.id)}</code><br>
  Source: undercatcreatives.com/briefing-room<br>
  Reply directly to this email to start the conversation.
</div>

</body></html>`;
}

function buildPlainText(rec: BriefRecord): string {
  const brief = rec.brief as Record<string, unknown>;
  const offer = (brief.offer ?? {}) as Record<string, string>;
  const audience = (brief.audienceText as string) ?? "—";
  const additionalContext = (brief.additionalContext as string) ?? "";

  return `${buildSubject(rec).replace("[Briefing Room] ", "")}
Submitted ${new Date(rec.submitted_at ?? rec.created_at).toISOString()} · locale: ${rec.locale}

LEAD
  Name        ${rec.lead_name || "—"}
  Company     ${rec.lead_company || "—"}
  Email       ${rec.lead_email}
  Phone       ${rec.lead_phone || "—"}
  Entry path  ${ENTRY_LABEL[rec.entry_path] ?? rec.entry_path}

PROJECT
  Mission     ${rec.mission || "—"}
  One-liner   ${offer.keyOffer || "—"}
  Timeline    ${timelineLabel(rec.timeline)}
  Budget      ${bahtRange(rec.budget_range)}
  Channels    ${rec.channels.join(", ") || "—"}
  Risk        ${rec.risk_level || "—"}

AUDIENCE
  ${audience}
${additionalContext ? `\nADDITIONAL CONTEXT\n  ${additionalContext}\n` : ""}
NEXT
  - Record 90-sec Loom reply within 24h
  - Send Cal.com link
  - Tag in Notion CRM

Brief ID: ${rec.id}
Source: undercatcreatives.com/briefing-room
`;
}

// ─── Main handler ─────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFY_TO_EMAIL = Deno.env.get("NOTIFY_TO_EMAIL") ?? "hello@undercatcreatives.com";
    const NOTIFY_FROM_EMAIL =
      Deno.env.get("NOTIFY_FROM_EMAIL") ?? "Briefing Room <brief@undercatcreatives.com>";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase env not configured");
    }
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const payload = (await req.json()) as Partial<WebhookPayload> & { brief_id?: string };

    // ─── Resolve the record (webhook OR explicit invocation) ──────────────
    let record: BriefRecord | null = null;

    if (payload.type === "INSERT" && payload.record) {
      record = payload.record;
    } else if (payload.brief_id) {
      const { data, error } = await supabase
        .from("brief_requests")
        .select("*")
        .eq("id", payload.brief_id)
        .single();
      if (error) throw new Error(`Failed to load brief: ${error.message}`);
      record = data as BriefRecord;
    } else {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!record) {
      return new Response(JSON.stringify({ error: "Record not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Skip drafts ──────────────────────────────────────────────────────
    if (record.status === "draft") {
      return new Response(JSON.stringify({ skipped: "draft" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Idempotency — skip if already notified ───────────────────────────
    const { data: existing } = await supabase
      .from("brief_requests")
      .select("pao_notified")
      .eq("id", record.id)
      .single();

    if (existing?.pao_notified) {
      return new Response(JSON.stringify({ skipped: "already_notified" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── Send via Resend ──────────────────────────────────────────────────
    const subject = buildSubject(record);
    const html = buildHtml(record);
    const text = buildPlainText(record);

    const replyTo = record.lead_email && record.lead_email.includes("@")
      ? record.lead_email
      : undefined;

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM_EMAIL,
        to: [NOTIFY_TO_EMAIL],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject,
        html,
        text,
        tags: [
          { name: "type", value: "brief_notify" },
          { name: "entry_path", value: record.entry_path },
        ],
      }),
    });

    if (!resendResp.ok) {
      const errBody = await resendResp.text();
      throw new Error(`Resend API failed: ${resendResp.status} ${errBody}`);
    }

    const resendJson = await resendResp.json();

    // ─── Mark as notified ─────────────────────────────────────────────────
    const { error: updateErr } = await supabase
      .from("brief_requests")
      .update({ pao_notified: true })
      .eq("id", record.id);

    if (updateErr) {
      console.error("Failed to mark pao_notified:", updateErr);
      // non-fatal — email already sent
    }

    return new Response(
      JSON.stringify({
        ok: true,
        brief_id: record.id,
        resend_id: resendJson.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("notify-on-brief error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
