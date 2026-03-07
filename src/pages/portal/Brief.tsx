import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import type { Project } from '@/types/portal';

export default function Brief() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;

  useEffect(() => { trackEvent('portal_view_brief'); }, []);

  if (!project) return null;

  const b = project.briefSummary;

  const sections = [
    { label: 'Objective', content: b.objective },
    { label: 'Audience', content: b.audience },
    { label: 'Style Direction', content: b.styleDirection },
    { label: 'Package', content: b.package },
    { label: 'Revision Terms', content: b.revisionTerms },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Project Brief</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="border border-border bg-card p-5"
          >
            <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-2">{s.label}</h3>
            <p className="text-sm">{s.content}</p>
          </motion.div>
        ))}

        {/* Deliverables */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="border border-border bg-card p-5">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-2">Deliverables</h3>
          <ul className="space-y-1">
            {b.deliverables.map((d, i) => (
              <li key={i} className="text-sm text-foreground">{d}</li>
            ))}
          </ul>
        </motion.div>

        {/* Channels */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="border border-border bg-card p-5">
          <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-2">Channels</h3>
          <div className="flex flex-wrap gap-2">
            {b.channels.map(c => (
              <span key={c} className="px-2.5 py-1 text-[10px] tracking-wider uppercase border border-border bg-secondary">{c}</span>
            ))}
          </div>
        </motion.div>

        {/* Constraints */}
        {b.constraints.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="border border-border bg-card p-5">
            <h3 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-2">Constraints</h3>
            <ul className="space-y-1">
              {b.constraints.map((c, i) => (
                <li key={i} className="text-sm text-muted-foreground">{c}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Working rules */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="border-t border-border pt-8 space-y-5">
        <h2 className="text-[10px] text-muted-foreground tracking-wider uppercase">Working Terms</h2>
        {[
          { title: 'Go / No-Go', body: 'Project starts after scope is confirmed, contract is signed, and 50% deposit is received.' },
          { title: 'Revisions', body: '2 revision rounds included unless otherwise stated.' },
          { title: 'Change Order', body: 'Directional or structural changes may require a change order before work continues.' },
          { title: 'Final Delivery', body: 'Final files are released after final payment.' },
        ].map((rule, i) => (
          <div key={i} className="bg-card border border-border p-5">
            <h3 className="text-xs font-medium mb-1">{rule.title}</h3>
            <p className="text-xs text-muted-foreground">{rule.body}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
