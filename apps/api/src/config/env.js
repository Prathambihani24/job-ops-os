import process from "node:process";

function readEnv(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;

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
    supabaseUrl: process.env.SUPABASE_URL ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
    anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    groqModel: process.env.GROQ_MODEL ?? "openai/gpt-oss-120b"
  };
}
