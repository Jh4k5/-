-- =========================================================
-- A displayed world ranking must cite a source name, a year,
-- and optionally a link — otherwise it must not be shown.
-- Purely additive: three new nullable columns, no drops.
-- =========================================================

alter table public.universities
  add column if not exists world_rank_source text,
  add column if not exists world_rank_year int,
  add column if not exists world_rank_link text;
