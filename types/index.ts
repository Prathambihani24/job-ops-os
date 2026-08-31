export interface User {
  id: string;
  email: string;
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  technicalSkills: string[];
  crmExperience: string[];
  marketingAutomation: string[];
  apis: string[];
  dataAnalysis: string[];
  portfolioLinks: string[];
  resumeUrl: string | null;
}

export interface ApplicationTracker {
  id: string;
  userId: string;
  jobId?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  jobTitle?: string;
  company?: string;
  matchScore?: number;
  appliedDate?: string;
  updated_at?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location?: string;
  gtmRoleType?: string;
  type?: string;
  salaryRange?: string;
  description?: string;
  requiredSkills?: string[];
  matchScore?: number;
  postedDate?: string;
  gtmAlignmentScore?: number;
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
    overallFit: number;
  };
  missingSkills: string[];
  suggestedBulletPoints: string[];
}