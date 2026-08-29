-- The owner is making "Bridge to China Edu" / "جسر الصين التعليمية" the
-- PRIMARY brand (approved despite an existing unrelated business using a
-- near-identical name), not just an alternate. The dictionary siteName
-- change (code-level) drives the header/footer/JSON-LD name; this migration
-- flips the one FAQ answer that explicitly names the brand, so the old name
-- is now framed as "previously known as" rather than the current one.
update public.faqs set
  answer_ar = 'نحن «جسر الصين التعليمية» (Bridge to China Edu) — مكتب استشارات متخصص حصرياً في المنح الدراسية والقبول الجامعي في الصين، عُرف سابقاً باسم «جسر إلى الصين» (يُكتب أحياناً Jisr to China). نرافقك من أول استشارة مجانية حتى استقبالك في مطار مدينتك الجامعية.',
  answer_en = 'We are "Bridge to China Edu" (جسر الصين التعليمية) — a consultancy focused exclusively on scholarships and university admission in China, previously known as "Bridge to China" (also written Jisr to China). We walk with you from your first free consultation to being met at the airport of your university city.',
  answer_ru = 'Мы — «Bridge to China Edu» (جسر الصين التعليمية) — консалтинговое агентство, специализирующееся исключительно на стипендиях и поступлении в вузы Китая, ранее известное как «Bridge to China» (также пишется Jisr to China). Мы сопровождаем вас от первой бесплатной консультации до встречи в аэропорту вашего университетского города.',
  updated_at = now()
where question_en = 'Who are we, and what is the platform called?';
