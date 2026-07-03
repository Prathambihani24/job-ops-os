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

test("tailor endpoint returns a job-aligned resume draft", async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.APP_NAME = "gtm-os-test";
  process.env.API_BASE_URL = "http://127.0.0.1";

  const app = buildApp();
  const request = createMockRequest({
    method: "POST",
    url: "/v1/resume/tailor",
    body: {
      jobPosting: {
        title: "GTM Engineer",
        company: "SignalStack AI",
        description:
          "Looking for a GTM Engineer who can automate lead sourcing, tailor outbound messaging, and build reporting systems in TypeScript and Supabase.",
        contact: {
          name: "Avery Chen",
          role: "Founding GTM Engineer",
          email: "avery@signalstack.ai"
        }
      }
    }
  });
  const response = createMockResponse();

  await app.requestHandler(request, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.tailoredResume.jobTitle, "GTM Engineer");
  assert.ok(body.data.tailoredResume.summary.includes("SignalStack AI"));
  assert.ok(body.data.tailoredResume.keywordMatches.length > 0);
});

test("launch endpoint returns an application record and outreach draft", async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.APP_NAME = "gtm-os-test";
  process.env.API_BASE_URL = "http://127.0.0.1";

  const app = buildApp();
  const request = createMockRequest({
    method: "POST",
    url: "/v1/applications/launch",
    body: {
      jobPosting: {
        title: "AI Automation Associate",
        company: "Northwind Labs",
        description:
          "We need a builder who can automate outreach, manage pipelines, and tailor resumes to AI roles.",
        contact: {
          name: "Maya Patel",
          role: "People Ops Lead",
          email: "maya@northwindlabs.ai"
        }
      }
    }
  });
  const response = createMockResponse();

  await app.requestHandler(request, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.data.deliveryStatus, "ready_to_send");
  assert.equal(body.data.application.company_name, "Northwind Labs");
  assert.ok(body.data.outreach.subject.includes("AI Automation Associate"));
});

test("dashboard overview endpoint returns tracked outcomes", async () => {
  process.env.NODE_ENV = "test";
  process.env.PORT = "3000";
  process.env.APP_NAME = "gtm-os-test";
  process.env.API_BASE_URL = "http://127.0.0.1";

  const app = buildApp();
  const request = createMockRequest({
    method: "GET",
    url: "/v1/dashboard/overview"
  });
  const response = createMockResponse();

  await app.requestHandler(request, response);
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(typeof body.data.summary.totalApplications, "number");
  assert.ok(Array.isArray(body.data.recentApplications));
  assert.ok(body.data.recentApplications.length > 0);
});
