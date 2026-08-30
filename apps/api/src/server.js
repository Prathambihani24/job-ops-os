import http from "node:http";
import { loadConfig } from "./config/env.js";
import { mockCompanies } from "./data/mock-companies.js";
import { sampleJobPosting } from "./data/sample-jobs.js";
import { createLogger } from "./lib/logger.js";
import { sendJson, readJsonBody } from "./lib/response.js";
import { createRouter } from "./lib/router.js";
import {
  buildCareerPlan,
  buildDashboardOverview,
  createDashboardDataServices,
  launchApplicationFlow
} from "./services/dashboard-data.js";
import { scoreOpportunity } from "./services/opportunity-scoring.js";

export function buildApp() {
  const config = loadConfig();
  const logger = createLogger({
    service: config.appName,
    environment: config.nodeEnv
  });
  const router = createRouter();
  const { tracker } = createDashboardDataServices();

  router.register("GET", "/v1/health/live", async (_request, response) => {
    sendJson(response, 200, {
      status: "ok",
      service: config.appName,
      timestamp: new Date().toISOString()
    });
  });

  router.register("GET", "/v1/health/ready", async (_request, response) => {
    sendJson(response, 200, {
      status: "ready",
      checks: {
        api: "pass",
        database: "ready-for-supabase",
        integrations: config.apolloApiKey ? "resume-tailoring-ready with apollo" : "resume-tailoring-ready with free company fallback"
      }
    });
  });

  router.register("GET", "/v1/companies", async (_request, response, context) => {
    const limit = Number.parseInt(context.url.searchParams.get("limit") ?? "20", 10);
    const safeLimit = Number.isNaN(limit) ? 20 : Math.min(Math.max(limit, 1), 100);

    sendJson(response, 200, {
      data: mockCompanies.slice(0, safeLimit),
      meta: {
        count: Math.min(safeLimit, mockCompanies.length)
      }
    });
  });

  router.register("POST", "/v1/opportunities/score", async (request, response) => {
    const body = await readJsonBody(request);
    const result = scoreOpportunity(body);

    sendJson(response, 200, {
      data: result
    });
  });

  router.register("GET", "/v1/dashboard/overview", async (_request, response) => {
    sendJson(response, 200, {
      data: await buildDashboardOverview()
    });
  });

  router.register("GET", "/v1/career/plan", async (_request, response) => {
    sendJson(response, 200, {
      data: buildCareerPlan()
    });
  });

  router.register("POST", "/v1/resume/tailor", async (request, response) => {
    const body = await readJsonBody(request);
    const jobPosting = body.jobPosting ?? sampleJobPosting;
    const result = await tracker.tailorAndDraft(jobPosting);

    sendJson(response, 200, {
      data: result
    });
  });

  router.register("POST", "/v1/applications/launch", async (request, response) => {
    const body = await readJsonBody(request);
    const jobPosting = body.jobPosting ?? sampleJobPosting;

    sendJson(response, 200, {
      data: await launchApplicationFlow(jobPosting)
    });
  });

  const requestHandler = async (request, response) => {
    const startedAt = Date.now();

    try {
      const handled = await router.dispatch(request, response, {
        config,
        logger
      });

      if (!handled) {
        sendJson(response, 404, {
          error: {
            code: "not_found",
            message: "Route not found."
          }
        });
      }
    } catch (error) {
      logger.error("Request failed.", {
        errorName: error.name,
        errorMessage: error.message,
        route: request.url,
        method: request.method
      });

      sendJson(response, 500, {
        error: {
          code: "internal_server_error",
          message: "The server could not process the request."
        }
      });
    } finally {
      logger.info("Request completed.", {
        method: request.method,
        route: request.url,
        durationMs: Date.now() - startedAt
      });
    }
  };

  const server = http.createServer(requestHandler);

  return {
    config,
    logger,
    requestHandler,
    server
  };
}

export async function startServer(overrides = {}) {
  const app = buildApp();
  const port = overrides.port ?? app.config.port;

  await new Promise((resolve) => {
    app.server.listen(port, resolve);
  });

  const address = app.server.address();
  const resolvedPort =
    typeof address === "object" && address !== null ? address.port : port;

  app.logger.info("Server started.", {
    port: resolvedPort
  });

  return {
    ...app,
    port: resolvedPort,
    async stop() {
      await new Promise((resolve, reject) => {
        app.server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error(
      JSON.stringify({
        level: "error",
        message: "Fatal startup error.",
        errorName: error.name,
        errorMessage: error.message
      })
    );
    process.exit(1);
  });
}
