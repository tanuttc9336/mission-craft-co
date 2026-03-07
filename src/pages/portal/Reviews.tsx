import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import StatusBadge from '@/components/portal/StatusBadge';
import RevisionCounter from '@/components/portal/RevisionCounter';
import FeedbackForm from '@/components/portal/FeedbackForm';
import type { Project } from '@/types/portal';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Reviews() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { trackEvent('portal_view_reviews'); }, []);

  if (!project) return null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Reviews</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      <RevisionCounter included={project.revisionIncluded} used={project.revisionUsed} />

      {project.reviewItems.length === 0 ? (
        <div className="border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">No review items yet. They'll appear here when work is ready for your feedback.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {project.reviewItems.map((item, i) => {
            const isOpen = expandedId === item.id;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border border-border bg-card"
              >
                <button
                  onClick={() => setExpandedId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm font-medium">{item.title}</h3>
                      <span className="text-[10px] text-muted-foreground">v{item.version}</span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.approvalType.replace(/-/g, ' ')} · Due: {item.dueDate}
                    </p>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 ml-3 transition-transform", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
                        <a
                          href={item.reviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wide uppercase hover:bg-secondary transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open review file
                        </a>

                        {!item.feedbackSubmitted ? (
                          <FeedbackForm
                            reviewItemId={item.id}
                            onSubmit={(data) => {
                              console.log('Feedback submitted:', { itemId: item.id, ...data });
                            }}
                          />
                        ) : (
                          <div className="p-4 bg-secondary">
                            <p className="text-xs text-muted-foreground">Feedback submitted. We'll review and follow up.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
