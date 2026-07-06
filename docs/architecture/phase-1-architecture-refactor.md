# Phase 1 Architecture Refactor

## Why this refactor exists

The original Phase 1 foundation assumed a more enterprise-oriented path with paid-provider expectations. That direction does not match the actual goal of this project, which is to serve as a recruiter-friendly GTM engineering portfolio that works at zero cost for the core workflow.

This refactor resets the architecture around four principles:

- the free path must be the default path
- premium providers must be optional plugins
- the repository must demonstrate clean software boundaries
- the system must stay easy to explain in a GitHub walkthrough

## Updated architecture

The target architecture now separates concerns like this:

- `apps/web` will become the main Next.js portfolio and demo application
- `apps/api` remains a lightweight Phase 1 contract prototype until Next.js route handlers and shared packages replace it
- `packages/` will hold reusable business logic and provider interfaces
- `database/` owns the Supabase schema and migrations
- `workflows/` owns n8n assets and automation notes
- `prompts/` and `agents/` are reserved for future AI workflow assets

## Free core versus optional plugins

### Free core

The project must remain functional with:

- Next.js
- Supabase Free
- n8n self-hosted
- Ollama
- HubSpot Free
- Slack Free
- CSV import
- manual entry
- Google Sheets

### Optional plugins

The following providers are now treated as optional adapters:

- Apollo
- Clay
- LinkedIn
- Gmail
- Google Calendar
- OpenAI
- Claude
- Notion

## Provider abstraction direction

Direct vendor coupling is no longer acceptable for the long-term architecture. Future implementation should prefer interfaces such as:

- `LeadProvider`
- `CompanyResearchProvider`
- `MessageGenerationProvider`
- `ResumeSourceProvider`
- `CRMProvider`
- `NotificationProvider`

This allows a free provider and a premium provider to coexist behind the same contract.

## Repository structure after refactor

```text
.
|-- agents/
|   `-- README.md
|-- apps/
|   |-- api/
|   |   |-- Dockerfile
|   |   |-- src/
|   |   `-- test/
|   `-- web/
|       `-- README.md
|-- database/
|   |-- README.md
|   `-- supabase/
|       `-- migrations/
|-- docs/
|   |-- api/
|   |   `-- openapi.yaml
|   |-- architecture/
|   |   |-- diagrams.md
|   |   |-- phase-1-architecture-refactor.md
|   |   `-- phase-1-file-review-matrix.md
|   `-- runbooks/
|       |-- setup-guide.md
|       `-- troubleshooting.md
|-- packages/
|   |-- providers/
|   |   `-- README.md
|   `-- shared-domain/
|       `-- README.md
|-- prompts/
|   `-- README.md
|-- shared/
|   `-- README.md
|-- workflows/
|   |-- README.md
|   `-- n8n/
|       `-- README.md
|-- .env.example
|-- .github/workflows/ci.yml
|-- .gitignore
|-- docker-compose.yml
|-- package.json
|-- README.md
`-- scripts/
    `-- check-env.mjs
```

## Architectural decisions

### Keep

- the current API prototype, because it already demonstrates request boundaries and testing discipline
- the Supabase schema draft, because it captures the core GTM entities well enough to evolve from
- the OpenAPI file, because it documents the first internal contract

### Modify

- root documentation, because it currently describes a paid-service-biased architecture
- environment setup, because it treats optional providers as mandatory
- folder structure, because `supabase/` and `n8n/` were too isolated from the desired top-level taxonomy

### Move

- Supabase artifacts into `database/`
- workflow artifacts into `workflows/`
- the API Dockerfile into `apps/api/`

### Delete or deprecate

- documents that present Apollo or Clay as if they are required
- stale architecture language that frames the project as a startup SaaS rather than a portfolio system

## Constraints before Phase 2

- no Phase 2 code should assume Apollo exists
- no research flow should assume Clay exists
- all AI capabilities must default to Ollama first
- the Next.js frontend becomes the primary product surface
- the repository structure must stay aligned with the documented boundaries above
