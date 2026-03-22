import { useEffect, useState, useMemo } from 'react';
import { useBrief } from '@/hooks/useBrief';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Copy, Phone, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { matchCases } from '@/utils/caseMatch';
import ExploreCard from '@/components/briefing-room/ExploreCard';
import logo from '@/assets/undercat-logo.png';

const sections: { title: string; key: string }[] = [
  { title: 'Objective', key: 'objective' },
  { title: 'Audience', key: 'audience' },
  { title: 'Project', key: 'offer' },
  { title: 'Style Direction', key: 'styleSummary' },
  { title: 'Channel Plan', key: 'channelPlan' },
  { title: 'Creative Directions', key: 'creativeDirections' },
  { title: 'In Scope', key: 'inScope' },
  { title: 'Out of Scope', key: 'outOfScope' },
  { title: 'Timeline Phases', key: 'timeline' },
  { title: 'Asset Checklist', key: 'assetChecklist' },
  { title: 'Terms & Conditions', key: 'terms' },
];

export default function Blueprint() {
  const { brief, finalizeBrief, updateLead } = useBrief();
  const [blocks, setBlocks] = useState<Record<string, string>>(
    typeof brief.blueprintTextBlocks === 'object' && !Array.isArray(brief.blueprintTextBlocks)
      ? brief.blueprintTextBlocks
      : {}
  );
  const [copied, setCopied] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Lead capture form state
  const [leadName, setLeadName] = useState(brief.lead.name);
  const [leadCompany, setLeadCompany] = useState(brief.lead.company);
  const [leadEmail, setLeadEmail] = useState(brief.lead.email);
  const [leadPhone, setLeadPhone] = useState(brief.lead.phone);

  // Referenced work from matching
  const referencedWork = useMemo(() =>
    matchCases({
      mission: brief.mission,
      audienceText: brief.audienceText,
      styleDNA: brief.styleDNA,
      limit: 3,
    }),
    [brief.mission, brief.audienceText, brief.styleDNA]
  );

  useEffect(() => {
    trackEvent('page_view', { page: 'blueprint' });
    const final = finalizeBrief();
    setBlocks(
      typeof final.blueprintTextBlocks === 'object' && !Array.isArray(final.blueprintTextBlocks)
        ? final.blueprintTextBlocks
        : {}
    );
    // Check if already unlocked (returning user)
    if (brief.lead.email) setUnlocked(true);
  }, []);

  const handleUnlock = () => {
    if (!leadName.trim() || !leadEmail.trim()) return;
    updateLead({ name: leadName, company: leadCompany, email: leadEmail, phone: leadPhone });
    setUnlocked(true);
    trackEvent('blueprint_unlock', { email: leadEmail });
  };

  const handlePrint = () => {
    trackEvent('generate_blueprint', { action: 'download' });
    window.print();
  };

  const handleCopy = () => {
    const text = sections
      .map(s => `## ${s.title}\n${blocks[s.key] ?? 'TBD'}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sections to show in preview (not blurred)
  const previewKeys = ['objective', 'audience', 'offer', 'styleSummary'];

  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* Header */}
      <div className="no-print mb-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-2">
            Briefing Room
          </p>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Your Mission Brief</h1>
          <p className="text-muted-foreground text-sm">
            {unlocked
              ? 'Your full blueprint is ready. Download, copy, or book a call to get started.'
              : 'Preview your brief below. Unlock the full blueprint to download and share.'
            }
          </p>
        </motion.div>
      </div>

      {/* Actions — only when unlocked */}
      {unlocked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="no-print flex flex-wrap gap-3 mb-10"
        >
          <Button variant="hero" onClick={handlePrint}>
            <Download size={14} /> Download PDF
          </Button>
          <Button variant="heroOutline" onClick={handleCopy}>
            <Copy size={14} /> {copied ? 'Copied!' : 'Copy Text'}
          </Button>
          <Button variant="heroOutline" asChild>
            <a href="#book-call" onClick={() => trackEvent('book_call_click')}>
              <Phone size={14} /> Book a Discovery Call
            </a>
          </Button>
        </motion.div>
      )}

      {/* Blueprint Document */}
      <div className="bg-background border border-foreground p-8 md:p-12 space-y-8" id="blueprint-doc">
        {/* Header */}
        <div className="border-b border-border pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Undercat" className="h-5 w-auto invert dark:invert-0" />
              <span className="font-display text-xs font-bold tracking-wider uppercase">Undercat</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl">Mission Brief</h2>
            <p className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase">
              Generated {new Date(brief.createdAt).toLocaleDateString()} • ID: {brief.id.slice(0, 8)}
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map(s => {
          const isPreview = previewKeys.includes(s.key);
          const shouldBlur = !unlocked && !isPreview;

          return (
            <div key={s.key} className="relative">
              <h3 className="font-display text-sm tracking-wider mb-3">{s.title}</h3>
              <pre className={`text-sm text-muted-foreground whitespace-pre-wrap font-body leading-relaxed transition-all ${
                shouldBlur ? 'blur-sm select-none' : ''
              }`}>
                {blocks[s.key] ?? 'Not yet defined.'}
              </pre>
            </div>
          );
        })}

        {/* Additional context — if present */}
        {blocks.additionalContext && (
          <div className={!unlocked ? 'blur-sm select-none' : ''}>
            <h3 className="font-display text-sm tracking-wider mb-3">Additional Context</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">
              {blocks.additionalContext}
            </pre>
          </div>
        )}
      </div>

      {/* ─── Lead Capture Gate ─── */}
      <AnimatePresence>
        {!unlocked && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="mt-10 p-8 border border-foreground bg-background"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lock size={16} />
              <h3 className="font-display text-lg">Unlock Your Full Blueprint</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your details to access the complete brief — including scope boundaries, creative directions, and download options.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mb-4">
              <input
                type="text"
                value={leadName}
                onChange={e => setLeadName(e.target.value)}
                placeholder="Your name *"
                className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
              />
              <input
                type="text"
                value={leadCompany}
                onChange={e => setLeadCompany(e.target.value)}
                placeholder="Company"
                className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
              />
              <input
                type="email"
                value={leadEmail}
                onChange={e => setLeadEmail(e.target.value)}
                placeholder="Email *"
                className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
              />
              <input
                type="tel"
                value={leadPhone}
                onChange={e => setLeadPhone(e.target.value)}
                placeholder="Phone (optional)"
                className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
              />
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={handleUnlock}
              disabled={!leadName.trim() || !leadEmail.trim()}
            >
              Unlock Blueprint <ArrowRight size={16} />
            </Button>

            <p className="text-[10px] text-muted-foreground mt-3">
              We'll use this to follow up on your brief. No spam.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Referenced Work ─── */}
      {unlocked && referencedWork.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10"
        >
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Referenced Work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {referencedWork.map(mc => (
              <ExploreCard
                key={mc.caseStudy.id}
                caseStudy={mc.caseStudy}
                matchReason={mc.matchReason}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Bottom CTAs */}
      <div className="no-print mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center">
        {unlocked ? (
          <>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Send Brief to Undercat</Link>
            </Button>
            <Button variant="ghost" asChild className="text-xs tracking-wider uppercase">
              <Link to="/briefing-room">← Edit Brief</Link>
            </Button>
          </>
        ) : (
          <Button variant="ghost" asChild className="text-xs tracking-wider uppercase">
            <Link to="/briefing-room">← Edit Brief</Link>
          </Button>
        )}
      </div>

      {/* JSON output for admin */}
      <details className="no-print mt-8">
        <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground tracking-wider uppercase">
          Admin: View JSON payload
        </summary>
        <pre className="mt-4 bg-secondary p-4 text-xs overflow-auto max-h-96 border border-border">
          {JSON.stringify(brief, null, 2)}
        </pre>
      </details>
    </div>
  );
}
