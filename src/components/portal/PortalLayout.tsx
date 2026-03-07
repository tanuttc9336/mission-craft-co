import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Clock, Package, Eye, FolderOpen,
  FileText, ArrowRight, User, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/data/portal-mock-data';
import logo from '@/assets/undercat-logo.png';

const navItems = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/timeline', label: 'Timeline', icon: Clock },
  { to: '/portal/deliverables', label: 'Deliverables', icon: Package },
  { to: '/portal/reviews', label: 'Reviews', icon: Eye },
  { to: '/portal/files', label: 'Files', icon: FolderOpen },
  { to: '/portal/brief', label: 'Brief', icon: FileText },
  { to: '/portal/next-steps', label: 'Next Steps', icon: ArrowRight },
  { to: '/portal/account', label: 'Account', icon: User },
];

export default function PortalLayout() {
  const { user, isLoading, logout } = usePortalAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false);

  const userProjects = user ? mockProjects.filter(p => user.projectIds.includes(p.id)) : [];

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (userProjects.length > 0 && !activeProjectId) {
      setActiveProjectId(userProjects[0].id);
    }
  }, [userProjects, activeProjectId]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm tracking-widest uppercase animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!user) return null;

  const activeProject = mockProjects.find(p => p.id === activeProjectId);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card fixed inset-y-0 left-0 z-40">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Undercat" className="h-6 w-auto invert dark:invert-0" />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase">Undercat</span>
          </Link>

          {/* Project Switcher */}
          {userProjects.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setProjectSwitcherOpen(!projectSwitcherOpen)}
                className="w-full flex items-center justify-between text-left p-2 -mx-2 rounded hover:bg-secondary transition-colors text-xs"
              >
                <span className="truncate font-medium">{activeProject?.title}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", projectSwitcherOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {projectSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border shadow-elevated z-10"
                  >
                    {userProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { setActiveProjectId(p.id); setProjectSwitcherOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors",
                          p.id === activeProjectId && "bg-secondary font-medium"
                        )}
                      >
                        {p.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {userProjects.length === 1 && (
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase truncate">{activeProject?.title}</p>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide uppercase transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-[10px] text-muted-foreground mb-2 truncate">{user.name}</div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Undercat" className="h-5 w-auto invert dark:invert-0" />
            <span className="font-display text-[10px] font-bold tracking-wider uppercase">Portal</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-border bg-background"
            >
              <div className="px-4 py-4 space-y-1">
                {userProjects.length > 1 && (
                  <div className="mb-3 pb-3 border-b border-border space-y-1">
                    {userProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-xs",
                          p.id === activeProjectId ? "bg-secondary font-medium" : "text-muted-foreground"
                        )}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
                {navItems.map(item => {
                  const isActive = item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide uppercase",
                        isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground uppercase tracking-wide mt-3"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-10 max-w-5xl mx-auto">
          <Outlet context={{ activeProjectId, activeProject, userProjects }} />
        </div>
      </main>
    </div>
  );
}
