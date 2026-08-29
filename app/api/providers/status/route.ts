import { loadConfig } from "../../../../apps/api/src/config/env.js";

export const runtime = "nodejs";

export async function GET() {
  const config = loadConfig();
  return Response.json({
    ai: { provider: config.aiProvider, model: config.aiModel, configured: Boolean(config.aiApiKey || config.aiProvider === "ollama") },
    sources: {
      greenhouse: { configured: config.greenhouseBoardTokens.length > 0, boards: config.greenhouseBoardTokens.length },
      lever: { configured: config.leverSiteNames.length > 0, sites: config.leverSiteNames.length },
      ashby: { configured: config.ashbyJobBoards.length > 0, boards: config.ashbyJobBoards.length },
      adzuna: { configured: Boolean(config.adzunaAppId && config.adzunaAppKey) }
    },
    enrichment: {
      apollo: Boolean(config.apolloApiKey),
      clay: Boolean(config.clayApiKey)
    },
    background: { cronConfigured: Boolean(config.cronSecret), schedule: "0 */6 * * *" }
  });
}
