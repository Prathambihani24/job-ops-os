# Setup Guide

## Why these steps matter

The refactored project is designed to be demonstrable with free tools first. The setup is split by layer so the portfolio can run locally without paid providers and gain optional capabilities later through plugins.

## Software

Install:

- Node.js `24.18.0` or newer
- Docker Desktop
- Supabase CLI
- Ollama

## Required free accounts

Create free accounts for:

- Supabase
- HubSpot
- Slack
- GitHub
- Vercel

## Optional accounts and credentials

Only add these if you want the optional integrations:

- OpenAI
- Anthropic
- Apollo
- Clay
- Notion
- Gmail
- Google Calendar

## Local startup

1. Copy `.env.example` to `.env`.
2. Fill in the free-tool credentials first.
3. Leave premium plugin credentials empty if you do not use them.
4. Validate the environment with `node ./scripts/check-env.mjs`.
5. Run the current Phase 1 tests with `node --test ./apps/api/test/**/*.test.js`.

## Docker

Why Docker is used:

- it creates a stable runtime for the API
- it gives `n8n` a self-hosted local home
- it keeps the portfolio easy to demo on another machine

## Deployment direction

The planned free deployment split is:

- `Vercel Free` for the Next.js frontend
- `Supabase Free` for the database
- local or self-hosted `n8n` for workflow demos
- optional Docker usage for the current API prototype and workflow tooling
