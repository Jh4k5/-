-- 0037_blog_batch_1.sql
--
-- Phase 6 (blog content engine): editorial batch 1 — five researched,
-- trilingual (AR/EN/RU) articles written for the existing `articles`
-- table and the existing blog architecture. No new tables, no parallel
-- content system: after this migration the posts behave exactly like
-- CMS-published articles (editable in /admin/articles, listed on
-- /{locale}/blog, included in sitemap.xml alternates automatically).
--
-- Topics (see docs/EDITORIAL-CONTENT-PLAN.md for the full 25-topic plan):
--   1. chinese-government-scholarship-csc-guide   (tips)
--   2. china-student-visa-x1-x2-guide             (tips)
--   3. english-taught-degrees-china-guide         (universities)
--   4. hsk-levels-guide-study-china               (about_china)
--   5. study-in-china-costs-guide                 (student_life)
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Only official sources linked (campuschina.org, csc.edu.cn,
--     chinesetest.cn, visaforchina.cn, mfa.gov.cn).
--   • Cost figures are clearly framed as indicative ranges, never as
--     exact statistics; readers are directed to verify with universities.
--   • No fabricated testimonials, rankings, or admission promises.
--   • Each version carries localized internal links into the site's
--     conversion paths (services, contact) and cross-links between the
--     batch's articles.
--   • Cover images use the site's built-in brand scenes (scene:*) so no
--     storage upload is required.
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ===========================================================================
-- 1 · Chinese Government Scholarship (CSC) — the complete guide
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'chinese-government-scholarship-csc-guide',
  $$منحة الحكومة الصينية (CSC): الدليل الشامل للتقديم$$,
  $$The Chinese Government Scholarship (CSC): The Complete Application Guide$$,
  $$Стипендия правительства Китая (CSC): полное руководство по подаче заявки$$,
  $$ما هي منحة الحكومة الصينية، وما الذي تغطيه فعلاً، وما مسارات التقديم وشروطه ووثائقه ومواعيده؟ دليل عملي شامل بالعربية مع المصادر الرسمية.$$,
  $$What the Chinese Government Scholarship really covers, the three application routes, eligibility rules, required documents, timelines, and the mistakes that cost students the award — with official sources.$$,
  $$Что на самом деле покрывает стипендия правительства Китая, три способа подачи заявки, условия участия, необходимые документы, сроки и типичные ошибки — с официальными источниками.$$,
  $$<p>تُعدّ منحة الحكومة الصينية (Chinese Government Scholarship) أشهر منحة دراسية في الصين وأكثرها تنافسية. يموّلها مجلس الدولة الصيني وتديرها هيئة المنح الصينية (CSC — China Scholarship Council)، وهي متاحة للطلاب الدوليين من معظم الدول العربية للدراسة بالبكالوريوس أو الماجستير أو الدكتوراه، إضافة إلى برامج اللغة الصينية.</p>
<h2>ما الذي تغطيه المنحة؟</h2>
<p>المنحة الكاملة (Full Scholarship) تشمل عادةً:</p>
<ul>
<li>رسوم الدراسة كاملة خلال سنوات البرنامج.</li>
<li>الإقامة في سكن الجامعة (أو بدل سكن في بعض الجامعات).</li>
<li>مخصص شهري لتكاليف المعيشة يختلف بحسب مرحلة الدراسة.</li>
<li>تأمين طبي شامل طوال فترة الدراسة.</li>
</ul>
<p>أما تذاكر الطيران الدولية فلا تغطيها المنحة في الغالب، ويجب حسابها ضمن ميزانيتك. وتوجد أيضاً منح جزئية عبر بعض المسارات تغطي الرسوم فقط أو بعض البنود.</p>
<h2>مسارات التقديم الثلاثة</h2>
<ol>
<li><strong>عبر السفارة الصينية في بلدك (النوع A):</strong> تقدّم أولاً إلى السفارة أو القنصلية، وهي ترشّح المتقدمين للهيئة. هذا المسار الأشهر للطلاب العرب.</li>
<li><strong>عبر الجامعة الصينية مباشرة (النوع B):</strong> تتقدّم إلى الجامعة نفسها، والجامعة ترشّح المتميزين للمنحة.</li>
<li><strong>عبر اتفاقيات التبادل الحكومية (النوع C):</strong> مسارات خاصة باتفاقيات بين الصين ودول أو مؤسسات محددة.</li>
</ol>
<p><strong>تنبيه مهم:</strong> يُسمح بالتقديم عبر مسار واحد فقط. التقديم عبر مسارين في العام نفسه قد يؤدي إلى استبعادك من المنحة بالكامل.</p>
<h2>شروط الأهلية</h2>
<ul>
<li>أن تكون مواطناً غير صيني وبصحة جيدة.</li>
<li>بكالوريوس: حاصل على شهادة الثانوية وعمرک أقل من 25 سنة عند بدء الدراسة.</li>
<li>ماجستير: حاصل على البكالوريوس وعمرک أقل من 35 سنة.</li>
<li>دكتوراه: حاصل على الماجستير وعمرک أقل من 40 سنة.</li>
<li>ألا تكون حاصلاً في الوقت نفسه على منحة صينية حكومية أخرى.</li>
</ul>
<h2>الوثائق المطلوبة عادةً</h2>
<ul>
<li>جواز سفر ساري المفعول.</li>
<li>استمارة التقديم عبر نظام CSC الإلكتروني.</li>
<li>أعلى شهادة دراسية معتمدة، مع ترجمة موثقة عند الحاجة.</li>
<li>كشوف الدرجات لآخر مرحلة دراسية.</li>
<li>خطة دراسية (Study Plan) — العنصر الأكثر تأثيراً في ملف الماجستير والدكتوراه.</li>
<li>خطابا توصية من أستاذين لطلاب الماجستير والدكتوراه.</li>
<li>إثبات اللغة: شهادة HSK للبرامج المُدرَّسة بالصينية، أو IELTS/TOEFL للبرامج الإنجليزية.</li>
<li>استمارة الفحص الطبي للأجانب (للمرشحين النهائيين).</li>
</ul>
<p>تختلف القائمة الدقيقة بين السفارات والجامعات، لذا اعتمد دائماً على الإعلان الرسمي للسنة التي تتقدّم فيها.</p>
<h2>الجدول الزمني المعتاد</h2>
<p>بالنسبة للالتحاق في سبتمبر، تُعلن معظم الجهات عن فتح التقديم بين ديسمبر ويناير، وتُغلق الأبواب عادةً بين يناير وأبريل حسب الجهة، وتظهر النتائج بين مايو ويوليو، ثم تُرسل خطابات القبول ونموذج JW201 في الصيف. ابدأ التحضير قبل فتح الباب بشهرين على الأقل.</p>
<h2>أخطاء شائعة تُفقد الطلاب المنحة</h2>
<ul>
<li>خطة دراسية عامة ومكرّرة تصلح لأي طالب — لجنة التقييم تلاحظها فوراً.</li>
<li>إهمال توثيق الترجمات أو إرسال صور غير واضحة للوثائق.</li>
<li>التقديم في الأسبوع الأخير ثم تفويت متطلبات تكميلية.</li>
<li>الاعتقاد بأن المنحة تشمل تذكرة الطيران، ثم التخطيط المالي الخاطئ.</li>
</ul>
<h2>المصادر الرسمية</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">بوابة Campus China</a> — الموقع الرسمي لمنح CSC للطلاب الدوليين، وفيه قائمة الجامعات المشاركة سنوياً.</li>
<li><a href="https://www.csc.edu.cn" target="_blank">موقع هيئة المنح الصينية (CSC)</a> — النظام الإلكتروني للتقديم والإعلانات الرسمية.</li>
</ul>
<h2>هل تحتاج مساعدة في ملفك؟</h2>
<p>يترافق التقديم الناجح عادةً مع ملف متكامل: خطة دراسية مقنعة، اختيار واقعي للجامعات، ومتابعة دقيقة للمواعيد. يمكنك طلب <a href="/ar/contact">استشارة مجانية من فريق Bridge to China Edu</a> لمراجعة وضعك الدراسي، أو التعرف على <a href="/ar/services">خدماتنا في القبولات والمنح</a>. وبعد قبولك ستحتاج إلى <a href="/ar/blog/china-student-visa-x1-x2-guide">تأشيرة الطالب X1 — اقرأ دليلنا الكامل لها</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. التفاصيل قد تتغير من سنة لأخرى؛ تحقّق دائماً من المصادر الرسمية و إعلان السفارة أو الجامعة.</em></p>$$,
  $$<p>The Chinese Government Scholarship (CGS) is the best-known and most competitive scholarship for international students in China. It is funded by the Chinese state and administered by the China Scholarship Council (CSC). Students from most countries can apply for bachelor's, master's or PhD programs — as well as Chinese language programs.</p>
