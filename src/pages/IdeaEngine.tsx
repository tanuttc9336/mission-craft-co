import { useState } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';
import { Sparkles, Lightbulb, Target, Video, MousePointerClick, Loader2, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';
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

interface ContentResults {
  contentIdeas: string[];
  campaignThemes: { title: string; description: string }[];
  adAngles: string[];
  shortFormVideoIdeas: string[];
  ctaIdeas: string[];
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

function ResultSection({
  icon,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-display text-sm tracking-widest uppercase">{title}</h3>
      </div>
      {children}
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

      setResults(data as ContentResults);
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
    const text = [
      '# CONTENT IDEAS',
      ...results.contentIdeas.map((idea, i) => `${i + 1}. ${idea}`),
      '',
      '# CAMPAIGN THEMES',
      ...results.campaignThemes.map(t => `**${t.title}** — ${t.description}`),
      '',
      '# AD ANGLES',
      ...results.adAngles.map((a, i) => `${i + 1}. ${a}`),
      '',
      '# SHORT-FORM VIDEO IDEAS',
      ...results.shortFormVideoIdeas.map((v, i) => `${i + 1}. ${v}`),
      '',
      '# CTA IDEAS',
      ...results.ctaIdeas.map((c, i) => `${i + 1}. ${c}`),
    ].join('\n');
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
          Tell us about your brand and goals. Our AI generates 10 content ideas, campaign themes, ad angles, video concepts, and CTA suggestions — instantly.
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
            <p className="text-sm text-muted-foreground tracking-wider uppercase">Crafting your ideas...</p>
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
                <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">Results for</p>
                <p className="text-sm font-medium mt-1">
                  {industry} · {objective} · {platform} · {tone}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy All'}
              </Button>
            </div>

            {/* Content Ideas */}
            <ResultSection
              icon={<Lightbulb size={16} className="text-highlight" />}
              title="10 Content Ideas"
              delay={0}
            >
              <ol className="space-y-3">
                {results.contentIdeas.map((idea, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-highlight font-display font-bold text-xs mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ol>
            </ResultSection>

            {/* Campaign Themes */}
            <ResultSection
              icon={<Target size={16} className="text-highlight" />}
              title="Campaign Themes"
              delay={0.1}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.campaignThemes.map((theme, i) => (
                  <div key={i} className="border border-border p-4">
                    <h4 className="font-display text-sm mb-2">{theme.title}</h4>
                    <p className="text-xs text-muted-foreground">{theme.description}</p>
                  </div>
                ))}
              </div>
            </ResultSection>

            {/* Ad Angles */}
            <ResultSection
              icon={<Target size={16} className="text-highlight" />}
              title="Ad Angles"
              delay={0.2}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.adAngles.map((angle, i) => (
                  <div key={i} className="flex gap-3 p-3 border border-border text-sm">
                    <span className="text-highlight font-display font-bold text-xs shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span>{angle}</span>
                  </div>
                ))}
              </div>
            </ResultSection>

            {/* Short-form Video Ideas */}
            <ResultSection
              icon={<Video size={16} className="text-highlight" />}
              title="Short-Form Video Ideas"
              delay={0.3}
            >
              <ol className="space-y-3">
                {results.shortFormVideoIdeas.map((vid, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-highlight font-display font-bold text-xs mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{vid}</span>
                  </li>
                ))}
              </ol>
            </ResultSection>

            {/* CTA Ideas */}
            <ResultSection
              icon={<MousePointerClick size={16} className="text-highlight" />}
              title="CTA Ideas"
              delay={0.4}
            >
              <div className="flex flex-wrap gap-3">
                {results.ctaIdeas.map((cta, i) => (
                  <div key={i} className="px-4 py-2 border border-highlight bg-highlight/10 text-sm font-medium">
                    {cta}
                  </div>
                ))}
              </div>
            </ResultSection>

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
