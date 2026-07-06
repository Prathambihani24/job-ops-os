# Shared Dashboard UI

This folder is **not** a standalone Next.js app anymore. It used to duplicate the
root `/app` entry point (same dashboard, two copies), which meant every UI change
had to be made twice and it was easy to edit the wrong one.

It now only holds the pieces the root app imports directly:

- `components/dashboard/` — `DashboardShell` and `QuickLaunchPanel`
- `lib/get-dashboard-overview.ts` — server-side data fetching (Supabase -> API -> fallback mock data)

## Where the app actually runs

The real, deployed app lives at the repo root:

- `app/page.tsx`, `app/layout.tsx` — entry point (imports from this folder via relative path)
- `app/api/v1/**` — Next.js route handlers (dashboard overview, resume tailoring, application launch, career plan)

Run it with `npm run dev` from the repo root, not from inside `apps/web`.
