import { useBrief } from '@/hooks/useBrief';
import { Slider } from '@/components/ui/slider';

const sliders: { key: keyof ReturnType<typeof useBrief>['brief']['styleDNA']; left: string; right: string }[] = [
  { key: 'quietVsLoud', left: 'Quiet Luxury', right: 'Loud Energy' },
  { key: 'cinematicVsUGC', left: 'Cinematic', right: 'UGC' },
  { key: 'minimalVsMaximal', left: 'Minimal', right: 'Maximal' },
  { key: 'funnyVsSerious', left: 'Funny', right: 'Serious' },
];

function getStyleSentence(dna: ReturnType<typeof useBrief>['brief']['styleDNA']): string {
  const parts: string[] = [];
  parts.push(dna.quietVsLoud < 40 ? 'understated elegance' : dna.quietVsLoud > 60 ? 'bold, high-energy presence' : 'balanced confidence');
  parts.push(dna.cinematicVsUGC < 40 ? 'polished cinematic' : dna.cinematicVsUGC > 60 ? 'raw, authentic UGC' : 'mixed-format');
  parts.push(dna.minimalVsMaximal < 40 ? 'clean and minimal' : dna.minimalVsMaximal > 60 ? 'rich and maximal' : 'well-composed');
  parts.push(dna.funnyVsSerious < 40 ? 'with a touch of wit' : dna.funnyVsSerious > 60 ? 'with a serious tone' : 'with tonal flexibility');
  return `Your style: ${parts.join(', ')}.`;
}

export default function StepStyleDNA() {
  const { brief, updateStyleDNA } = useBrief();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Dial in the vibe.</h2>
      <p className="text-muted-foreground text-sm mb-8">Slide to set the creative direction.</p>

      <div className="space-y-8 max-w-lg">
        {sliders.map(s => (
          <div key={s.key}>
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-3">
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

      <div className="mt-8 p-4 bg-secondary rounded-lg max-w-lg">
        <p className="text-sm font-display italic">{getStyleSentence(brief.styleDNA)}</p>
      </div>
    </div>
  );
}
