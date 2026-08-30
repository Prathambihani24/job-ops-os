import { loadConfig } from "../config/env.js";
import { masterResumeProfile } from "../data/master-resume-profile.js";
import { sampleJobPosting } from "../data/sample-jobs.js";
import { createLogger } from "../lib/logger.js";
import { createApplicationTracker } from "./application-tracker.js";
import { createCareerPlanner } from "./career-planner.js";
import { createAiProvider } from "./ai-provider.js";
import { tailorResume, buildOutreachMessage } from "./resume-tailoring.js";

function firstNonEmptyLine(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[#>*-]+\s*/, "").trim())
    .find((line) => line.length > 2 && line.length < 120) ?? "Target role";
}

export function normalizeJobPosting(input = {}) {
  const description = String(input.description ?? "").trim();
  const title = String(input.title ?? "").trim() ||
    description.match(/(?:job title|position|role|title)\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
    firstNonEmptyLine(description);
  const company = String(input.company ?? "").trim() ||
    description.match(/(?:company|employer|organization)\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
    "Target company";

  return {
    title: title.slice(0, 160),
    company: company.slice(0, 160),
    sourceUrl: input.sourceUrl ? String(input.sourceUrl).trim() : undefined,
    location: input.location ? String(input.location).trim() : "Not specified",
    description,
    contact: input.contact && typeof input.contact === "object" ? input.contact : undefined
  };
}

export function createDashboardDataServices() {
  const config = loadConfig();
  const logger = createLogger({
    service: config.appName,
    environment: config.nodeEnv
  });
  const tracker = createApplicationTracker({
    profile: masterResumeProfile,
    logger,
    config
  });
  const careerPlanner = createCareerPlanner({
    profile: masterResumeProfile,
    logger,
    config
  });

  return {
    config,
    logger,
    tracker,
    careerPlanner
  };
}

export async function buildDashboardOverview() {
  const { tracker, careerPlanner } = createDashboardDataServices();
  const overview = await tracker.summarize();

  return {
    ...overview,
    careerPlan: careerPlanner.plan()
  };
}

export function buildCareerPlan() {
  const { careerPlanner } = createDashboardDataServices();
  return careerPlanner.plan();
}

export async function launchApplicationFlow(jobPosting = sampleJobPosting) {
  const { tracker, careerPlanner, logger, config } = createDashboardDataServices();
  const normalizedJob = normalizeJobPosting(jobPosting);
  if (!normalizedJob.description || normalizedJob.description.length < 40) {
    throw new Error("Paste the complete job description before generating your resume.");
  }

  const fallbackResume = tailorResume(masterResumeProfile, normalizedJob);
  const ai = createAiProvider({ config, logger });
  const tailoredResume = await ai.tailorResume(normalizedJob, masterResumeProfile, fallbackResume).catch((error) => {
    logger.warn("AI resume tailoring failed; using verified profile tailoring.", { errorMessage: error.message });
    return fallbackResume;
  });
  const outreach = buildOutreachMessage(masterResumeProfile, normalizedJob, tailoredResume);
  const result = await tracker.tailorAndDraft(normalizedJob, { tailoredResume, outreach });
  const careerPlan = careerPlanner.plan();

  logger.info("Application launched.", {
    company: normalizedJob.company,
    jobTitle: normalizedJob.title,
    contactEmail: normalizedJob.contact?.email ?? null
  });

  return {
    application: result.application,
    tailoredResume: result.tailoredResume,
    outreach: result.outreach,
    careerPlan,
    deliveryStatus: normalizedJob.contact?.email
      ? "ready_to_send"
      : "needs_contact_email"
  };
}
