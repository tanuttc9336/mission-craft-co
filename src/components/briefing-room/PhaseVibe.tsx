import { useBrief } from '@/hooks/useBrief';
import { channelOptions } from '@/data/builder';
import { Channel } from '@/types/brief';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';

const sliders: { key: keyof ReturnType<typeof useBrief>['brief']['styleDNA']; left: string; right: string }[] = [
  { key: 'quietVsLoud', left: 'Quiet Luxury', right: 'Loud Energy' },
  { key: 'cinematicVsUGC', left: 'Cinematic', right: 'UGC' },
  { key: 'minimalVsMaximal', left: 'Minimal', right: 'Maximal' },
  { key: 'funnyVsSerious', left: 'Funny', right: 'Serious' },
];

function getVibeSentence(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 40 ? 'understated elegance' : dna.quietVsLoud > 60 ? 'bold, high-energy presence' : 'balanced confidence');
  parts.push(dna.cinematicVsUGC < 40 ? 'polished cinematic' : dna.cinematicVsUGC > 60 ? 'raw, authentic UGC' : 'mixed-format');
  parts.push(dna.minimalVsMaximal < 40 ? 'clean and minimal' : dna.minimalVsMaximal > 60 ? 'rich and maximal' : 'well-composed');
  parts.push(dna.funnyVsSerious < 40 ? 'with a touch of wit' : dna.funnyVsSerious > 60 ? 'with a serious tone' : 'with tonal flexibility');
  return `Your vibe: ${parts.join(', ')}.`;
}

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

  return (
    <div className="space-y-10">
      {/* Style DNA Sliders */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-2">Dial In The Vibe.</h2>
        <p className="text-muted-foreground text-sm mb-6">Slide to set the creative direction.</p>

        <div className="space-y-8 max-w-lg">
          {sliders.map(s => (
            <div key={s.key}>
              <div className="flex justify-between text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-3">
                <span>{s.left}</span>
                <span>{s.right}</span>
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

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Channels */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-2">Where Will This Live?</h2>
        <p className="text-muted-foreground text-sm mb-4">Select your target channels.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg">
          {channelOptions.map(c => {
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
    </div>
  );
}
