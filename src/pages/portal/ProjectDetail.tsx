import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjectData, getProjectHealth } from '@/hooks/usePortalData';
import StatusBadge from '@/components/portal/StatusBadge';
import RevisionCounter from '@/components/portal/RevisionCounter';
import { Link } from 'react-router-dom';
import { Clock, Package, Eye, FolderOpen, FileText, ArrowRight } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { project, loading } = useProjectData(id);

  if (loading) return <div className="text-muted-foreground text-sm animate-pulse p-6">Loading…</div>;
  if (!project) return <p className="text-muted-foreground p-6">Project not found.</p>;

  const health = getProjectHealth(project);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[10px] text-muted-foreground tracking-wider uppercase mb-1">{project.category}</p>
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">{project.title}</h1>
        <p className="text-sm text-muted-foreground max-w-xl">{project.objective}</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span className="text-xs text-muted-foreground">Phase: {project.current_phase}</span>
        <span className="text-xs text-muted-foreground">Lead: {project.lead_contact}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Start', value: project.start_date },
          { label: 'Target', value: project.target_date },
          { label: 'Bundle', value: project.scope_bundle },
          { label: 'Audience', value: project.audience },
        ].map(item => (
          <div key={item.label} className="border border-border bg-card p-4">
            <p className="text-[10px] text-muted-foreground tracking-wider uppercase">{item.label}</p>
            <p className="text-sm font-medium mt-1 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      <RevisionCounter included={project.revision_included} used={project.revision_used} />

      <div className="border border-border bg-card p-5 space-y-2">
        <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase">Recent Activity</h3>
        {project.recent_activity.map((a, i) => <p key={i} className="text-xs text-muted-foreground">{a}</p>)}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { to: '/portal/timeline', label: 'Timeline', icon: Clock },
          { to: '/portal/deliverables', label: 'Deliverables', icon: Package },
          { to: '/portal/reviews', label: 'Reviews', icon: Eye },
          { to: '/portal/files', label: 'Files', icon: FolderOpen },
          { to: '/portal/brief', label: 'Brief', icon: FileText },
          { to: '/portal/next-steps', label: 'Next Steps', icon: ArrowRight },
        ].map(a => (
          <Link key={a.to} to={a.to} className="flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wide uppercase hover:bg-secondary transition-colors">
            <a.icon className="h-3 w-3" />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
