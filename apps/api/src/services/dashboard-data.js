import { loadConfig } from "../config/env.js";
import { masterResumeProfile } from "../data/master-resume-profile.js";
import { sampleJobPosting } from "../data/sample-jobs.js";
import { createLogger } from "../lib/logger.js";
import { createApplicationTracker } from "./application-tracker.js";
import { createCareerPlanner } from "./career-planner.js";

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
    careerPlan: await careerPlanner.plan()
  };
}

export async function buildCareerPlan() {
  const { careerPlanner } = createDashboardDataServices();
  return careerPlanner.plan();
}

export async function launchApplicationFlow(jobPosting = sampleJobPosting) {
  const { tracker, careerPlanner, logger } = createDashboardDataServices();
  const result = await tracker.tailorAndDraft(jobPosting);
  const careerPlan = await careerPlanner.plan();

  logger.info("Application launched.", {
    company: jobPosting.company,
    jobTitle: jobPosting.title,
    contactEmail: jobPosting.contact?.email ?? null
  });

  return {
    application: result.application,
    tailoredResume: result.tailoredResume,
    outreach: result.outreach,
    careerPlan,
    deliveryStatus: jobPosting.contact?.email
      ? "ready_to_send"
      : "needs_contact_email"
  };
}
