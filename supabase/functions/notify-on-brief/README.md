# notify-on-brief — setup + deploy guide

Edge function that emails Pao every time a brief is submitted (status transitions to `submitted`).

## Required env (set via Supabase CLI)

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
supabase secrets set NOTIFY_TO_EMAIL=tanut.tc9336@gmail.com
supabase secrets set NOTIFY_FROM_EMAIL="Briefing Room <brief@undercatcreatives.com>"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase Edge Functions runtime — no need to set manually.

## Deploy

```bash
cd apps/mission-craft-v3
supabase functions deploy notify-on-brief
```

## Setup Resend (one-time)

1. Sign up: https://resend.com → free tier (100 emails/day, 3,000/mo)
2. Add domain `undercatcreatives.com` → verify SPF + DKIM via Cloudflare DNS
3. Create API key → copy → set as `RESEND_API_KEY` secret
4. (Optional) Set up `brief@undercatcreatives.com` mailbox or use a verified subdomain like `notify.undercatcreatives.com`

**Until domain is verified**, change `NOTIFY_FROM_EMAIL` to Resend's sandbox sender (e.g. `onboarding@resend.dev`) — works for testing but rate-limited and lands in spam.

## Setup Database Webhook (one-time, in Supabase Dashboard)

1. Go to Supabase Dashboard → Database → Webhooks → Create a new webhook
2. Name: `brief-submitted-notify`
3. Table: `public.brief_requests`
4. Events: ☑ INSERT, ☑ UPDATE
5. Type: HTTP Request → POST
6. URL: `https://cotanyifydbfnzzwhxsb.supabase.co/functions/v1/notify-on-brief`
7. HTTP Headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>` *(or the anon key if function has `verify_jwt=false`)*
8. Conditions (optional but recommended): only fire when `NEW.status = 'submitted'` and `OLD.status IS DISTINCT FROM NEW.status`
9. Save

The function is idempotent — checks `pao_notified` flag and skips if already notified, so duplicate webhook fires are safe.

## Test

```bash
# Local invoke (after supabase functions serve)
curl -X POST http://localhost:54321/functions/v1/notify-on-brief \
  -H "Content-Type: application/json" \
  -d '{"brief_id": "<paste a real submitted brief id>"}'

# Production smoke test
curl -X POST https://cotanyifydbfnzzwhxsb.supabase.co/functions/v1/notify-on-brief \
  -H "Content-Type: application/json" \
  -d '{"brief_id": "<id>"}'
```

Expected response: `{"ok": true, "brief_id": "...", "resend_id": "..."}`

## Manual call from app (alternative to webhook)

If the database webhook flow is overkill, the React client can call this function directly after `supabase.from('brief_requests').insert(...)`:

```ts
await fetch(`${SUPABASE_URL}/functions/v1/notify-on-brief`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
  body: JSON.stringify({ brief_id: insertedBriefId }),
});
```

The webhook approach is preferred because it survives client-side errors (network drop after insert).

## What this does NOT do (yet — Sprint v3.7)

- AI tagging (auto-tags via Anthropic Claude → C1)
- Pre-call prep summary (Sonnet 4.6 → C2)
- Email draft in Pao's voice (C3)
- Slack notification (when Pao has workspace)
- LINE OA push

These all read from `ai_summary` / `ai_tags` columns which are reserved in the schema for that sprint.