<h2>What the scholarship actually covers</h2>
<p>The full scholarship normally includes:</p>
<ul>
<li>Complete tuition coverage for the duration of the program.</li>
<li>On-campus accommodation (or a housing allowance at some universities).</li>
<li>A monthly living stipend that depends on your study level.</li>
<li>Comprehensive medical insurance throughout your studies.</li>
</ul>
<p>International flights are generally <strong>not</strong> covered — budget for them yourself. Partial awards covering only tuition or selected items also exist through some routes.</p>
<h2>The three application routes</h2>
<ol>
<li><strong>Through the Chinese embassy in your country (Type A):</strong> you apply to the embassy or consulate, which nominates candidates to the CSC. This is the most common route.</li>
<li><strong>Directly through a Chinese university (Type B):</strong> you apply to the university, which nominates strong applicants for the scholarship.</li>
<li><strong>Through intergovernmental agreements (Type C):</strong> special channels tied to bilateral agreements between China and specific countries or institutions.</li>
</ol>
<p><strong>Important:</strong> you may apply through only ONE route per year. Applying through two routes simultaneously can disqualify you entirely.</p>
<h2>Eligibility rules</h2>
<ul>
<li>Non-Chinese citizenship and good health.</li>
<li>Bachelor's programs: high-school graduate, under 25 at enrollment.</li>
<li>Master's programs: bachelor's degree holder, under 35.</li>
<li>PhD programs: master's degree holder, under 40.</li>
<li>You must not already hold another Chinese government scholarship at the same time.</li>
</ul>
<h2>Documents usually required</h2>
<ul>
<li>A valid passport.</li>
<li>The CSC online application form.</li>
<li>Your highest diploma, with a notarized translation if needed.</li>
<li>Academic transcripts.</li>
<li>A study plan — the single most influential document for master's and PhD files.</li>
<li>Two recommendation letters for master's and PhD applicants.</li>
<li>Language proof: HSK for Chinese-taught programs, IELTS/TOEFL for English-taught ones.</li>
<li>The Foreigner Physical Examination Form (for finalists).</li>
</ul>
<p>The exact list differs between embassies and universities, so always follow the official notice for the year you are applying in.</p>
<h2>Typical timeline</h2>
<p>For September intake, most routes open applications between December and January, with deadlines roughly between January and April. Results are announced between May and July, and admission letters plus the JW201 form arrive over the summer. Start preparing at least two months before the window opens.</p>
<h2>Common mistakes that cost students the award</h2>
<ul>
<li>A generic, copy-paste study plan — evaluation committees recognize it instantly.</li>
<li>Missing notarized translations or unclear document scans.</li>
<li>Applying in the final week and missing follow-up requirements.</li>
<li>Assuming flights are covered and misjudging the real budget.</li>
</ul>
<h2>Official sources</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">Campus China</a> — the official CSC portal for international students, including the annual list of participating universities.</li>
<li><a href="https://www.csc.edu.cn" target="_blank">China Scholarship Council</a> — the online application system and official announcements.</li>
</ul>
<h2>Need help with your application?</h2>
<p>Winning files usually share three things: a convincing study plan, realistic university choices and careful deadline management. Book a <a href="/en/contact">free consultation with Bridge to China Edu</a> to review your profile, or explore our <a href="/en/services">admission and scholarship services</a>. Once admitted, you will need the X1 visa — read our <a href="/en/blog/china-student-visa-x1-x2-guide">complete student visa guide</a>.</p>
<p><em>Last reviewed: November 2026. Details change from year to year — always confirm with the official sources and your embassy or university.</em></p>$$,
  $$<p>Стипендия правительства Китая (Chinese Government Scholarship, CGS) — самая известная и самая конкурентная стипендия для иностранных студентов в Китае. Её финансирует государство, а администрирует Китайский совет по стипендиям (CSC). Студенты из большинства стран могут претендовать на бакалавриат, магистратуру, докторантуру, а также на языковые программы.</p>
<h2>Что реально покрывает стипендия</h2>
<p>Полная стипендия обычно включает:</p>
<ul>
<li>Полное покрытие обучения на весь срок программы.</li>
<li>Проживание в общежитии университета (или денежную компенсацию в ряде вузов).</li>
<li>Ежемесячную стипендию на проживание, размер зависит от уровня обучения.</li>
<li>Комплексную медицинскую страховку на весь период учёбы.</li>
</ul>
<p>Международные авиабилеты, как правило, <strong>не</strong> покрываются — заложите их в бюджет отдельно. Через некоторые каналы существуют и частичные стипендии, покрывающие только обучение или отдельные статьи расходов.</p>
<h2>Три способа подачи заявки</h2>
<ol>
<li><strong>Через посольство КНР в вашей стране (тип A):</strong> вы подаёте документы в посольство или консульство, которое номинирует кандидатов в CSC. Самый распространённый путь.</li>
<li><strong>Напрямую через китайский университет (тип B):</strong> вы поступаете в вуз, и он номинирует сильных абитуриентов на стипендию.</li>
<li><strong>Через межправительственные соглашения (тип C):</strong> особые каналы по двусторонним договорённостям Китая с конкретными странами.</li>
</ol>
<p><strong>Важно:</strong> подавать документы можно только по одному каналу в год. Одновременная подача по двум каналам может полностью лишить вас стипендии.</p>
<h2>Условия участия</h2>
<ul>
<li>Гражданство не КНР и хорошее здоровье.</li>
<li>Бакалавриат: аттестат о среднем образовании, возраст до 25 лет на момент зачисления.</li>
<li>Магистратура: степень бакалавра, возраст до 35 лет.</li>
<li>Докторантура: степень магистра, возраст до 40 лет.</li>
<li>Отсутствие другой государственной стипендии КНР в тот же период.</li>
</ul>
<h2>Обычный пакет документов</h2>
<ul>
<li>Действующий загранпаспорт.</li>
<li>Онлайн-анкету в системе CSC.</li>
<li>Диплом о высшем образовании с нотариально заверенным переводом при необходимости.</li>
<li>Академическую справку с оценками.</li>
<li>План обучения (Study Plan) — самый влиятельный документ для магистратуры и докторантуры.</li>
<li>Два рекомендательных письма для магистрантов и докторантов.</li>
<li>Подтверждение языка: сертификат HSK для программ на китайском или IELTS/TOEFL для программ на английском.</li>
<li>Медицинскую форму для иностранцев (для финалистов).</li>
</ul>
<p>Точный список различается между посольствами и вузами — всегда ориентируйтесь на официальное объявление конкретного года.</p>
<h2>Типичные сроки</h2>
<p>При зачислении в сентябре большинство каналов открывает приём с декабря по январь, дедлайны обычно приходятся на январь–апрель, результаты объявляют с мая по июль, а письма о зачислении и форму JW201 присылают летом. Начинайте готовиться минимум за два месяца до открытия приёма.</p>
<h2>Типичные ошибки, лишающие студентов стипендии</h2>
<ul>
<li>Шаблонный, скопированный план обучения — комиссия распознаёт его мгновенно.</li>
<li>Отсутствие нотариальных переводов или нечитаемые сканы.</li>
<li>Подача в последнюю неделю и срыв дополнительных требований.</li>
<li>Уверенность, что авиабилеты входят в стипендию, и неверный расчёт бюджета.</li>
</ul>
<h2>Официальные источники</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">Campus China</a> — официальный портал CSC для иностранных студентов со списком участвующих университетов каждого года.</li>
<li><a href="https://www.csc.edu.cn" target="_blank">China Scholarship Council</a> — система онлайн-подачи и официальные объявления.</li>
</ul>
<h2>Нужна помощь с заявкой?</h2>
<p>Успешные файлы объединяют три вещи: убедительный план обучения, реалистичный выбор вузов и аккуратное соблюдение сроков. Запишитесь на <a href="/ru/contact">бесплатную консультацию Bridge to China Edu</a>, чтобы оценить ваш профиль, или изучите наши <a href="/ru/services">услуги по поступлению и стипендиям</a>. После зачисления вам понадобится виза X1 — прочитайте наше <a href="/ru/blog/china-student-visa-x1-x2-guide">полное руководство по студенческой визе</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Детали меняются из года в год — всегда сверяйтесь с официальными источниками и объявлениями посольства или вуза.</em></p>$$,
  'scene:campus-gate', 'tips', 'published', now(), now()
)
on conflict (slug) do nothing;

-- ===========================================================================
-- 2 · China student visa: X1 vs X2
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'china-student-visa-x1-x2-guide',
  $$تأشيرة الطالب الصينية X1 وX2: الفروق والوثائق والمواعيد$$,
  $$China Student Visa X1 vs X2: Differences, Documents and Timing$$,
  $$Студенческая виза X1 и X2 в Китай: отличия, документы и сроки$$,
  $$ما الفرق بين تأشيرة الطالب X1 وX2؟ متى تحتاج كل واحدة، وما الوثائق المطلوبة وخطوات ما بعد الوصول؟ دليل عملي بالعربية مع المصادر الرسمية.$$,
  $$The difference between the X1 and X2 student visas, which one your program needs, the documents to prepare, when to apply, and what to do within 30 days of arrival.$$,
  $$Чем отличается студенческая виза X1 от X2, какая нужна именно вам, какие документы готовить, когда подавать заявку и что сделать в первые 30 дней после приезда.$$,
  $$<p>بعد حصولك على القبول الجامعي في الصين، تصبح التأشيرة الخطوة التالية — والنوع الذي تحتاجه يعتمد على مدة برنامجك الدراسي.</p>
