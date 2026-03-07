import { useBrief } from '@/hooks/useBrief';
import { ctaTypes } from '@/data/builder';

export default function StepOffer() {
  const { brief, updateOffer } = useBrief();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">What's the offer?</h2>
      <p className="text-muted-foreground text-sm mb-8">Keep it sharp. The best briefs are the clearest.</p>

      <div className="space-y-5 max-w-lg">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Product / Service Name</label>
          <input
            type="text"
            maxLength={60}
            value={brief.offer.productName}
            onChange={e => updateOffer({ productName: e.target.value })}
            placeholder="e.g., Apex Model X"
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
          />
          <span className="text-xs text-muted-foreground mt-1 block">{brief.offer.productName.length}/60</span>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Key Offer / Value Prop</label>
          <input
            type="text"
            maxLength={120}
            value={brief.offer.keyOffer}
            onChange={e => updateOffer({ keyOffer: e.target.value })}
            placeholder="e.g., The quietest luxury SUV on the market"
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
          />
          <span className="text-xs text-muted-foreground mt-1 block">{brief.offer.keyOffer.length}/120</span>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Proof Points (up to 3)</label>
          {brief.offer.proofPoints.map((pp, i) => (
            <input
              key={i}
              type="text"
              maxLength={80}
              value={pp}
              onChange={e => {
                const next = [...brief.offer.proofPoints];
                next[i] = e.target.value;
                updateOffer({ proofPoints: next });
              }}
              placeholder={`Proof point ${i + 1}`}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow"
            />
          ))}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">CTA Type</label>
          <div className="flex flex-wrap gap-2">
            {ctaTypes.map(cta => (
              <button
                key={cta}
                onClick={() => updateOffer({ ctaType: cta })}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                  brief.offer.ctaType === cta
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-accent/50'
                }`}
              >
                {cta}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
