export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  technicalSkills: string[];
  crmExperience: string[];
  marketingAutomation: string[];
  apis: string[];
  dataAnalysis: string[];
  portfolioLinks: string[];
  resumeUrl?: string | null;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // Remote, Hybrid, Onsite
  salaryRange?: string;
  description: string;
  requiredSkills: string[];
  gtmRoleType: 'GTM Engineer' | 'Solutions Engineer' | 'RevOps Engineer' | 'Technical Account Manager';
  matchScore?: number;
  postedDate: string;
  sourceUrl?: string;
}

export interface JDAnalysisResult {
  jobTitle: string;
  companyName: string;
  matchPercentage: number;
  coreTechnicalSkills: string[];
  gtmAlignment: {
    crmScore: number;
    apiScore: number;
    automationScore: number;
    overallFit: string;
  };
  missingSkills: string[];
  suggestedBulletPoints: string[];
}

export type ApplicationStatus = 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface ApplicationTracker {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedDate?: string;
  followUpDate?: string | null;
  notes?: string;
  matchScore: number;
}
