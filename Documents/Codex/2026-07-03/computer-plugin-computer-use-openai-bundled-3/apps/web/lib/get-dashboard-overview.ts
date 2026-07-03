import type { ApplicationRecord, DashboardOverview } from "@gtm-os/types";

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

async function readApiOverview(fallbackOverview: DashboardOverview) {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://127.0.0.1:3000";
  const response = await fetch(`${apiBaseUrl}/v1/dashboard/overview`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return fallbackOverview;
  }

  const payload = (await response.json()) as { data?: DashboardOverview };
  return payload.data ?? fallbackOverview;
}

export async function getDashboardOverview(
  fallbackOverview: DashboardOverview
): Promise<DashboardOverview> {
  try {
    const liveApplications = await readLiveApplications();

    if (Array.isArray(liveApplications) && liveApplications.length > 0) {
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
          { label: "Sourced", count: 82, percentage: 100 },
          { label: "Applied", count: summary.totalApplications, percentage: 48 },
          { label: "Interviewing", count: summary.interviewing, percentage: 16 },
          { label: "Offer Track", count: summary.offers, percentage: 2 }
        ],
        nextActions: fallbackOverview.nextActions
      };
    }
  } catch {
    // Fall back to the API route below.
  }

  try {
    return await readApiOverview(fallbackOverview);
  } catch {
    return fallbackOverview;
  }
}
