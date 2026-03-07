import { useLens } from '@/hooks/useLens';
import LensChip from './LensChip';
import type { LensGoal, LensTimeline, LensBudgetRange, LensConstraint } from '@/types/lens';

const goals: LensGoal[] = ['Awareness', 'Leads', 'Sales', 'Launch', 'Retention', 'Employer Brand'];
const timelines: LensTimeline[] = ['ASAP', '2–4 weeks', '1–2 months', '3+ months'];
const budgets: LensBudgetRange[] = ['<100k', '100–250k', '250–500k', '500k+'];
const constraints: LensConstraint[] = ['Committee approvals', 'Fixed launch date', 'Need talent / actors', 'Need location', 'Brand guidelines ready', 'Need full production support'];

export default function StepGoals() {
  const { session, updateSession, toggleConstraint } = useLens();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl mb-2">What Are You Aiming For?</h2>
      <p className="text-muted-foreground text-sm mb-10">Enough to guide the recommendation, not lock the scope.</p>

      <div className="space-y-10">
        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Main Goal</p>
          <div className="flex flex-wrap gap-2">
            {goals.map(g => (
              <LensChip key={g} label={g} active={session.mainGoal === g} onClick={() => updateSession({ mainGoal: g })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Timeline</p>
          <div className="flex flex-wrap gap-2">
            {timelines.map(t => (
              <LensChip key={t} label={t} active={session.timeline === t} onClick={() => updateSession({ timeline: t })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Rough Budget Band</p>
          <div className="flex flex-wrap gap-2">
            {budgets.map(b => (
              <LensChip key={b} label={b} active={session.budgetRange === b} onClick={() => updateSession({ budgetRange: b })} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Constraints <span className="normal-case tracking-normal">(optional, multi-select)</span></p>
          <div className="flex flex-wrap gap-2">
            {constraints.map(c => (
              <LensChip key={c} label={c} active={session.constraints.includes(c)} onClick={() => toggleConstraint(c)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
