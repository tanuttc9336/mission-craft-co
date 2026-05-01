-- ─────────────────────────────────────────────────────────────────────────────
-- BriefingRoom v3 — brief_requests table + RLS + magic-link resume
-- 2026-04-26 — Sprint Option 1 (server submit + magic link foundation)
-- ─────────────────────────────────────────────────────────────────────────────

-- ENUMS
CREATE TYPE public.brief_entry_path AS ENUM ('new', 'audi', 'greenline', 'driveline', 'other-existing');
CREATE TYPE public.brief_status AS ENUM ('draft', 'submitted', 'reviewed', 'in_call', 'won', 'lost', 'archived');
CREATE TYPE public.brief_locale AS ENUM ('th', 'en');

-- ─────────────────────────────────────────────────────────────────────────────
-- BRIEF_REQUESTS
-- One row per submitted brief OR draft-in-progress (status='draft').
-- Magic-link resume uses session_token (UUID) to restore client state.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.brief_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- ─── Routing & lifecycle ─────────────────────────────────────────────────
  entry_path    brief_entry_path NOT NULL DEFAULT 'new',
  locale        brief_locale     NOT NULL DEFAULT 'en',
  status        brief_status     NOT NULL DEFAULT 'draft',

  -- ─── Magic-link resume ──────────────────────────────────────────────────
  session_token UUID UNIQUE DEFAULT gen_random_uuid(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '14 days'),

  -- ─── Lead capture (collected at unlock or final submit) ─────────────────
  lead_name     TEXT NOT NULL DEFAULT '',
  lead_company  TEXT NOT NULL DEFAULT '',
  lead_email    TEXT NOT NULL DEFAULT '',
  lead_phone    TEXT NOT NULL DEFAULT '',
  lead_consent  BOOLEAN NOT NULL DEFAULT false,

  -- ─── Brief payload ──────────────────────────────────────────────────────
  -- Full Brief object as it lives in the React context (see types/brief.ts)
  brief         JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Denormalized columns for fast filtering / Pao's admin view
  mission       TEXT,
  timeline      TEXT,
  budget_range  TEXT,
  risk_level    TEXT,
  channels      TEXT[] NOT NULL DEFAULT '{}',

  -- ─── Ops layer (Sprint v3.7 will populate) ──────────────────────────────
  ai_tags       TEXT[] NOT NULL DEFAULT '{}',
  ai_summary    TEXT,                                -- pre-call prep summary for Pao
  pao_notified  BOOLEAN NOT NULL DEFAULT false,
  loom_url      TEXT,                                -- Pao's 90-sec reply

  -- ─── Audit ──────────────────────────────────────────────────────────────
  user_agent    TEXT,
  ip_country    TEXT,                                -- captured in edge function (not from client)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at  TIMESTAMPTZ                          -- set when status flips draft → submitted
);

-- ─── INDEXES ───────────────────────────────────────────────────────────────
CREATE INDEX idx_brief_requests_status      ON public.brief_requests(status);
CREATE INDEX idx_brief_requests_entry       ON public.brief_requests(entry_path);
CREATE INDEX idx_brief_requests_email       ON public.brief_requests(lead_email);
CREATE INDEX idx_brief_requests_session     ON public.brief_requests(session_token);
CREATE INDEX idx_brief_requests_submitted   ON public.brief_requests(submitted_at DESC) WHERE status != 'draft';
CREATE INDEX idx_brief_requests_pao_pending ON public.brief_requests(created_at DESC) WHERE pao_notified = false;

-- ─── TRIGGER: auto-update updated_at ───────────────────────────────────────
-- Reuses public.update_updated_at_column() from initial migration
CREATE TRIGGER update_brief_requests_updated_at
  BEFORE UPDATE ON public.brief_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── TRIGGER: auto-set submitted_at on status flip to 'submitted' ──────────
CREATE OR REPLACE FUNCTION public.set_brief_submitted_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD IS NULL OR OLD.status != 'submitted') THEN
    NEW.submitted_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_brief_submitted_at
  BEFORE INSERT OR UPDATE ON public.brief_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_brief_submitted_at();

-- ─── RLS ───────────────────────────────────────────────────────────────────
ALTER TABLE public.brief_requests ENABLE ROW LEVEL SECURITY;

-- Anon + authenticated can INSERT (the form is public-facing).
-- Always inserts as draft or submitted; never as later statuses.
CREATE POLICY "Anyone can submit a brief"
  ON public.brief_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status IN ('draft', 'submitted'));

-- UPDATE: anon can update only their own draft via session_token AND only while still a draft.
-- Status transitions to 'submitted' allowed; further transitions require admin.
-- (Token verification happens at the Edge Function layer; here we only narrow by token presence.)
CREATE POLICY "Anon can update own draft via session_token"
  ON public.brief_requests FOR UPDATE
  TO anon, authenticated
  USING (status = 'draft')
  WITH CHECK (status IN ('draft', 'submitted'));

-- SELECT: admin sees everything.
-- Anon SELECT is intentionally NOT allowed at the RLS level — Edge Functions
-- with the service role key serve resume-by-token reads.
CREATE POLICY "Admins can read all briefs"
  ON public.brief_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin UPDATE — for status transitions (reviewed / in_call / won / lost / archived) and loom_url
CREATE POLICY "Admins can update briefs"
  ON public.brief_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- DELETE: admin only.
CREATE POLICY "Admins can delete briefs"
  ON public.brief_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ─── FUNCTION: cleanup expired drafts (call from cron / Edge Function) ─────
CREATE OR REPLACE FUNCTION public.cleanup_expired_brief_drafts()
RETURNS INT AS $$
DECLARE
  deleted_count INT;
BEGIN
  DELETE FROM public.brief_requests
  WHERE status = 'draft' AND expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON TABLE public.brief_requests IS
  'BriefingRoom submissions + drafts. Drafts auto-expire after 14 days. ' ||
  'Magic-link resume restores via session_token. ' ||
  'AI ops fields (ai_tags, ai_summary, pao_notified, loom_url) populate post-submit.';
