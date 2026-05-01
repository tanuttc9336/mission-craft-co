import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { trackEvent } from '@/utils/analytics';
import type { User } from '@supabase/supabase-js';

export interface PortalUser {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  projectIds: string[];
}

interface PortalAuthContextValue {
  user: PortalUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const PortalAuthContext = createContext<PortalAuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

async function buildPortalUser(authUser: User): Promise<PortalUser | null> {
  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, company, email, phone')
    .eq('id', authUser.id)
    .single();

  // Fetch role
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', authUser.id);

  const role = roles?.find(r => r.role === 'admin') ? 'admin' : 'client';

  // Fetch project links
  const { data: links } = await supabase
    .from('user_projects')
    .select('project_id')
    .eq('user_id', authUser.id);

  // If admin, get all projects
  let projectIds: string[] = [];
  if (role === 'admin') {
    const { data: allProjects } = await supabase.from('projects').select('id');
    projectIds = allProjects?.map(p => p.id) ?? [];
  } else {
    projectIds = links?.map(l => l.project_id) ?? [];
  }

  return {
    id: authUser.id,
    name: profile?.name ?? '',
    company: profile?.company ?? '',
    email: profile?.email ?? authUser.email ?? '',
    phone: profile?.phone ?? '',
    role,
    projectIds,
  };
}

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let initialised = false;

    // 1. Use getSession for the initial load (avoids race with onAuthStateChange)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const portalUser = await buildPortalUser(session.user);
        setUser(portalUser);
      }
      setIsLoading(false);
      initialised = true;
    });

    // 2. Listen for subsequent auth changes (sign-in, sign-out, token refresh)
    //    Skip the INITIAL_SESSION event to avoid double-calling buildPortalUser
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'INITIAL_SESSION') return; // handled by getSession above
        if (session?.user) {
          const portalUser = await buildPortalUser(session.user);
          setUser(portalUser);
        } else {
          setUser(null);
        }
        if (!initialised) setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    trackEvent('portal_login');
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    trackEvent('portal_logout');
  };

  return (
    <PortalAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}
