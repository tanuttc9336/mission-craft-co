import { cn } from '@/lib/utils';

interface RevisionCounterProps {
  included: number;
  used: number;
  className?: string;
}

export default function RevisionCounter({ included, used, className }: RevisionCounterProps) {
  const remaining = included - used;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground tracking-wide uppercase">Revision Rounds</span>
        <span className="font-medium">{remaining} remaining</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: included }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 transition-colors",
              i < used ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>
      {remaining === 0 && (
        <p className="text-[10px] text-muted-foreground">
          All included rounds used. Additional revisions may require a change order.
        </p>
      )}
    </div>
  );
}
