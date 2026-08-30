import type { ApplicationRecord, DashboardOverview, DiscoveredJobRecord, ResumeVersionRecord } from "@gtm-os/types";
import { buildDashboardOverview } from "../../api/src/services/dashboard-data.js";

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return {
    baseUrl: supabaseUrl.replace(/\/$/, ""),
    serviceRoleKey
  };
}

async function readLiveApplications() {
  const supabase = getSupabaseConfig();

  if (!supabase) {
    return null;
  }

  const response = await fetch(
    `${supabase.baseUrl}/rest/v1/job_applications?select=*&order=created_at.desc&limit=10`,
    {
      cache: "no-store",
      headers: {
        apikey: supabase.serviceRoleKey,
        authorization: `Bearer ${supabase.serviceRoleKey}`
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function readLiveDiscoveredJobs(): Promise<DiscoveredJobRecord[] | null> {
  const supabase = getSupabaseConfig();
  if (!supabase) return null;
  const response = await fetch(
    `${supabase.baseUrl}/rest/v1/discovered_jobs?select=*&order=fit_score.desc,discovered_at.desc&limit=12`,
    { cache: "no-store", headers: { apikey: supabase.serviceRoleKey, authorization: `Bearer ${supabase.serviceRoleKey}` } }
  );
  if (!response.ok) return null;
  const rows = await response.json();
  return Array.isArray(rows) ? rows.map((row) => ({
    id: row.id,
    source: row.source,
    title: row.title,
    company: row.company,
    location: row.location,
    description: row.description,
    url: row.job_url,
    fitScore: row.fit_score ?? 0,
    reasons: Array.isArray(row.reasons) ? row.reasons : [],
    gaps: Array.isArray(row.gaps) ? row.gaps : [],
    discoveredAt: row.discovered_at
  })) : [];
}

async function readLiveResumeVersions(): Promise<ResumeVersionRecord[] | null> {
  const supabase = getSupabaseConfig();
  if (!supabase) return null;
  const response = await fetch(
    `${supabase.baseUrl}/rest/v1/resume_profiles?select=id,profile_name,owner_name,source_markdown,created_at,updated_at&order=created_at.desc&limit=6`,
    { cache: "no-store", headers: { apikey: supabase.serviceRoleKey, authorization: `Bearer ${supabase.serviceRoleKey}` } }
  );
  if (!response.ok) return null;
  const rows = await response.json();
  return Array.isArray(rows) ? rows.map((row) => ({
    id: row.id,
    profileName: row.profile_name,
    ownerName: row.owner_name,
    sourceMarkdown: row.source_markdown,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  })) : [];
}

async function readApiOverview(fallbackOverview: DashboardOverview) {
  if (process.env.API_BASE_URL) {
    const response = await fetch(`${process.env.API_BASE_URL}/v1/dashboard/overview`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallbackOverview;
    }

    const payload = (await response.json()) as { data?: DashboardOverview };
    return payload.data ?? fallbackOverview;
  }

  return (await buildDashboardOverview()) as DashboardOverview;
}

function emptyLiveOverview(fallbackOverview: DashboardOverview): DashboardOverview {
  return {
    summary: { totalApplications: 0, sent: 0, interviewing: 0, replies: 0, offers: 0 },
    recentApplications: [],
    pipelineStages: [
      { label: "Sourced", count: 0, percentage: 0 },
      { label: "Applied", count: 0, percentage: 0 },
      { label: "Interviewing", count: 0, percentage: 0 },
      { label: "Offer Track", count: 0, percentage: 0 }
    ],
    nextActions: fallbackOverview.nextActions,
    careerPlan: fallbackOverview.careerPlan,
    discoveredJobs: [],
    resumeVersions: []
  };
}

export async function getDashboardOverview(
  fallbackOverview: DashboardOverview
): Promise<DashboardOverview> {
  try {
    const [liveApplications, discoveredJobs, resumeVersions] = await Promise.all([
      readLiveApplications(),
      readLiveDiscoveredJobs(),
      readLiveResumeVersions()
    ]);

    if (Array.isArray(liveApplications)) {
      const recentApplications = liveApplications.map((row) => ({
        id: row.id,
        companyName: row.company_name ?? row.companyName,
        jobTitle: row.job_title ?? row.jobTitle,
        contactName: row.contact_name ?? row.contactName,
        contactRole: row.contact_role ?? row.contactRole,
        contactEmail: row.contact_email ?? row.contactEmail,
        status: row.status as ApplicationRecord["status"],
        appliedAt: row.applied_at ?? row.appliedAt,
        updatedAt: row.updated_at ?? row.updatedAt,
        source: row.source_provider ?? row.source ?? "manual",
        resumeTitle: row.tailored_resume_title ?? row.resumeTitle ?? "Tailored Resume",
        outcomeSummary: row.outcome_summary ?? row.outcomeSummary,
        nextStep: row.next_step ?? row.nextStep
      })) as ApplicationRecord[];

      const summary = {
        totalApplications: recentApplications.length,
        sent: recentApplications.filter((app) => app.status === "sent").length,
        interviewing: recentApplications.filter((app) => app.status === "interviewing").length,
        replies: recentApplications.filter((app) =>
          ["reply_received", "interviewing", "offer"].includes(app.status)
        ).length,
        offers: recentApplications.filter((app) => app.status === "offer").length
      };

      return {
        summary,
        recentApplications,
        pipelineStages: [
          { label: "Sourced", count: discoveredJobs?.length ?? 0, percentage: 100 },
          { label: "Applied", count: summary.totalApplications, percentage: discoveredJobs?.length ? Math.round((summary.totalApplications / discoveredJobs.length) * 100) : summary.totalApplications ? 100 : 0 },
          { label: "Interviewing", count: summary.interviewing, percentage: summary.totalApplications ? Math.round((summary.interviewing / summary.totalApplications) * 100) : 0 },
          { label: "Offer Track", count: summary.offers, percentage: summary.totalApplications ? Math.round((summary.offers / summary.totalApplications) * 100) : 0 }
        ],
        nextActions: fallbackOverview.nextActions,
        careerPlan: fallbackOverview.careerPlan,
        discoveredJobs: discoveredJobs ?? [],
        resumeVersions: resumeVersions ?? []
      };
    }
  } catch {
    // A configured live workspace should remain honest when its database is temporarily unavailable.
    if (getSupabaseConfig()) return emptyLiveOverview(fallbackOverview);
  }

  try {
    return await readApiOverview(fallbackOverview);
  } catch {
    return fallbackOverview;
  }
}
