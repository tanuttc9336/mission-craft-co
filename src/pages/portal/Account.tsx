import { usePortalAuth } from '@/hooks/usePortalAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/usePortalData';
import { LogOut } from 'lucide-react';

export default function Account() {
  const { user, logout } = usePortalAuth();
  const navigate = useNavigate();
  const { projects } = useProjects(user?.projectIds ?? []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold tracking-tight mb-1">Account</h1>
      </motion.div>

      <div className="space-y-4">
        {[
          { label: 'Name', value: user.name },
          { label: 'Company', value: user.company },
          { label: 'Email', value: user.email },
          { label: 'Phone', value: user.phone || '—' },
          { label: 'Role', value: user.role === 'admin' ? 'Admin' : 'Client' },
        ].map((field, i) => (
          <motion.div key={field.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between p-4 border border-border bg-card">
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{field.label}</span>
            <span className="text-sm">{field.value}</span>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-[10px] text-muted-foreground tracking-wider uppercase mb-3">Linked Projects</h2>
        <div className="space-y-2">
          {projects.map(p => (
            <div key={p.id} className="p-4 border border-border bg-card flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                <p className="text-[10px] text-muted-foreground">{p.category}</p>
              </div>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{p.status.replace(/-/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button variant="outline" onClick={() => { logout(); navigate('/login'); }} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
