export type ProjectStatus = 'on-track' | 'waiting-approval' | 'in-progress' | 'at-risk' | 'delivered' | 'scope-review';
export type StageStatus = 'not-started' | 'in-progress' | 'waiting' | 'completed';
export type DeliverableStatus = 'not-started' | 'in-progress' | 'in-review' | 'awaiting-approval' | 'delivered';
export type ApprovalType = 'approve-direction' | 'approve-edit' | 'approve-final' | 'confirm-asset-list' | 'request-revision';
export type ReviewStatus = 'pending' | 'approved' | 'revision-requested' | 'in-review';
export type FileCategory = 'review' | 'final' | 'reference' | 'document';
export type NextStepOwner = 'client' | 'undercat';
export type UserRole = 'client' | 'admin';
export type FeedbackCategory = 'message' | 'pacing' | 'visual' | 'brand-alignment' | 'factual-corrections' | 'cta-clarity' | 'other';

export interface ClientUser {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  role: UserRole;
  projectIds: string[];
}

export interface TimelineStage {
  id: string;
  name: string;
  status: StageStatus;
  owner: string;
  targetDate: string;
  notes: string;
  blocker?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  quantity: number;
  status: DeliverableStatus;
  notes: string;
}

export interface ReviewItem {
  id: string;
  title: string;
  version: number;
  approvalType: ApprovalType;
  dueDate: string;
  status: ReviewStatus;
  reviewLink: string;
  feedbackSubmitted: boolean;
}

export interface ProjectFile {
  id: string;
  title: string;
  type: FileCategory;
  version: string;
  updatedAt: string;
  status: string;
  url: string;
}

export interface NextStep {
  id: string;
  title: string;
  owner: NextStepOwner;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
}

export interface BriefSummary {
  objective: string;
  audience: string;
  deliverables: string[];
  channels: string[];
  styleDirection: string;
  constraints: string[];
  package: string;
  revisionTerms: string;
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  category: string;
  objective: string;
  currentPhase: string;
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  scopeBundle: string;
  audience: string;
  channels: string[];
  styleDirection: string;
  timelineStages: TimelineStage[];
  deliverables: Deliverable[];
  reviewItems: ReviewItem[];
  files: ProjectFile[];
  briefSummary: BriefSummary;
  nextSteps: NextStep[];
  revisionIncluded: number;
  revisionUsed: number;
  leadContact: string;
  recentActivity: string[];
}
