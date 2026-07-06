# Milestone 2: Monorepo Foundation

## Overview

This milestone turns the project from an architecture refactor into a real product foundation. The goal is not to build every feature yet. The goal is to create boundaries that make future features easy to add without turning the repo into a one-off job tracker.

## What was added

- npm workspaces-based monorepo setup
- TypeScript base configuration
- Next.js dashboard app scaffold in `apps/web`
- shared UI-facing sample data in `packages/shared-domain`
- reusable TypeScript contracts in `packages/types`
- provider interfaces and a free-first manual adapter in `packages/providers`
- initial runtime config loader in `packages/config`
- first PostgreSQL schema draft and seed data
- first workflow runbook for daily pipeline summaries

## Why these choices

### Why start with workspaces

Because this project needs to support both apps and reusable packages. Keeping types, provider contracts, and dashboard data in separate packages forces cleaner architecture early.

### Why a dashboard shell before full CRUD

Because GTM systems are judged by how clearly they support action. A dashboard shell lets you shape the operator experience and define the most important metrics before spending time on forms and tables.

### Why provider interfaces now

Because provider lock-in is one of the easiest ways to accidentally build a brittle GTM system. Defining interfaces early makes optional providers realistic instead of aspirational.

## Trade-offs

- The web app scaffold is created before dependency installation, so this milestone improves structure and code quality more than immediate runtime completeness.
- The SQL schema is intentionally narrow. It covers the core job-search pipeline first rather than prematurely modeling every future GTM use case.
- The dashboard uses sample data today. Real Supabase queries will arrive in the next milestone.

## Suggested next milestone

Milestone 3 should connect the dashboard and API to Supabase with:

- migrations and local database bootstrap
- repository layer for companies, contacts, and opportunities
- a typed API contract between frontend and backend
- one end-to-end workflow from source to dashboard

## Portfolio value

### GTM skill demonstrated

You are showing that you understand pipeline visibility, prioritization, workflow automation, and operator experience instead of only frontend implementation.

### Engineering skill demonstrated

You are showing that you can design modular systems, define interfaces, separate concerns, and make architecture choices that anticipate changing business workflows.

### How to explain it in interviews

“I designed the system so job search was the first use case, but not the last. The architecture isolates apps, provider adapters, domain models, and workflows so the same foundation can power other GTM motions like sales or partnerships.”
