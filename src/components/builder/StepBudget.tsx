import { useBrief } from '@/hooks/useBrief';
import { constraintOptions } from '@/data/builder';
import { BudgetRange, Timeline, Constraint } from '@/types/brief';
import { motion } from 'framer-motion';
import FitRiskIndicator from '@/components/FitRiskIndicator';

const budgetOptions: { id: BudgetRange; label: string }[] = [
  { id: '<100k', label: 'Under 100k' },
  { id: '100-250k', label: '100–250k' },
  { id: '250-500k', label: '250–500k' },
  { id: '500k+', label: '500k+' },
];

const timelineOptions: { id: Timeline; label: string }[] = [
  { id: 'asap', label: 'ASAP' },
  { id: '2-4-weeks', label: '2–4 weeks' },
  { id: '1-2-months', label: '1–2 months' },
  { id: '3+-months', label: '3+ months' },
];

export default function StepBudget() {
  const { brief, updateBrief } = useBrief();

  const toggleConstraint = (id: Constraint) => {
    const next = brief.constraints.includes(id)
      ? brief.constraints.filter(c => c !== id)
      : [...brief.constraints, id];
    updateBrief({ constraints: next });
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">Budget, Timeline & Constraints.</h2>
      <p className="text-muted-foreground text-sm mb-8">Helps us scope accurately.</p>

      <div className="space-y-8 max-w-lg">
        <div>
          <label className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground block mb-3">Budget Range</label>
          <div className="grid grid-cols-2 gap-2">
            {budgetOptions.map(b => (
              <button
                key={b.id}
                onClick={() => updateBrief({ budgetRange: b.id })}
                className={`p-3 border text-sm font-medium transition-all ${
                  brief.budgetRange === b.id
                    ? 'border-foreground bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-foreground'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground block mb-3">Timeline</label>
          <div className="grid grid-cols-2 gap-2">
            {timelineOptions.map(t => (
              <button
                key={t.id}
                onClick={() => updateBrief({ timeline: t.id })}
                className={`p-3 border text-sm font-medium transition-all ${
                  brief.timeline === t.id
                    ? 'border-foreground bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:border-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground block mb-3">Constraints</label>
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
                  <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${
                    active ? 'bg-primary-foreground border-primary-foreground' : 'border-muted-foreground'
                  }`}>
                    {active && <span className="text-xs text-primary">✓</span>}
                  </div>
                  {c.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <FitRiskIndicator level={brief.riskLevel} />

        <div className="p-5 border border-foreground space-y-2">
          <p className="text-[10px] font-bold tracking-wider uppercase text-foreground">Undercat OS Terms</p>
          <p className="text-xs text-muted-foreground">• Go/No-Go: scope confirmed + contract + 50% deposit</p>
          <p className="text-xs text-muted-foreground">• 2 revisions included, directional change = change order</p>
          <p className="text-xs text-muted-foreground">• No final files before final payment</p>
        </div>
      </div>
    </div>
  );
}
