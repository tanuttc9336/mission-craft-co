import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PortalProject {
  id: string;
  title: string;
  category: string;
  objective: string;
  current_phase: string;
  status: string;
  start_date: string | null;
  target_date: string | null;
  scope_bundle: string;
  audience: string;
  channels: string[];
  style_direction: string;
  lead_contact: string;
  recent_activity: string[];
  revision_included: number;
  revision_used: number;
}

export interface PortalTimelinePhase {
  id: string;
  project_id: string;
  name: string;
  status: string;
  owner: string;
  target_date: string | null;
  notes: string;
  blocker: string | null;
  sort_order: number;
}

export interface PortalDeliverable {
  id: string;
  project_id: string;
  name: string;
  quantity: number;
  status: string;
  notes: string;
}

export interface PortalReview {
  id: string;
  project_id: string;
  title: string;
  version: number;
  approval_type: string;
  due_date: string | null;
  status: string;
  review_link: string;
  feedback_submitted: boolean;
}

export interface PortalFile {
  id: string;
  project_id: string;
  title: string;
  type: string;
  version: string;
  file_updated_at: string;
  status: string;
  url: string;
}

export interface PortalBrief {
  id: string;
  project_id: string;
  objective: string;
  audience: string;
  deliverables: string[];
  channels: string[];
  style_direction: string;
  constraints: string[];
  package: string;
  revision_terms: string;
}

export interface PortalNextStep {
  id: string;
  project_id: string;
  title: string;
  owner: string;
  due_date: string | null;
  status: string;
  notes: string;
}

export function useProjects(projectIds: string[]) {
  const [projects, setProjects] = useState<PortalProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectIds.length === 0) { setLoading(false); return; }
    
    supabase
      .from('projects')
      .select('*')
      .in('id', projectIds)
      .then(({ data }) => {
        setProjects((data as PortalProject[]) ?? []);
        setLoading(false);
      });
  }, [projectIds.join(',')]);

  return { projects, loading };
}

export function useProjectData(projectId: string | undefined) {
  const [project, setProject] = useState<PortalProject | null>(null);
  const [timeline, setTimeline] = useState<PortalTimelinePhase[]>([]);
  const [deliverables, setDeliverables] = useState<PortalDeliverable[]>([]);
  const [reviews, setReviews] = useState<PortalReview[]>([]);
  const [files, setFiles] = useState<PortalFile[]>([]);
  const [brief, setBrief] = useState<PortalBrief | null>(null);
  const [nextSteps, setNextSteps] = useState<PortalNextStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      const [projRes, tlRes, delRes, revRes, fileRes, briefRes, nsRes] = await Promise.all([
        supabase.from('projects').select('*').eq('id', projectId).single(),
        supabase.from('timeline_phases').select('*').eq('project_id', projectId).order('sort_order'),
        supabase.from('deliverables').select('*').eq('project_id', projectId),
        supabase.from('reviews').select('*').eq('project_id', projectId),
        supabase.from('files').select('*').eq('project_id', projectId),
        supabase.from('briefs').select('*').eq('project_id', projectId).maybeSingle(),
        supabase.from('next_steps').select('*').eq('project_id', projectId),
      ]);

      setProject((projRes.data as PortalProject) ?? null);
      setTimeline((tlRes.data as PortalTimelinePhase[]) ?? []);
      setDeliverables((delRes.data as PortalDeliverable[]) ?? []);
      setReviews((revRes.data as PortalReview[]) ?? []);
      setFiles((fileRes.data as PortalFile[]) ?? []);
      setBrief((briefRes.data as PortalBrief) ?? null);
      setNextSteps((nsRes.data as PortalNextStep[]) ?? []);
      setLoading(false);
    };

    load();
  }, [projectId]);

  return { project, timeline, deliverables, reviews, files, brief, nextSteps, loading };
}

export function getProjectHealth(project: PortalProject) {
  if (project.status === 'delivered') return { label: 'Delivered', color: 'bg-primary text-primary-foreground', description: 'All assets complete and delivered.' };
  if (project.status === 'waiting-approval') return { label: 'Waiting on Approval', color: 'bg-highlight text-foreground', description: 'Client decision or feedback needed to continue.' };
  if (project.status === 'at-risk') return { label: 'At Risk', color: 'bg-destructive text-destructive-foreground', description: 'Blockers or timing pressure may affect delivery.' };
  if (project.status === 'scope-review') return { label: 'Scope Review', color: 'bg-muted text-muted-foreground', description: 'Feedback may affect scope. Reviewing before proceeding.' };
  if (project.status === 'in-progress') return { label: 'In Progress', color: 'bg-secondary text-secondary-foreground', description: 'Active work underway.' };
  return { label: 'On Track', color: 'bg-primary text-primary-foreground', description: 'Moving forward with no blockers.' };
}
