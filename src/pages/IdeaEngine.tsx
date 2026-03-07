import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';
import { Sparkles, Loader2, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const industries = [
  'Automotive', 'Golf & Lifestyle', 'Restaurant & F&B', 'Events & Entertainment',
  'Real Estate', 'Fashion & Luxury', 'Tech & SaaS', 'Health & Wellness',
  'Education', 'Finance & Banking', 'E-commerce', 'Travel & Hospitality',
];

const objectives = [
  'Brand Awareness', 'Lead Generation', 'Sales & Conversion', 'Product Launch',
  'Community Building', 'Employer Branding', 'Event Promotion', 'Retargeting',
];

const platforms = [
  'TikTok', 'Instagram Reels', 'YouTube', 'Meta Ads',
  'LinkedIn', 'Website', 'Email', 'LED / OOH',
];

const tones = [
  'Bold & Loud', 'Quiet Luxury', 'Playful & Fun', 'Serious & Professional',
  'Cinematic', 'Raw & Authentic', 'Minimal & Clean', 'Energetic & Fast',
];

interface ContentIdea {
  title: string;
  insight: string;
  concept: string;
  brandFit: string;
  visualDirection: string;
  format: string;
  undercatReason: string;
}

interface ContentResults {
  ideas: ContentIdea[];
}

function ChipSelector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2 text-xs font-medium tracking-wide uppercase border transition-all duration-150 ${
              value === opt
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-foreground'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function IdeaCard({ idea, index }: { idea: ContentIdea; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border border-border"
    >
      {/* Header */}
      <div className="border-b border-border p-6 flex items-start gap-4">
        <span className="text-highlight font-display font-bold text-xl shrink-0 leading-none mt-1">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="font-display text-lg tracking-wide">{idea.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 italic">"{idea.insight}"</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Concept</p>
          <p className="text-sm leading-relaxed">{idea.concept}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Brand Fit</p>
            <p className="text-sm leading-relaxed">{idea.brandFit}</p>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-1.5">Visual Direction</p>
            <p className="text-sm leading-relaxed">{idea.visualDirection}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">Format</span>
            <span className="px-3 py-1 border border-highlight bg-highlight/10 text-xs font-medium">{idea.format}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-highlight mb-1.5">Why Undercat Would Recommend It</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{idea.undercatReason}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function IdeaEngine() {
  const [industry, setIndustry] = useState('');
  const [objective, setObjective] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ContentResults | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    trackEvent('page_view', { page: 'idea-engine' });
  }, []);

  const canGenerate = industry && objective && platform && tone;

  const generate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setResults(null);
    trackEvent('start_builder');

    try {
      const { data, error } = await supabase.functions.invoke('content-ideas', {
        body: { industry, objective, platform, tone },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Normalize: AI may return { ideas: [...] } or the array directly
      const ideas = Array.isArray(data?.ideas) ? data.ideas : Array.isArray(data) ? data : [];
      if (ideas.length === 0) throw new Error('No ideas were generated. Please try again.');
      setResults({ ideas } as ContentResults);
      trackEvent('generate_blueprint');
    } catch (e: any) {
      console.error('Idea generation failed:', e);
      toast({
        title: 'Generation failed',
        description: e.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIndustry('');
    setObjective('');
    setPlatform('');
    setTone('');
    setResults(null);
  };

  const copyAll = () => {
    if (!results) return;
    const text = results.ideas.map((idea, i) => [
      `## ${String(i + 1).padStart(2, '0')} — ${idea.title}`,
      `**Insight:** ${idea.insight}`,
      `**Concept:** ${idea.concept}`,
      `**Brand Fit:** ${idea.brandFit}`,
      `**Visual Direction:** ${idea.visualDirection}`,
      `**Format:** ${idea.format}`,
      `**Why Undercat Recommends:** ${idea.undercatReason}`,
    ].join('\n')).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="container py-16 md:py-24 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-highlight flex items-center justify-center">
            <Sparkles size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl">What Should We Make?</h1>
            <p className="text-xs text-muted-foreground tracking-wider uppercase mt-0.5">AI Content Idea Engine</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-xl">
          Tell us about your brand and goals. Our creative AI generates 5 sharp, strategically filtered content ideas — no filler, no fluff.
        </p>
      </motion.div>

      {/* Input selectors */}
      <div className="space-y-8 mb-12">
        <ChipSelector label="Industry" options={industries} value={industry} onChange={setIndustry} />
        <ChipSelector label="Objective" options={objectives} value={objective} onChange={setObjective} />
        <ChipSelector label="Primary Platform" options={platforms} value={platform} onChange={setPlatform} />
        <ChipSelector label="Brand Tone" options={tones} value={tone} onChange={setTone} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-16">
        <Button
          variant="hero"
          size="xl"
          onClick={generate}
          disabled={!canGenerate || loading}
          className={!canGenerate ? 'opacity-40' : ''}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Generate Ideas
            </>
          )}
        </Button>
        {(industry || objective || platform || tone) && (
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors p-2" title="Reset">
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="w-12 h-12 bg-highlight flex items-center justify-center animate-pulse">
              <Sparkles size={24} className="text-primary" />
            </div>
            <p className="text-sm text-muted-foreground tracking-wider uppercase">Filtering through Undercat standards...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">Curated for</p>
                <p className="text-sm font-medium mt-1">
                  {industry} · {objective} · {platform} · {tone}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
            </div>

            {/* Idea Cards */}
            {results.ideas.map((idea, i) => (
              <IdeaCard key={i} idea={idea} index={i} />
            ))}

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="border-t border-border pt-8 mt-8 text-center"
            >
              <p className="text-sm text-muted-foreground mb-4">Ready to bring these ideas to life?</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="/builder">Build Your Project <ArrowRight size={14} /></a>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <a href="/contact">Book a Call <ArrowRight size={14} /></a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
