import { RiskLevel } from '@/types/brief';

const config: Record<RiskLevel, { label: string; border: string; message: string }> = {
  green: {
    label: '● Good Fit',
    border: 'border-foreground',
    message: 'This scope looks well-aligned. Ready to move forward.',
  },
  yellow: {
    label: '● Some Considerations',
    border: 'border-foreground/50',
    message: 'A few variables to work through. We recommend a scoping call to align.',
  },
  red: {
    label: '● High Complexity',
    border: 'border-foreground',
    message: 'This combination of constraints is challenging. We suggest starting with a Starter Sprint and booking a call to plan the full scope.',
  },
};

export default function FitRiskIndicator({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <div className={`p-5 border ${c.border}`}>
      <span className={`text-xs font-bold tracking-wider uppercase ${
        level === 'green' ? 'text-foreground' : level === 'yellow' ? 'text-highlight' : 'text-destructive'
      }`}>
        {c.label}
      </span>
      <p className="text-sm text-muted-foreground mt-2">{c.message}</p>
    </div>
  );
}
