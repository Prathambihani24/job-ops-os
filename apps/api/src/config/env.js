import process from "node:process";

function readEnv(name, fallback = undefined) {
  const value = process.env[name] || fallback;

  if (value === undefined || value === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function loadConfig() {
  const port = Number.parseInt(readEnv("PORT", "3000"), 10);

  if (Number.isNaN(port) || port < 0) {
    throw new Error("PORT must be a non-negative integer.");
  }

  return {
    appName: readEnv("APP_NAME", "gtm-os-job-search"),
    nodeEnv: readEnv("NODE_ENV", "development"),
    port,
    logLevel: readEnv("LOG_LEVEL", "info"),
    apiBaseUrl: readEnv("API_BASE_URL", `http://localhost:${port}`),
    apolloApiKey: process.env.APOLLO_API_KEY ?? "",
    clayApiKey: process.env.CLAY_API_KEY ?? "",
    cronSecret: process.env.CRON_SECRET ?? "",
    aiProvider: process.env.AI_PROVIDER || "ollama",
    aiApiKey: process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
    aiBaseUrl: process.env.AI_BASE_URL || process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434/v1",
    aiModel: process.env.AI_MODEL || process.env.OLLAMA_MODEL || "qwen3:8b",
    greenhouseApiKey: process.env.GREENHOUSE_API_KEY ?? "",
    greenhouseBoardTokens: splitCsv(process.env.GREENHOUSE_BOARD_TOKENS),
    leverApiKey: process.env.LEVER_API_KEY ?? "",
    leverSiteNames: splitCsv(process.env.LEVER_SITE_NAMES),
    ashbyApiKey: process.env.ASHBY_API_KEY ?? "",
    ashbyJobBoards: splitCsv(process.env.ASHBY_JOB_BOARDS),
    adzunaAppId: process.env.ADZUNA_APP_ID ?? "",
    adzunaAppKey: process.env.ADZUNA_APP_KEY ?? "",
    adzunaCountry: process.env.ADZUNA_COUNTRY ?? "in",
    adzunaQuery: process.env.ADZUNA_QUERY ?? "marketing OR growth OR GTM OR social media",
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  };
}

function splitCsv(value) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