<h2>X1 أم X2؟</h2>
<ul>
<li><strong>تأشيرة X1:</strong> للبرامج التي تتجاوز مدتها 180 يوماً — بكالوريوس، ماجستير، دكتوراه، وسنة اللغة الصينية الكاملة. هذه تأشيرة «الدرجة العلمية» الأساسية.</li>
<li><strong>تأشيرة X2:</strong> للبرامج القصيرة حتى 180 يوماً — فصول لغة قصيرة، برامج تبادل فصلية، تدريبات قصيرة.</li>
</ul>
<p>القاعدة بسيطة: برنامج طويل يعني X1، وبرنامج قصير يعني X2. إذا دخلت الصين بتأشيرة X2 ثم قررت مواصلة دراسة جامعية، فستحتاج للخروج والتقديم على X1 من جديد.</p>
<h2>الوثائق المطلوبة عادةً</h2>
<ul>
<li>جواز سفر ساري المفعول مع صفحة فارغة على الأقل.</li>
<li>استمارة طلب التأشيرة المعبأة إلكترونياً مع صورة شخصية رقمية.</li>
<li><strong>خطاب القبول الجامعي (Admission Letter)</strong> الأصلي أو الصيغة الإلكترونية الرسمية.</li>
<li><strong>نموذج JW201 أو JW202:</strong> يصدره مكتب التعليم الدولي بجامعتك — JW201 لحاملي المنح الحكومية مثل <a href="/ar/blog/chinese-government-scholarship-csc-guide">منحة CSC</a>، وJW202 للطلاب على حسابهم الخاص.</li>
<li>إثبات مالي في بعض السفارات، ووثائق إضافية تختلف حسب بلد التقديم.</li>
</ul>
<h2>أين ومتى تتقدّم؟</h2>
<p>يتم التقديم عبر السفارة أو القنصلية الصينية في بلدك، أو عبر مركز طلبات التأشيرة الصينية المعتمد. تختلف الإجراءات من بلد لآخر، لكن القاعدة العامة: قدّم الطلب قبل شهر تقريباً من موعد سفرك، ولا تشترط تذكرة الطيران قبل صدور التأشيرة.</p>
<h2>خطوة ما بعد الوصول — الأهم بالنسبة لحاملي X1</h2>
<p>تأشيرة X1 وحدها لا تكفي للإقامة الدراسية الطويلة. خلال <strong>30 يوماً</strong> من وصولك يجب أن تحوّلها إلى <strong>إقامة (Residence Permit)</strong> عبر مكتب الشرطة المختص بالأجانب في مدينتك الجامعية. غالباً ما تتكفل الجامعة بترتيب موعد التحويل مع الطلاب الجدد في بداية العام — لكن المسؤولية النهائية مسؤوليتك.</p>
<p>أما X2 فلا تُحوّل إلى إقامة، وتنتهي بانتهاء مدتها. لا يُسمح لحامليها بالعمل داخل الصين — والعمل الطلابي يتطلب إقامة سارية وموافقة الجامعة.</p>
<h2>أسئلة يتكرر طرحها</h2>
<ul>
<li><strong>هل يمكنني العمل بتأشيرة الطالب؟</strong> العمل الجزئي داخل الحرم الجامعي ممكن بموافقات خاصة، والعمل خارج الحرم يتطلب تصريحاً إضافياً. لا تعتمد على الدخل من العمل في ميزانيتك.</li>
<li><strong>هل تستغرق التأشيرة طويلاً؟</strong> المدة تختلف حسب البلد والموسم؛ نهاية الصيف ذروة ازدحام، فابدأ مبكراً.</li>
<li><strong>ماذا لو تأخر نموذج JW عني؟</strong> راسل مكتب الطلاب الدوليين فوراً — الجامعات معتادة على إرساله إلكترونياً بسرعة.</li>
</ul>
<h2>المصادر الرسمية</h2>
<ul>
<li><a href="https://www.visaforchina.cn" target="_blank">مركز طلبات التأشيرة الصينية</a> — الموقع الرسمي لمراكز التأشيرة المعتمدة في عدة دول.</li>
<li><a href="https://www.mfa.gov.cn" target="_blank">وزارة الخارجية الصينية</a> — المعلومات الرسمية حول التأشيرات ولوائح الإقامة.</li>
</ul>
<h2>هل لديك سؤال عن مسارك؟</h2>
<p>ترتيب التأشيرة في وقتها الصحيح يريحك من ضغط اللحظات الأخيرة. تواصل مع <a href="/ar/contact">فريق Bridge to China Edu لاستشارة مجانية</a> أو تعرّف على <a href="/ar/services">خدماتنا الكاملة للقبول والتأشيرات</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. متطلبات التأشيرة تختلف بين السفارات وتتغير دورياً؛ اعتمد دائماً على الموقع الرسمي للسفارة أو مركز التأشيرة في بلدك.</em></p>$$,
  $$<p>Once your university admission is confirmed, the visa is the next step — and which type you need depends on the length of your program.</p>
<h2>X1 or X2?</h2>
<ul>
<li><strong>X1 visa:</strong> for programs longer than 180 days — bachelor's, master's, PhD and full academic-year Chinese language programs. This is the standard degree-student visa.</li>
<li><strong>X2 visa:</strong> for short programs up to 180 days — one-semester language courses, exchange semesters, short training programs.</li>
</ul>
<p>The rule is simple: a long program means X1, a short one means X2. If you enter on an X2 and then decide to continue with a degree, you will need to leave and apply for an X1.</p>
<h2>Documents usually required</h2>
<ul>
<li>A valid passport with at least one blank page.</li>
<li>The completed online visa application form with a digital photo.</li>
<li>Your <strong>university admission letter</strong> (original or official digital version).</li>
<li>The <strong>JW201 or JW202 form</strong> issued by your university's international student office — JW201 for government scholarship holders such as <a href="/en/blog/chinese-government-scholarship-csc-guide">CSC awardees</a>, JW202 for self-funded students.</li>
<li>Proof of funds at some embassies, plus country-specific extras.</li>
</ul>
<h2>Where and when to apply</h2>
<p>Applications go through the Chinese embassy or consulate in your country, or through the authorized Chinese Visa Application Service Center. Procedures differ by country, but as a general rule: apply roughly a month before you plan to travel, and you do not need to buy the flight ticket before the visa is issued.</p>
<h2>The post-arrival step — critical for X1 holders</h2>
<p>An X1 visa alone is not enough for long-term study. Within <strong>30 days</strong> of arrival you must convert it into a <strong>residence permit</strong> at the exit-entry administration for foreigners in your university city. Most universities arrange a group appointment for new students at the start of the year — but the responsibility stays yours.</p>
<p>The X2 cannot be converted into a residence permit and expires with its duration. X2 holders are not authorized to work — student work authorization requires a valid residence permit and university approval.</p>
<h2>Frequently asked questions</h2>
<ul>
<li><strong>Can I work on a student visa?</strong> On-campus part-time work is possible with specific approvals; off-campus work requires an additional permit. Never rely on work income in your budget planning.</li>
<li><strong>Is processing slow?</strong> It varies by country and season; late summer is peak season, so start early.</li>
<li><strong>What if my JW form is delayed?</strong> Contact the international student office immediately — universities are used to sending it electronically.</li>
</ul>
<h2>Official sources</h2>
<ul>
<li><a href="https://www.visaforchina.cn" target="_blank">Chinese Visa Application Service Center</a> — the official portal for authorized visa centers in many countries.</li>
<li><a href="https://www.mfa.gov.cn" target="_blank">Ministry of Foreign Affairs of China</a> — official visa and residence information.</li>
</ul>
<h2>Questions about your route?</h2>
<p>Getting the visa timing right removes the last-minute panic. Talk to <a href="/en/contact">Bridge to China Edu for a free consultation</a> or explore our <a href="/en/services">full admission and visa services</a>.</p>
<p><em>Last reviewed: November 2026. Visa requirements differ between embassies and change periodically — always follow the official website of your country's embassy or visa center.</em></p>$$,
  $$<p>Когда поступление подтверждено, следующим шагом становится виза — и её тип зависит от продолжительности вашей программы.</p>
