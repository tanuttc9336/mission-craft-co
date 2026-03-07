import { useEffect, useState } from 'react';
import { useBrief } from '@/hooks/useBrief';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import { motion } from 'framer-motion';
import { Download, Copy, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blueprint() {
  const { brief, finalizeBrief } = useBrief();
  const [blocks, setBlocks] = useState(brief.blueprintTextBlocks);
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState(brief.lead.email);

  useEffect(() => {
    trackEvent('page_view', { page: 'blueprint' });
    const final = finalizeBrief();
    setBlocks(final.blueprintTextBlocks);
  }, []);

  const handlePrint = () => {
    trackEvent('generate_blueprint', { action: 'download' });
    window.print();
  };

  const handleCopy = () => {
    const text = Object.entries(blocks).map(([k, v]) => `## ${k.toUpperCase()}\n${v}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    if (!email) return;
    trackEvent('submit_lead', { via: 'blueprint_email' });
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, briefId: brief.id, type: 'blueprint_email' }),
    }).catch(() => {});
    setEmailSent(true);
  };

  const sections: { title: string; key: string }[] = [
    { title: 'Objective', key: 'objective' },
    { title: 'Audience Summary', key: 'audience' },
    { title: 'Offer', key: 'offer' },
    { title: 'Style Direction', key: 'styleSummary' },
    { title: 'Channel Plan', key: 'channelPlan' },
    { title: 'Deliverables', key: 'deliverables' },
    { title: 'Timeline Phases', key: 'timeline' },
    { title: 'Creative Directions', key: 'creativeDirections' },
    { title: 'Asset Checklist', key: 'assetChecklist' },
    { title: 'Terms & Conditions', key: 'terms' },
  ];

  return (
    <div className="container py-16 md:py-24 max-w-3xl relative">
      <div className="liquid-orb liquid-orb-1 -top-40 -right-32 opacity-15" />

      {/* Actions Bar */}
      <div className="no-print mb-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Your Project Blueprint</h1>
          <p className="text-muted-foreground text-sm mb-8">A high-level plan based on your brief. Not a full strategy — that starts after kickoff.</p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="hero" onClick={handlePrint}>
              <Download size={14} /> Download PDF
            </Button>
            <Button variant="heroOutline" onClick={handleCopy}>
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button variant="heroOutline" asChild>
              <a href="#book-call" onClick={() => trackEvent('book_call_click')}>
                <Phone size={14} /> Book a 15-min Call
              </a>
            </Button>
          </div>

          {/* Email capture */}
          {!emailSent ? (
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <Button onClick={handleEmail} disabled={!email}>
                <Mail size={14} /> Email to me
              </Button>
            </div>
          ) : (
            <p className="text-sm text-accent font-medium">✓ We'll send this to {email} shortly.</p>
          )}
        </motion.div>
      </div>

      {/* Blueprint Document */}
      <div className="bg-card rounded-lg border border-border shadow-elevated p-8 md:p-12 space-y-8 relative z-10" id="blueprint-doc">
        <div className="border-b border-border pb-6">
          <span className="font-display text-lg text-foreground">Undercat<span className="text-accent">.</span></span>
          <h2 className="font-display text-2xl md:text-3xl mt-2">Project Blueprint</h2>
          <p className="text-xs text-muted-foreground mt-1">Generated {new Date(brief.createdAt).toLocaleDateString()} • ID: {brief.id.slice(0, 8)}</p>
        </div>

        {sections.map(s => (
          <div key={s.key}>
            <h3 className="font-display text-lg mb-2">{s.title}</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">
              {blocks[s.key] ?? 'Not yet defined.'}
            </pre>
          </div>
        ))}
      </div>

      {/* JSON output for admin */}
      <details className="no-print mt-8 relative z-10">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Admin: View JSON payload</summary>
        <pre className="mt-4 bg-secondary rounded-lg p-4 text-xs overflow-auto max-h-96 text-secondary-foreground">
          {JSON.stringify(brief, null, 2)}
        </pre>
      </details>

      <div className="no-print mt-12 text-center relative z-10">
        <Button variant="ghost" asChild>
          <Link to="/contact">Ready to go? Submit your details →</Link>
        </Button>
      </div>
    </div>
  );
}
