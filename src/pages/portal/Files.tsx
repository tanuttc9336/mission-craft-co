import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackEvent } from '@/utils/analytics';
import { mockProjects } from '@/data/portal-mock-data';
import type { Project, FileCategory } from '@/types/portal';
import { ExternalLink, FileText, Film, Image, File } from 'lucide-react';

const typeIcons: Record<FileCategory, typeof FileText> = {
  document: FileText,
  reference: Image,
  review: Film,
  final: File,
};

const sections: { key: FileCategory; label: string }[] = [
  { key: 'review', label: 'Review Files' },
  { key: 'final', label: 'Final Files' },
  { key: 'reference', label: 'References' },
  { key: 'document', label: 'Documents' },
];

export default function Files() {
  const { activeProjectId } = useOutletContext<{ activeProjectId: string }>();
  const project = mockProjects.find(p => p.id === activeProjectId) as Project | undefined;

  useEffect(() => { trackEvent('portal_open_file'); }, []);

  if (!project) return null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Files</h1>
        <p className="text-sm text-muted-foreground">{project.title}</p>
      </motion.div>

      {sections.map(section => {
        const files = project.files.filter(f => f.type === section.key);
        if (files.length === 0) return null;
        const Icon = typeIcons[section.key];

        return (
          <motion.div key={section.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-3">{section.label}</h2>
            <div className="space-y-2">
              {files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-4 border border-border bg-card">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.title}</p>
                      <p className="text-[10px] text-muted-foreground">{file.version} · {file.updatedAt} · {file.status}</p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 p-2 border border-border hover:bg-secondary transition-colors shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
