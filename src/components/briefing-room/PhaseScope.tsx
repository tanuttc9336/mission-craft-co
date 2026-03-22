import { useBrief } from '@/hooks/useBrief';
import { bundles, constraintOptions } from '@/data/builder';
import { BundleId, Timeline, Constraint } from '@/types/brief';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import FitRiskIndicator from '@/components/FitRiskIndicator';

const timelineOptions: { id: Timeline; label: string }[] = [
  { id: 'asap', label: 'ASAP' },
  { id: '2-4-weeks', label: '2–4 Weeks' },
  { id: 'flexible', label: 'Flexible' },
];

export default function PhaseScope() {
  const { brief, updateBrief } = useBrief();

  const toggleConstraint = (id: Constraint) => {
    const next = brief.constraints.includes(id)
      ? brief.constraints.filter(c => c !== id)
      : [...brief.constraints, id];
    updateBrief({ constraints: next });
  };

  return (
    <div className="space-y-10">
      {/* Packages */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-2">Choose Your Package.</h2>
        <p className="text-muted-foreground text-sm mb-6">Pick a package or go custom.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map(b => {
            const active = brief.deliverablesBundle === b.id;
            const isPopular = b.id === 'signature';
            return (
              <motion.button
                key={b.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateBrief({ deliverablesBundle: b.id as BundleId })}
                className={`text-left p-6 border transition-all duration-200 relative ${
                  active ? 'border-foreground bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground'
                }`}
              >
                {isPopular && (
                  <span className={`absolute -top-3 right-4 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 ${
                    active ? 'bg-primary-foreground text-primary' : 'bg-foreground text-background'
                  }`}>
                    <Star size={10} className="inline mr-1 -mt-0.5" />Most Popular
                  </span>
                )}
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium">{b.label}</span>
                  {active && <Check size={16} className="opacity-70 mt-0.5" />}
                </div>
                {/* Price hint */}
                <p className={`text-xs font-medium mb-2 ${active ? 'opacity-80' : 'text-foreground'}`}>
                  {b.priceHint}
                </p>
                <p className={`text-xs mb-3 italic ${active ? 'opacity-60' : 'text-muted-foreground'}`}>{b.tagline}</p>
                {b.deliverables.length > 0 && (
                  <ul className="space-y-1.5 mb-3">
                    {b.deliverables.map((d, i) => (
                      <li key={i} className={`text-xs flex items-start gap-2 ${active ? 'opacity-80' : 'text-foreground/80'}`}>
                        <span className="text-highlight mt-0.5">—</span> {d}
                      </li>
                    ))}
                  </ul>
                )}
                <p className={`text-xs ${active ? 'opacity-50' : 'text-muted-foreground'}`}>{b.note}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 p-4 border border-border">
          <p className="text-xs text-muted-foreground">2 revision rounds are included in all packages. Directional changes beyond revisions = Change Order.</p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Timeline + Constraints side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timeline */}
        <section>
          <h2 className="font-display text-xl md:text-2xl mb-2">Timeline</h2>
          <p className="text-muted-foreground text-sm mb-4">When do you need this?</p>

          <div className="grid grid-cols-1 gap-2">
            {timelineOptions.map(t => (
              <button
                key={t.id}
                onClick={() => updateBrief({ timeline: t.id })}
                className={`p-3 border text-sm font-medium transition-all text-left ${
                  brief.timeline === t.id
                    ? 'border-foreground bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Constraints / Heads Up */}
        <section>
          <h2 className="font-display text-xl md:text-2xl mb-2">Heads Up</h2>
          <p className="text-muted-foreground text-sm mb-4">Anything we should know?</p>

          <div className="space-y-2">
            {constraintOptions.map(c => {
              const active = brief.constraints.includes(c.id as Constraint);
              return (
                <motion.button
                  key={c.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleConstraint(c.id as Constraint)}
                  className={`w-full text-left px-4 py-3 border text-sm transition-all flex items-center gap-3 ${
                    active ? 'border-foreground bg-primary text-primary-foreground' : 'border-border bg-background hover:border-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                    active ? 'bg-primary-foreground border-primary-foreground' : 'border-muted-foreground'
                  }`}>
                    {active && <span className="text-xs text-primary">✓</span>}
                  </div>
                  {c.label}
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Fit/Risk Indicator */}
      <FitRiskIndicator level={brief.riskLevel} />

      {/* Terms */}
      <div className="p-5 border border-foreground space-y-2">
        <p className="text-[10px] font-bold tracking-wider uppercase text-foreground">Undercat OS Terms</p>
        <p className="text-xs text-muted-foreground">Go/No-Go: scope confirmed + contract + 50% deposit</p>
        <p className="text-xs text-muted-foreground">2 revisions included, directional change = change order</p>
        <p className="text-xs text-muted-foreground">No final files before final payment</p>
      </div>
    </div>
  );
}
