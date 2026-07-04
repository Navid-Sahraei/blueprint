-- Method-fidelity columns:
-- deep_work_sessions.start_time — Newport's method blocks specific hours,
--   not just days; optional so quick logging still works.
-- practice_sessions.next_focus — closes Ericsson's loop (goal → attempt →
--   feedback → adjustment): what the next session will work on.
alter table public.deep_work_sessions add column start_time time;
alter table public.practice_sessions add column next_focus text;
