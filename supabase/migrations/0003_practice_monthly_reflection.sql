-- The Deliberate Practice module's monthly "what changed" reflection
-- (spec: a qualitative check-in in place of an hours-accumulated counter,
-- so the UI doesn't reinforce the 10,000-hour myth). Not covered by 0001.

create table public.practice_monthly_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.practice_skill(id) on delete cascade,
  month_label text not null, -- e.g. '2026-07'
  what_changed text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (skill_id, month_label)
);

alter table public.practice_monthly_reflections enable row level security;

create policy "own rows" on public.practice_monthly_reflections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_updated_at before update on public.practice_monthly_reflections
  for each row execute function public.set_updated_at();
