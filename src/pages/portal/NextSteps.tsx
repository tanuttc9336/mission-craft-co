import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import StatusBadge from '@/components/portal/StatusBadge';
import type { Project } from '@/types/portal';

export default function NextSteps() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;

  useEffect(() => { trackEvent('portal_view_next_steps'); }, []);

  if (!project) return null;

  const clientSteps = project.nextSteps.filter(s => s.owner === 'client');
  const undercatSteps = project.nextSteps.filter(s => s.owner === 'undercat');

  const StepList = ({ steps, label }: { steps: typeof project.nextSteps; label: string }) => (
    <div className="space-y-3">
      <h2 className="text-[10px] text-muted-foreground tracking-wider uppercase">{label}</h2>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground p-4 border border-border bg-card">Nothing pending.</p>
      ) : (
        steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 border border-border bg-card flex items-start justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{step.title}</p>
              {step.notes && <p className="text-xs text-muted-foreground mt-1">{step.notes}</p>}
              <p className="text-[10px] text-muted-foreground mt-1">Due: {step.dueDate}</p>
            </div>
            <StatusBadge status={step.status} className="shrink-0" />
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Next Steps</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StepList steps={clientSteps} label="What you need to do" />
        <StepList steps={undercatSteps} label="What Undercat is doing" />
      </div>
    </div>
  );
}
