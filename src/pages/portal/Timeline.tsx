import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import StatusBadge from '@/components/portal/StatusBadge';
import type { Project } from '@/types/portal';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-react';

const stageIcons: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  'in-progress': Clock,
  waiting: AlertCircle,
  'not-started': Circle,
};

export default function Timeline() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;

  useEffect(() => { trackEvent('portal_view_timeline'); }, []);

  if (!project) return null;

  const currentIdx = project.timelineStages.findIndex(s => s.status === 'in-progress' || s.status === 'waiting');

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Timeline</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      <div className="space-y-0">
        {project.timelineStages.map((stage, i) => {
          const Icon = stageIcons[stage.status] || Circle;
          const isCurrent = i === currentIdx;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4"
            >
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center shrink-0 border",
                  isCurrent ? "border-primary bg-primary text-primary-foreground" :
                  stage.status === 'completed' ? "border-primary bg-primary text-primary-foreground" :
                  "border-border bg-card text-muted-foreground"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                {i < project.timelineStages.length - 1 && (
                  <div className={cn(
                    "w-px flex-1 min-h-[40px]",
                    stage.status === 'completed' ? "bg-primary" : "bg-border"
                  )} />
                )}
              </div>

              {/* Content */}
              <div className={cn(
                "pb-8 flex-1",
                isCurrent && "pt-0"
              )}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className={cn(
                      "text-sm font-medium",
                      isCurrent && "font-bold"
                    )}>{stage.name}</h3>
                    <p className="text-[10px] text-muted-foreground tracking-wide mt-0.5">
                      {stage.owner} · {stage.targetDate}
                    </p>
                  </div>
                  <StatusBadge status={stage.status} />
                </div>
                {stage.notes && (
                  <p className="text-xs text-muted-foreground mt-2">{stage.notes}</p>
                )}
                {stage.blocker && (
                  <p className="text-xs text-destructive mt-1">⚠ {stage.blocker}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