<h2>X1 или X2?</h2>
<ul>
<li><strong>Виза X1:</strong> для программ длительностью более 180 дней — бакалавриат, магистратура, докторантура и полный учебный год китайского языка. Это стандартная виза для студентов долгосрочных программ.</li>
<li><strong>Виза X2:</strong> для коротких программ до 180 дней — семестровые языковые курсы, обмен, краткосрочные стажировки.</li>
</ul>
<p>Правило простое: длинная программа — X1, короткая — X2. Если вы въехали по X2, а потом решили продолжить учёбу на степень, придётся выехать и оформить X1 заново.</p>
<h2>Обычный пакет документов</h2>
<ul>
<li>Действующий загранпаспорт с хотя бы одной чистой страницей.</li>
<li>Заполненную онлайн-анкету с цифровой фотографией.</li>
<li><strong>Письмо о зачислении</strong> из университета (оригинал или официальная электронная версия).</li>
<li><strong>Форму JW201 или JW202</strong>, которую выдаёт отдел по работе с иностранными студентами: JW201 — для обладателей государственных стипендий, например <a href="/ru/blog/chinese-government-scholarship-csc-guide">стипендии CSC</a>, JW202 — для самостоятельно оплачивающих учёбу.</li>
<li>Подтверждение финансовой состоятельности в ряде посольств и другие страновые документы.</li>
</ul>
<h2>Где и когда подавать</h2>
<p>Заявка подаётся в посольство или консульство КНР в вашей стране либо через уполномоченный визовый центр Китая. Процедуры различаются, но общее правило: подавайте документы примерно за месяц до планируемой поездки, и покупать авиабилет до выдачи визы не требуется.</p>
<h2>Шаг после приезда — критично для держателей X1</h2>
<p>Самой визы X1 для долгой учёбы недостаточно. В течение <strong>30 дней</strong> после прибытия её нужно преобразовать в <strong>вид на жительство</strong> в управлении по вопросам въезда и выезда для иностранцев в городе вашего университета. Многие вузы организуют групповой визит для первокурсников, но итоговая ответственность — на вас.</p>
<p>X2 нельзя преобразовать в вид на жительство, она истекает вместе со сроком. Держателям X2 работать не разрешено — трудоустройство студента требует действующего ВНЖ и согласия университета.</p>
<h2>Частые вопросы</h2>
<ul>
<li><strong>Можно ли работать по студенческой визе?</strong> Частичная работа в кампусе возможна при специальных согласованиях; для работы вне кампуса нужен отдельный документ. Не закладывайте доход от работы в бюджет.</li>
<li><strong>Долго ли оформляется виза?</strong> Зависит от страны и сезона; конец лета — пик нагрузки, начинайте заранее.</li>
<li><strong>Что делать, если форма JW задерживается?</strong> Немедленно напишите в отдел иностранных студентов — вузы оперативно высылают её в электронном виде.</li>
</ul>
<h2>Официальные источники</h2>
<ul>
<li><a href="https://www.visaforchina.cn" target="_blank">Визовый центр Китая</a> — официальный портал уполномоченных визовых центров во многих странах.</li>
<li><a href="https://www.mfa.gov.cn" target="_blank">МИД КНР</a> — официальная информация о визах и правилах пребывания.</li>
</ul>
<h2>Остались вопросы по вашему маршруту?</h2>
<p>Правильно выбранные сроки оформления визы избавляют от паники в последний момент. Обратитесь в <a href="/ru/contact">Bridge to China Edu за бесплатной консультацией</a> или изучите наши <a href="/ru/services">услуги по поступлению и визам</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Требования к визе различаются между посольствами и периодически меняются — всегда сверяйтесь с официальным сайтом посольства или визового центра вашей страны.</em></p>$$,
  'scene:night-bridge', 'tips', 'published', now(), now()
)
on conflict (slug) do nothing;

-- ===========================================================================
-- 3 · English-taught degrees in China
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'english-taught-degrees-china-guide',
  $$الدراسة بالإنجليزية في الصين: بكالوريوس وماجستير بلا صينية$$,
  $$Study in English in China: Bachelor's and Master's Without Chinese$$,
  $$Учёба на английском в Китае: бакалавриат и магистратура без китайского$$,
  $$نعم، يمكنك الدراسة في الصين بالإنجليزية بالكامل. ما التخصصات المتاحة، وكيف تختار برنامجاً معتمداً، وماذا عن اللغة الصينية والاعتراف بالشهادة؟$$,
  $$Yes, you can complete a full degree in China taught entirely in English. What fields are available, how to verify a program's accreditation, and what role Chinese still plays.$$,
  $$Да, в Китае можно полностью получить степень на английском языке. Какие направления доступны, как проверить аккредитацию программы и какую роль всё же играет китайский.$$,
  $$<p>كثير من الطلاب العرب يفترضون أن الدراسة في الصين تتطلب إجادة الصينية أولاً. الحقيقة أن مئات البرامج الجامعية الصينية تُدرَّس اليوم <strong>بالإنجليزية بالكامل</strong>، من السنة التحضيرية حتى الدكتوراه.</p>
<h2>التخصصات المتاحة بالإنجليزية</h2>
<ul>
<li><strong>إدارة الأعمال والاقتصاد:</strong> أكثر الحقول توفراً، وتشمل بكالوريوس إدارة الأعمال الدولية وماجستير إدارة الأعمال MBA.</li>
<li><strong>الهندسة وعلوم الحاسوب:</strong> بكالوريوس وماجستير في الهندسة المدنية، الميكانيكية، الكهربائية، وعلوم البيانات.</li>
<li><strong>الطب البشري MBBS:</strong> برنامج بكالوريوس الطب بالإنجليزية، ومن أشهر البرامج الدولية في الصين.</li>
<li><strong>العلاقات الدولية والعلوم السياسية.</strong></li>
<li><strong>برامج الدكتوراه البحثية</strong> في معظم التخصصات العلمية.</li>
</ul>
<h2>كيف تتأكد أن البرنامج معتمد وجاد؟</h2>
<p>الانتشار الكبير للبرامج الإنجليزية يعني تفاوت الجودة أيضاً. قبل دفع أي رسوم:</p>
<ul>
<li>تأكد أن الجامعة معتمدة لدى وزارة التعليم الصينية ومدرجة ضمن قوائم الجامعات المخوّلة بقبول الطلاب الدوليين.</li>
<li>اطلب نسب الخريجين وشهادات الطلاب السابقين من بلدك إن أمكن.</li>
<li>إن كنت تدرس الطب، تحقق كيف تتعامل بلدك مع شهادة MBBS الصينية لمزاولة المهنة — كل دولة لها لوائح خاصة.</li>
<li>قارن رسوم البرنامج بالمتوسط؛ السعر المنخفض جداً قد يعني برنامجاً ضعيفاً.</li>
</ul>
<h2>متطلبات اللغة الإنجليزية</h2>
<p>تطلب أغلب الجامعات إثبات إجادتك الإنجليزية: IELTS عادةً بدرجة 6.0 فأعلى للبكالوريوس و6.5 للماجستير، أو TOEFL بما يعادلها. بعض الجامعات تقبل اختباراتها الداخلية أو دراستك السابقة بالإنجليزية كإثبات. الطلاب من الأقسام الإنجليزية في الثانوية غالباً ما يستفيدون من إعفاءات.</p>
<h2>فهل أنسى اللغة الصينية إذن؟</h2>
<p>البرنامج يُدرَّس بالإنجليزية، لكن حياتك اليومية ستكون بالصينية: التسوق، التنقل، الصرافة، والتدريب الصيفي. الجامعات تقدم عادةً مقررات صينية إلزامية أو اختيارية لطلاب البرامج الإنجليزية — استفد منها فعلاً، لأن إجادة الصينية الأساسية تحسن حياتك اليومية وترفع قيمتك في سوق العمل لاحقاً، خاصةً إن كنت تفكر بالعمل في الصين أو مع شركات صينية بعد التخرج.</p>
<h2>هل الدراسة بالإنجليزية أغلى؟</h2>
<p>عادةً نعم — برامج البكالوريوس والماجستير الإنجليزية أغلى من نظيراتها الصينية في معظم الجامعات. اقرأ تفاصيل التكاليف في <a href="/ar/blog/study-in-china-costs-guide">دليلنا الشامل لتكاليف الدراسة والمعيشة في الصين</a>.</p>
<h2>كيف تختار جامعتك؟</h2>
<p>تصفّح <a href="/ar/universities">جامعاتنا المختارة</a> وتعرّف على مقارنة المدن والتخصصات، أو ابدأ بـ<a href="/ar/blog/hsk-levels-guide-study-china">فهم مستويات HSK</a> إن كنت تفكر بمسار مزدوج بالصينية.</p>
<h2>مصادر رسمية مفيدة</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">Campus China</a> — البوابة الرسمية للطلاب الدوليين، وقوائم الجامعات المشاركة في المنح الحكومية.</li>
<li>مواقع الجامعات الرسمية — المصدر الأول دائماً لتفاصيل البرامج والرسوم ومواعيد التقديم.</li>
</ul>
<h2>هل تحتاج مشورة في اختيار البرنامج؟</h2>
<p>اختيار البرنامج الإنجليزي المناسب — معتمد وبسعر منطقي وفي مدينة تناسبك — هو بالضبط ما نساعد فيه. ابدأ بـ<a href="/ar/contact">استشارة مجانية</a> أو شاهد <a href="/ar/services">خدماتنا</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. متطلبات البرامج والرسوم تختلف بين الجامعات؛ اعتمد على المواقع الرسمية للجامعات.</em></p>$$,
  $$<p>Many students assume that studying in China means mastering Chinese first. In reality, hundreds of Chinese university programs today are taught <strong>entirely in English</strong> — from foundation years to PhDs.</p>
