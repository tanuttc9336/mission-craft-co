import { useLens } from '@/hooks/useLens';
import { Slider } from '@/components/ui/slider';
import LensChip from './LensChip';
import type { LensCreativeMode } from '@/types/lens';

const sliders: { key: keyof ReturnType<typeof useLens>['session']['styleDNA']; left: string; right: string }[] = [
  { key: 'quietVsLoud', left: 'Quiet Luxury', right: 'Loud Energy' },
  { key: 'cinematicVsRaw', left: 'Cinematic', right: 'Raw / UGC' },
  { key: 'minimalVsExpressive', left: 'Minimal', right: 'Expressive' },
  { key: 'seriousVsPlayful', left: 'Serious', right: 'Playful' },
];

const modes: LensCreativeMode[] = ['Safe / Commercial', 'Elevated / Distinctive', 'Bold / Campaign-Led'];

function getStyleRead(dna: ReturnType<typeof useLens>['session']['styleDNA'], mode: LensCreativeMode | null): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 35 ? 'lean' : dna.quietVsLoud > 65 ? 'high-energy' : 'balanced');
  parts.push(dna.cinematicVsRaw < 35 ? 'cinematic' : dna.cinematicVsRaw > 65 ? 'raw and authentic' : 'mixed-format');
  parts.push(dna.minimalVsExpressive < 35 ? 'premium restraint' : dna.minimalVsExpressive > 65 ? 'expressive richness' : 'well-composed');
  parts.push(dna.seriousVsPlayful < 35 ? 'with serious edge' : dna.seriousVsPlayful > 65 ? 'with enough energy to feel alive' : 'with tonal flexibility');
  const modeStr = mode === 'Bold / Campaign-Led' ? ' Campaign energy.' : mode === 'Elevated / Distinctive' ? ' Elevated craft.' : mode === 'Safe / Commercial' ? ' Commercial clarity.' : '';
  return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}, ${parts[1]}, ${parts[2]} ${parts[3]}.${modeStr}`;
}

export default function StepEnergy() {
  const { session, updateStyleDNA, updateSession } = useLens();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">What Energy Fits?</h2>
      <p className="text-muted-foreground text-sm mb-10">How should this brand feel?</p>

      <div className="space-y-8 max-w-lg">
        {sliders.map(s => (
          <div key={s.key}>
            <div className="flex justify-between text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-3">
              <span>{s.left}</span>
              <span>{s.right}</span>
            </div>
            <Slider
              value={[session.styleDNA[s.key]]}
              onValueChange={([v]) => updateStyleDNA({ [s.key]: v })}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Creative Mode</p>
        <div className="flex flex-wrap gap-2">
          {modes.map(m => (
            <LensChip key={m} label={m} active={session.creativeMode === m} onClick={() => updateSession({ creativeMode: m })} />
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 border border-border max-w-lg">
        <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Style Read</p>
        <p className="text-sm font-display italic">"{getStyleRead(session.styleDNA, session.creativeMode)}"</p>
      </div>
    </div>
  );
}
