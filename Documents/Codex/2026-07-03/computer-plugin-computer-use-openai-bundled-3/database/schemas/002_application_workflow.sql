create table if not exists resume_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_name text not null,
  owner_name text not null,
  source_markdown text not null,
  skills jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  job_title text not null,
  job_url text,
  source_provider text not null default 'manual',
  contact_name text,
  contact_role text,
  contact_email text,
  status text not null default 'draft',
  applied_at timestamptz,
  outcome text,
  outcome_summary text,
  next_step text,
  resume_profile_id uuid references resume_profiles(id) on delete set null,
  tailored_resume_markdown text,
  outreach_subject text,
  outreach_body text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists job_applications_status_idx on job_applications (status);
create index if not exists job_applications_company_name_idx on job_applications (company_name);
create index if not exists job_applications_applied_at_idx on job_applications (applied_at desc);