<h2>Fields available in English</h2>
<ul>
<li><strong>Business and economics:</strong> the widest offer, including bachelor's degrees in international business and MBA programs.</li>
<li><strong>Engineering and computer science:</strong> bachelor's and master's tracks in civil, mechanical and electrical engineering, plus data science.</li>
<li><strong>MBBS medicine:</strong> the bachelor of medicine program in English, one of China's most established international programs.</li>
<li><strong>International relations and political science.</strong></li>
<li><strong>Research doctorates</strong> across most scientific fields.</li>
</ul>
<h2>How to verify a program is accredited and serious</h2>
<p>The large supply of English-taught programs means quality varies. Before paying any fees:</p>
<ul>
<li>Confirm the university is accredited by China's Ministry of Education and authorized to enroll international students.</li>
<li>Ask about graduation rates and request contacts of alumni from your country when possible.</li>
<li>If you are studying medicine, check how your country treats a Chinese MBBS for professional licensing — every country has its own rules.</li>
<li>Compare tuition with the average; a suspiciously low price can mean a weak program.</li>
</ul>
<h2>English language requirements</h2>
<p>Most universities require proof of English: typically IELTS 6.0+ for bachelor's and 6.5+ for master's, or an equivalent TOEFL score. Some accept their internal tests or previous English-medium education as proof. Students from English-section high schools often qualify for waivers.</p>
<h2>So can you forget about Chinese?</h2>
<p>Your program runs in English, but daily life runs in Chinese: shopping, transport, banking and internships. Universities usually offer mandatory or optional Chinese courses for English-taught students — genuinely use them. Basic Chinese improves your everyday life and raises your value on the job market later, especially if you consider working in China or with Chinese companies after graduation.</p>
<h2>Is studying in English more expensive?</h2>
<p>Usually yes — English-taught bachelor's and master's programs cost more than their Chinese-taught counterparts at most universities. See the full picture in our <a href="/en/blog/study-in-china-costs-guide">guide to studying and living costs in China</a>.</p>
<h2>How to choose your university</h2>
<p>Browse our <a href="/en/universities">selected universities</a> for city and program comparisons, or start by understanding <a href="/en/blog/hsk-levels-guide-study-china">HSK levels</a> if you are considering a Chinese-taught track alongside.</p>
<h2>Useful official sources</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">Campus China</a> — the official portal for international students, including lists of universities participating in government scholarships.</li>
<li>Official university websites — always the primary source for program details, fees and deadlines.</li>
</ul>
<h2>Need advice on choosing a program?</h2>
<p>Picking the right English-taught program — accredited, fairly priced, in a city that suits you — is exactly what we help with. Start with a <a href="/en/contact">free consultation</a> or see our <a href="/en/services">services</a>.</p>
<p><em>Last reviewed: November 2026. Program requirements and fees differ between universities — rely on official university websites.</em></p>$$,
  $$<p>Многие студенты полагают, что учёба в Китае требует сначала выучить китайский. На деле сегодня сотни программ китайских вузов преподаются <strong>полностью на английском</strong> — от подготовительных курсов до докторантуры.</p>
<h2>Какие направления доступны на английском</h2>
<ul>
<li><strong>Бизнес и экономика:</strong> самое широкое предложение, включая бакалавриат по международному бизнесу и программы MBA.</li>
<li><strong>Инженерия и компьютерные науки:</strong> бакалавриат и магистратура по гражданской, механической и электротехнике, а также наука о данных.</li>
<li><strong>Медицина MBBS:</strong> англоязычная программа бакалавриата медицины — один из самых известных международных программ Китая.</li>
<li><strong>Международные отношения и политология.</strong></li>
<li><strong>Научные докторантуры</strong> по большинству естественно-научных направлений.</li>
</ul>
<h2>Как проверить аккредитацию программы</h2>
<p>Большой выбор англоязычных программ означает и разброс качества. Перед оплатой взносов:</p>
<ul>
<li>Убедитесь, что вуз аккредитован министерством образования КНР и имеет право принимать иностранных студентов.</li>
<li>Спросите о доле выпускников и попросите контакты выпускников из вашей страны, если возможно.</li>
<li>Если вы изучаете медицину, уточните, как ваша страна признаёт китайский диплом MBBS для лицензирования — у каждой страны свои правила.</li>
<li>Сравните стоимость со средними цифрами; подозрительно низкая цена может означать слабую программу.</li>
</ul>
<h2>Требования к английскому языку</h2>
<p>Большинство вузов требует подтверждение уровня: обычно IELTS от 6.0 для бакалавриата и от 6.5 для магистратуры либо эквивалентный TOEFL. Некоторые принимают внутренние тесты или предыдущее образование на английском. Выпускники англоязычных школьных отделений часто освобождаются от сдачи.</p>
<h2>Значит, китайский можно не учить?</h2>
<p>Программа идёт на английском, но повседневная жизнь — на китайском: магазины, транспорт, банк, стажировки. Вузы обычно предлагают обязательные или факультативные курсы китайского для англоязычных студентов — используйте их по-настоящему. Базовый китайский облегчает быт и повышает вашу ценность на рынке труда, особенно если после выпуска вы рассматриваете работу в Китае или с китайскими компаниями.</p>
<h2>Учёба на английском дороже?</h2>
<p>Как правило, да — англоязычные бакалавриат и магистратура стоят дороже китайскоязычных аналогов в большинстве вузов. Полную картину смотрите в нашем <a href="/ru/blog/study-in-china-costs-guide">руководстве по стоимости учёбы и жизни в Китае</a>.</p>
<h2>Как выбрать университет</h2>
<p>Посмотрите <a href="/ru/universities">подобранные нами университеты</a> для сравнения городов и программ или начните с понимания <a href="/ru/blog/hsk-levels-guide-study-china">уровней HSK</a>, если рассматриваете и китайскоязычный трек.</p>
<h2>Полезные официальные источники</h2>
<ul>
<li><a href="https://www.campuschina.org" target="_blank">Campus China</a> — официальный портал для иностранных студентов со списками вузов — участников государственных стипендий.</li>
<li>Официальные сайты университетов — первоисточник по деталям программ, стоимости и срокам.</li>
</ul>
<h2>Нужен совет по выбору программы?</h2>
<p>Подобрать правильную англоязычную программу — аккредитованную, по адекватной цене и в подходящем городе — именно то, чем мы занимаемся. Начните с <a href="/ru/contact">бесплатной консультации</a> или посмотрите наши <a href="/ru/services">услуги</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Требования и стоимость различаются между вузами — опирайтесь на официальные сайты университетов.</em></p>$$,
  'scene:campus-library', 'universities', 'published', now(), now()
)
on conflict (slug) do nothing;

-- ===========================================================================
-- 4 · HSK levels explained
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'hsk-levels-guide-study-china',
  $$شهادة HSK: دليل المستويات ومتطلبات الجامعات الصينية$$,
  $$HSK Explained: Levels, Word Counts and What Universities Expect$$,
  $$Экзамен HSK: уровни, словарный запас и требования университетов$$,
  $$ما هو اختبار HSK، وما الفرق بين مستوياته من 1 إلى 6، وكم كلمة يحتاج كل مستوى، وما الشهادة التي تطلبها الجامعات للبكالوريوس والماجستير؟$$,
  $$What the HSK test is, how levels 1–6 differ, how many words each level requires, and which certificate universities expect for bachelor's, master's and PhD admission.$$,
  $$Что такое экзамен HSK, чем различаются уровни 1–6, какой словарный запас нужен на каждом уровне и какой сертификат требуют вузы для бакалавриата, магистратуры и докторантуры.$$,
  $$<p>إذا كنت تنوي الدراسة بالصينية في الصين، فستقابل حتماً كلمة HSK. إليك ما تحتاج معرفته عن هذا الاختبار دون تعقيد.</p>
