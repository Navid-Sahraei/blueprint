-- The product spec's Adventure Ledger debrief captures a keepsake
-- alongside best_moment/biggest_surprise; 0001 omitted the column.
alter table public.adventures add column keepsake text;
