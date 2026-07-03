const requiredVariables = ["APP_URL", "API_BASE_URL", "AI_PROVIDER"] as const;

type RequiredVariable = (typeof requiredVariables)[number];

export type AppRuntimeConfig = {
  appUrl: string;
  apiBaseUrl: string;
  aiProvider: string;
};

function getRequiredEnv(name: RequiredVariable, env: NodeJS.ProcessEnv): string {
  const value = env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function validateUrl(value: string, name: string): string {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(`Invalid URL for ${name}: ${value}`);
  }
}

export function loadAppRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env
): AppRuntimeConfig {
  return {
    appUrl: validateUrl(getRequiredEnv("APP_URL", env), "APP_URL"),
    apiBaseUrl: validateUrl(getRequiredEnv("API_BASE_URL", env), "API_BASE_URL"),
    aiProvider: getRequiredEnv("AI_PROVIDER", env)
  };
}
