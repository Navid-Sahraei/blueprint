-- Blueprint — initial schema.
-- Every table: user_id → auth.users, created_at/updated_at, RLS owner-only.

create extension if not exists "pgcrypto";

-- Shared trigger to maintain updated_at.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Platform tables
-- ---------------------------------------------------------------------------

create table public.user_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_key text not null check (module_key in (
    'values-compass','odyssey-plan','annual-okrs','misogi','adventure-ledger',
    'deep-work','woop','habit-foundry','deliberate-practice','annual-review',
    'gratitude'
  )),
  is_active boolean not null default true,
  activated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, module_key)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'free' check (plan in ('free','pro_monthly','pro_annual')),
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Layer 1 — Direction
-- ---------------------------------------------------------------------------

create table public.values (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  value_name text not null,
  rank int not null,
  personal_definition text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.life_design_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_label text not null,
  plan_text jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.objectives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quarter text not null, -- e.g. '2026-Q3'
  objective_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.key_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  objective_id uuid not null references public.objectives(id) on delete cascade,
  kr_text text not null,
  target_value numeric,
  current_value numeric default 0,
  unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Layer 2 — Big Moves
-- ---------------------------------------------------------------------------

create table public.misogi_candidates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text,
  fear_score int check (fear_score between 1 and 10),
  pull_score int check (pull_score between 1 and 10),
  fifty_percent_check boolean,
  status text not null default 'candidate'
    check (status in ('candidate','selected','training','done','failed_worth_it','dropped')),
  event_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.misogi_training_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  misogi_id uuid not null references public.misogi_candidates(id) on delete cascade,
  session_date date not null,
  type text,
  effort_score int check (effort_score between 1 and 10),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.misogi_debrief (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  misogi_id uuid not null references public.misogi_candidates(id) on delete cascade,
  outcome text check (outcome in ('completed','failed_worth_it','abandoned')),
  what_happened text,
  what_it_changed text,
  next_year_seed text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (misogi_id)
);

create table public.adventures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'idea'
    check (status in ('idea','scheduled','booked','done')),
  target_date date,
  type text check (type in ('nature','skill','place','people','solo')),
  budget numeric,
  companions text,
  best_moment text,
  biggest_surprise text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Layer 3 — Execution
-- ---------------------------------------------------------------------------

create table public.deep_work_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  planned_duration int, -- minutes
  actual_duration int,
  task_description text,
  focus_rating int check (focus_rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.woop_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  linked_key_result_id uuid references public.key_results(id) on delete set null,
  wish text not null,
  outcome text not null,
  obstacle text not null,
  if_then_plan text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Layer 4 — Growth & Mastery
-- ---------------------------------------------------------------------------

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  status text not null default 'backlog'
    check (status in ('backlog','installing','automatic','dropped')),
  quarter text, -- e.g. '2026-Q3'
  start_date date,
  tiny_version text,
  anchor text,
  implementation_intention text,
  identity_line text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habit_weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  week_of date not null,
  days_completed int check (days_completed between 0 and 7),
  friction_note text,
  adjustment_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (habit_id, week_of)
);

create table public.practice_skill (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_name text not null,
  start_date date,
  feedback_source_description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.practice_skill(id) on delete cascade,
  date date not null,
  duration_minutes int,
  sub_skill_focus text,
  feedback_notes text,
  difficulty_rating int check (difficulty_rating between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Layer 5 — Learning Loop
-- ---------------------------------------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_type text not null check (period_type in ('quarterly','annual')),
  period_label text not null, -- e.g. '2026-Q3' or '2026'
  summary_snapshot jsonb not null default '{}'::jsonb,
  reflection_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, period_type, period_label)
);

create table public.gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_of date not null,
  entry_1 text,
  entry_2 text,
  entry_3 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_of)
);

-- ---------------------------------------------------------------------------
-- RLS: owner-only access on every table, plus updated_at triggers.
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'user_modules','subscriptions','values','life_design_plans','objectives',
    'key_results','misogi_candidates','misogi_training_log','misogi_debrief',
    'adventures','deep_work_sessions','woop_entries','habits',
    'habit_weekly_reviews','practice_skill','practice_sessions','reviews',
    'gratitude_entries'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id)', t);
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end;
$$;

-- Subscriptions are written by Stripe webhooks via the service role; users
-- may only read their own row. Replace the permissive policy for writes.
drop policy "own rows" on public.subscriptions;
create policy "read own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);
