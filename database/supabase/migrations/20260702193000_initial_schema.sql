create extension if not exists pgcrypto;

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  linkedin_url text,
  company_stage text not null default 'unknown',
  employee_count integer,
  headquarters text,
  annual_revenue_band text,
  source_provider text not null default 'apollo',
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  full_name text not null,
  first_name text,
  last_name text,
  title text,
  email text,
  linkedin_url text,
  person_role text not null default 'unknown',
  source_provider text not null default 'apollo',
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  external_job_id text,
  title text not null,
  location text,
  employment_type text,
  status text not null default 'open',
  posted_at timestamptz,
  job_url text,
  source_provider text not null default 'apollo',
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists news_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  headline text not null,
  summary text,
  source_name text,
  source_url text,
  published_at timestamptz,
  sentiment text,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  signal_type text not null,
  signal_value text not null,
  confidence_score numeric(5,2) not null default 0,
  detected_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  source_provider text not null default 'clay',
  source_payload jsonb not null default '{}'::jsonb
);

create table if not exists research_artifacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  artifact_type text not null,
  title text not null,
  body_markdown text not null,
  notion_page_id text,
  generated_by_model text,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  primary_contact_id uuid references people(id) on delete set null,
  stage text not null default 'discovered',
  fit_score integer,
  priority_score integer,
  recommendation text,
  scoring_breakdown jsonb not null default '{}'::jsonb,
  owner_email text,
  hubspot_deal_id text,
  opened_at timestamptz not null default now(),
  last_activity_at timestamptz,
  closed_at timestamptz,
  close_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  channel text not null,
  subject text,
  body_text text not null,
  personalization_notes text,
  generated_by_model text,
  status text not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  person_id uuid references people(id) on delete set null,
  message_id uuid references messages(id) on delete set null,
  interaction_type text not null,
  direction text not null,
  occurred_at timestamptz not null default now(),
  outcome text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  external_run_id text,
  trigger_source text not null,
  status text not null default 'queued',
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists event_log (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id uuid,
  event_name text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_people_company_id on people(company_id);
create index if not exists idx_jobs_company_id on jobs(company_id);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_news_items_company_id on news_items(company_id);
create index if not exists idx_signals_company_id on signals(company_id);
create index if not exists idx_signals_active on signals(company_id, is_active) where is_active = true;
create index if not exists idx_opportunities_company_id on opportunities(company_id);
create index if not exists idx_opportunities_stage on opportunities(stage);
create index if not exists idx_messages_opportunity_id on messages(opportunity_id);
create index if not exists idx_interactions_opportunity_id on interactions(opportunity_id);
create index if not exists idx_workflow_runs_status on workflow_runs(status);
create index if not exists idx_event_log_aggregate on event_log(aggregate_type, aggregate_id);
