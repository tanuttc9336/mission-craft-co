import { useLens } from '@/hooks/useLens';
import LensChip from './LensChip';
import type { LensIndustry, LensOfferType, LensBrandStage } from '@/types/lens';

const industries: LensIndustry[] = ['Automotive', 'Golf / Lifestyle', 'Restaurant / F&B', 'Events / Concerts', 'Hospitality', 'Beauty / Wellness', 'Fashion / Retail', 'Property / Real Estate', 'Other'];
const offerTypes: LensOfferType[] = ['Product', 'Service', 'Experience', 'Venue', 'Campaign / Launch', 'Personal Brand'];
const brandStages: LensBrandStage[] = ['New / Launching', 'Growing', 'Established', 'Repositioning'];

export default function StepWorld() {
  const { session, updateSession } = useLens();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Pick Your World</h2>
      <p className="text-muted-foreground text-sm mb-10">Just enough context for us to read the landscape.</p>

      <div className="space-y-10">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Industry</p>
          <div className="flex flex-wrap gap-2">
            {industries.map(i => (
              <LensChip key={i} label={i} active={session.industry === i} onClick={() => updateSession({ industry: i })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Offer Type</p>
          <div className="flex flex-wrap gap-2">
            {offerTypes.map(o => (
              <LensChip key={o} label={o} active={session.offerType === o} onClick={() => updateSession({ offerType: o })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Brand Stage</p>
          <div className="flex flex-wrap gap-2">
            {brandStages.map(b => (
              <LensChip key={b} label={b} active={session.brandStage === b} onClick={() => updateSession({ brandStage: b })} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
