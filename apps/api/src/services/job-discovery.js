import { masterResumeProfile } from "../data/master-resume-profile.js";
import { upsertDiscoveredJobs } from "../lib/supabase-rest.js";
import { createAiProvider } from "./ai-provider.js";

async function getJson(url, headers = {}) {
  const response = await fetch(url, { headers: { accept: "application/json", ...headers } });
  if (!response.ok) throw new Error(`Source returned ${response.status}: ${url}`);
  return response.json();
}

function normalizeJob(job, source) {
  return {
    source,
    sourceId: String(job.id ?? job.hostedUrl ?? job.absolute_url ?? job.url ?? job.title),
    title: job.title ?? "Untitled role",
    company: job.company ?? job.companyName ?? source,
    location: job.location?.name ?? job.location ?? "Not specified",
    description: String(job.content ?? job.description ?? ""),
    url: job.absolute_url ?? job.hostedUrl ?? job.applyUrl ?? job.url ?? null,
    discoveredAt: new Date().toISOString()
  };
}

async function greenhouse(config) {
  const jobs = [];
  for (const board of config.greenhouseBoardTokens) {
    const payload = await getJson(`https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(board)}/jobs?content=true`);
    jobs.push(...(payload.jobs ?? []).map((job) => normalizeJob(job, "greenhouse")));
  }
  return jobs;
}

async function lever(config) {
  const jobs = [];
  for (const site of config.leverSiteNames) {
    const payload = await getJson(`https://api.lever.co/v0/postings/${encodeURIComponent(site)}?mode=json`);
    jobs.push(...(payload ?? []).map((job) => normalizeJob(job, "lever")));
  }
  return jobs;
}

async function ashby(config) {
  const jobs = [];
  for (const board of config.ashbyJobBoards) {
    const payload = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(board)}?includeCompensation=true`);
    jobs.push(...(payload.jobs ?? []).map((job) => normalizeJob(job, "ashby")));
  }
  return jobs;
}

async function adzuna(config) {
  if (!config.adzunaAppId || !config.adzunaAppKey || config.adzunaAppId.includes("replace")) return [];
  const params = new URLSearchParams({ app_id: config.adzunaAppId, app_key: config.adzunaAppKey, results_per_page: "30", what: config.adzunaQuery });
  const payload = await getJson(`https://api.adzuna.com/v1/api/jobs/${config.adzunaCountry}/search/1?${params}`);
  return (payload.results ?? []).map((job) => normalizeJob({ ...job, company: job.company?.display_name, location: job.location?.display_name, url: job.redirect_url, description: job.description }, "adzuna"));
}

export async function runJobDiscovery({ config, logger }) {
  const tasks = [];
  if (config.greenhouseBoardTokens.length) tasks.push(greenhouse(config));
  if (config.leverSiteNames.length) tasks.push(lever(config));
  if (config.ashbyJobBoards.length) tasks.push(ashby(config));
  if (config.adzunaAppId && config.adzunaAppKey) tasks.push(adzuna(config));
  const settled = await Promise.allSettled(tasks);
  const jobs = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  settled.filter((result) => result.status === "rejected").forEach((result) => logger.warn("Job source failed; continuing the run.", { errorMessage: result.reason?.message }));
  const unique = [...new Map(jobs.map((job) => [job.url ?? `${job.source}:${job.sourceId}`, job])).values()];
  const ai = createAiProvider({ config, logger });
  const ranked = [];
  for (const job of unique.slice(0, 100)) {
    const aiResult = await ai.classifyJob(job, masterResumeProfile).catch((error) => {
      logger.warn("AI classification failed; keeping job for heuristic review.", { errorMessage: error.message });
      return null;
    });
    const text = `${job.title} ${job.description}`.toLowerCase();
    const heuristic = masterResumeProfile.skills.filter((skill) => text.includes(skill.toLowerCase())).length;
    ranked.push({ ...job, fitScore: aiResult?.fitScore ?? Math.min(45 + heuristic * 6, 88), reasons: aiResult?.reasons ?? [`Matches ${heuristic} profile skills`], gaps: aiResult?.gaps ?? [] });
  }
  ranked.sort((a, b) => b.fitScore - a.fitScore);
  await upsertDiscoveredJobs(config, ranked).catch((error) => {
    logger.warn("Could not persist discovered jobs; returning ranked results anyway.", { errorMessage: error.message });
  });
  logger.info("Background job discovery completed.", { sources: tasks.length, discovered: jobs.length, unique: unique.length, ranked: ranked.length, aiEnabled: ai.enabled });
  return ranked;
}