<h2>ما هو اختبار HSK؟</h2>
<p>اختبار HSK (Hanyu Shuiping Kaoshi) هو الاختبار الرسمي الموحّد لقياس مستوى اللغة الصينية لغير الناطقين بها. تديره مؤسسة اختبارات الصينية الدولية، وتعتمد نتائجه الجامعات الصينية والجهات المانحة للتأشيرات وبيوت العمل. الاختبار متوفر في مراكز معتمدة في معظم العواصم العربية، والتسجيل يتم عبر <a href="https://www.chinesetest.cn" target="_blank">الموقع الرسمي chinesetest.cn</a>.</p>
<h2>المستويات الستة وحجم المفردات</h2>
<ul>
<li><strong>HSK 1:</strong> نحو 150 كلمة — عبارات أساسية جداً: تحيات، أرقام، تقديم النفس.</li>
<li><strong>HSK 2:</strong> نحو 300 كلمة — جمل يومية بسيطة عن العائلة والتسوق والوقت.</li>
<li><strong>HSK 3:</strong> نحو 600 كلمة — التواصل في مواقف الحياة اليومية المألوفة.</li>
<li><strong>HSK 4:</strong> نحو 1200 كلمة — نقاش موضوعات عامة بثقة؛ المستوى الأدنى الذي تقبل به معظم الجامعات للبكالوريوس.</li>
<li><strong>HSK 5:</strong> نحو 2500 كلمة — قراءة الصحف والمحاضرات؛ يطلبه كثير من برامج الماجستير.</li>
<li><strong>HSK 6:</strong> أكثر من 5000 كلمة — فهم النصوص المعقدة والتعبير بسلاسة؛ المستوى المعتاد للدكتوراه والبرامج الأدبية.</li>
</ul>
<p>ملاحظة: تعمل الصين حالياً على معيار جديد موسّع يصل إلى تسعة مستويات، لكن النظام المعتمد دولياً المطبّق في أغلب المراكز لا يزال نظام المستويات الستة المذكور أعلاه — وهو المعيار الذي تشير إليه الجامعات عادةً في اشتراطاتها الحالية.</p>
<h2>ما الشهادة التي تطلبها الجامعات؟</h2>
<ul>
<li><strong>البكالوريوس بالصينية:</strong> غالباً HSK 4 كحد أدنى، وبعض الجامعات المرموقة تطلب HSK 5.</li>
<li><strong>الماجستير والدكتوراه بالصينية:</strong> عادةً HSK 5 فأعلى للماجستير، وHSK 5 أو 6 للدكتوراه حسب التخصص.</li>
<li><strong>برامج اللغة أولاً:</strong> إن كان مستواك دون المطلوب، تتيح لك معظم الجامعات سنة تحضيرية لغوية قبل التخصص — وهذه من أكثر الطرق شيوعاً لدخول التخصصات الصينية.</li>
</ul>
<p>لكل جامعة اشتراطاتها الدقيقة المنشورة في صفحة القبول الدولي، فتحقق منها مباشرة قبل التخطيط.</p>
<h2>كم تحتاج من الوقت للتحضير؟</h2>
<p>تختلف المدة بحسب كثافة الدراسة وخلفيتك السابقة. كقاعدة عملية: مسار منتظم من الصفر إلى HSK 4 يستغرق عادةً سنة إلى سنتين من الدراسة الجادة، بينما يمكن لمن أتمّ HSK 4 الوصول إلى HSK 5 في سنة إضافية مكثفة. الدراسة داخل الصين — ضمن سنة لغوية جامعية — هي الأسرع لأنك تعيش اللغة يومياً.</p>
<h2>نصائح عملية للاختبار</h2>
<ul>
<li>تدرّب على نماذج الاختبار الزمنية مبكراً — إدارة الوقت في قسم الاستماع هي أكبر عائق.</li>
<li>ركّز على المفردات المطلوبة لكل مستوى عبر قوائم HSK الرسمية بدل مواد عامة.</li>
<li>سجّل في الاختبار قبل موعدك المستهدف بشهرين؛ المقاعد تمتلئ في مواسم الذروة.</li>
</ul>
<p>وبعد الوصول للمستوى المطلوب، تعرف على <a href="/ar/blog/chinese-government-scholarship-csc-guide">كيف تعزز ملف منحة CSC</a> بشهادة اللغة، أو على <a href="/ar/blog/study-in-china-costs-guide">تكاليف الدراسة والمعيشة</a> لتخطيط ميزانيتك.</p>
<h2>المصدر الرسمي</h2>
<ul>
<li><a href="https://www.chinesetest.cn" target="_blank">chinesetest.cn</a> — الموقع الرسمي للتسجيل في HSK وجدولة المراكز والاختبارات التجريبية.</li>
</ul>
<h2>أين تبدأ؟</h2>
<p>مسار اللغة الصحيح يوفر عليك سنة كاملة أحياناً. احصل على <a href="/ar/contact">استشارة مجانية</a> من فريقنا لتقييم وضعك اللغوي وترتيب خطة الوصول للمستوى المطلوب، أو شاهد <a href="/ar/services">خدماتنا الدراسية واللغوية</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. اشتراطات الجامعات تتغير؛ اعتمد على صفحات القبول الرسمية.</em></p>$$,
  $$<p>If you plan to study in Chinese, you will meet the word HSK everywhere. Here is what you actually need to know — without the jargon.</p>
<h2>What is the HSK?</h2>
<p>The HSK (Hanyu Shuiping Kaoshi) is China's official standardized proficiency test for non-native speakers. It is administered by Chinese Testing International, and its results are recognized by Chinese universities, scholarship bodies and employers. The test runs at authorized centers in most capital cities, and registration goes through the <a href="https://www.chinesetest.cn" target="_blank">official portal chinesetest.cn</a>.</p>
<h2>The six levels and their vocabulary</h2>
<ul>
<li><strong>HSK 1:</strong> about 150 words — very basic phrases: greetings, numbers, introducing yourself.</li>
<li><strong>HSK 2:</strong> about 300 words — simple daily sentences about family, shopping and time.</li>
<li><strong>HSK 3:</strong> about 600 words — communicating in familiar everyday situations.</li>
<li><strong>HSK 4:</strong> about 1,200 words — discussing general topics with confidence; the minimum level most universities accept for bachelor's admission.</li>
<li><strong>HSK 5:</strong> about 2,500 words — reading newspapers and following lectures; required by many master's programs.</li>
<li><strong>HSK 6:</strong> over 5,000 words — understanding complex texts and expressing yourself fluently; the usual expectation for PhD programs and literary fields.</li>
</ul>
<p>Note: China is rolling out an expanded standard with up to nine proficiency levels, but the system administered internationally at most centers is still the six-level system above — and it is the one universities typically reference in their current requirements.</p>
<h2>What do universities require?</h2>
<ul>
<li><strong>Chinese-taught bachelor's:</strong> usually HSK 4 minimum; some leading universities ask for HSK 5.</li>
<li><strong>Chinese-taught master's and PhD:</strong> typically HSK 5+ for master's, HSK 5 or 6 for doctorates depending on the field.</li>
<li><strong>Language-first route:</strong> if you are below the requirement, most universities offer a preparatory language year before the degree — one of the most common paths into Chinese-taught programs.</li>
</ul>
<p>Every university publishes its exact requirements on its international admissions page — verify there before planning.</p>
<h2>How long does preparation take?</h2>
<p>It depends on intensity and background. As a practical rule: a steady path from zero to HSK 4 typically takes one to two years of serious study, and HSK 4 holders can usually reach HSK 5 with one more intensive year. Studying inside China — within a university language year — is the fastest route, because you live the language daily.</p>
<h2>Practical exam tips</h2>
<ul>
<li>Practice timed mock papers early — time management in the listening section is the biggest obstacle.</li>
<li>Focus on the official per-level vocabulary lists instead of generic materials.</li>
<li>Register about two months before your target date; seats fill up in peak seasons.</li>
</ul>
<p>Once you reach the required level, see how the certificate strengthens your <a href="/en/blog/chinese-government-scholarship-csc-guide">CSC scholarship file</a>, and read our guide to <a href="/en/blog/study-in-china-costs-guide">study and living costs</a> for budgeting.</p>
<h2>Official source</h2>
<ul>
<li><a href="https://www.chinesetest.cn" target="_blank">chinesetest.cn</a> — the official HSK registration portal with centers, dates and mock tests.</li>
</ul>
<h2>Where to start?</h2>
<p>The right language route can save you a full year. Get a <a href="/en/contact">free consultation</a> to assess your level and plan the path to your target certificate, or see our <a href="/en/services">study and language services</a>.</p>
<p><em>Last reviewed: November 2026. University requirements change — rely on official admissions pages.</em></p>$$,
  $$<p>Если вы планируете учиться на китайском, слово HSK будет встречаться вам повсюду. Вот что действительно стоит знать — без лишних сложностей.</p>
<h2>Что такое HSK?</h2>
<p>HSK (Hanyu Shuiping Kaoshi) — официальный стандартизированный экзамен по китайскому языку для иностранцев. Его проводит Chinese Testing International, а результаты признают китайские вузы, стипендиальные фонды и работодатели. Экзамен сдают в аккредитованных центрах в большинстве столиц, регистрация — через <a href="https://www.chinesetest.cn" target="_blank">официальный портал chinesetest.cn</a>.</p>
<h2>Шесть уровней и словарный запас</h2>
<ul>
<li><strong>HSK 1:</strong> около 150 слов — простейшие фразы: приветствия, числа, представление себя.</li>
<li><strong>HSK 2:</strong> около 300 слов — простые бытовые фразы о семье, покупках и времени.</li>
<li><strong>HSK 3:</strong> около 600 слов — общение в знакомых бытовых ситуациях.</li>
<li><strong>HSK 4:</strong> около 1200 слов — уверенное обсуждение общих тем; минимальный уровень, который принимают большинство вузов для бакалавриата.</li>
<li><strong>HSK 5:</strong> около 2500 слов — чтение газет и понимание лекций; требуется во многих магистратурах.</li>
<li><strong>HSK 6:</strong> более 5000 слов — понимание сложных текстов и свободное выражение мыслей; обычное требование для докторантуры и гуманитарных программ.</li>
</ul>
<p>Примечание: в Китае внедряется расширенный стандарт с девятью уровнями владения, однако в международных центрах пока применяется система шести уровней, описанная выше, — и именно на неё ссылаются вузы в актуальных требованиях.</p>
<h2>Что требуют университеты?</h2>
<ul>
<li><strong>Бакалавриат на китайском:</strong> обычно HSK 4 как минимум; ведущие вузы нередко просят HSK 5.</li>
<li><strong>Магистратура и докторантура на китайском:</strong> как правило, HSK 5 и выше для магистратуры, HSK 5 или 6 для докторантуры в зависимости от направления.</li>
<li><strong>Сначала язык:</strong> если ваш уровень ниже требуемого, большинство вузов предлагает подготовительный языковой год перед программой — один из самых распространённых путей на китайскоязычные специальности.</li>
</ul>
<p>Каждый вуз публикует точные требования на странице приёма иностранцев — сверяйтесь там напрямую.</p>
<h2>Сколько времени занимает подготовка?</h2>
<p>Всё зависит от интенсивности и базы. Практическое правило: стабильный путь с нуля до HSK 4 обычно занимает один-два года серьёзных занятий, а с HSK 4 до HSK 5 — ещё один интенсивный год. Учёба в самом Китае, в рамках университетского языкового года, — самый быстрый маршрут, потому что вы живёте в языке каждый день.</p>
<h2>Практические советы по экзамену</h2>
<ul>
<li>Рано начните тренироваться на вариантах с таймером — управление временем в секции аудирования главное препятствие.</li>
<li>Учите официальный словарь своего уровня, а не общие материалы.</li>
<li>Регистрируйтесь примерно за два месяца до целевой даты; в пиковые сезоны места заканчиваются.</li>
</ul>
<p>Достигнув нужного уровня, посмотрите, как сертификат усиливает <a href="/ru/blog/chinese-government-scholarship-csc-guide">заявку на стипендию CSC</a>, и изучите <a href="/ru/blog/study-in-china-costs-guide">стоимость учёбы и жизни</a> для планирования бюджета.</p>
<h2>Официальный источник</h2>
<ul>
<li><a href="https://www.chinesetest.cn" target="_blank">chinesetest.cn</a> — официальный портал регистрации HSK с центрами, датами и пробными тестами.</li>
</ul>
<h2>С чего начать?</h2>
<p>Правильно выбранный языковой маршрут иногда экономит целый год. Получите <a href="/ru/contact">бесплатную консультацию</a> для оценки уровня и плана подготовки или посмотрите наши <a href="/ru/services">учебные и языковые услуги</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Требования вузов меняются — ориентируйтесь на официальные страницы приёма.</em></p>$$,
  'scene:xian', 'about_china', 'published', now(), now()
)
on conflict (slug) do nothing;

