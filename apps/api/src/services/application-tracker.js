import { tailorResume, buildOutreachMessage } from "./resume-tailoring.js";
import {
  listJobApplications,
  saveResumeProfile,
  upsertJobApplication
} from "../lib/supabase-rest.js";

function nowIso() {
  return new Date().toISOString();
}

function normalizeRow(row) {
  return {
    id: row.id,
    companyName: row.company_name ?? row.companyName,
    jobTitle: row.job_title ?? row.jobTitle,
    contactName: row.contact_name ?? row.contactName,
    contactRole: row.contact_role ?? row.contactRole,
    contactEmail: row.contact_email ?? row.contactEmail,
    status: row.status,
    appliedAt: row.applied_at ?? row.appliedAt,
    updatedAt: row.updated_at ?? row.updatedAt ?? nowIso(),
    source: row.source_provider ?? row.source ?? "manual",
    resumeTitle: row.tailored_resume_title ?? row.resumeTitle ?? "Tailored Resume",
    outcomeSummary: row.outcome_summary ?? row.outcomeSummary,
    nextStep: row.next_step ?? row.nextStep
  };
}

export function createApplicationTracker({ profile, logger, config }) {
  const fallbackApplications = [
    {
      id: "app_001",
      companyName: "SignalStack AI",
      jobTitle: "GTM Engineer",
      contactName: "Avery Chen",
      contactRole: "Founding GTM Engineer",
      contactEmail: "avery@signalstack.ai",
      status: "sent",
      appliedAt: nowIso(),
      updatedAt: nowIso(),
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
      appliedAt: nowIso(),
      updatedAt: nowIso(),
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
      appliedAt: nowIso(),
      updatedAt: nowIso(),
      source: "google_sheets",
      resumeTitle: "Tailored Growth Ops Resume",
      outcomeSummary: "Received a positive reply and requested availability.",
      nextStep: "Book founder call"
    }
  ];

  async function loadApplications() {
    try {
      const rows = await listJobApplications(config, 10);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(normalizeRow);
      }
    } catch (error) {
      logger.warn("Falling back to local application data.", {
        errorMessage: error.message
      });
    }

    return fallbackApplications;
  }

  return {
    async listApplications() {
      return loadApplications();
    },
    async summarize() {
      const applications = await loadApplications();
      const summary = {
        totalApplications: applications.length,
        sent: applications.filter((app) => app.status === "sent").length,
        interviewing: applications.filter((app) => app.status === "interviewing").length,
        replies: applications.filter((app) =>
          ["reply_received", "interviewing", "offer"].includes(app.status)
        ).length,
        offers: applications.filter((app) => app.status === "offer").length
      };

      return {
        summary,
        recentApplications: applications,
        pipelineStages: [
          { label: "Sourced", count: 82, percentage: 100 },
          { label: "Applied", count: summary.totalApplications, percentage: 48 },
          { label: "Interviewing", count: summary.interviewing, percentage: 16 },
          { label: "Offer Track", count: summary.offers, percentage: 2 }
        ],
        nextActions: [
          {
            title: "Tailor resume for the next matched role",
            description: "Auto-generate a version that mirrors the JD and contact context.",
            priority: "high"
          },
          {
            title: "Send follow-up to the point of contact",
            description: "Draft a polite follow-up email or Slack note and queue it for approval.",
            priority: "high"
          },
          {
            title: "Review outcome trends",
            description: "Track which companies respond, interview, or convert to offers.",
            priority: "medium"
          }
        ]
      };
    },
    async tailorAndDraft(jobPosting) {
      const tailoredResume = await tailorResume(profile, jobPosting);
      const outreach = buildOutreachMessage(profile, jobPosting, tailoredResume);

      logger.info("Resume tailored.", {
        company: jobPosting.company,
        jobTitle: jobPosting.title,
        keywords: tailoredResume.keywordMatches
      });

      try {
        await saveResumeProfile(config, {
          profile_name: `${profile.fullName} Master Resume`,
          owner_name: profile.fullName,
          source_markdown: profile.summary,
          skills: profile.skills,
          experience: profile.experience
        });
      } catch (error) {
        logger.warn("Could not persist resume profile.", {
          errorMessage: error.message
        });
      }

      const application = {
        company_name: jobPosting.company,
        job_title: jobPosting.title,
        job_url: jobPosting.sourceUrl ?? null,
        source_provider: jobPosting.contact?.email ? "manual" : "apollo",
        contact_name: jobPosting.contact?.name ?? null,
        contact_role: jobPosting.contact?.role ?? null,
        contact_email: jobPosting.contact?.email ?? null,
        status: "sent",
        applied_at: nowIso(),
        outcome: "pending",
        outcome_summary: "Application drafted and queued for delivery.",
        next_step: jobPosting.contact?.email
          ? "Send email and track response"
          : "Find the right contact and send the tailored draft",
        tailored_resume_markdown: tailoredResume.summary,
        outreach_subject: outreach.subject,
        outreach_body: outreach.text,
        updated_at: nowIso()
      };

      try {
        await upsertJobApplication(config, application);
      } catch (error) {
        logger.warn("Could not persist application record.", {
          errorMessage: error.message
        });
      }

      return {
        tailoredResume,
        outreach,
        application
      };
    }
  };
}
