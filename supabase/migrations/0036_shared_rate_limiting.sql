-- 0036_shared_rate_limiting.sql
--
-- Distributed rate limiting (Phase 3 backlog): the previous limiter was
-- per-process, so on serverless every new instance started with a clean
-- counter — an attacker rotating instances (or just lucky request routing)
-- bypassed the cap entirely.
--
-- This migration backs the SAME limits with a shared store inside the
-- project's existing Supabase database (free tier, no new infrastructure):
--
--   /api/leads : 5 submissions per IP per 10 minutes
--   /api/track : 60 events per IP per minute
--
-- Design:
--   • Fixed windows keyed by (bucket, window_id) — one atomic
--     INSERT … ON CONFLICT DO UPDATE per request, no read-modify-write.
--   • SECURITY DEFINER RPC `consume_rate_limit(p_bucket, p_limit,
--     p_window_seconds)` returns true when the caller is OVER the limit.
--   • Inputs are validated (bucket pattern, limit and window bounds) and
--     stale rows are pruned probabilistically (~1% of calls) so the table
--     stays tiny; a hard row cap bounds the worst case.
--   • The table itself is not exposed to any role (RLS denied + privileges
--     revoked) — writes happen only through the RPC.
--
-- The application calls the RPC via the anon key and FAILS OPEN when it is
-- missing, slow (2.5 s timeout) or erroring: the per-instance limiter still
-- guards each instance, and form availability beats strictness.
--
-- Idempotent: safe to re-run. No row data is changed.
-- Apply with: supabase db push (or paste into the SQL editor).

create table if not exists public.rate_limit_hits (
  bucket text not null,
  window_id bigint not null,
  hits int not null default 0,
  touched_at timestamptz not null default now(),
  primary key (bucket, window_id)
);

-- Nothing readable/writable directly by any client role.
alter table public.rate_limit_hits enable row level security;
revoke all on public.rate_limit_hits from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_bucket text,
  p_limit int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window bigint;
  v_hits int;
  v_total bigint;
begin
  -- Validate the caller's parameters. Anything unexpected fails CLOSED
  -- (returns true = limited): legitimate traffic always matches.
  if p_bucket is null or p_bucket !~ '^(leads|track):[A-Za-z0-9.:]{1,64}$' then
    return true;
  end if;
  if p_limit is null or p_limit < 1 or p_limit > 1000 then
    return true;
  end if;
  if p_window_seconds is null or p_window_seconds < 10 or p_window_seconds > 3600 then
    return true;
  end if;

  -- Hard cap: if the table somehow grew beyond 50k rows, stop counting
  -- (bounded storage beats unbounded growth).
  select count(*) into v_total from public.rate_limit_hits;
  if v_total > 50000 then
    delete from public.rate_limit_hits;
  end if;

  v_window := floor(extract(epoch from now()) / p_window_seconds)::bigint;

  insert into public.rate_limit_hits (bucket, window_id, hits, touched_at)
  values (p_bucket, v_window, 1, now())
  on conflict (bucket, window_id)
  do update set hits = public.rate_limit_hits.hits + 1, touched_at = now();

  select hits into v_hits
    from public.rate_limit_hits
   where bucket = p_bucket and window_id = v_window;

  -- Opportunistic pruning: keep the table tiny without a cron job.
  if random() < 0.01 then
    delete from public.rate_limit_hits where window_id < v_window - 4;
  end if;

  return v_hits > p_limit;
end;
$$;

revoke execute on function public.consume_rate_limit(text, int, int) from public;
grant execute on function public.consume_rate_limit(text, int, int) to anon, authenticated, service_role;
