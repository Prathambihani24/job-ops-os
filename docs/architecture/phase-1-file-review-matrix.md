# Phase 1 File Review Matrix

## Root files

| File | Decision | Why |
| --- | --- | --- |
| `.gitignore` | Modify | Needs Next.js and Vercel ignores for the new free-first web architecture. |
| `.env.example` | Modify | Must make free-core values primary and premium integrations optional. |
| `package.json` | Modify | Must reflect the multi-package structure instead of only `apps/*`. |
| `docker-compose.yml` | Modify | Must point to the API Dockerfile in its app-specific location. |
| `README.md` | Modify | Must describe the new portfolio architecture and plugin model. |
| `Dockerfile` | Move | Belongs under `apps/api/` once app responsibilities are separated. |

## Application files

| File | Decision | Why |
| --- | --- | --- |
| `apps/api/src/server.js` | Keep | Useful as the current Phase 1 contract prototype. |
| `apps/api/src/config/env.js` | Keep | Still a valid config entry point for the prototype API. |
| `apps/api/src/lib/logger.js` | Keep | Structured logging remains aligned with the new architecture. |
| `apps/api/src/lib/response.js` | Keep | HTTP response helpers are still valid prototype support code. |
| `apps/api/src/lib/router.js` | Keep | Lightweight routing is acceptable for the Phase 1 prototype. |
| `apps/api/src/data/mock-companies.js` | Modify later | It should move behind shared fixtures or providers in Phase 2, but can remain during the architecture refactor. |
| `apps/api/src/services/opportunity-scoring.js` | Keep | The scoring logic belongs in reusable domain code later, but the behavior remains useful. |
| `apps/api/test/health.test.js` | Keep | The contract prototype still needs verification. |

## Documentation files

| File | Decision | Why |
| --- | --- | --- |
| `docs/architecture/phase-1-foundation.md` | Rename | The new architecture is a refactor, not the old foundation story. |
| `docs/architecture/diagrams.md` | Modify | Must show the free-core and plugin boundaries. |
| `docs/api/openapi.yaml` | Keep | Still useful as the internal contract baseline. |
| `docs/runbooks/setup-guide.md` | Modify | Must show the free-tool path first. |
| `docs/runbooks/troubleshooting.md` | Modify | Must distinguish free-core failures from optional plugin failures. |

## Workflow and data files

| File | Decision | Why |
| --- | --- | --- |
| `n8n/README.md` | Move | Workflow materials belong under `workflows/`. |
| `supabase/migrations/20260702193000_initial_schema.sql` | Move | Database assets belong under `database/`. |

## Automation files

| File | Decision | Why |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Keep | CI still matches the current runnable Phase 1 scope. |
| `scripts/check-env.mjs` | Keep | Environment validation remains useful during the transition. |
