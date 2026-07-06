import type {
  ApplicationRecord,
  CareerPlan,
  DashboardOverview,
  DashboardHighlight,
  DashboardMetric,
  DashboardPipelineStage,
  DashboardTask
} from "@gtm-os/types";

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Active applications",
    value: "24",
    description: "Across software, GTM engineering, and AI operations roles."
  },
  {
    label: "Response rate",
    value: "37%",
    description: "Measured from personalized outreach and warm applications."
  },
  {
    label: "Upcoming interviews",
    value: "3",
    description: "Includes recruiter screen, founder chat, and technical round."
  },
  {
    label: "AI recommendations",
    value: "12",
    description: "High-signal companies surfaced by scoring and research agents."
  }
];

export const dashboardPipelineStages: DashboardPipelineStage[] = [
  { label: "Sourced", count: 82, percentage: 100 },
  { label: "Applied", count: 24, percentage: 29 },
  { label: "Interviewing", count: 6, percentage: 7 },
  { label: "Offer Track", count: 1, percentage: 1 }
];

export const dashboardTasks: DashboardTask[] = [
  {
    title: "Tailor resume for AI startup platform role",
    description: "Use the JD analyzer and resume tailoring agent before noon.",
    priority: "high"
  },
  {
    title: "Review founder hiring signals",
    description: "Check recent LinkedIn and product launch activity for top targets.",
    priority: "high"
  },
  {
    title: "Prepare weekly pipeline summary",
    description: "Send conversion metrics and next actions into Slack.",
    priority: "medium"
  }
];

export const dashboardHighlights: DashboardHighlight[] = [
  {
    eyebrow: "Provider architecture",
    title: "Swap lead and AI providers cleanly",
    description:
      "Adapters live behind stable interfaces so CSV, Google Sheets, Ollama, HubSpot, and future paid providers can change without reworking the product."
  },
  {
    eyebrow: "Workflow thinking",
    title: "Design for GTM execution, not just CRUD",
    description:
      "The system is centered on repeatable workflows like research, prioritization, outreach generation, and daily summaries instead of isolated screens."
  },
  {
    eyebrow: "Portfolio value",
    title: "Shows technical depth with business intent",
    description:
      "This project demonstrates systems design, automation thinking, and user-facing judgment that map well to GTM engineering roles at AI startups."
  }
];

export const careerPlan: CareerPlan = {
  primaryGoal: "Target social media, growth marketing, GTM operations, and marketing automation roles.",
  roleSuggestions: [
    {
      title: "Social Media Manager",
      fitScore: 96,
      priority: "primary",
      summary:
        "Best match for your current experience managing content, engagement, calendars, and analytics.",
      whyItFits: [
        "Matches your current Social Media Manager experience.",
        "Uses content, engagement, and analytics strengths directly.",
        "Pairs well with Canva, Adobe Express, and Instagram Analytics."
      ],
      searchQueries: ["social media manager", "brand social media", "community and social content"]
    },
    {
      title: "Growth Marketing Associate",
      fitScore: 91,
      priority: "primary",
      summary:
        "Strong fit for lead generation, content marketing, and campaign execution roles.",
      whyItFits: [
        "Supported 500+ lead generation efforts with Apollo.io and LinkedIn Sales Navigator.",
        "You already have campaign and outreach workflow experience.",
        "Useful bridge from marketing into GTM operations."
      ],
      searchQueries: ["growth marketing associate", "demand generation", "growth operations"]
    },
    {
      title: "GTM Operations Associate",
      fitScore: 88,
      priority: "secondary",
      summary:
        "Best for startups that want someone who can connect CRM, outreach, reporting, and automation.",
      whyItFits: [
        "You have hands-on experience with HubSpot, Apollo.io, and CRM-style workflows.",
        "The role aligns with your AI automation and tracking mindset.",
        "Good interview story for systems and process improvement."
      ],
      searchQueries: ["gtm operations", "revenue operations associate", "sales operations"]
    },
    {
      title: "Marketing Operations Specialist",
      fitScore: 85,
      priority: "secondary",
      summary:
        "Ideal for marketing teams that need someone to manage tools, reporting, and campaign execution.",
      whyItFits: [
        "Strong overlap with Excel, analytics, campaign management, and CRM support.",
        "Your education in computer engineering adds technical credibility.",
        "This role can evolve into broader GTM systems work."
      ],
      searchQueries: ["marketing operations", "marketing ops specialist", "crm marketing"]
    }
  ],
  companyMatches: [
    {
      id: "cmp_01",
      name: "Orbital Revenue",
      domain: "orbitalrevenue.example",
      linkedinUrl: "https://www.linkedin.com/company/orbital-revenue",
      stage: "Series A",
      fitScore: 92,
      source: "apollo",
      reason: "Strong fit for growth, CRM, and outreach automation.",
      targetRole: "GTM Operations Associate",
      hiringSignal: "Posted for GTM systems and outbound tooling.",
      personalizedObservation: "Likely to value someone who can combine lead gen with workflow design."
    },
    {
      id: "cmp_02",
      name: "Signal Foundry",
      domain: "signalfoundry.example",
      linkedinUrl: "https://www.linkedin.com/company/signal-foundry",
      stage: "Seed",
      fitScore: 89,
      source: "apollo",
      reason: "Founder-led company likely to need social and growth execution.",
      targetRole: "Growth Marketing Associate",
      hiringSignal: "Founder activity suggests outbound and brand building work.",
      personalizedObservation: "Good place to pitch yourself as a hands-on operator."
    },
    {
      id: "cmp_03",
      name: "Northwind Labs",
      domain: "northwindlabs.example",
      linkedinUrl: "https://www.linkedin.com/company/northwind-labs",
      stage: "Seed",
      fitScore: 87,
      source: "apollo",
      reason: "Fits a marketing/CRM operator who can support pipeline and customer touchpoints.",
      targetRole: "Marketing Operations Specialist",
      hiringSignal: "Hiring across customer and go-to-market functions.",
      personalizedObservation: "Likely to appreciate cross-functional communication skills."
    }
  ],
  providerStatus: {
    provider: "apollo",
    health: "degraded",
    checkedAt: "2026-07-03T00:00:00.000Z",
    notes: "Apollo is modeled as an optional adapter. Connect APOLLO_API_KEY to switch from the free fallback company list."
  },
  nextSteps: [
    "Choose the primary role target for the week.",
    "Use Apollo to source companies that match that role.",
    "Tailor the resume and outreach for each company.",
    "Send applications and capture every outcome in the dashboard."
  ]
};

