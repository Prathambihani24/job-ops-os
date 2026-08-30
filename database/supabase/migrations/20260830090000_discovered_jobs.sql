create table if not exists discovered_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_job_id text not null,
  title text not null,
  company text not null,
  location text,
  description text not null default '',
  job_url text,
  fit_score integer not null default 0 check (fit_score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_job_id)
);

create index if not exists idx_discovered_jobs_fit_score on discovered_jobs(fit_score desc);
create index if not exists idx_discovered_jobs_discovered_at on discovered_jobs(discovered_at desc);

alter table discovered_jobs enable row level security;
