import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import StatusBadge from '@/components/portal/StatusBadge';
import RevisionCounter from '@/components/portal/RevisionCounter';
import type { Project, DeliverableStatus } from '@/types/portal';
import { cn } from '@/lib/utils';

const filters: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'in-review', label: 'In Review' },
  { value: 'delivered', label: 'Delivered' },
];

export default function Deliverables() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;
  const [filter, setFilter] = useState('all');

  useEffect(() => { trackEvent('portal_view_deliverables'); }, []);

  if (!project) return null;

  const filtered = filter === 'all'
    ? project.deliverables
    : project.deliverables.filter(d => d.status === filter);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Deliverables</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      {/* Scope summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="border border-border bg-card p-6 space-y-3">
        <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Scope Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Package</p>
            <p className="text-sm font-medium mt-0.5">{project.scopeBundle}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Outputs</p>
            <p className="text-sm font-medium mt-0.5">{project.deliverables.length} items</p>
          </div>
        </div>
        <RevisionCounter included={project.revisionIncluded} used={project.revisionUsed} />
        <p className="text-[10px] text-muted-foreground">
          Directional changes may require a change order before work continues.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 text-[10px] tracking-wider uppercase border transition-colors",
              filter === f.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-4 border border-border bg-card"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium truncate">{d.name}</p>
                <span className="text-[10px] text-muted-foreground">×{d.quantity}</span>
              </div>
              {d.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.notes}</p>}
            </div>
            <StatusBadge status={d.status} className="ml-3 shrink-0" />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">No deliverables match this filter.</p>
        )}
      </div>
    </div>
  );
}