-- ===========================================================================
-- 5 · Costs of studying and living in China
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'study-in-china-costs-guide',
  $$تكلفة الدراسة والمعيشة في الصين: دليل الميزانية الشامل$$,
  $$Cost of Studying and Living in China: A Complete Budget Guide$$,
  $$Стоимость учёбы и жизни в Китае: полное руководство по бюджету$$,
  $$كم تكلف الدراسة في الصين فعلاً؟ نطاقات الرسوم لكل مرحلة، تكاليف السكن والمعيشة حسب المدينة، والبنود التي يغفلها الطلاب عادةً عند حساب الميزانية.$$,
  $$What studying in China really costs: tuition ranges by level and language of instruction, accommodation and living costs by city tier, and the budget items students forget.$$,
  $$Сколько на самом деле стоит учёба в Китае: диапазоны оплаты по уровням и языку обучения, расходы на жильё и жизнь в разных городах и статьи бюджета, о которых забывают.$$,
  $$<p>تُعدّ الصين واحدة من أكثر الوجهات الدراسية جدوىً من حيث التكلفة مقارنة بأوروبا وأمريكا، لكن الميزانية الدقيقة تحتاج فهماً لبنودها الحقيقية. في هذا الدليل نفصل النطاقات المعتادة — مع التأكيد أن الأرقام مؤشرات استرشادية تختلف بين الجامعات والمدن، وأن المصدر النهائي دائماً هو صفحة الرسوم الرسمية للجامعة.</p>
<h2>رسوم الدراسة: النطاقات المعتادة</h2>
<ul>
<li><strong>برامج اللغة الصينية:</strong> عادةً ما بين 8,000 و25,000 يوان صيني سنوياً حسب الجامعة والمدينة.</li>
<li><strong>البكالوريوس بالصينية:</strong> غالباً بين 15,000 و30,000 يوان سنوياً.</li>
<li><strong>البكالوريوس بالإنجليزية:</strong> عادةً بين 25,000 و50,000 يوان سنوياً — أعلى من نظيره الصيني.</li>
<li><strong>الماجستير:</strong> عادةً بين 20,000 و60,000 يوان سنوياً بحسب التخصص والجامعة.</li>
<li><strong>الدكتوراه:</strong> نطاق قريب من الماجستير، مع إمكانيات أوسع للمنح البحثية.</li>
<li><strong>الطب البشري MBBS:</strong> عادةً بين 30,000 و60,000 يوان سنوياً.</li>
</ul>
<h2>السكن: الخياران الأساسيان</h2>
<ul>
<li><strong>سكن الجامعة:</strong> الغرفة المزدوجة عادةً بين 750 و1,500 يوان شهرياً — الخيار الأوفر والأكثر أماناً للسنة الأولى، وغالباً ما تشترطه الجامعات على الطلاب الجدد.</li>
<li><strong>السكن الخاص:</strong> شقة مستقلة أو غرفة مؤجرة عادةً بين 2,000 و5,000 يوان شهرياً بحسب المدينة والموقع — حرية أكبر وتكلفة أعلى، وتحتاج عادةً تسجيل العقد لدى الشرطة.</li>
</ul>
<h2>المعيشة الشهرية حسب المدينة</h2>
<p>مدينتا بكين وشنجهاي الأغلى، تليهما المدن الكبرى مثل قوانغجو وشنتشن وشنغهاي... القاعدة العملية:</p>
<ul>
<li><strong>المدن الكبرى:</strong> ميزانية معيشة طالب منتظمة عادةً 2,500–4,000 يوان شهرياً شاملة الطعام والتنقل والاتصالات والمصاريف الصغيرة.</li>
<li><strong>المدن المتوسطة والصغيرة:</strong> عادةً 1,500–2,500 يوان شهرياً لنمط الحياة نفسه.</li>
</ul>
<p>الطعام في مطاعم الجامعة أوفر بكثير من المطاعم الخارجية — وجبة جامعية تكلف عادةً 10–20 يوان، بينما وجبة مطعم متوسط 30–60 يوان.</p>
<h2>بنود يغفلها الطلاب عند حساب الميزانية</h2>
<ul>
<li><strong>رسوم التقديم:</strong> معظم الجامعات تطلب رسوم تقديم غير مستردة (غالباً 400–800 يوان) لكل برنامج.</li>
<li><strong>تذكرة الطيران:</strong> لا تغطيها المنح الحكومية عادةً — احسبها ذهاباً وعوداً سنوياً.</li>
<li><strong>التأمين الطبي:</strong> نحو 400–800 يوان سنوياً للطلاب (مجاني ضمن منحة CSC).</li>
<li><strong>الإقامة والتأشيرة:</strong> رسوم تحويل X1 إلى إقامة سارية سنوياً.</li>
<li><strong>الكتب والمواد:</strong> مبلغ صغير لكنه تراكمي.</li>
<li><strong>مصاريف البداية:</strong> أول شهر يتطلب فرشاة سرير وأدوات مطبخ وتأسيس غرفة — خصص له 1,000–2,000 يوان.</li>
</ul>
<h2>كيف تخفض التكلفة؟</h2>
<ul>
<li>قدّم على <a href="/ar/blog/chinese-government-scholarship-csc-guide">منحة الحكومة الصينية CSC</a> — التغطية الكاملة تشمل الرسوم والسكن والمخصص الشهري.</li>
<li>ابحث عن منح الجامعات المحلية والإقليمية — أقل شهرة وأقل تنافسية.</li>
<li>اختر مدينة متوسطة الحجم: نفس الشهادة بتكلفة معيشة أقل بوضوح.</li>
<li>ابدأ بالسكن الجامعي في السنة الأولى ثم قرر.</li>
</ul>
<h2>ميزانية تقديرية سنوية</h2>
<p>طالب بكالوريوس بالصينية في مدينة متوسطة، بدون منحة: رسوم نحو 20,000 يوان + سكن جامعي نحو 12,000 يوان + معيشة نحو 24,000 يوان + بنود أخرى نحو 5,000 يوان — أي نحو <strong>60,000 يوان سنوياً</strong> تقريباً (قبل أي منحة). في بكين أو شنجهاي مع برنامج إنجليزي، قد تصل المجموع إلى نحو ضعف هذا الرقم.</p>
<h2>تنبيه منهجي</h2>
<p>كل الأرقام أعلاه نطاقات استرشادية مبنية على المعدلات الشائعة، وليست أسعاراً ثابتة. رسوم جامعتك ومدينتك قد تختلف — والتحقق المباشر من الجامعة خطوة لا غنى عنها قبل أي التزام مالي.</p>
<h2>هل تريد ميزانية دقيقة لحالتك؟</h2>
<p>نحن نعرف تفاصيل رسوم الجامعات ونظم المدن، ونساعدك في بناء خطة مالية واقعية تناسب برنامجك المستهدف. ابدأ بـ<a href="/ar/contact">استشارة مجانية</a> أو شاهد <a href="/ar/services">خدماتنا</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. الأسعار استرشادية وتتغير؛ اعتمد على الجامعة كمصدر نهائي.</em></p>$$,
  $$<p>China is one of the most cost-competitive study destinations compared with Europe or North America — but an accurate budget needs to understand its real components. This guide breaks down the typical ranges, with one clear caveat: the figures are indicative and vary between universities and cities, and the final source is always the university's official fee page.</p>
