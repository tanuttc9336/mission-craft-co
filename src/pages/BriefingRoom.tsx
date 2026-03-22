import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBrief } from '@/hooks/useBrief';
import { trackEvent } from '@/utils/analytics';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Crosshair, FolderOpen } from 'lucide-react';

import PhaseMission from '@/components/briefing-room/PhaseMission';
import PhaseVibe from '@/components/briefing-room/PhaseVibe';
import PhaseScope from '@/components/briefing-room/PhaseScope';

const phases = [
  { label: 'The Mission', component: PhaseMission },
  { label: 'The Vibe', component: PhaseVibe },
  { label: 'The Scope', component: PhaseScope },
];

const templateOptions = [
  { id: 'audi-thailand', label: 'Audi Thailand', desc: 'Launch campaign' },
  { id: 'greenline-golf-lab', label: 'Greenline Golf Lab', desc: 'Content strategy' },
  { id: 'ranees-restaurant', label: "Ranee's Restaurant", desc: 'Social media content' },
  { id: 'fc-bayern-bangkok', label: 'FC Bayern Bangkok', desc: 'Event content' },
];

export default function BriefingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentStep, totalSteps, clarityPercent, nextStep, prevStep, goToStep, resetBrief, prefillFromCase, finalizeBrief, brief } = useBrief();
  const [showGateway, setShowGateway] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    trackEvent('page_view', { page: 'briefing-room' });

    // If template query param, prefill and skip gateway
    const template = searchParams.get('template');
    if (template) {
      prefillFromCase(template);
      setShowGateway(false);
    }

    // If brief already has data (returning user), skip gateway
    if (brief.mission || brief.audienceText || brief.channels.length > 0) {
      setShowGateway(false);
    }
  }, []);

  useEffect(() => {
    if (!showGateway) {
      trackEvent('briefing_room_phase', { phase: currentStep, label: phases[currentStep]?.label });
    }
  }, [currentStep, showGateway]);

  const handleGenerate = () => {
    trackEvent('generate_blueprint');
    finalizeBrief();
    navigate('/blueprint');
  };

  const handleStartFresh = () => {
    resetBrief();
    setShowGateway(false);
    trackEvent('briefing_room_entry', { path: 'fresh' });
  };

  const handleSelectTemplate = (caseId: string) => {
    prefillFromCase(caseId);
    setShowGateway(false);
    trackEvent('briefing_room_entry', { path: 'template', caseId });
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetBrief();
    setShowResetConfirm(false);
    setShowGateway(true);
  };

  const PhaseComponent = phases[currentStep]?.component;
  const isLast = currentStep === totalSteps - 1;

  // Clarity blocks (4 blocks)
  const clarityBlocks = Math.round((clarityPercent / 100) * 4);

  // === GATEWAY ===
  if (showGateway) {
    return (
      <div className="container py-16 md:py-24 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
            Briefing Room
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4">
            Plan Your<br />Next Move.
          </h1>
          <p className="text-muted-foreground text-sm mb-2">
            A 3-step mission planner that turns your idea into a production-ready brief.
          </p>
          <p className="text-muted-foreground text-sm mb-12">
            Takes about 3 minutes.
          </p>

          {/* Entry Paths */}
          {!showTemplates ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStartFresh}
                className="text-left p-6 border border-border bg-background hover:border-foreground transition-all group"
              >
                <Crosshair size={20} className="mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium text-sm block mb-1">Start Fresh</span>
                <p className="text-xs text-muted-foreground">Build from scratch</p>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowTemplates(true)}
                className="text-left p-6 border border-border bg-background hover:border-foreground transition-all group"
              >
                <FolderOpen size={20} className="mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-medium text-sm block mb-1">Use a Template</span>
                <p className="text-xs text-muted-foreground">Pre-fill from our past work</p>
              </motion.button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
                  Choose a template
                </p>
                <button onClick={() => setShowTemplates(false)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  ← Back
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templateOptions.map(t => (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTemplate(t.id)}
                    className="text-left p-5 border border-border bg-background hover:border-foreground transition-all"
                  >
                    <span className="font-medium text-sm block mb-1">{t.label}</span>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Social proof */}
          <div className="pt-8 border-t border-border">
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground">
              Trusted by Audi, Ducati, FC Bayern, Greenline Golf Lab
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // === PHASE VIEW ===
  return (
    <div className="container py-16 md:py-24 max-w-3xl">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-1">
              Briefing Room
            </p>
            <h1 className="font-display text-xl md:text-2xl">
              Phase {currentStep + 1}/{totalSteps}: {phases[currentStep]?.label}
            </h1>
          </div>
          <button
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            title="Start over"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Phase indicator blocks (clickable) */}
        <div className="flex gap-1.5 mb-3">
          {phases.map((phase, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className={`h-1.5 flex-1 transition-colors cursor-pointer hover:opacity-80 ${
                i <= currentStep ? 'bg-foreground' : 'bg-border'
              }`}
              title={phase.label}
            />
          ))}
        </div>

        {/* Clarity blocks */}
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">Brief clarity</p>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-3 h-3 transition-colors ${
                  i < clarityBlocks ? 'bg-foreground' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="min-h-[400px]"
        >
          {PhaseComponent && <PhaseComponent />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={currentStep === 0 ? () => setShowGateway(true) : prevStep}
          className="text-xs tracking-wider uppercase"
        >
          <ArrowLeft size={14} /> {currentStep === 0 ? 'Gateway' : 'Back'}
        </Button>

        {isLast ? (
          <Button variant="hero" size="lg" onClick={handleGenerate}>
            View My Blueprint <ArrowRight size={16} />
          </Button>
        ) : (
          <Button variant="default" size="lg" onClick={nextStep}>
            Continue <ArrowRight size={14} />
          </Button>
        )}
      </div>

      {/* Reset confirmation dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border border-border p-8 max-w-sm w-full mx-4"
            >
              <h3 className="font-display text-lg mb-2">Start Over?</h3>
              <p className="text-sm text-muted-foreground mb-6">This will clear your current brief. You'll start from the gateway.</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="default" onClick={confirmReset} className="flex-1">
                  Start Over
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
