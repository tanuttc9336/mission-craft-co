import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBrief } from '@/hooks/useBrief';
import { trackEvent } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

import StepMission from '@/components/builder/StepMission';
import StepAudience from '@/components/builder/StepAudience';
import StepOffer from '@/components/builder/StepOffer';
import StepStyleDNA from '@/components/builder/StepStyleDNA';
import StepChannels from '@/components/builder/StepChannels';
import StepDeliverables from '@/components/builder/StepDeliverables';
import StepBudget from '@/components/builder/StepBudget';

const stepLabels = ['Mission', 'Audience', 'Offer', 'Style DNA', 'Channels', 'Deliverables', 'Budget & Timeline'];

const stepComponents = [StepMission, StepAudience, StepOffer, StepStyleDNA, StepChannels, StepDeliverables, StepBudget];

export default function Builder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentStep, totalSteps, clarityPercent, nextStep, prevStep, resetBrief, prefillFromCase, finalizeBrief, brief } = useBrief();

  useEffect(() => {
    trackEvent('page_view', { page: 'builder' });
    trackEvent('start_builder');
    const template = searchParams.get('template');
    if (template) prefillFromCase(template);
  }, []);

  useEffect(() => {
    trackEvent('complete_step', { step: currentStep, label: stepLabels[currentStep] });
  }, [currentStep]);

  const handleGenerate = () => {
    trackEvent('generate_blueprint');
    finalizeBrief();
    navigate('/blueprint');
  };

  const StepComponent = stepComponents[currentStep];
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl">Brief Builder</h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
              Step {currentStep + 1} / {totalSteps} — {stepLabels[currentStep]}
            </p>
          </div>
          <button onClick={resetBrief} className="text-muted-foreground hover:text-foreground transition-colors p-2" title="Reset">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-0.5 bg-border overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              initial={false}
              animate={{ width: `${clarityPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 tracking-wider uppercase">Brief Clarity: {clarityPercent}%</p>
        </div>

        {/* Step indicators */}
        <div className="flex gap-1 mt-4">
          {stepLabels.map((_, i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 transition-colors ${
                i <= currentStep ? 'bg-foreground' : 'bg-border'
              }`}
            />
          ))}
        </div>
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

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="text-xs tracking-wider uppercase"
        >
          <ArrowLeft size={14} /> Back
        </Button>

        {isLast ? (
          <Button variant="hero" size="lg" onClick={handleGenerate}>
            Generate Blueprint <ArrowRight size={16} />
          </Button>
        ) : (
          <Button variant="default" size="lg" onClick={nextStep}>
            Continue <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
