import type {
  ApplicationRecord,
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
  nextActions: dashboardTasks
};
