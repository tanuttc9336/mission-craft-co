import { RiskLevel } from '@/types/brief';

const config: Record<RiskLevel, { label: string; color: string; bg: string; message: string }> = {
  green: {
    label: 'Good Fit',
    color: 'hsl(145 60% 40%)',
    bg: 'hsl(145 40% 95%)',
    message: 'This scope looks well-aligned. Ready to move forward.',
  },
  yellow: {
    label: 'Some Considerations',
    color: 'hsl(42 80% 45%)',
    bg: 'hsl(42 60% 95%)',
    message: 'A few variables to work through. We recommend a scoping call to align.',
  },
  red: {
    label: 'High Complexity',
    color: 'hsl(0 65% 50%)',
    bg: 'hsl(0 40% 96%)',
    message: 'This combination of constraints is challenging. We suggest starting with a Starter Sprint and booking a call to plan the full scope.',
  },
};

export default function FitRiskIndicator({ level }: { level: RiskLevel }) {
  const c = config[level];
  return (
    <div className="rounded-lg p-5 border" style={{ background: c.bg, borderColor: c.color + '33' }}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
        <span className="font-medium text-sm" style={{ color: c.color }}>{c.label}</span>
      </div>
      <p className="text-sm text-muted-foreground">{c.message}</p>
    </div>
  );
}
