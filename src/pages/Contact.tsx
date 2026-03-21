import { useState, useEffect } from 'react';
import { useBrief } from '@/hooks/useBrief';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/utils/analytics';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function Contact() {
  const { brief, updateLead } = useBrief();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { trackEvent('page_view', { page: 'contact' }); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.lead.name || !brief.lead.email || !brief.lead.consent) return;

    const payload = {
      brief: { ...brief },
      submittedAt: new Date().toISOString(),
    };

    // Insert into Supabase
    supabase.from('contact_submissions').insert({
      name: brief.lead.name,
      company: brief.lead.company,
      email: brief.lead.email,
      phone: brief.lead.phone,
      project_location: brief.lead.projectLocation || '',
      notes: brief.lead.notes || '',
      consent: brief.lead.consent,
      brief_data: brief,
    }).then(() => {}).catch(() => {});

    try {
      const stored = JSON.parse(localStorage.getItem('undercat-leads') ?? '[]');
      stored.push(payload);
      localStorage.setItem('undercat-leads', JSON.stringify(stored));
    } catch {}

    trackEvent('submit_lead', { briefId: brief.id });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="container py-32 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle size={48} className="mx-auto text-highlight mb-6" />
          <h1 className="font-display text-3xl mb-4">Brief Received.</h1>
          <p className="text-muted-foreground text-sm mb-2">We'll review your project details and be in touch within 1 business day.</p>
          <p className="text-xs text-muted-foreground">Next steps: We'll send a scoping summary, then schedule a 15-min alignment call if it's a fit.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-16 md:py-24 max-w-lg">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Let's Talk.</h1>
        <p className="text-muted-foreground text-sm mb-10">Submit your details and we'll take it from here.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Name *" value={brief.lead.name} onChange={v => updateLead({ name: v })} required />
          <Field label="Company *" value={brief.lead.company} onChange={v => updateLead({ company: v })} required />
          <Field label="Email *" type="email" value={brief.lead.email} onChange={v => updateLead({ email: v })} required />
          <Field label="Phone" value={brief.lead.phone} onChange={v => updateLead({ phone: v })} />
          <Field label="Project Location" value={brief.lead.projectLocation} onChange={v => updateLead({ projectLocation: v })} />

          <div>
            <label className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground block mb-2">Notes (optional)</label>
            <textarea
              value={brief.lead.notes}
              onChange={e => updateLead({ notes: e.target.value })}
              maxLength={500}
              rows={3}
              className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow resize-none"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={brief.lead.consent}
              onChange={e => updateLead({ consent: e.target.checked })}
              className="mt-1"
            />
            <span className="text-xs text-muted-foreground">
              I consent to Undercat Creatives contacting me about this project and storing my information per their data policy. *
            </span>
          </label>

          <div className="pt-4 space-y-3">
            <Button variant="hero" size="xl" type="submit" className="w-full" disabled={!brief.lead.consent || !brief.lead.name || !brief.lead.email}>
              Submit Brief
            </Button>
          </div>
        </form>

        <div className="mt-10 p-5 border border-border space-y-2">
          <p className="text-[10px] font-bold tracking-wider uppercase text-foreground">Undercat OS</p>
          <p className="text-xs text-muted-foreground">• Contract + 50% deposit required before production starts</p>
          <p className="text-xs text-muted-foreground">• 2 revision rounds included</p>
          <p className="text-xs text-muted-foreground">• Final files released upon final payment</p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        maxLength={120}
        className="w-full bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
      />
    </div>
  );
}