<h2>Tuition: the typical ranges</h2>
<ul>
<li><strong>Chinese language programs:</strong> usually CNY 8,000–25,000 per year depending on the university and city.</li>
<li><strong>Chinese-taught bachelor's:</strong> mostly CNY 15,000–30,000 per year.</li>
<li><strong>English-taught bachelor's:</strong> usually CNY 25,000–50,000 per year — higher than the Chinese-taught equivalent.</li>
<li><strong>Master's degrees:</strong> typically CNY 20,000–60,000 per year depending on field and university.</li>
<li><strong>PhD programs:</strong> a range similar to master's, with wider access to research funding.</li>
<li><strong>MBBS medicine:</strong> typically CNY 30,000–60,000 per year.</li>
</ul>
<h2>Accommodation: the two main options</h2>
<ul>
<li><strong>University dormitory:</strong> a shared room usually costs CNY 750–1,500 per month — the cheapest and safest option for the first year, and often required by universities for new students.</li>
<li><strong>Private housing:</strong> a rented room or apartment usually runs CNY 2,000–5,000 per month depending on city and location — more freedom, higher cost, and normally requires registering the lease with the local police.</li>
</ul>
<h2>Monthly living costs by city</h2>
<p>Beijing and Shanghai are the most expensive, followed by major cities like Guangzhou and Shenzhen. A practical rule:</p>
<ul>
<li><strong>Major cities:</strong> a normal student lifestyle typically costs CNY 2,500–4,000 per month including food, transport, phone and small extras.</li>
<li><strong>Mid-sized and smaller cities:</strong> typically CNY 1,500–2,500 per month for the same lifestyle.</li>
</ul>
<p>University canteens are far cheaper than restaurants — a canteen meal usually costs CNY 10–20, while a mid-range restaurant meal runs CNY 30–60.</p>
<h2>Budget items students forget</h2>
<ul>
<li><strong>Application fees:</strong> most universities charge a non-refundable fee (often CNY 400–800) per program.</li>
<li><strong>Flights:</strong> usually not covered by government scholarships — budget round trips each year.</li>
<li><strong>Medical insurance:</strong> roughly CNY 400–800 per year for students (included in the CSC scholarship).</li>
<li><strong>Residence permit:</strong> the annual fee for converting and renewing your X1-based residence permit.</li>
<li><strong>Books and materials:</strong> small but cumulative.</li>
<li><strong>Settling-in costs:</strong> the first month needs bedding, kitchen basics and room setup — allow CNY 1,000–2,000.</li>
</ul>
<h2>How to bring the cost down</h2>
<ul>
<li>Apply for the <a href="/en/blog/chinese-government-scholarship-csc-guide">Chinese Government Scholarship (CSC)</a> — full coverage includes tuition, accommodation and a monthly stipend.</li>
<li>Look into university and provincial scholarships — less famous and less competitive.</li>
<li>Choose a mid-sized city: the same degree at a clearly lower living cost.</li>
<li>Start in a university dorm for year one, then decide.</li>
</ul>
<h2>An indicative annual budget</h2>
<p>A Chinese-taught bachelor's student in a mid-sized city, without a scholarship: tuition around CNY 20,000 + dorm around CNY 12,000 + living around CNY 24,000 + extras around CNY 5,000 — roughly <strong>CNY 60,000 per year</strong> before any scholarship. In Beijing or Shanghai with an English-taught program, the total can reach about double that figure.</p>
<h2>A methodological note</h2>
<p>All figures above are indicative ranges based on common levels, not fixed prices. Your university's and city's numbers may differ — verifying directly with the university is a step you cannot skip before any financial commitment.</p>
<h2>Want a budget for your exact case?</h2>
<p>We know universities' fee structures and cities' costs, and we help you build a realistic financial plan around your target program. Start with a <a href="/en/contact">free consultation</a> or see our <a href="/en/services">services</a>.</p>
<p><em>Last reviewed: November 2026. Prices are indicative and change — treat the university as the final source.</em></p>$$,
  $$<p>Китай — одно из самых выгодных по стоимости направлений учёбы в сравнении с Европой и Северной Америкой, но точный бюджет требует понимания его реальных составляющих. В этом руководстве — типичные диапазоны с одной важной оговоркой: цифры ориентировочные и различаются между вузами и городами, а окончательный источник — всегда официальная страница оплаты университета.</p>
<h2>Оплата обучения: типичные диапазоны</h2>
<ul>
<li><strong>Языковые программы китайского:</strong> обычно 8 000–25 000 юаней в год в зависимости от вуза и города.</li>
<li><strong>Бакалавриат на китайском:</strong> как правило, 15 000–30 000 юаней в год.</li>
<li><strong>Бакалавриат на английском:</strong> обычно 25 000–50 000 юаней в год — дороже китайскоязычного аналога.</li>
<li><strong>Магистратура:</strong> обычно 20 000–60 000 юаней в год в зависимости от направления и вуза.</li>
<li><strong>Докторантура:</strong> диапазон близок к магистратуре, с более широким доступом к исследовательскому финансированию.</li>
<li><strong>Медицина MBBS:</strong> как правило, 30 000–60 000 юаней в год.</li>
</ul>
<h2>Жильё: два основных варианта</h2>
<ul>
<li><strong>Общежитие университета:</strong> двухместная комната обычно стоит 750–1 500 юаней в месяц — самый экономный и безопасный вариант для первого года, который вузы нередко предписывают первокурсникам.</li>
<li><strong>Частное жильё:</strong> комната или квартира обычно обходятся в 2 000–5 000 юаней в месяц в зависимости от города и района — больше свободы, выше цена, и договор обычно нужно регистрировать в полиции.</li>
</ul>
<h2>Ежемесячные расходы по городам</h2>
<p>Пекин и Шанхай — самые дорогие, далее крупные города вроде Гуанчжоу и Шэньчжэня. Практическое правило:</p>
<ul>
<li><strong>Крупные города:</strong> обычный студенческий образ жизни обходится примерно в 2 500–4 000 юаней в месяц с учётом еды, транспорта, связи и мелких расходов.</li>
<li><strong>Средние и небольшие города:</strong> обычно 1 500–2 500 юаней в месяц при том же образе жизни.</li>
</ul>
<p>Студенческие столовые заметно дешевле ресторанов: обед в столовой обычно стоит 10–20 юаней, а в ресторане среднего уровня — 30–60 юаней.</p>
<h2>Статьи бюджета, о которых забывают</h2>
<ul>
<li><strong>Сборы за подачу:</strong> большинство вузов берёт невозвратный взнос (часто 400–800 юаней) за каждую программу.</li>
<li><strong>Авиабилеты:</strong> государственные стипендии обычно их не покрывают — закладывайте перелёты туда и обратно каждый год.</li>
<li><strong>Медицинская страховка:</strong> примерно 400–800 юаней в год для студентов (входит в стипендию CSC).</li>
<li><strong>Вид на жительство:</strong> ежегодный сбор за преобразование и продление ВНЖ на основе визы X1.</li>
<li><strong>Учебники и материалы:</strong> небольшие, но накапливающиеся расходы.</li>
<li><strong>Обустройство:</strong> в первый месяц нужны постельное бельё, кухонные принадлежности и мелочи — отложите 1 000–2 000 юаней.</li>
</ul>
<h2>Как снизить расходы</h2>
<ul>
<li>Подайте заявку на <a href="/ru/blog/chinese-government-scholarship-csc-guide">стипендию правительства Китая (CSC)</a> — полное покрытие включает обучение, проживание и ежемесячное пособие.</li>
<li>Изучите университетские и провинциальные стипендии — менее известные и менее конкурентные.</li>
<li>Выберите город среднего размера: та же степень при заметно меньших расходах на жизнь.</li>
<li>Первый год живите в общежитии, а потом решайте.</li>
</ul>
<h2>Ориентировочный годовой бюджет</h2>
<p>Студент бакалавриата на китайском в среднем городе без стипендии: обучение около 20 000 юаней + общежитие около 12 000 + жизнь около 24 000 + прочее около 5 000 — примерно <strong>60 000 юаней в год</strong> до стипендий. В Пекине или Шанхае на англоязычной программе итог может достигать примерно вдвое большей суммы.</p>
<h2>Методологическое примечание</h2>
<p>Все цифры выше — ориентировочные диапазоны по распространённым уровням, а не фиксированные цены. Цены вашего вуза и города могут отличаться, и прямая сверка с университетом — обязательный шаг перед любыми финансовыми обязательствами.</p>
<h2>Хотите бюджет именно для вашего случая?</h2>
<p>Мы знаем структуру оплаты вузов и стоимость жизни в городах и поможем составить реалистичный финансовый план под вашу целевую программу. Начните с <a href="/ru/contact">бесплатной консультации</a> или посмотрите наши <a href="/ru/services">услуги</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Цены ориентировочны и меняются — окончательный источник всегда университет.</em></p>$$,
  'scene:hangzhou', 'student_life', 'published', now(), now()
)
on conflict (slug) do nothing;
