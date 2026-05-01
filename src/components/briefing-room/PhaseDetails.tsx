import { useBrief } from '@/hooks/useBrief';
import { constraintOptions } from '@/data/builder';
import { BudgetRange, Timeline, Constraint } from '@/types/brief';
import { motion } from 'framer-motion';

const timelineOptions: { id: Timeline; label: string; desc: string }[] = [
  { id: 'asap', label: 'ASAP', desc: 'Within 2 weeks' },
  { id: '2-4-weeks', label: '2–4 Weeks', desc: 'Standard timeline' },
  { id: 'flexible', label: 'Flexible', desc: 'No rush' },
];

const budgetOptions: { id: BudgetRange; label: string }[] = [
  { id: '<100k', label: 'Under ฿100k' },
  { id: '100-250k', label: '฿100–250k' },
  { id: '250-500k', label: '฿250–500k' },
  { id: '500k+', label: '฿500k+' },
  { id: 'not-defined', label: 'Not yet defined' },
];

export default function PhaseDetails() {
  const { brief, updateBrief } = useBrief();

  const toggleConstraint = (id: Constraint) => {
    const next = brief.constraints.includes(id)
      ? brief.constraints.filter(c => c !== id)
      : [...brief.constraints, id];
    updateBrief({ constraints: next });
  };

  return (
    <div className="space-y-10">
      {/* Timeline */}
      <section>
        <h2 className="font-display text-2xl md:text-3xl mb-1">Timeline</h2>
        <p className="text-muted-foreground text-sm mb-4">
          When do you need the final deliverables?
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-lg">
          {timelineOptions.map(t => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => updateBrief({ timeline: t.id })}
              className={`p-4 border text-center transition-all duration-200 ${
                brief.timeline === t.id
                  ? 'border-foreground bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground'
              }`}
            >
              <span className="text-sm font-medium block">{t.label}</span>
              <span className={`text-[10px] ${brief.timeline === t.id ? 'opacity-60' : 'text-muted-foreground'}`}>
                {t.desc}
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Budget Range — optional */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Budget Range</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Optional — helps us recommend the right scope. All prices in THB.
        </p>

        <div className="flex flex-wrap gap-2 max-w-lg">
          {budgetOptions.map(b => (
            <button
              key={b.id}
              onClick={() => updateBrief({ budgetRange: brief.budgetRange === b.id ? null : b.id })}
              className={`px-4 py-2.5 border text-sm font-medium transition-all ${
                brief.budgetRange === b.id
                  ? 'border-foreground bg-primary text-primary-foreground'
                  : 'border-border bg-background hover:border-foreground'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Constraints */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Anything We Should Know?</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Flags that affect timeline, budget, or production complexity.
        </p>

        <div className="space-y-2 max-w-lg">
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

      <div className="h-px bg-border" />

      {/* Additional Context — free-text */}
      <section>
        <h2 className="font-display text-xl md:text-2xl mb-1">Additional Context</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Anything else that will help us scope this right.
        </p>

        <textarea
          value={brief.additionalContext}
          onChange={e => updateBrief({ additionalContext: e.target.value })}
          maxLength={500}
          rows={4}
          placeholder="e.g. We have brand guidelines ready. HQ needs to approve all creative. We'd like to shoot at our showroom in Bangkok."
          className="w-full max-w-lg bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-shadow resize-none"
        />
        <span className="text-[10px] text-muted-foreground mt-1 block">
          {brief.additionalContext.length}/500
        </span>
      </section>
    </div>
  );
}
