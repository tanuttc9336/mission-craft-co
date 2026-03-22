import { useBrief } from '@/hooks/useBrief';
import { channelOptions } from '@/data/builder';
import { Channel } from '@/types/brief';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { matchForVibe, matchForMission } from '@/utils/caseMatch';
import ExploreCard from './ExploreCard';

const sliders: { key: keyof ReturnType<typeof useBrief>['brief']['styleDNA']; left: string; right: string; leftDesc: string; rightDesc: string }[] = [
  { key: 'quietVsLoud', left: 'Quiet Luxury', right: 'Loud Energy', leftDesc: 'Understated, refined', rightDesc: 'Bold, high-impact' },
  { key: 'cinematicVsUGC', left: 'Cinematic', right: 'UGC', leftDesc: 'Polished, produced', rightDesc: 'Raw, authentic' },
  { key: 'minimalVsMaximal', left: 'Minimal', right: 'Maximal', leftDesc: 'Clean, focused', rightDesc: 'Rich, layered' },
  { key: 'funnyVsSerious', left: 'Funny', right: 'Serious', leftDesc: 'Playful, witty', rightDesc: 'Authoritative, credible' },
];

function getVibeSentence(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 40 ? 'understated elegance' : dna.quietVsLoud > 60 ? 'bold, high-energy presence' : 'balanced confidence');
  parts.push(dna.cinematicVsUGC < 40 ? 'polished cinematic' : dna.cinematicVsUGC > 60 ? 'raw, authentic UGC' : 'mixed-format');
  parts.push(dna.minimalVsMaximal < 40 ? 'clean and minimal' : dna.minimalVsMaximal > 60 ? 'rich and maximal' : 'well-composed');
  parts.push(dna.funnyVsSerious < 40 ? 'with a touch of wit' : dna.funnyVsSerious > 60 ? 'with a serious tone' : 'with tonal flexibility');
  return `Your vibe: ${parts.join(', ')}.`;
}

// Filter out LED Screen from channel options
const filteredChannels = channelOptions.filter(c => c.id !== 'led-screen');

export default function PhaseVibe() {
  const { brief, updateStyleDNA, updateBrief } = useBrief();

  const toggleChannel = (id: Channel) => {
    const next = brief.channels.includes(id)
      ? brief.channels.filter(c => c !== id)
      : [...brief.channels, id];
    updateBrief({ channels: next });
  };

  const selectedChannels = channelOptions.filter(c => brief.channels.includes(c.id));
  const allRatios = [...new Set(selectedChannels.flatMap(c => c.aspectRatios))];

  // Get Phase 1 matched case IDs to exclude duplicates
  const phase1Matches = useMemo(
    () => matchForMission(brief.mission, brief.audienceText),
    [brief.mission, brief.audienceText]
  );
  const phase1Ids = phase1Matches.map(m => m.caseStudy.id);

  // Match cases based on vibe DNA (excluding Phase 1 matches)
  const vibeMatches = useMemo(
    () => matchForVibe(brief.mission, brief.audienceText, brief.styleDNA, phase1Ids),
    [brief.mission, brief.audienceText, brief.styleDNA, phase1Ids]
  );

  return (
    <div className="space-y-10">
      {/* Style DNA Sliders */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-1">Dial In The Vibe.</h2>
        <p className="text-muted-foreground text-sm mb-6">
          This guides our creative direction — from casting to color grade.
        </p>

        <div className="space-y-8 max-w-lg">
          {sliders.map(s => (
            <div key={s.key}>
              <div className="flex justify-between text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-1">
                <span>{s.left}</span>
                <span>{s.right}</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground/50 mb-3">
                <span>{s.leftDesc}</span>
                <span>{s.rightDesc}</span>
              </div>
              <Slider
                value={[brief.styleDNA[s.key]]}
                onValueChange={([v]) => updateStyleDNA({ [s.key]: v })}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          ))}
        </div>

        {/* Live vibe sentence */}
        <div className="mt-6 p-4 border border-border max-w-lg">
          <p className="text-sm font-display italic">{getVibeSentence(brief.styleDNA)}</p>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Channels — without LED Screen */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Where Will This Live?</h2>
        <p className="text-muted-foreground text-sm mb-4">
          This determines aspect ratios and edit styles we'll need.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
          {filteredChannels.map(c => {
            const active = brief.channels.includes(c.id);
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleChannel(c.id)}
                className={`p-4 border text-center transition-all duration-200 ${
                  active ? 'border-foreground bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground'
                }`}
              >
                <span className="text-sm font-medium">{c.label}</span>
              </motion.button>
            );
          })}
        </div>

        {allRatios.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 border border-border max-w-lg">
            <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-2">Required aspect ratios</p>
            <div className="flex flex-wrap gap-2">
              {allRatios.map(r => (
                <span key={r} className="text-xs bg-secondary px-3 py-1 border border-border">{r}</span>
              ))}
            </div>
          </motion.div>
        )}
      </section>

      {/* ─── Explore: Vibe-Matched Work ─── */}
      <AnimatePresence>
        {vibeMatches.length > 0 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-border">
              <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-4">
                Your vibe matches
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vibeMatches.map(mc => (
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
