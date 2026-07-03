# AI-Powered GTM Operating System

This repository is a free-first GTM engineering portfolio project designed to help you become employable for GTM Engineer, GTM Associate, and AI operations roles at modern startups.

The product vision is an AI-powered GTM operating system that starts with your job search and expands into reusable workflows for sales, recruiting, partnerships, community growth, investor CRM, and founder outreach.

## Current milestone

The repo now includes:

- a Next.js dashboard shell in `apps/web`
- a lightweight API prototype in `apps/api`
- reusable workspace packages for config, shared domain data, types, and provider interfaces
- a first PostgreSQL schema draft and seed data
- a resume tailoring and application-launch workflow
- live dashboard reading from Supabase when credentials are available
- an initial n8n workflow runbook

## Why this architecture

- `apps/` holds deployable surfaces
- `packages/` holds reusable domain logic and interfaces
- `database/` holds schema and seed assets
- `workflows/` holds automation runbooks and future n8n exports
- `docs/` explains architecture, setup, and roadmap decisions

This separation matters because GTM systems change providers often. Swapping Slack for Discord or HubSpot for Salesforce should not require rewriting the whole application.

## Quick start

```bash
cp .env.example .env
node ./scripts/check-env.mjs
npm run test --workspace @gtm-os/config
node --test ./apps/api/test/**/*.test.js
npm run build:web
```

## Local development

```bash
npm run dev:api
npm run dev:web
```

## Learning value

This repo is intentionally designed to demonstrate:

- provider abstraction and clean architecture
- workflow-driven product design
- AI-assisted GTM thinking
- startup-oriented prioritization
- technical communication and documentation discipline

## Key documents

- [Architecture Refactor](/Users/pratham/Documents/Codex/2026-07-03/computer-plugin-computer-use-openai-bundled-3/docs/architecture/phase-1-architecture-refactor.md)
- [Architecture Diagrams](/Users/pratham/Documents/Codex/2026-07-03/computer-plugin-computer-use-openai-bundled-3/docs/architecture/diagrams.md)
- [Milestone 2 Foundation](/Users/pratham/Documents/Codex/2026-07-03/computer-plugin-computer-use-openai-bundled-3/docs/roadmap/milestone-2-foundation.md)
- [Milestone 3 Application Automation](/Users/pratham/Documents/Codex/2026-07-03/computer-plugin-computer-use-openai-bundled-3/docs/roadmap/milestone-3-application-automation.md)
- [Setup Guide](/Users/pratham/Documents/Codex/2026-07-03/computer-plugin-computer-use-openai-bundled-3/docs/runbooks/setup-guide.md)
