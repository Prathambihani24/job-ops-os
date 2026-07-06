# AI-Powered GTM Operating System

A portfolio-ready command center for pipeline visibility, AI research, outreach drafting, and repeatable GTM workflows.

## Project Structure

- apps/api/ → Lightweight API server
- apps/web/ → Next.js dashboard frontend
- packages/ → Reusable domain logic and types
- database/ → PostgreSQL schema (Supabase)
- workflows/ → n8n automation runbooks
- docs/ → Architecture docs and setup guides

## Quick Start

npm install
cp .env.example .env
npm run dev:api
npm run dev

## Documentation

- [Architecture](docs/architecture/phase-1-architecture-refactor.md)
- [Setup Guide](docs/runbooks/setup-guide.md)
- [API Spec](docs/api/openapi.yaml)

## Tech Stack

Next.js 15, TypeScript, PostgreSQL, Supabase, n8n

## Live Demo

https://job-ops-os.vercel.app

## License

MIT
