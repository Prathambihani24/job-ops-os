import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { buildApp } from "../src/server.js";

function createMockRequest({ method, url, body }) {
  const chunks = body ? [Buffer.from(JSON.stringify(body))] : [];
  const request = Readable.from(chunks);
  request.method = method;
  request.url = url;
  return request;
}

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(payload = "") {
      this.body = payload;
    }
  };
}

test("live health endpoint returns ok", async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.APP_NAME = "gtm-os-test";
  process.env.API_BASE_URL = "http://127.0.0.1";

  const app = buildApp();
  const request = createMockRequest({
    method: "GET",
    url: "/v1/health/live"
  });
  const response = createMockResponse();

  await app.requestHandler(request, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "gtm-os-test");
});

test("score endpoint returns recommendation payload", async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.APP_NAME = "gtm-os-test";
  process.env.API_BASE_URL = "http://127.0.0.1";

  const app = buildApp();
  const request = createMockRequest({
    method: "POST",
    url: "/v1/opportunities/score",
    body: {
      companyStage: "Series A",
      hasOpenRole: true,
      recentNewsCount: 3,
      founderActivityScore: 14,
      techFitScore: 8,
      personalizationDepthScore: 9
    }
  });
  const response = createMockResponse();

  await app.requestHandler(request, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.recommendation, "prioritize");
  assert.equal(typeof body.data.score, "number");
});
