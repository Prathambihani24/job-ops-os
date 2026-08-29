import { runJobDiscovery } from "../../../../apps/api/src/services/job-discovery.js";
import { loadConfig } from "../../../../apps/api/src/config/env.js";
import { createLogger } from "../../../../apps/api/src/lib/logger.js";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  const config = loadConfig();
  const authorization = request.headers.get("authorization");
  if (!config.cronSecret || authorization !== `Bearer ${config.cronSecret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const logger = createLogger({ service: config.appName, workflow: "job-sync" });
  const startedAt = Date.now();
  const jobs = await runJobDiscovery({ config, logger });
  return Response.json({ ok: true, runId: `sync_${Date.now()}`, jobsFound: jobs.length, topMatches: jobs.slice(0, 10), durationMs: Date.now() - startedAt });
}
