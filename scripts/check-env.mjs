import process from "node:process";

try {
  process.loadEnvFile(".env");
} catch {
  // The validator will report missing values below if the file is absent.
}

// Keys the app cannot run without: DB connection + the port/name it boots with.
const requiredKeys = [
  "NODE_ENV",
  "PORT",
  "APP_NAME",
  "DATABASE_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
];

// Keys that unlock optional features. Nothing in the codebase currently reads
// HUBSPOT_ACCESS_TOKEN, SLACK_BOT_TOKEN, or SLACK_SIGNING_SECRET, so they live
// here rather than blocking startup. N8N_ENCRYPTION_KEY is only needed if you
// run the n8n container from docker-compose.yml.
const optionalKeys = [
  "N8N_ENCRYPTION_KEY",
  "HUBSPOT_ACCESS_TOKEN",
  "SLACK_BOT_TOKEN",
  "SLACK_SIGNING_SECRET",
  "AI_PROVIDER",
  "OLLAMA_BASE_URL",
  "OLLAMA_MODEL",
  "NOTION_API_KEY",
  "NOTION_DATABASE_ID",
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "APOLLO_API_KEY",
  "CLAY_API_KEY",
  "LINKEDIN_SESSION_COOKIE",
  "GMAIL_CLIENT_ID",
  "GMAIL_CLIENT_SECRET",
  "GOOGLE_CALENDAR_CLIENT_ID",
  "GOOGLE_CALENDAR_CLIENT_SECRET",
  "SENTRY_DSN",
  "BETTER_STACK_SOURCE_TOKEN"
];

function isPlaceholder(value) {
  return typeof value === "string" && value.toLowerCase().includes("replace");
}

const missingKeys = requiredKeys.filter((key) => {
  const value = process.env[key];
  return !value || isPlaceholder(value);
});

const optionalPlaceholders = optionalKeys.filter((key) => {
  const value = process.env[key];
  return Boolean(value) && isPlaceholder(value);
});

if (missingKeys.length > 0) {
  console.error(
    JSON.stringify(
      {
        level: "error",
        message: "Environment validation failed for the free-core stack.",
        missingKeys
      },
      null,
      2
    )
  );
  process.exit(1);
}

console.log(
  JSON.stringify({
    level: "info",
    message: "Environment validation passed for the free-core stack.",
    checkedRequiredKeys: requiredKeys.length,
    optionalPlaceholders
  })
);
