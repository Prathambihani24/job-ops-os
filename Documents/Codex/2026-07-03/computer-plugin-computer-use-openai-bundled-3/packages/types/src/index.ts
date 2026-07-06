export type DashboardMetric = {
  label: string;
  value: string;
  description: string;
};

export type DashboardPipelineStage = {
  label: string;
  count: number;
  percentage: number;
};

export type DashboardTask = {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
};

export type DashboardHighlight = {
  eyebrow: string;
  title: string;
  description: string;
};

export type CareerRoleSuggestion = {
  title: string;
  fitScore: number;
  priority: "primary" | "secondary" | "explore";
  summary: string;
  whyItFits: string[];
  searchQueries: string[];
};

export type CareerCompanyMatch = {
  id: string;
  name: string;
  domain?: string;
  linkedinUrl?: string;
  stage: string;
  fitScore: number;
  source: string;
  reason: string;
  targetRole: string;
  hiringSignal: string;
  personalizedObservation: string;
};

export type CareerProviderStatus = {
  provider: string;
  health: ProviderHealth;
  checkedAt: string;
  notes?: string;
};

export type CareerPlan = {
  primaryGoal: string;
  roleSuggestions: CareerRoleSuggestion[];
  companyMatches: CareerCompanyMatch[];
  providerStatus: CareerProviderStatus;
  nextSteps: string[];
};

export type ProviderHealth = "healthy" | "degraded" | "offline";

export type LeadRecord = {
  id: string;
  companyName: string;
  contactName: string;
  contactRole: string;
  source: string;
  score: number;
};

export type ApplicationOutcome =
  | "draft"
  | "tailored"
  | "sent"
  | "viewed"
  | "reply_received"
  | "interviewing"
  | "rejected"
  | "offer"
  | "closed";

export type ResumeExperience = {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type ResumeProfile = {
  fullName: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  portfolioUrl?: string;
  skills: string[];
  experience: ResumeExperience[];
  education: string[];
};

export type JobContact = {
  name: string;
  role: string;
  email?: string;
  linkedinUrl?: string;
};

export type JobPosting = {
  title: string;
  company: string;
  sourceUrl?: string;
  location?: string;
  description: string;
  contact?: JobContact;
};

export type TailoredResumeBullet = {
  original?: string;
  tailored: string;
  reason: string;
};

export type TailoredResumeSection = {
  title: string;
  bullets: TailoredResumeBullet[];
};

export type TailoredResume = {
  jobTitle: string;
  company: string;
  headline: string;
  summary: string;
  sections: TailoredResumeSection[];
  keywordMatches: string[];
};

export type ApplicationRecord = {
  id: string;
  companyName: string;
  jobTitle: string;
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  status: ApplicationOutcome;
  appliedAt?: string;
  updatedAt: string;
  source: string;
  resumeTitle: string;
  outcomeSummary?: string;
  nextStep?: string;
};

export type DashboardOverview = {
  summary: {
    totalApplications: number;
    sent: number;
    interviewing: number;
    replies: number;
    offers: number;
  };
  recentApplications: ApplicationRecord[];
  pipelineStages: DashboardPipelineStage[];
  nextActions: DashboardTask[];
  careerPlan: CareerPlan;
};
