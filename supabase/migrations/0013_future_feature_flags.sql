-- =========================================================
-- Prompt 2 §10: feature flags only for the seven future features.
-- No new tables, pages, routes or nav links — each flag is the
-- entire deliverable for this round, unblocking a future build
-- without any current cost. Every flag defaults to disabled and is
-- editable from the existing "custom settings" admin section.
-- =========================================================

insert into public.settings (key, value, value_ar, value_en, value_ru) values
  ('feature_grants_directory_enabled', 'false', null, null, null),
  ('feature_university_comparison_enabled', 'false', null, null, null),
  ('feature_cost_calculator_enabled', 'false', null, null, null),
  ('feature_appointment_booking_enabled', 'false', null, null, null),
  ('feature_student_portal_enabled', 'false', null, null, null),
  ('feature_parent_center_enabled', 'false', null, null, null),
  ('feature_forms_library_enabled', 'false', null, null, null)
on conflict (key) do nothing;
