import { cn } from '@/lib/utils';
import type { ProjectStatus, StageStatus, DeliverableStatus, ReviewStatus } from '@/types/portal';

type BadgeStatus = ProjectStatus | StageStatus | DeliverableStatus | ReviewStatus | string;

const statusStyles: Record<string, string> = {
  'on-track': 'bg-primary text-primary-foreground',
  'waiting-approval': 'bg-highlight text-foreground',
  'in-progress': 'bg-secondary text-secondary-foreground',
  'at-risk': 'bg-destructive text-destructive-foreground',
  'delivered': 'bg-primary text-primary-foreground',
  'scope-review': 'bg-muted text-muted-foreground',
  'not-started': 'bg-muted text-muted-foreground',
  'waiting': 'bg-highlight text-foreground',
  'completed': 'bg-primary text-primary-foreground',
  'in-review': 'bg-highlight text-foreground',
  'awaiting-approval': 'bg-highlight text-foreground',
  'pending': 'bg-secondary text-secondary-foreground',
  'approved': 'bg-primary text-primary-foreground',
  'revision-requested': 'bg-destructive text-destructive-foreground',
};

const statusLabels: Record<string, string> = {
  'on-track': 'On Track',
  'waiting-approval': 'Waiting on Approval',
  'in-progress': 'In Progress',
  'at-risk': 'At Risk',
  'delivered': 'Delivered',
  'scope-review': 'Scope Review',
  'not-started': 'Not Started',
  'waiting': 'Waiting',
  'completed': 'Completed',
  'in-review': 'In Review',
  'awaiting-approval': 'Awaiting Approval',
  'pending': 'Pending',
  'approved': 'Approved',
  'revision-requested': 'Revision Requested',
};

export default function StatusBadge({ status, className }: { status: BadgeStatus; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
      statusStyles[status] || 'bg-muted text-muted-foreground',
      className
    )}>
      {statusLabels[status] || status}
    </span>
  );
}
