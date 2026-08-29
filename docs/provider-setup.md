# Provider and background setup

All secrets belong in `.env.local` for local development or in the deployment provider's encrypted environment-variable store. Never add real keys to `.env.example`, source files, browser code, or the dashboard response.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set a random `CRON_SECRET`.
3. Install Ollama, then download a free local model:

~~~bash
ollama pull qwen3:8b
~~~

4. Configure the local model:

~~~dotenv
AI_PROVIDER=ollama
AI_API_KEY=
AI_BASE_URL=http://127.0.0.1:11434/v1
AI_MODEL=qwen3:8b
~~~

Ollama runs the model locally, so no AI API key is required and resume/job data stays on your machine. For a lighter laptop model, use `ollama pull gemma3:4b` and set `AI_MODEL=gemma3:4b`. To use a hosted OpenAI-compatible OSS provider later, set `AI_PROVIDER=openai-compatible`, `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL`.

## Job sources

Board/site identifiers are comma-separated:

~~~dotenv
GREENHOUSE_BOARD_TOKENS=company-one,company-two
LEVER_SITE_NAMES=company-one,company-two
ASHBY_JOB_BOARDS=company-one,company-two
ADZUNA_APP_ID=your-app-id
ADZUNA_APP_KEY=your-app-key
ADZUNA_COUNTRY=in
ADZUNA_QUERY=marketing OR growth OR GTM OR social media
~~~

Greenhouse, Lever, and Ashby public job-posting endpoints may not require a key for GET requests; the key fields are reserved for account-specific or partner integrations. Only use source access that is authorized for your account and use case.

## Enrichment and notifications

~~~dotenv
APOLLO_API_KEY=your-apollo-key
CLAY_API_KEY=your-clay-key
SLACK_BOT_TOKEN=your-slack-token
SLACK_DEFAULT_CHANNEL_ID=your-channel-id
~~~

Email and SMS providers should be added server-side with explicit consent, suppression, and human approval controls before sending.

## Background execution

The application exposes `GET /api/cron/job-sync`, protected by:

~~~http
Authorization: Bearer $CRON_SECRET
~~~

The deployment schedule is `0 */6 * * *` in UTC. On Vercel, cron jobs run on production deployments; use a plan that supports a six-hour interval. For a non-Vercel deployment, invoke the same endpoint from EventBridge, Cloud Scheduler, or Kubernetes CronJob with the Authorization header.

The endpoint fans out to configured job sources, deduplicates results, ranks them, and uses the configured AI API when available. Failed sources are logged and do not abort successful sources. Do not expose the endpoint publicly without the CRON_SECRET.

## Configuration status

`GET /api/providers/status` returns provider names and configured booleans/counts only. It never returns key values.
