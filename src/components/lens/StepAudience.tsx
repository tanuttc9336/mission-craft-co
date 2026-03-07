import { useLens } from '@/hooks/useLens';
import LensChip from './LensChip';
import type { LensAudienceType, LensBuyingMindset } from '@/types/lens';

const audienceTypes: LensAudienceType[] = ['Busy Decision-Makers', 'Founder-Led Buyers', 'Premium / Taste-Driven Buyers', 'Mainstream Consumers', 'Local Community', 'Event-Driven Audience', 'Niche Enthusiasts', 'Internal Team / Talent'];
const mindsets: LensBuyingMindset[] = ['Trust-first', 'Status-driven', 'Price-aware', 'Emotion-led', 'Convenience-led', 'Performance-led', 'Curiosity-led'];

export default function StepAudience() {
  const { session, updateSession } = useLens();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Who Are You Trying To Move?</h2>
      <p className="text-muted-foreground text-sm mb-10">The audience changes the creative route.</p>

      <div className="space-y-10">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Audience Type</p>
          <div className="flex flex-wrap gap-2">
            {audienceTypes.map(a => (
              <LensChip key={a} label={a} active={session.audienceType === a} onClick={() => updateSession({ audienceType: a })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Buying Mindset</p>
          <div className="flex flex-wrap gap-2">
            {mindsets.map(m => (
              <LensChip key={m} label={m} active={session.buyingMindset === m} onClick={() => updateSession({ buyingMindset: m })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">What do you want them to feel or do? <span className="normal-case tracking-normal">(optional)</span></p>
          <input
            type="text"
            value={session.desiredAudienceResponse}
            onChange={e => updateSession({ desiredAudienceResponse: e.target.value })}
            placeholder="e.g. Trust us enough to book a call"
            className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
