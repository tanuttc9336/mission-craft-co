
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.project_status AS ENUM ('on-track', 'waiting-approval', 'in-progress', 'at-risk', 'delivered', 'scope-review');
CREATE TYPE public.stage_status AS ENUM ('not-started', 'in-progress', 'waiting', 'completed');
CREATE TYPE public.deliverable_status AS ENUM ('not-started', 'in-progress', 'in-review', 'awaiting-approval', 'delivered');
CREATE TYPE public.approval_type AS ENUM ('approve-direction', 'approve-edit', 'approve-final', 'confirm-asset-list', 'request-revision');
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'revision-requested', 'in-review');
CREATE TYPE public.file_category AS ENUM ('review', 'final', 'reference', 'document');
CREATE TYPE public.next_step_owner AS ENUM ('client', 'undercat');
CREATE TYPE public.next_step_status AS ENUM ('pending', 'in-progress', 'completed');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  objective TEXT NOT NULL DEFAULT '',
  current_phase TEXT NOT NULL DEFAULT '',
  status project_status NOT NULL DEFAULT 'in-progress',
  start_date DATE,
  target_date DATE,
  scope_bundle TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  channels TEXT[] NOT NULL DEFAULT '{}',
  style_direction TEXT NOT NULL DEFAULT '',
  lead_contact TEXT NOT NULL DEFAULT '',
  recent_activity TEXT[] NOT NULL DEFAULT '{}',
  revision_included INT NOT NULL DEFAULT 2,
  revision_used INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- USER_PROJECTS
CREATE TABLE public.user_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  UNIQUE(user_id, project_id)
);
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- TIMELINE PHASES
CREATE TABLE public.timeline_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status stage_status NOT NULL DEFAULT 'not-started',
  owner TEXT NOT NULL DEFAULT '',
  target_date DATE,
  notes TEXT NOT NULL DEFAULT '',
  blocker TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_phases ENABLE ROW LEVEL SECURITY;

-- DELIVERABLES
CREATE TABLE public.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  status deliverable_status NOT NULL DEFAULT 'not-started',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  approval_type approval_type NOT NULL DEFAULT 'approve-direction',
  due_date DATE,
  status review_status NOT NULL DEFAULT 'pending',
  review_link TEXT NOT NULL DEFAULT '#',
  feedback_submitted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- FILES
CREATE TABLE public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type file_category NOT NULL DEFAULT 'document',
  version TEXT NOT NULL DEFAULT 'v1',
  file_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '#',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- BRIEFS
CREATE TABLE public.briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
  objective TEXT NOT NULL DEFAULT '',
  audience TEXT NOT NULL DEFAULT '',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  channels TEXT[] NOT NULL DEFAULT '{}',
  style_direction TEXT NOT NULL DEFAULT '',
  constraints TEXT[] NOT NULL DEFAULT '{}',
  package TEXT NOT NULL DEFAULT '',
  revision_terms TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- NEXT STEPS
CREATE TABLE public.next_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  owner next_step_owner NOT NULL DEFAULT 'undercat',
  due_date DATE,
  status next_step_status NOT NULL DEFAULT 'pending',
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.next_steps ENABLE ROW LEVEL SECURITY;

-- CONTACT SUBMISSIONS
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  project_location TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  consent BOOLEAN NOT NULL DEFAULT false,
  brief_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER FUNCTIONS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.user_has_project_access(_user_id UUID, _project_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_projects WHERE user_id = _user_id AND project_id = _project_id
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin'
  )
$$;

-- RLS POLICIES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read linked projects" ON public.projects FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), id));
CREATE POLICY "Users can read own project links" ON public.user_projects FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can read project timeline" ON public.timeline_phases FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Users can read project deliverables" ON public.deliverables FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Users can read project reviews" ON public.reviews FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Users can read project files" ON public.files FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Users can read project briefs" ON public.briefs FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Users can read project next steps" ON public.next_steps FOR SELECT TO authenticated USING (public.user_has_project_access(auth.uid(), project_id));
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can read submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TRIGGERS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, COALESCE(NEW.email, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- INDEXES
CREATE INDEX idx_user_projects_user ON public.user_projects(user_id);
CREATE INDEX idx_user_projects_project ON public.user_projects(project_id);
CREATE INDEX idx_timeline_phases_project ON public.timeline_phases(project_id);
CREATE INDEX idx_deliverables_project ON public.deliverables(project_id);
CREATE INDEX idx_reviews_project ON public.reviews(project_id);
CREATE INDEX idx_files_project ON public.files(project_id);
CREATE INDEX idx_briefs_project ON public.briefs(project_id);
CREATE INDEX idx_next_steps_project ON public.next_steps(project_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
