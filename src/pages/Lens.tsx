import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useLens } from '@/hooks/useLens';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';
import { useToast } from '@/hooks/use-toast';
import {
  LENS_INDUSTRIES, LENS_GOALS, LENS_FEELS, LENS_CHALLENGES,
  LensSlide, LensSummary, LensLead,
} from '@/types/lens';
import {
  ArrowRight, ArrowLeft, Loader2, RotateCcw, Copy, Check,
  Eye, Briefcase, Phone, Mail,
} from 'lucide-react';

/* ─── Chip toggle ─── */
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-xs font-medium tracking-wide uppercase border transition-all duration-150 ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-foreground border-border hover:border-foreground'
      }`}
    >
      {label}
    </button>
  );
}

/* ─── Multi-chip ─── */
function MultiChip({ options, selected, toggle }: { options: string[]; selected: string[]; toggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <Chip key={o} label={o} active={selected.includes(o)} onClick={() => toggle(o)} />
      ))}
    </div>
  );
}

/* ─── Slide type labels ─── */
const slideTypeLabels: Record<string, string> = {
  'brand-read': 'Your Brand Read',
  'audience-reality': 'Audience Reality',
  'category-trap': 'Category Trap',
  'what-missing': 'What May Be Missing',
  'route': 'Recommended Route',
  'undercat-take': 'If Undercat Built This',
};

const slideTypeNumbers: Record<string, string> = {
  'brand-read': '01',
  'audience-reality': '02',
  'category-trap': '03',
  'what-missing': '04',
  'route': '05',
  'undercat-take': '06',
};

/* ─────────────────────────────────────────────── */
/* MAIN COMPONENT                                 */
/* ─────────────────────────────────────────────── */
export default function Lens() {
  const {
    phase, setPhase, context, updateContext,
    slides, setSlides, summary, setSummary,
    currentSlide, setCurrentSlide,
    lead, setLead, buildSession, resetLens,
  } = useLens();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { trackEvent('lens_page_view'); }, []);

  /* ─── Context helpers ─── */
  const toggleFeel = (v: string) => {
    const next = context.desiredFeel.includes(v)
      ? context.desiredFeel.filter(x => x !== v)
      : [...context.desiredFeel, v];
    updateContext({ desiredFeel: next });
  };
  const toggleChallenge = (v: string) => {
    const next = context.currentChallenges.includes(v)
      ? context.currentChallenges.filter(x => x !== v)
      : [...context.currentChallenges, v];
    updateContext({ currentChallenges: next });
  };

  const canSubmitContext = context.businessName && context.industry && context.offerDescription && context.targetAudience && context.mainGoal;

  /* ─── Generate session ─── */
  const generateSession = async () => {
    if (!canSubmitContext) return;
    setLoading(true);
    setPhase('generating');
    trackEvent('lens_submit_context');

    try {
      const { data, error } = await supabase.functions.invoke('undercat-lens', {
        body: context,
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const parsedSlides: LensSlide[] = Array.isArray(data?.slides) ? data.slides : [];
      const parsedSummary: LensSummary | null = data?.summary ?? null;

      if (parsedSlides.length === 0) throw new Error('No session was generated. Please try again.');

      setSlides(parsedSlides);
      setSummary(parsedSummary!);
      setCurrentSlide(0);
      setPhase('session');
      trackEvent('lens_generate_session');
    } catch (e: any) {
      console.error('Lens generation failed:', e);
      toast({ title: 'Generation failed', description: e.message || 'Please try again.', variant: 'destructive' });
      setPhase('context');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Copy summary ─── */
  const copySummary = () => {
    if (!summary) return;
    const text = [
      `# Undercat Lens — ${context.businessName}`,
      '',
      `**Brand Situation:** ${summary.brandSituation}`,
      `**Audience Reality:** ${summary.audienceReality}`,
      `**Category Trap:** ${summary.categoryTrap}`,
      `**What May Be Missing:** ${summary.whatMayBeMissing}`,
      `**Recommended Route:** ${summary.recommendedRoute}`,
      `**Undercat Take:** ${summary.undercatTake}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
    trackEvent('lens_save_result');
  };

  /* ─── Lead form state ─── */
  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '', phone: '', consent: false });

  const submitLead = () => {
    if (!leadForm.name || !leadForm.email || !leadForm.consent) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    const leadData: LensLead = { ...leadForm };
    setLead(leadData);
    buildSession();
    trackEvent('lens_submit_lead');
    toast({ title: 'Saved! Check your inbox.' });
    trackEvent('lens_email_result_click');
  };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* ═══════════════ HERO ═══════════════ */}
        {phase === 'hero' && (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[90vh] flex items-center bg-primary text-primary-foreground"
          >
            <div className="container py-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-2 mb-8">
                  <Eye size={16} className="text-highlight" />
                  <span className="text-[10px] font-medium tracking-[0.3em] uppercase opacity-60">Undercat Lens</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6 tracking-tighter">
                  See Your Brand<br />
                  Through <span className="text-highlight">Undercat</span>
                </h1>
                <p className="text-lg md:text-xl opacity-60 max-w-xl mb-10 font-body">
                  Discover what may be holding attention back — and what kind of creative direction could move it forward.
                </p>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={() => { setPhase('context'); trackEvent('lens_start'); }}
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Start Your Lens <ArrowRight size={16} />
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    <Link to="/work">Explore Work</Link>
                  </Button>
                </div>
                <p className="text-xs opacity-40 tracking-wider">
                  A fast guided session. High-level recommendations only.
                </p>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════ CONTEXT CAPTURE ═══════════════ */}
        {phase === 'context' && (
          <motion.section
            key="context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container py-16 md:py-24 max-w-2xl"
          >
            <div className="mb-12">
              <button onClick={() => setPhase('hero')} className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-widest uppercase flex items-center gap-2 mb-8">
                <ArrowLeft size={14} /> Back
              </button>
              <h2 className="font-display text-2xl md:text-3xl mb-3">Context Capture</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Give us a little context. We'll shape the session around your brand.
              </p>
            </div>

            <div className="space-y-8">
              {/* Business name */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Business Name *</label>
                <Input
                  value={context.businessName}
                  onChange={e => updateContext({ businessName: e.target.value })}
                  placeholder="e.g. Apex Golf Co."
                  className="bg-background"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3 block">Industry *</label>
                <div className="flex flex-wrap gap-2">
                  {LENS_INDUSTRIES.map(ind => (
                    <Chip key={ind} label={ind} active={context.industry === ind} onClick={() => updateContext({ industry: ind })} />
                  ))}
                </div>
              </div>

              {/* What do you sell */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">What Do You Sell? *</label>
                <Input
                  value={context.offerDescription}
                  onChange={e => updateContext({ offerDescription: e.target.value })}
                  placeholder="e.g. premium golf apparel / restaurant experience / automotive campaign"
                  className="bg-background"
                />
              </div>

              {/* Target audience */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Who Are You Trying to Reach? *</label>
                <Input
                  value={context.targetAudience}
                  onChange={e => updateContext({ targetAudience: e.target.value })}
                  placeholder="e.g. new golfers / local diners / high-intent car buyers"
                  className="bg-background"
                />
              </div>

              {/* Main goal */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3 block">What Are You Trying to Achieve? *</label>
                <div className="flex flex-wrap gap-2">
                  {LENS_GOALS.map(g => (
                    <Chip key={g} label={g} active={context.mainGoal === g} onClick={() => updateContext({ mainGoal: g })} />
                  ))}
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-border pt-8">
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">Optional — helps us sharpen the lens</p>
              </div>

              {/* Desired feel */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3 block">How Should It Feel?</label>
                <MultiChip options={LENS_FEELS} selected={context.desiredFeel} toggle={toggleFeel} />
              </div>

              {/* Current challenges */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3 block">What's Not Working Right Now?</label>
                <MultiChip options={LENS_CHALLENGES} selected={context.currentChallenges} toggle={toggleChallenge} />
              </div>

              {/* Extra notes */}
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Anything Else We Should Know?</label>
                <Textarea
                  value={context.extraNotes}
                  onChange={e => updateContext({ extraNotes: e.target.value })}
                  placeholder="Links, references, context…"
                  rows={3}
                  className="bg-background resize-none"
                />
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
              <button onClick={() => setPhase('hero')} className="text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase flex items-center gap-2">
                <ArrowLeft size={14} /> Back
              </button>
              <Button
                variant="hero"
                size="xl"
                onClick={generateSession}
                disabled={!canSubmitContext}
                className={!canSubmitContext ? 'opacity-40' : ''}
              >
                Generate My Lens <ArrowRight size={16} />
              </Button>
            </div>
          </motion.section>
        )}

        {/* ═══════════════ GENERATING ═══════════════ */}
        {phase === 'generating' && (
          <motion.section
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[70vh] flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-primary flex items-center justify-center">
                <Loader2 size={28} className="text-primary-foreground animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium tracking-wider uppercase mb-2">Building your lens</p>
                <p className="text-xs text-muted-foreground">Reframing {context.businessName} through Undercat's perspective…</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════ SESSION (STEPPER) ═══════════════ */}
        {phase === 'session' && slides.length > 0 && (
          <motion.section
            key="session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {/* Progress bar */}
            <div className="fixed top-16 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
              <div className="container flex items-center justify-between h-12">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  Undercat Lens — {context.businessName}
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>
              <div className="h-0.5 bg-border">
                <motion.div
                  className="h-full bg-highlight"
                  initial={false}
                  animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="container py-28 md:py-32 max-w-2xl min-h-[80vh] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35 }}
                >
                  {(() => {
                    const slide = slides[currentSlide];
                    const typeLabel = slideTypeLabels[slide.slideType] || slide.slideType;
                    const num = slideTypeNumbers[slide.slideType] || String(currentSlide + 1).padStart(2, '0');
                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-8">
                          <span className="text-highlight font-display text-sm font-bold">{num}</span>
                          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">{typeLabel}</span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 leading-tight">{slide.title}</h2>
                        <p className="text-lg md:text-xl leading-relaxed mb-6 font-body">{slide.lead}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{slide.body}</p>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-16 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentSlide === 0) { setPhase('context'); }
                    else { setCurrentSlide(currentSlide - 1); }
                  }}
                  className="text-xs tracking-wider uppercase"
                >
                  <ArrowLeft size={14} /> Back
                </Button>

                {currentSlide < slides.length - 1 ? (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => {
                      setCurrentSlide(currentSlide + 1);
                      trackEvent('lens_complete_slide', { slide: currentSlide });
                    }}
                  >
                    Continue <ArrowRight size={14} />
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => {
                      trackEvent('lens_complete_slide', { slide: currentSlide });
                      setPhase('summary');
                    }}
                  >
                    See Your Summary <ArrowRight size={16} />
                  </Button>
                )}
              </div>

              {/* Restart */}
              <div className="mt-6 flex justify-center">
                <button onClick={resetLens} className="text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase flex items-center gap-2">
                  <RotateCcw size={12} /> Restart
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* ═══════════════ SUMMARY ═══════════════ */}
        {phase === 'summary' && summary && (
          <motion.section
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container py-16 md:py-24 max-w-2xl"
          >
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-highlight" />
                <span className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground">Undercat Lens — Summary</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl mb-2">{context.businessName}</h2>
              <p className="text-sm text-muted-foreground">{context.industry} · {context.mainGoal}</p>
            </div>

            {/* Summary cards */}
            <div className="space-y-6 mb-16">
              {([
                ['Brand Situation', summary.brandSituation],
                ['Audience Reality', summary.audienceReality],
                ['Category Trap', summary.categoryTrap],
                ['What May Be Missing', summary.whatMayBeMissing],
                ['Recommended Route', summary.recommendedRoute],
                ['Undercat Take', summary.undercatTake],
              ] as [string, string][]).map(([label, text], i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border p-6"
                >
                  <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-highlight mb-3">{label}</p>
                  <p className="text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="border-t border-border pt-8 mb-12">
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-6">Next Move</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <Button variant="default" size="lg" asChild className="w-full" onClick={() => trackEvent('lens_explore_work_click')}>
                  <Link to="/work"><Briefcase size={14} /> Explore Work</Link>
                </Button>
                <Button variant="default" size="lg" asChild className="w-full" onClick={() => trackEvent('lens_continue_to_builder')}>
                  <Link to="/briefing-room">Start Your Brief <ArrowRight size={14} /></Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild className="w-full" onClick={() => trackEvent('lens_book_call_click')}>
                  <Link to="/contact"><Phone size={14} /> Book a Call</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="ghost" size="sm" onClick={copySummary}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Summary'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPhase('lead')}>
                  <Mail size={14} /> Email This to Me
                </Button>
              </div>
            </div>

            {/* Back to slides */}
            <div className="flex justify-center">
              <button onClick={() => { setCurrentSlide(0); setPhase('session'); }} className="text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase flex items-center gap-2">
                <ArrowLeft size={12} /> Review Slides
              </button>
            </div>
          </motion.section>
        )}

        {/* ═══════════════ LEAD CAPTURE ═══════════════ */}
        {phase === 'lead' && (
          <motion.section
            key="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="container py-16 md:py-24 max-w-md"
          >
            <button onClick={() => setPhase('summary')} className="text-muted-foreground hover:text-foreground transition-colors text-xs tracking-widest uppercase flex items-center gap-2 mb-8">
              <ArrowLeft size={14} /> Back to Summary
            </button>
            <h2 className="font-display text-2xl mb-3">Save Your Lens</h2>
            <p className="text-sm text-muted-foreground mb-8">We'll email your personalized summary. No spam, just your result.</p>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Name *</label>
                <Input value={leadForm.name} onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Company</label>
                <Input value={leadForm.company} onChange={e => setLeadForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
              </div>
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Email *</label>
                <Input type="email" value={leadForm.email} onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))} placeholder="you@company.com" />
              </div>
              <div>
                <label className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2 block">Phone (optional)</label>
                <Input value={leadForm.phone} onChange={e => setLeadForm(p => ({ ...p, phone: e.target.value }))} placeholder="(+66) 094-986-9882" />
              </div>
              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  checked={leadForm.consent}
                  onCheckedChange={(c) => setLeadForm(p => ({ ...p, consent: !!c }))}
                  id="lens-consent"
                />
                <label htmlFor="lens-consent" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  I agree to receive my Lens result via email. We won't share your data.
                </label>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="hero" size="xl" className="w-full" onClick={submitLead} disabled={!leadForm.name || !leadForm.email || !leadForm.consent}>
                Email My Lens <Mail size={16} />
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
