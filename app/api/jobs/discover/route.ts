import { runJobDiscovery } from "../../../../apps/api/src/services/job-discovery.js";
import { loadConfig } from "../../../../apps/api/src/config/env.js";
import { createLogger } from "../../../../apps/api/src/lib/logger.js";

export const runtime = "nodejs";
export const maxDuration = 300;

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const config = loadConfig();
  const logger = createLogger({ service: config.appName, workflow: "manual-job-discovery" });
  const startedAt = Date.now();

  try {
    const jobs = await runJobDiscovery({ config, logger });
    return Response.json({
      ok: true,
      jobsFound: jobs.length,
      topMatches: jobs.slice(0, 10),
      durationMs: Date.now() - startedAt
    });
  } catch (error) {
    logger.error("Manual job discovery failed.", {
      error: error instanceof Error ? error.message : String(error)
    });
    return Response.json({ error: "Job discovery failed" }, { status: 500 });
  }
}
