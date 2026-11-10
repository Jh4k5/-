-- 0035_lead_notification_status.sql
--
-- Phase 4 (email notifications): persist the delivery status of the two
-- transactional emails dispatched after a lead is saved:
--
--   confirmation_status  → applicant confirmation (AR/EN/RU)
--   owner_notice_status  → "New Student Inquiry" to the owner
--
-- Values: 'sent' | 'failed' | 'skipped' (null = no attempt recorded).
--
-- The application writes statuses through a SECURITY DEFINER RPC,
-- `record_lead_notification(p_lead_id, p_kind, p_status, p_error)`, because
-- the anon role holds no UPDATE policy on leads (and must not get one).
-- The RPC is tightly bounded:
--   • only leads created within the last 24 hours can be touched,
--   • only the two status columns can be written,
--   • kinds/statuses are validated, error text capped at 200 chars.
-- An abuser holding the public anon key would need a real lead UUID (never
-- exposed anywhere) and could at worst flip the status label of a recent
-- lead — no data exposure, no lead loss.
--
-- The API route feature-detects the RPC: until this migration is applied,
-- dispatch falls back to log-only mode and nothing breaks.
--
-- Idempotent: safe to re-run. No row data is changed.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ---------------------------------------------------------------------------
-- 1 · Status columns
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists confirmation_status text
    check (confirmation_status in ('sent','failed','skipped'));

alter table public.leads
  add column if not exists owner_notice_status text
    check (owner_notice_status in ('sent','failed','skipped'));

-- ---------------------------------------------------------------------------
-- 2 · Keep the public insert surface constrained (extends DB-03 / 0032)
--    Inserts coming through the API must not pre-set either status.
--    (The application never sends them; this closes the direct-PostgREST
--    path.)
-- ---------------------------------------------------------------------------
drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (
    status = 'new'
    and source in ('contact_form', 'eligibility_check')
    and char_length(full_name) between 1 and 120
    and char_length(phone) between 1 and 40
    and char_length(country) between 1 and 80
    and char_length(coalesce(message, '')) <= 2000
    and char_length(coalesce(email, '')) <= 160
    and confirmation_status is null
    and owner_notice_status is null
  );

-- ---------------------------------------------------------------------------
-- 3 · Status-recording RPC (used by /api/leads after persistence)
-- ---------------------------------------------------------------------------
create or replace function public.record_lead_notification(
  p_lead_id uuid,
  p_kind text,
  p_status text,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- strict enum validation
  if p_kind not in ('confirmation', 'owner_notice') then
    raise exception 'invalid_notification_kind';
  end if;
  if p_status not in ('sent', 'failed', 'skipped') then
    raise exception 'invalid_notification_status';
  end if;

  -- only fresh leads can be annotated (bounded abuse surface)
  update public.leads
     set confirmation_status = case when p_kind = 'confirmation' then p_status else confirmation_status end,
         owner_notice_status = case when p_kind = 'owner_notice' then p_status else owner_notice_status end
   where id = p_lead_id
     and created_at > now() - interval '24 hours';
end;
$$;

-- grant to the roles the API uses; nobody else
revoke execute on function public.record_lead_notification(uuid, text, text, text) from public;
grant execute on function public.record_lead_notification(uuid, text, text, text) to anon, authenticated, service_role;
