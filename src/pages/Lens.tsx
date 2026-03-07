import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLens } from '@/hooks/useLens';
import { trackEvent } from '@/utils/analytics';
import { supabase } from '@/integrations/supabase/client';

import StepWorld from '@/components/lens/StepWorld';
import StepAudience from '@/components/lens/StepAudience';
import StepStuck from '@/components/lens/StepStuck';
import StepEnergy from '@/components/lens/StepEnergy';
import StepGoals from '@/components/lens/StepGoals';
import LensResult from '@/components/lens/LensResult';

const stepLabels = ['Your World', 'Your Audience', 'What\'s Stuck', 'Brand Energy', 'Your Goals'];
const stepComponents = [StepWorld, StepAudience, StepStuck, StepEnergy, StepGoals];

export default function Lens() {
  const { session, currentStep, totalSteps, nextStep, prevStep, setResult, resetSession } = useLens();
  const [started, setStarted] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(!!session.result);
  const [error, setError] = useState('');

  useEffect(() => {
    trackEvent('lens_page_view');
  }, []);

  const handleStart = () => {
    setStarted(true);
    trackEvent('lens_start');
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    trackEvent('lens_generate_result');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('lens-generate', {
        body: {
          industry: session.industry,
          offerType: session.offerType,
          brandStage: session.brandStage,
          audienceType: session.audienceType,
          buyingMindset: session.buyingMindset,
          desiredAudienceResponse: session.desiredAudienceResponse,
          currentChallenges: session.currentChallenges,
          styleDNA: session.styleDNA,
          creativeMode: session.creativeMode,
          mainGoal: session.mainGoal,
          timeline: session.timeline,
          budgetRange: session.budgetRange,
          constraints: session.constraints,
        },
      });

      if (fnError) throw new Error(fnError.message || 'Generation failed');

      const result = data?.result || data;
      if (!result?.brandSituation) throw new Error('Invalid result format');

      setResult(result);
      setShowResult(true);
    } catch (e) {
      console.error('Lens generation error:', e);
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const isLast = currentStep === totalSteps - 1;
  const StepComponent = stepComponents[currentStep];

  // Hero / Landing
  if (!started && !showResult) {
    return (
      <div className="min-h-[90vh] flex items-center">
        <div className="container max-w-3xl py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">Undercat Lens</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-6 tracking-tighter">
              See Your Brand<br />Through Undercat
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-10">
              Discover what may be holding attention back — and what kind of creative direction could move it forward.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="hero" size="xl" onClick={handleStart}>
                Start Your Lens <ArrowRight size={16} />
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/work">Explore Work</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">A fast guided session. High-level recommendations only.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Result
  if (showResult) {
    return (
      <div className="container py-16 md:py-24">
        <LensResult />
        <div className="mt-12 text-center">
          <button
            onClick={() => { resetSession(); setShowResult(false); setStarted(false); }}
            className="text-xs text-muted-foreground tracking-wider uppercase hover:text-foreground transition-colors"
          >
            Start a new Lens session
          </button>
        </div>
      </div>
    );
  }

  // Stepper
  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.3em] uppercase text-muted-foreground mb-1">Undercat Lens</p>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              Step {currentStep + 1} / {totalSteps} — {stepLabels[currentStep]}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mt-2">
          {stepLabels.map((_, i) => (
            <div key={i} className={`h-0.5 flex-1 transition-colors duration-300 ${i <= currentStep ? 'bg-foreground' : 'bg-border'}`} />
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 tracking-wider uppercase">
          Undercat Lens Progress — {Math.round(((currentStep + 1) / totalSteps) * 100)}%
        </p>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[400px]"
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive mt-6">
          {error}
        </motion.p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
        <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="text-xs tracking-wider uppercase">
          <ArrowLeft size={14} /> Back
        </Button>

        {isLast ? (
          <Button variant="hero" size="lg" onClick={handleGenerate} disabled={generating}>
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> Generating</>
            ) : (
              <>Generate Your Lens <ArrowRight size={16} /></>
            )}
          </Button>
        ) : (
          <Button variant="default" size="lg" onClick={() => { nextStep(); trackEvent('lens_complete_step', { step: currentStep }); }}>
            Continue <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
