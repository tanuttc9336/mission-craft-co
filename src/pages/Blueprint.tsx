import { useEffect, useState } from 'react';
import { useBrief } from '@/hooks/useBrief';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import { motion } from 'framer-motion';
import { Download, Copy, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/undercat-logo.png';

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
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* Actions Bar */}
      <div className="no-print mb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl mb-2">Your Project Blueprint</h1>
          <p className="text-muted-foreground text-sm mb-10">A high-level plan based on your brief. Not a full strategy — that starts after kickoff.</p>

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

          {!emailSent ? (
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
              />
              <Button onClick={handleEmail} disabled={!email}>
                <Mail size={14} /> Email to me
              </Button>
            </div>
          ) : (
            <p className="text-sm text-highlight font-medium">✓ We'll send this to {email} shortly.</p>
          )}
        </motion.div>
      </div>

      {/* Blueprint Document */}
      <div className="bg-background border border-foreground p-8 md:p-12 space-y-8" id="blueprint-doc">
        <div className="border-b border-border pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Undercat" className="h-5 w-auto invert dark:invert-0" />
              <span className="font-display text-xs font-bold tracking-wider uppercase">Undercat</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl">Project Blueprint</h2>
            <p className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase">Generated {new Date(brief.createdAt).toLocaleDateString()} • ID: {brief.id.slice(0, 8)}</p>
          </div>
        </div>

        {sections.map(s => (
          <div key={s.key}>
            <h3 className="font-display text-sm tracking-wider mb-3">{s.title}</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-body leading-relaxed">
              {blocks[s.key] ?? 'Not yet defined.'}
            </pre>
          </div>
        ))}
      </div>

      {/* JSON output for admin */}
      <details className="no-print mt-8">
        <summary className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground tracking-wider uppercase">Admin: View JSON payload</summary>
        <pre className="mt-4 bg-secondary p-4 text-xs overflow-auto max-h-96 border border-border">
          {JSON.stringify(brief, null, 2)}
        </pre>
      </details>

      <div className="no-print mt-12 text-center">
        <Button variant="ghost" asChild className="text-xs tracking-wider uppercase">
          <Link to="/contact">Ready to go? Submit your details →</Link>
        </Button>
      </div>
    </div>
  );
}
