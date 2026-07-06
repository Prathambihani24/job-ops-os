create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  stage text not null default 'unknown',
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  full_name text not null,
  role_title text not null,
  email text,
  linkedin_url text,
  created_at timestamptz not null default now()
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  contact_id uuid references contacts(id) on delete set null,
  source text not null,
  stage text not null,
  status text not null default 'active',
  priority_score integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_score_idx on companies (score desc);
create index if not exists contacts_company_id_idx on contacts (company_id);
create index if not exists opportunities_company_id_idx on opportunities (company_id);
create index if not exists opportunities_stage_idx on opportunities (stage);
