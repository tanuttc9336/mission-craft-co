import { useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { trackEvent } from '@/utils/analytics';
import { useProjectData, getProjectHealth } from '@/hooks/usePortalData';
import StatusBadge from '@/components/portal/StatusBadge';
import RevisionCounter from '@/components/portal/RevisionCounter';
import { Clock, Eye, FolderOpen, FileText, ArrowRight, Package } from 'lucide-react';

const fade = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { user } = usePortalAuth();
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const { project, nextSteps, deliverables, reviews, timeline, loading } = useProjectData(activeProjectId);

  useEffect(() => { trackEvent('portal_view_dashboard'); }, []);

  if (loading) return <div className="text-muted-foreground text-sm animate-pulse">Loading…</div>;
  if (!project) return <p className="text-muted-foreground text-sm">No active project.</p>;

  const health = getProjectHealth(project);
  const waitingOnClient = nextSteps.filter(s => s.owner === 'client' && s.status !== 'completed');
  const nextMilestone = timeline.find(s => s.status !== 'completed');
  const pendingReviews = reviews.filter(r => r.status !== 'approved');

  return (
    <div className="space-y-8">
      <motion.div {...fade}>
        <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">Welcome back</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">{user?.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.title} — {project.category}</p>
      </motion.div>

      <motion.div {...fade} transition={{ delay: 0.05 }} className="flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span className="text-xs text-muted-foreground">Phase: {project.current_phase}</span>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div {...fade} transition={{ delay: 0.1 }} className="border border-border bg-card p-6 space-y-3">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">What's happening now</h3>
          <p className="text-sm font-medium">{project.current_phase} phase is active.</p>
          {project.recent_activity.slice(0, 2).map((a, i) => (
            <p key={i} className="text-xs text-muted-foreground">{a}</p>
          ))}
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.15 }} className="border border-border bg-card p-6 space-y-3">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Waiting on you</h3>
          {waitingOnClient.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing needed right now.</p>
          ) : (
            waitingOnClient.map(s => (
              <div key={s.id} className="flex items-start justify-between gap-2">
                <p className="text-sm">{s.title}</p>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{s.due_date}</span>
              </div>
            ))
          )}
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.2 }} className="border border-border bg-card p-6 space-y-3">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Next milestone</h3>
          {nextMilestone ? (
            <>
              <p className="text-sm font-medium">{nextMilestone.name}</p>
              <p className="text-xs text-muted-foreground">Target: {nextMilestone.target_date}</p>
              {nextMilestone.blocker && <p className="text-xs text-destructive">Blocker: {nextMilestone.blocker}</p>}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">All milestones complete.</p>
          )}
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.25 }} className="border border-border bg-card p-6">
          <RevisionCounter included={project.revision_included} used={project.revision_used} />
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.3 }} className="border border-border bg-card p-6 space-y-3">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Deliverables</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold font-display">{deliverables.filter(d => d.status === 'delivered').length}</span>
            <span className="text-xs text-muted-foreground">of {deliverables.length} delivered</span>
          </div>
          <div className="flex gap-1">
            {deliverables.map(d => (
              <div key={d.id} className={`h-1.5 flex-1 ${d.status === 'delivered' ? 'bg-primary' : d.status === 'in-review' || d.status === 'awaiting-approval' ? 'bg-highlight' : 'bg-muted'}`} />
            ))}
          </div>
        </motion.div>

        <motion.div {...fade} transition={{ delay: 0.35 }} className="border border-border bg-card p-6 space-y-3">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Latest review</h3>
          {pendingReviews.length > 0 ? (
            <>
              <p className="text-sm font-medium">{pendingReviews[0].title}</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={pendingReviews[0].status} />
                <span className="text-xs text-muted-foreground">Due: {pendingReviews[0].due_date}</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No pending reviews.</p>
          )}
        </motion.div>
      </div>

      <motion.div {...fade} transition={{ delay: 0.4 }}>
        <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/portal/reviews', label: 'Review latest work', icon: Eye },
            { to: '/portal/timeline', label: 'View timeline', icon: Clock },
            { to: '/portal/files', label: 'Open files', icon: FolderOpen },
            { to: '/portal/brief', label: 'Check brief', icon: FileText },
            { to: '/portal/deliverables', label: 'Deliverables', icon: Package },
            { to: '/portal/next-steps', label: 'Next steps', icon: ArrowRight },
          ].map(a => (
            <Link key={a.to} to={a.to} className="flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wide uppercase hover:bg-secondary transition-colors">
              <a.icon className="h-3 w-3" />
              {a.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
