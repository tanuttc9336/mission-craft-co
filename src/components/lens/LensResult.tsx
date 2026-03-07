import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Mail, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLens } from '@/hooks/useLens';
import { trackEvent } from '@/utils/analytics';

function ResultBlock({ label, children, delay = 0 }: { label: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="border border-border p-6 md:p-8"
    >
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-muted-foreground mb-4">{label}</p>
      {children}
    </motion.div>
  );
}

export default function LensResult() {
  const { session, updateLead } = useLens();
  const [copied, setCopied] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const result = session.result;

  if (!result) return null;

  const copyAll = () => {
    const text = [
      `UNDERCAT LENS RESULT`,
      ``,
      `BRAND SITUATION`,
      result.brandSituation,
      ``,
      `AUDIENCE NEED`,
      result.audienceNeed,
      ``,
      `CATEGORY INSIGHT`,
      result.categoryMistake,
      ``,
      `UNDERCAT APPROACH`,
      result.undercatApproach,
      ``,
      `RECOMMENDED ROUTE: ${result.recommendedRoute.name}`,
      result.recommendedRoute.whyItFits,
      `Next step: ${result.recommendedRoute.nextStep}`,
      ``,
      ...result.creativeAngles.map((a, i) => [
        `CREATIVE ANGLE ${i + 1}: ${a.title}`,
        a.conceptSummary,
        `Tone: ${a.toneFeeling}`,
        `Why it works: ${a.whyItWorks}`,
        ``,
      ]).flat(),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('lens_submit_lead');
    // Mock submission
    console.log('[Lens Lead]', JSON.stringify({ ...session.lead, sessionId: session.id }));
    setLeadSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground mb-3">Undercat Lens Result</p>
        <h2 className="font-display text-3xl md:text-4xl mb-3">Your Brand, Through Our Lens</h2>
        <p className="text-muted-foreground text-sm">A high-level reading. Not a strategy deck — a starting point.</p>
      </motion.div>

      <div className="space-y-4">
        <ResultBlock label="Your Brand Situation" delay={0.1}>
          <p className="text-sm leading-relaxed">{result.brandSituation}</p>
        </ResultBlock>

        <ResultBlock label="What Your Audience Probably Needs" delay={0.2}>
          <p className="text-sm leading-relaxed">{result.audienceNeed}</p>
        </ResultBlock>

        <ResultBlock label="What Brands In This Space Often Get Wrong" delay={0.3}>
          <p className="text-sm leading-relaxed">{result.categoryMistake}</p>
        </ResultBlock>

        <ResultBlock label="How Undercat Would Approach It" delay={0.4}>
          <p className="text-sm leading-relaxed">{result.undercatApproach}</p>
        </ResultBlock>

        <ResultBlock label="Recommended Creative Route" delay={0.5}>
          <h3 className="font-display text-lg mb-3">{result.recommendedRoute.name}</h3>
          <p className="text-sm leading-relaxed mb-3">{result.recommendedRoute.whyItFits}</p>
          <p className="text-xs text-muted-foreground">
            <span className="text-highlight font-medium">Suggested next step:</span> {result.recommendedRoute.nextStep}
          </p>
        </ResultBlock>

        {result.creativeAngles.map((angle, i) => (
          <ResultBlock key={i} label={`Creative Angle ${i + 1}`} delay={0.6 + i * 0.1}>
            <h3 className="font-display text-lg mb-2">{angle.title}</h3>
            <p className="text-sm leading-relaxed mb-3">{angle.conceptSummary}</p>
            <div className="flex flex-col sm:flex-row gap-4 text-xs text-muted-foreground">
              <div><span className="text-foreground font-medium">Tone:</span> {angle.toneFeeling}</div>
              <div><span className="text-foreground font-medium">Why it works:</span> {angle.whyItWorks}</div>
            </div>
          </ResultBlock>
        ))}
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 flex flex-wrap gap-3"
      >
        <Button variant="ghost" onClick={copyAll} className="text-xs tracking-wider uppercase">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy Summary'}
        </Button>
        <Button variant="ghost" onClick={() => { setShowLeadForm(true); trackEvent('lens_email_result_click'); }} className="text-xs tracking-wider uppercase">
          <Mail size={14} /> Email This To Me
        </Button>
      </motion.div>

      {/* Lead Capture */}
      {showLeadForm && !leadSubmitted && (
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLeadSubmit}
          className="mt-8 border border-border p-6 md:p-8 space-y-4"
        >
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Save Your Lens Result</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required value={session.lead.name} onChange={e => updateLead({ name: e.target.value })} placeholder="Name" className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
            <input required value={session.lead.company} onChange={e => updateLead({ company: e.target.value })} placeholder="Company" className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
            <input required type="email" value={session.lead.email} onChange={e => updateLead({ email: e.target.value })} placeholder="Email" className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
            <input value={session.lead.phone} onChange={e => updateLead({ phone: e.target.value })} placeholder="Phone (optional)" className="bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={session.lead.consent} onChange={e => updateLead({ consent: e.target.checked })} className="mt-1" />
            <span className="text-xs text-muted-foreground">I agree to receive my Lens result and relevant updates from Undercat.</span>
          </label>
          <Button type="submit" variant="default" disabled={!session.lead.consent || !session.lead.email} className="text-xs tracking-wider uppercase">
            Save & Email My Result
          </Button>
        </motion.form>
      )}

      {leadSubmitted && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 border border-highlight p-6 text-center">
          <p className="text-sm font-display">Result saved. Check your inbox.</p>
        </motion.div>
      )}

      {/* Next Steps CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-16 border-t border-border pt-12"
      >
        <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">What's Next</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/builder" onClick={() => trackEvent('lens_continue_to_builder')} className="border border-border p-6 hover:border-foreground transition-colors group">
            <h4 className="font-display text-sm mb-2">Build Your Project</h4>
            <p className="text-xs text-muted-foreground mb-4">Shape your brief with our guided builder.</p>
            <span className="text-xs text-foreground font-medium tracking-wider uppercase group-hover:text-highlight transition-colors">Start <ArrowRight size={12} className="inline" /></span>
          </Link>
          <Link to="/work" onClick={() => trackEvent('lens_explore_work_click')} className="border border-border p-6 hover:border-foreground transition-colors group">
            <h4 className="font-display text-sm mb-2">Explore Similar Work</h4>
            <p className="text-xs text-muted-foreground mb-4">See how we've solved this before.</p>
            <span className="text-xs text-foreground font-medium tracking-wider uppercase group-hover:text-highlight transition-colors">Browse <ArrowRight size={12} className="inline" /></span>
          </Link>
          <Link to="/contact" onClick={() => trackEvent('lens_book_call_click')} className="border border-border p-6 hover:border-foreground transition-colors group">
            <h4 className="font-display text-sm mb-2">Book A Scoping Call</h4>
            <p className="text-xs text-muted-foreground mb-4">15 minutes. No commitment.</p>
            <span className="text-xs text-foreground font-medium tracking-wider uppercase group-hover:text-highlight transition-colors">Book <ArrowRight size={12} className="inline" /></span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
