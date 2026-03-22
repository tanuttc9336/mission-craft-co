import { useBrief } from '@/hooks/useBrief';
import { missions } from '@/data/builder';
import { Mission } from '@/types/brief';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { matchForMission } from '@/utils/caseMatch';
import ExploreCard from './ExploreCard';

export default function PhaseMission() {
  const { brief, updateBrief, updateOffer } = useBrief();

  // Match cases based on mission + audience text
  const matchedCases = useMemo(
    () => matchForMission(brief.mission, brief.audienceText),
    [brief.mission, brief.audienceText]
  );

  const hasExploreContent = matchedCases.length > 0 && (brief.mission || brief.audienceText.trim());

  return (
    <div className="space-y-10">
      {/* Section A: Mission Select */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-1">What's The Mission?</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This shapes the creative strategy and how we measure success.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {missions.map(m => (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateBrief({ mission: m.id as Mission })}
              className={`text-left p-4 border transition-all duration-200 ${
                brief.mission === m.id
                  ? 'border-foreground bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground'
              }`}
            >
              <span className="font-medium text-sm">{m.label}</span>
              <p className={`text-xs mt-1 ${brief.mission === m.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                {m.description}
              </p>
              {/* Context: what this typically involves */}
              <p className={`text-[10px] mt-2 ${brief.mission === m.id ? 'opacity-50' : 'text-muted-foreground/50'}`}>
                e.g. {m.starterDeliverables.slice(0, 2).join(', ')}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Section B: Audience — free-text only */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Who's It For?</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Be specific: who are they, what do they care about, what action should they take?
        </p>

        <textarea
          value={brief.audienceText}
          onChange={e => updateBrief({ audienceText: e.target.value })}
          maxLength={200}
          rows={3}
          placeholder="e.g. Luxury car buyers in Thailand, aged 30-50, who value performance and exclusivity"
          className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow resize-none"
        />
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {brief.audienceText.length}/200
        </span>
      </section>

      <div className="h-px bg-border" />

      {/* Section C: One-liner */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Describe The Project</h2>
        <p className="text-muted-foreground text-sm mb-4">
          One sentence. What are we producing and why?
        </p>

        <input
          type="text"
          maxLength={120}
          value={brief.offer.keyOffer}
          onChange={e => updateOffer({ keyOffer: e.target.value })}
          placeholder="e.g. Launch film for the all-new Audi A5 in Thailand"
          className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow"
        />
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {brief.offer.keyOffer.length}/120
        </span>
      </section>

      {/* ─── Explore While Briefing ─── */}
      <AnimatePresence>
        {hasExploreContent && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-border">
              <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                We've done something similar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedCases.map(mc => (
                  <ExploreCard
                    key={mc.caseStudy.id}
                    caseStudy={mc.caseStudy}
                    matchReason={mc.matchReason}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
