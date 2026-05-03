// ─────────────────────────────────────────────────────────────────────────────
// Confirmation — post-submit page for BriefingRoom
// 2026-04-26 — BriefingRoom v3 Sprint 1 (Task #4)
//
// Replaces the old "/contact" double-form pattern. Reached via:
//   navigate(`/confirmation/${briefId}`, { state: { briefSnapshot, blocks } })
//
// Renders:
//   - Hero: "Brief received" + 24-hr promise + named/faced reply from Pao
//   - "What happens next" timeline (4 steps)
//   - Brief summary (read-only collapsed)
//   - Quick actions: add LINE OA · book a call (Cal.com placeholder) · download Blueprint
//
// Founder Loom flow (per project_briefingroom_v3 + feedback_pao_loom_signature):
//   This page TELLS the client a Loom is coming. Pao's commitment lives off-page.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Phone, Mail, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import logo from '@/assets/undercat-logo.png';
import type { Brief } from '@/types/brief';

interface LocationState {
  briefSnapshot?: Brief;
  blocks?: Record<string, string>;
}

const BANGKOK_TZ_OFFSET_HOURS = 7;

function next24h(): string {
  const now = new Date();
  const target = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  // Display in Bangkok local time
  const offsetMs = (target.getTimezoneOffset() + BANGKOK_TZ_OFFSET_HOURS * 60) * 60 * 1000;
  const bangkok = new Date(target.getTime() + offsetMs);
  return bangkok.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const brief = state.briefSnapshot;
  const blocks = state.blocks ?? {};

  useEffect(() => {
    trackEvent('confirmation_view', { briefId: id ?? null });
  }, [id]);

  const replyDeadline = useMemo(() => next24h(), []);

  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <motion.div {...fade} className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 size={20} className="text-foreground" />
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
            Briefing Room · Confirmation
          </p>
        </div>

        <h1 className="font-display text-3xl md:text-4xl mb-4 tracking-tight">
          We have it{brief?.lead.name?.split(' ')[0] ? `, ${brief.lead.name.split(' ')[0]}` : ''}.
        </h1>
        <p className="text-muted-foreground text-base mb-2 max-w-xl leading-relaxed">
          The brief is in our hands. We read every one carefully — not "scan," read.
        </p>
        <p className="text-foreground text-sm mt-6 font-medium">
          We'll be in touch by <span className="underline decoration-foreground decoration-1 underline-offset-4">{replyDeadline}</span> Bangkok time.
        </p>
      </motion.div>

      {/* ─── What happens next timeline ─────────────────────────────────── */}
      <motion.section {...fade} transition={{ delay: 0.1 }} className="mb-12">
        <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-6">
          What happens next
        </p>

        <ol className="space-y-5">
          {[
            {
              step: '01',
              title: 'We read it carefully.',
              detail: 'Then reply with what we see, what we\u2019d ask, and where we think the value lives.',
              eta: 'Within 24 hours',
            },
            {
              step: '02',
              title: 'We talk.',
              detail: '20 minutes. Sharpen the direction, surface what\u2019s missing, agree on scope and timeline.',
              eta: 'Day 2-3',
            },
            {
              step: '03',
              title: 'Proposal lands.',
              detail: 'Scope, deliverables, schedule, price. No surprises.',
              eta: 'Day 4-7',
            },
            {
              step: '04',
              title: 'Production begins.',
              detail: 'Kickoff with the team. First visible work by day 14.',
              eta: 'Day 8+',
            },
          ].map((row, i) => (
            <motion.li
              key={row.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-4 sm:gap-x-6 items-start"
            >
              <span className="font-display text-2xl text-muted-foreground/40 leading-none w-10">
                {row.step}
              </span>
              <div>
                <p className="text-sm font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{row.detail}</p>
              </div>
              <span className="hidden sm:inline-flex text-[10px] tracking-wider uppercase text-muted-foreground/70 self-center whitespace-nowrap">
                {row.eta}
              </span>
            </motion.li>
          ))}
        </ol>
      </motion.section>

      {/* ─── Quick actions ────────────────────────────────────────────────── */}
      <motion.section {...fade} transition={{ delay: 0.3 }} className="mb-12">
        <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
          While you wait
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://line.me/R/ti/p/@undercatcreatives"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('confirmation_line_click', { briefId: id ?? null })}
            className="border border-border p-4 hover:border-foreground transition-colors"
          >
            <MessageCircle size={16} className="mb-2" />
            <p className="text-sm font-medium">Add us on LINE</p>
            <p className="text-xs text-muted-foreground mt-1">@undercatcreatives — quickest reach</p>
          </a>
          <a
            href="mailto:hello@undercatcreatives.com"
            onClick={() => trackEvent('confirmation_email_click', { briefId: id ?? null })}
            className="border border-border p-4 hover:border-foreground transition-colors"
          >
            <Mail size={16} className="mb-2" />
            <p className="text-sm font-medium">Email Pao directly</p>
            <p className="text-xs text-muted-foreground mt-1">For anything time-sensitive</p>
          </a>
          <Link
            to="/work"
            onClick={() => trackEvent('confirmation_work_click', { briefId: id ?? null })}
            className="border border-border p-4 hover:border-foreground transition-colors"
          >
            <ArrowRight size={16} className="mb-2" />
            <p className="text-sm font-medium">See what we&rsquo;ve made</p>
            <p className="text-xs text-muted-foreground mt-1">Browse the work that matches the world you described</p>
          </Link>
        </div>
      </motion.section>

      {/* ─── Brief summary (compact) ──────────────────────────────────────── */}
      {brief && (
        <motion.section
          {...fade}
          transition={{ delay: 0.4 }}
          className="border-t border-border pt-8 mb-8"
        >
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
            What you sent us
          </p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Brief ID</span>
              <code className="text-xs font-mono text-muted-foreground">{id}</code>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Mission</span>
              <span>{brief.mission ?? '—'}</span>
            </div>
            {brief.offer.keyOffer && (
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Project</span>
                <span>{brief.offer.keyOffer}</span>
              </div>
            )}
            {brief.timeline && (
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Timeline</span>
                <span>{brief.timeline}</span>
              </div>
            )}
            {brief.budgetRange && (
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Budget</span>
                <span>{brief.budgetRange}</span>
              </div>
            )}
            {brief.channels.length > 0 && (
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Channels</span>
                <span>{brief.channels.join(', ')}</span>
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <motion.div {...fade} transition={{ delay: 0.5 }} className="border-t border-border pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Undercat" className="h-4 w-auto invert dark:invert-0" />
          <span className="font-display text-[10px] font-bold tracking-wider uppercase">Undercat</span>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs tracking-wider uppercase">
          <Link to="/">Back to home</Link>
        </Button>
      </motion.div>
    </div>
  );
}