export const dashboardApplications: ApplicationRecord[] = [
  {
    id: "app_001",
    companyName: "SignalStack AI",
    jobTitle: "GTM Engineer",
    contactName: "Avery Chen",
    contactRole: "Founding GTM Engineer",
    contactEmail: "avery@signalstack.ai",
    status: "sent",
    appliedAt: "2026-07-03T00:00:00.000Z",
    updatedAt: "2026-07-03T00:00:00.000Z",
    source: "manual",
    resumeTitle: "Tailored GTM Engineer Resume",
    outcomeSummary: "Applied and waiting for a reply.",
    nextStep: "Follow up in 3 days"
  },
  {
    id: "app_002",
    companyName: "Northwind Labs",
    jobTitle: "AI Automation Associate",
    contactName: "Maya Patel",
    contactRole: "People Ops Lead",
    contactEmail: "maya@northwindlabs.ai",
    status: "interviewing",
    appliedAt: "2026-07-03T00:00:00.000Z",
    updatedAt: "2026-07-03T00:00:00.000Z",
    source: "apollo",
    resumeTitle: "Tailored AI Automation Resume",
    outcomeSummary: "Recruiter screen scheduled.",
    nextStep: "Prepare interview notes"
  },
  {
    id: "app_003",
    companyName: "Orbit Ledger",
    jobTitle: "Growth Operations Analyst",
    contactName: "Jordan Lee",
    contactRole: "Head of Growth",
    contactEmail: "jordan@orbitledger.com",
    status: "reply_received",
    appliedAt: "2026-07-03T00:00:00.000Z",
    updatedAt: "2026-07-03T00:00:00.000Z",
    source: "google_sheets",
    resumeTitle: "Tailored Growth Ops Resume",
    outcomeSummary: "Received a positive reply and requested availability.",
    nextStep: "Book founder call"
  }
];

export const dashboardOverview: DashboardOverview = {
  summary: {
    totalApplications: dashboardApplications.length,
    sent: dashboardApplications.filter((app) => app.status === "sent").length,
    interviewing: dashboardApplications.filter((app) => app.status === "interviewing").length,
    replies: dashboardApplications.filter((app) =>
      ["reply_received", "interviewing", "offer"].includes(app.status)
    ).length,
    offers: dashboardApplications.filter((app) => app.status === "offer").length
  },
  recentApplications: dashboardApplications,
  pipelineStages: dashboardPipelineStages,
  nextActions: dashboardTasks,
  careerPlan
};
