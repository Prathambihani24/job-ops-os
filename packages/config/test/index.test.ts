import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { loadAppRuntimeConfig } from "../src/index.ts";

describe("loadAppRuntimeConfig", () => {
  it("returns validated config for valid environment variables", () => {
    const env = {
      APP_URL: "https://example.com",
      API_BASE_URL: "https://api.example.com",
      AI_PROVIDER: "openai"
    };

    const config = loadAppRuntimeConfig(env);

    assert.equal(config.appUrl, "https://example.com");
    assert.equal(config.apiBaseUrl, "https://api.example.com");
    assert.equal(config.aiProvider, "openai");
  });

  it("trims required environment variables before validation", () => {
    const env = {
      APP_URL: "  https://example.com  ",
      API_BASE_URL: "  https://api.example.com  ",
      AI_PROVIDER: "  openai  "
    };

    const config = loadAppRuntimeConfig(env);

    assert.equal(config.appUrl, "https://example.com");
    assert.equal(config.apiBaseUrl, "https://api.example.com");
    assert.equal(config.aiProvider, "openai");
  });

  it("throws if APP_URL is missing", () => {
    const env = {
      API_BASE_URL: "https://api.example.com",
      AI_PROVIDER: "openai"
    };

    assert.throws(
      () => loadAppRuntimeConfig(env),
      {
        name: "Error",
        message: /Missing required environment variable: APP_URL/
      }
    );
  });

  it("throws if API_BASE_URL is not a valid URL", () => {
    const env = {
      APP_URL: "https://example.com",
      API_BASE_URL: "not-a-url",
      AI_PROVIDER: "openai"
    };

    assert.throws(
      () => loadAppRuntimeConfig(env),
      {
        name: "Error",
        message: /Invalid URL for API_BASE_URL: not-a-url/
      }
    );
  });

  it("throws if AI_PROVIDER is empty after trimming", () => {
    const env = {
      APP_URL: "https://example.com",
      API_BASE_URL: "https://api.example.com",
      AI_PROVIDER: "   "
    };

    assert.throws(
      () => loadAppRuntimeConfig(env),
      {
        name: "Error",
        message: /Missing required environment variable: AI_PROVIDER/
      }
    );
  });
});
