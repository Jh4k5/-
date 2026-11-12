-- 0038_blog_batch_2.sql
--
-- Session 7 (mobile redesign + editorial growth): editorial batch 2 —
-- five researched, trilingual (AR/EN/RU) articles for the existing
-- `articles` table and blog architecture. No schema changes.
--
-- Topics (see docs/EDITORIAL-CONTENT-PLAN.md):
--   1. china-application-documents-checklist   (tips)
--   2. china-application-timeline-guide        (tips)
--   3. accommodation-in-china-international-students (student_life)
--   4. university-scholarships-china-guide     (tips)
--   5. banking-payments-china-students-guide   (student_life)
--
-- Content rules followed (same as batch 1):
--   • Original writing in each language (not machine translation).
--   • Only official sources linked.
--   • Costs/requirements framed as indicative ranges; no invented figures,
--     testimonials, rankings, or admission promises.
--   • Localized internal links into conversion paths + cross-links.
--   • Cover images use built-in brand scenes (scene:*) — no storage upload.
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.

-- china-application-documents-checklist.sql
--
-- Editorial batch 2 — single article insert: the complete documents
-- checklist for applying to Chinese universities (trilingual AR/EN/RU),
-- written for the existing `articles` table and blog architecture.
-- Follows the format of 0037_blog_batch_1.sql: dollar-quoted content,
-- scene cover reference, idempotent insert.
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Only official sources linked (chinesetest.cn, campuschina.org,
--     mfa.gov.cn).
--   • Requirements framed as indicative guidance with "check with the
--     university / official portal" direction; no invented figures.
--   • Localized internal links into the site's conversion paths
--     (services, contact, universities) plus cross-links to existing
--     articles (study-in-china-guide, choosing-chinese-university,
--     china-student-visa-x1-x2-guide, english-taught-degrees-china-guide,
--     hsk-levels-guide-study-china).
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ===========================================================================
-- 1 · The complete documents checklist for applying to Chinese universities
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'china-application-documents-checklist',
  $$مستندات القبول الجامعي في الصين: قائمة الوثائق الكاملة للتقديم$$,
  $$Documents Required to Study in China: The Complete Application Checklist$$,
  $$Документы для поступления в Китай: полный чек-лист для заявки$$,
  $$ما هي الوثائق التي يحتاجها الطلاب الدوليون للتقديم في الجامعات الصينية؟ قائمة كاملة تغطي جواز السفر والشهادات والترجمات الموثقة وإثبات اللغة والفحص الطبي، مع جدول زمني للتحضير.$$,
  $$Every document international students need when applying to Chinese universities — passport, diplomas, notarized translations, language proof and medical form — plus a preparation timeline.$$,
  $$Полный список документов для поступления в китайские вузы: паспорт, диплом, нотариальные переводы, подтверждение языка, медсправка — плюс правила нотариального заверения и график подготовки.$$,
  $$<p>حين تتقدّم إلى جامعة صينية، لا تحسم النتيجةَ مقالةٌ واحدة مبهرة بقدر ما يحسمها ملفُّ وثائق مكتمل ومنظّم. الخبر الجيد أن قائمة الوثائق شبه ثابتة في معظم الجامعات الصينية؛ والخبر الأقل سعادة أن التفاصيل الصغيرة — ترجمة موثقة ناقصة هنا، أو اختلاف في تهجئة الاسم هناك — هي بالضبط ما يعرقل الملفات ويؤخرها. في هذا الدليل نجمع لك كل وثيقة يحتاجها الطلاب الدوليون عادةً عند التقديم على الجامعات الصينية، مع القواعد العملية للترجمة والتوثيق وعدد النسخ التي يتعلمها معظم الطلاب بالتجربة المرّة. وإن كنت في بداية الطريق، ابدأ بقراءة <a href="/ar/blog/study-in-china-guide">دليلنا الشامل للدراسة في الصين</a> ثم عُد إلى هذه الصفحة لبناء ملفك خطوة بخطوة.</p>
<h2>الوثائق الأساسية في كل ملف تقديم</h2>
<p>أربع وثائق تشكّل العمود الفقري لأي ملف تقديم، من البكالوريوس إلى الدكتوراه:</p>
<ul>
<li><strong>جواز سفر ساري المفعول.</strong> جوازك هو هوية ملفك كله؛ تُقاس عليه كل وثيقة أخرى. تأكد من صلاحيته لما يتجاوز فترة دراستك المقررة — كقاعدة عملية، بقاء سنتين على الأقل من الصلاحية عند التقديم لبرنامج درجة علمية — ومن وجود صفحات فارغة فيه. تجديد الجواز بعد تقديم الطلبات يخلق اختلافات في الاسم والرقم يستغرق تصحيحها أسابيع.</li>
<li><strong>استمارة التقديم.</strong> تعتمد معظم الجامعات اليوم نظاماً إلكترونياً للتقديم، وتطلب بعضها نسخة PDF موقّعة أيضاً. املأ الاستمارة بالإنجليزية أو الصينية بحيث تطابق الأسماء ما هو مكتوب في جواز السفر حرفاً بحرف، لا كما تكتبه في بريدك الإلكتروني أو حساباتك على وسائل التواصل. عدم تطابق الاستمارة مع بقية الوثائق هو السبب الأشهر لإعادة الملفات لتصحيحها.</li>
<li><strong>أعلى شهادة دراسية أو شهادة التخرج.</strong> يقدّم المتقدمون للبكالوريوس شهادة إتمام المرحلة الثانوية، بينما يقدّم متقدمو الماجستير والدكتوراه شهادات درجاتهم العلمية. أما إن لم تكن قد تخرّجت بعد، فمعظم الجامعات تقبل شهادة رسمية بالتخرج المتوقع صادرة عن مؤسستك الحالية وموقّعة منها.</li>
<li><strong>كشوف الدرجات.</strong> سجل كامل بالمقررات والدرجات لآخر مرحلة دراسية أكملتها، ويُفضّل أن يكون صادراً أو مختوماً من مؤسستك نفسها. وتطلب بعض الجامعات كشوف كل مراحل الدراسة الجامعية، خصوصاً للبرامج البحثية.</li>
</ul>
<p>تعامل مع هذه الوثائق الأربع بوصفها حزمة واحدة: ينبغي أن تحكي معاً قصة واحدة متسقة عن هويتك ودراستك وطريقة كتابة اسمك.</p>
<h2>إثبات المستوى اللغوي</h2>
<p>يعتمد إثبات اللغة كلياً على لغة تدريس البرنامج الذي اخترته، وهو الوثيقة الوحيدة التي لا يمكن إنتاجها بين ليلة وضحاها؛ فمواعيد الاختبارات والتحضير لها وصدور النتائج تحتاج تخطيطاً مسبقاً.</p>
<h3>البرامج المُدرَّسة بالصينية: شهادة HSK</h3>
<p>تشترط الجامعات للبرامج المُدرَّسة بالصينية شهادة HSK بالمستوى الذي تحدده — غالباً حوالي HSK 4 للبكالوريوس وHSK 5 أو أعلى للدراسات العليا، مع اختلاف الشروط من جامعة لأخرى ومن تخصص لآخر. تُصدر الشهادة عبر الجهة الرسمية المشرفة على الاختبار، ويمكنك التسجيل والتحقق من النتائج عبر <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">موقع الاختبار الصيني الرسمي</a>. خطّط لموعد اختبارك بحيث تصلك الشهادة قبل المواعيد النهائية للتقديم، ويشرح <a href="/ar/blog/hsk-levels-guide-study-china">دليلنا لمستويات HSK</a> ماذا تعتمد كل مستوى وكيف تقرأه الجامعات.</p>
<h3>البرامج المُدرَّسة بالإنجليزية: آيلتس وتوفل والبدائل</h3>
<p>تُعدّ درجة آيلتس أو توفل الإثبات المعياري للبرامج الإنجليزية، وتحدد كل جامعة الدرجة المطلوبة بنفسها. وتقبل بعض الجامعات خطاب لغة التدريس من جامعتك السابقة إذا كانت دراستك كلها بالإنجليزية — لكن هذا قرار تعتمده كل جامعة على حدة، ولا يصح افتراضه مسبقاً. اطّلع على <a href="/ar/blog/english-taught-degrees-china-guide">دليلنا للبرامج المُدرَّسة بالإنجليزية في الصين</a> لمعرفة كيف تختلف هذه الشروط بين البرامج.</p>
<h2>خطة الدراسة وخطابات التوصية</h2>
<p>وثيقتان تحملان الوزن الإقناعي في ملفك، خصوصاً في الدراسات العليا:</p>
<ul>
<li><strong>خطة الدراسة أو الرسالة الشخصية.</strong> وثيقة مركّزة — صفحة إلى صفحتين عادةً — تشرح لماذا هذا البرنامج، ولماذا هذه الجامعة، وكيف يتكامل الاختيار مع مسارك الأكاديمي والمهني. وفي البرامج البحثية يُنتظر أن تشير إلى خلفيتك الأكاديمية وإلى الاتجاه الذي تريد أن يأخذه بحثك. الخطة المحددة الشخصية تتفوق دائماً على الخطة المصقولة العامة؛ فلجان القبول تقرأ المئات من النوع الثاني كل عام.</li>
<li><strong>خطابات التوصية.</strong> يُطلب من متقدمي الماجستير والدكتوراه عادةً خطابان من أساتذة أو مشرفين أكاديميين. بعض الجامعات تريدها في مظاريف مغلقة بتوقيع المُوصي على غلق المظروف، وبعضها يقبل ملفات PDF موقّعة تُرفع إلى النظام مباشرة. اطلبها من مُوصيك مبكراً؛ فالخطاب المكتوب على عجل يُعرف من سطوره الأولى.</li>
</ul>
<h2>الوثائق الطبية والصحية والخاصة بالبرامج</h2>
<p>إلى جانب الملف الأساسي، تظهر وثائق إضافية بحسب الجامعة والبرنامج وأحياناً جنسيتك:</p>
<h3>استمارة الفحص الطبي للأجانب</h3>
<p>النموذج الطبي الصيني المعياري للأجانب يعبّؤه طبيب ويختمه المستشفى، ويشمل تحاليل الدم والأشعة والفحص العام. بعض الجامعات تطلبه عند التقديم، وبعضها بعد القبول أو أثناء إجراءات التأشيرة. أجرِ الفحص قريباً من وقت الحاجة إليه، لأن لنتائجه مدة صلاحية محدودة.</p>
<h3>شهادة عدم وجود سوابق جنائية</h3>
<p>تطلب بعض الجامعات وبرامج المنح شهادة عدم وجود سوابق صادرة في بلدك. مدة إصدارها تتفاوت كثيراً بين الدول — من أيام قليلة إلى أسابيع — فتحقق مبكراً مما إذا كانت جامعاتك المستهدفة تطلبها.</p>
<h3>ملف الأعمال للبرامج الفنية</h3>
<p>يتضمن التقديم على برامج الفنون الجميلة والتصميم والعمارة والموسيقى عادةً ملف أعمال أو تسجيلاً لأداء، وفق قواعد الشكل والحجم التي تحددها كل كلية، ويُقيَّم ملف الأعمال إلى جانب سجلك الأكاديمي وأحياناً قبله في البرامج التنافسية.</p>
<h3>الإثبات المالي</h3>
<p>تطلب بعض الجامعات كشف حساب بنكي أو خطاب كفالة من ممول يثبت قدرتك على تغطية الرسوم وتكاليف المعيشة، وتظهر الوثائق المالية أيضاً في طلبات التأشيرة لبعض المتقدمين. ولأن المبالغ والصيغ المقبولة تختلف، فاجعل مكتب القبول في الجامعة والقنوات الرسمية للتأشيرة مصدر القرار النهائي.</p>
<h2>الترجمة والتوثيق والتصديقات</h2>
<p>هنا تتعثر معظم الملفات، فافهم الفروق الثلاثة التالية جيداً:</p>
<ul>
<li><strong>الترجمة.</strong> الوثائق الصادرة بغير الصينية أو الإنجليزية تحتاج عموماً ترجمة معتمدة — وغالباً موثقة لدى كاتب عدل. حين تحدد الجامعات عبارة «ترجمة موثقة» للشهادات وكشوف الدرجات، فالمقصود ترجمة ينفذها مترجم مرخّص أو مكتب توثيق معتمد، لا صديق يجيد اللغتين.</li>
<li><strong>النسخ الموثقة.</strong> حين تطلب الجامعة «نسخة موثقة» من شهادتك، فإن كاتب العدل يتحقق من مطابقة النسخة للأصل — خطوة تنجزها في بلدك قبل رفع أي شيء إلى النظام.</li>
<li><strong>التصديق.</strong> بعض الجامعات والجهات تطلب تصديق الوثائق الأجنبية الرسمية لاستخدامها في الصين. ومنذ انضمام الصين إلى اتفاقية أبستيل (السارية من نوفمبر 2023)، تكفي شهادة أبستيل الصادرة عن الجهة المختصة في بلدك لكثير من الوثائق الصادرة في الدول الأعضاء؛ وحيث لا ينطبق ذلك، يبقى المسار الأقدم: التصديق القنصلي عبر سفارة أو قنصلية الصين. أي المسارين ينطبق على وثائقك يعتمد على بلدك وعلى ما تطلبه الجامعة فعلاً — تحقق من الاثنين قبل إنفاق المال على أي منهما.</li>
</ul>
<p>ملاحظة عملية: اطلب من الترجمات الموثقة نسخاً أكثر مما تظن أنك تحتاج؛ فالتقديم على عدة جامعات بمجموعة واحدة منها اقتصاد زائف كلاسيكي.</p>
<h2>النسخ والمسوح الضوئية وكم تحتاج من كل شيء</h2>
<p>نظام بسيط يبقي الملف تحت السيطرة:</p>
<ul>
<li><strong>المسوح الرقمية أولاً.</strong> معظم الطلبات تبدأ إلكترونياً. امسح الوثائق بالألوان بدقة 300 نقطة للبوصة أو أعلى، مع تضمين الصفحات كاملة بما فيها الأختام والتواقيع، وسمِّ الملفات بأسماء واضحة يسهل تمييزها.</li>
<li><strong>مجموعتان أو ثلاث ورقية موثقة.</strong> احتفظ بمجموعة سليمة لنفسك لا تُمسّ، واستخدم البقية للتقديم ولاحقاً لملف التأشيرة. الوثائق الموثقة هي الجزء الأغلى في الملف فاحمِها من الضياع.</li>
<li><strong>الأصول تبقى معك.</strong> لا تكاد تطلب أي جامعة شهادتك الأصلية عند التقديم — النسخ الموثقة أو المسوح الضوئية هي القاعدة. لكن أحضر الأصول معك إلى الصين؛ فغالباً ما تُطلب بعد الوصول لاستكمال التسجيل وإجراءات الإقامة.</li>
</ul>
<h2>أخطاء شائعة في الوثائق</h2>
<ul>
<li><strong>ترجمات ناقصة أو غير معتمدة</strong> — الوثائق المترجمة ذاتياً أو الخالية من ختم التوثيق تُوضع جانباً بصمت.</li>
<li><strong>جواز سفر قصير الصلاحية</strong> — تجديد الجواز في منتصف التقديم يغيّر رقم الوثيقة ويعيدك خطوات إلى الوراء.</li>
<li><strong>أسماء غير متطابقة</strong> — فرق حرفين بين الجواز والشهادة وشهادة HSK يثير أسئلة تُجيب عليها بوثائق إضافية. وإذا كانت وثائقك تهجئ اسمك فعلاً بصور مختلفة، فجهّز مسبقاً تأكيداً موثقاً لهذا الاختلاف.</li>
<li><strong>مسوح مقصوصة أو باهتة</strong> — الأختام المبتورة والدرجات غير المقروءة تجعل المراجع يشك في الوثيقة كلها.</li>
<li><strong>نسخ قديمة من النماذج</strong> — نزّل دائماً استمارة الفحص الطبي ونماذج التقديم للسنة الحالية من المصدر الرسمي.</li>
</ul>
<h2>جدول زمني مقترح للتحضير</h2>
<p>بالعد التنازلي من موعد التحاق نموذجي في سبتمبر، يبدو الإيقاع المريح هكذا:</p>
<ol>
<li><strong>قبل 8–10 أشهر:</strong> افحص صلاحية جوازك، وابدأ البحث عن الجامعات وتقصيل قائمتها — <a href="/ar/blog/choosing-chinese-university">دليل اختيار الجامعة الصينية</a> يساعدك هنا — واحجز أي اختبار لغة ما زلت تحتاجه.</li>
<li><strong>قبل 6–8 أشهر:</strong> أدِّ اختبار HSK أو آيلتس/توفل، واطلب كشوف الدرجات وشهادات التخرج المتوقع، وابدأ الترجمات الموثقة.</li>
<li><strong>قبل 4–6 أشهر:</strong> اكتب خطة دراستك، واجمع خطابات التوصية، وقدّم طلباتك قبل المواعيد النهائية.</li>
<li><strong>قبل 2–4 أشهر:</strong> أجرِ الفحص الطبي، ورتّب شهادة السوابق والإثبات المالي حيث يلزم، واستجب فوراً لأي طلبات تكميلية من الجامعات.</li>
<li><strong>بعد القبول:</strong> جهّز الوثائق نفسها من جديد لملف التأشيرة — يشرح <a href="/ar/blog/china-student-visa-x1-x2-guide">دليل تأشيرتي X1 وX2</a> ماذا ستطلبه السفارة. ويمكنك أيضاً استكشاف البرامج مباشرة عبر <a href="/ar/universities">دليل الجامعات</a> لدينا في أثناء الانتظار.</li>
</ol>
<p>وإن كنت تتقدّم أيضاً لمنحة حكومية فوق القبول، فتوقّع قائمة وثائق أطول قليلاً؛ ينشر <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">بوابة Campus China الرسمية</a> متطلبات كل دورة تقديم، بينما تشرح صفحات الأقسام القنصلية على <a href="https://www.mfa.gov.cn" target="_blank" rel="noopener noreferrer">موقع وزارة الخارجية الصينية</a> مسار التصديق القنصلي عبر السفارات.</p>
<h2>جاهز لبناء ملف تقديمك؟</h2>
<p>الملف المكتمل المتسق جيد الترجمة يؤدي نصف عمل القبول. إن أردت عيناً خبيرة تراجع وثائقك قبل التقديم، فاحجز <a href="/ar/contact">استشارة مجانية مع فريق جسر الصين التعليمية</a> أو اطّلع على <a href="/ar/services">خدماتنا في دعم التقديم</a>. التفاصيل الصغيرة التي تُفحص مبكراً هي ما يبقي ملفك متحركاً نحو القبول.</p>
<p><em>آخر مراجعة: نوفمبر 2026. تختلف المتطلبات بين الجامعات وتتغير من سنة إلى أخرى — تحقق دائماً من مكتب القبول في جامعتك المستهدفة ومن البوابات الرسمية.</em></p>$$,
  $$<p>Most applications to Chinese universities are decided less by one brilliant essay and more by the quality of a folder of paperwork. The good news is that the document list is remarkably predictable from one university to the next. The catch is that the details — a missing notarized translation here, a mismatched name there — are exactly where files stall or quietly get set aside. This checklist walks you through every document international students typically need when applying to Chinese universities, together with the practical rules around translations, notarization and copies that most students learn the hard way. If you are still mapping out the overall journey, start with our <a href="/en/blog/study-in-china-guide">complete guide to studying in China</a>; this article is the paperwork layer on top of it.</p>
<h2>The core documents every application needs</h2>
<p>Four documents form the backbone of virtually every Chinese university application, from bachelor's to PhD level:</p>
<ul>
<li><strong>A valid passport.</strong> Your passport is the identity spine of the whole file: every other document gets checked against it. Make sure it stays valid well beyond your intended period of study — as a practical rule of thumb, aim for at least two years of validity remaining when you apply for a degree program — and that it has blank pages. Renewing a passport after you have submitted applications creates name and number mismatches that take weeks to untangle.</li>
<li><strong>The application form.</strong> Most universities now run an online admissions portal, and several also ask for a signed PDF of the form. Fill it in in English or Chinese with your name written exactly as it appears in your passport — not as it appears in your email signature. Inconsistencies between the form and your documents are the most common reason files get bounced back for corrections.</li>
<li><strong>Your highest diploma or graduation certificate.</strong> Bachelor's applicants submit their secondary-school leaving certificate; master's and PhD applicants submit their degree certificates. If you have not graduated yet, universities generally accept an official certificate of expected graduation issued and signed by your current institution.</li>
<li><strong>Academic transcripts.</strong> A complete record of courses and grades for your most recent finished stage of study, ideally issued or stamped by the institution itself. Some universities — especially for research programs — ask for transcripts covering all post-secondary study.</li>
</ul>
<p>Treat these four as a single package: together they must tell one consistent story about who you are, what you have studied and how your name is spelled.</p>
<h2>Proof of language proficiency</h2>
<p>Language proof depends entirely on the teaching language of your chosen program, and it is the one document you cannot produce overnight: test dates, preparation and results all take planning.</p>
<h3>Chinese-taught programs: the HSK certificate</h3>
<p>For programs taught in Chinese, universities ask for an HSK certificate at a level they specify — commonly around HSK 4 for bachelor's programs and HSK 5 or above for graduate programs, though exact requirements vary by university and major. Certificates are issued through the official test administration; you can register and verify results on the <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">official Chinese Test website</a>. Book a test date that gets the certificate into your hands before application deadlines, and read our detailed <a href="/en/blog/hsk-levels-guide-study-china">guide to HSK levels</a> to understand what each level certifies and how universities use it.</p>
<h3>English-taught programs: IELTS, TOEFL and alternatives</h3>
<p>For programs taught in English, an IELTS or TOEFL score is the standard proof, with the required score set by each university. Some universities accept a medium-of-instruction letter from your previous school if your entire degree was taught in English — but that is a decision each university makes individually, never an assumption you can rely on. Our <a href="/en/blog/english-taught-degrees-china-guide">guide to English-taught degrees in China</a> explains how these requirements differ between programs.</p>
<h2>Study plan and recommendation letters</h2>
<p>Two documents carry the persuasive weight of an application, especially at graduate level:</p>
<ul>
<li><strong>The study plan or personal statement.</strong> A focused document — typically one to two pages — that explains why this program, why this university, and how both connect to your academic and professional path. For research programs, it should draw on your academic background and point to the direction you want your research to take. A specific, personal study plan consistently outperforms a polished but generic one; admissions committees read hundreds of the latter every year.</li>
<li><strong>Recommendation letters.</strong> Master's and PhD applicants are normally asked for two letters from professors or academic supervisors. Some universities want them in sealed envelopes with the referee's signature across the flap; others accept signed PDFs uploaded to the portal. Ask your referees well in advance — a letter written in a rush is obvious from its first lines.</li>
</ul>
<h2>Medical, background and program-specific documents</h2>
<p>Beyond the core file, additional documents appear depending on the university, the program and sometimes your nationality:</p>
<h3>The Foreigner Physical Examination Form</h3>
<p>China's standard medical form for foreigners is filled in by a physician and stamped by the hospital, and it covers blood tests, an X-ray and a general examination. Some universities request it at application stage; others only after admission or during visa processing. Schedule the examination close to when the form is actually needed, because the results have a limited validity window.</p>
<h3>Police clearance</h3>
<p>Some universities and scholarship programs ask for a certificate of no criminal record issued in your home country. Processing times vary enormously between countries — from a few days to several weeks — so check early whether your target universities require it.</p>
<h3>Portfolios for art and design programs</h3>
<p>Applications to fine arts, design, architecture and music programs usually include a portfolio or an audition recording, following format and size rules set by each faculty. Portfolios are assessed alongside your academic file — and in some competitive programs, ahead of it.</p>
<h3>Financial proof</h3>
<p>Some universities ask for a bank statement or a sponsor letter showing that you can cover tuition and living costs, and financial documents also come up in visa applications for some applicants. Because amounts and accepted formats differ, treat the university's admissions office and the official visa channels as the deciding sources.</p>
<h2>Notarization, translation and authentication</h2>
<p>This is where most files go wrong, so keep three distinct concepts separate:</p>
<ul>
<li><strong>Translation.</strong> Documents issued in neither Chinese nor English generally need a certified — and often notarized — translation. When a university asks for a "notarized translation" of your diploma or transcripts, it means a translation prepared or certified by a licensed translator or notary office, not by a friend who happens to speak both languages.</li>
<li><strong>Notarized copies.</strong> Where a university asks for a "notarized copy" of a certificate, a notary public confirms that the copy matches the original — a step you complete at home, before anything is uploaded.</li>
<li><strong>Authentication.</strong> Some universities and authorities want foreign public documents authenticated for use in China. Since China joined the Hague Apostille Convention (in force from November 2023), an apostille issued by your own country's competent authority is sufficient for many documents from fellow member states; where this does not apply, the older route of consular legalization through a Chinese embassy or consulate remains. Which route applies to your documents depends on your country and on what the university actually requests — confirm both before spending money on either.</li>
</ul>
<p>One practical note: order more notarized translations than you think you need. Applying to several universities with a single set of documents is a classic false economy.</p>
<h2>Copies, scans and how many of each</h2>
<p>A simple system keeps the paperwork manageable:</p>
<ul>
<li><strong>Digital scans first.</strong> Most applications begin online. Scan in color at 300 dpi or higher, capture full pages including stamps and signatures, and give files clear names (for example, Passport_Surname_GivenName.pdf).</li>
<li><strong>Two or three notarized paper sets.</strong> Keep one set untouched for yourself, and use the others for submissions and later for the visa file. Notarized documents are the most expensive part of the folder, so protect them.</li>
<li><strong>Originals stay with you.</strong> Universities almost never need your original diploma at application stage — certified copies or scans are the norm. Do bring the originals to China, though: they are routinely requested after arrival for registration and residence procedures.</li>
</ul>
<h2>Common document mistakes to avoid</h2>
<ul>
<li><strong>Missing or uncertified translations</strong> — self-made translations or versions without the notary's stamp tend to be quietly set aside.</li>
<li><strong>Short passport validity</strong> — renewing a passport mid-application changes your document number and forces parts of the file to be redone.</li>
<li><strong>Mismatched names</strong> — a two-letter difference between your passport, diploma and HSK certificate raises questions that you then answer with even more paperwork. If your documents genuinely spell your name differently, prepare a notarized confirmation of the variation in advance.</li>
<li><strong>Cropped or faint scans</strong> — cut-off stamps and unreadable grades make reviewers doubt the whole document.</li>
<li><strong>Outdated forms</strong> — always download the current year's physical examination form and application templates from the official source.</li>
</ul>
<h2>A suggested preparation timeline</h2>
<p>Counting backwards from a typical September intake, a comfortable rhythm looks like this:</p>
<ol>
<li><strong>8–10 months before:</strong> check your passport validity, research and shortlist universities — our <a href="/en/blog/choosing-chinese-university">guide to choosing a Chinese university</a> helps here — and book any language test you still need.</li>
<li><strong>6–8 months before:</strong> sit the HSK or IELTS/TOEFL, request transcripts and expected-graduation letters, and start the notarized translations.</li>
<li><strong>4–6 months before:</strong> write your study plan, collect recommendation letters, and submit applications ahead of the deadlines.</li>
<li><strong>2–4 months before:</strong> complete the physical examination, arrange police clearance and financial proof where required, and answer any university follow-up requests promptly.</li>
<li><strong>After admission:</strong> assemble the same documents again for your visa file — our <a href="/en/blog/china-student-visa-x1-x2-guide">X1 and X2 student visa guide</a> explains what the embassy will ask for. While you wait, you can explore programs directly through our <a href="/en/universities">universities directory</a>.</li>
</ol>
<p>Applying for a government scholarship on top of admission? Expect a slightly longer document list: the official <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">Campus China portal</a> publishes the requirements for each application round, and the consular pages of the <a href="https://www.mfa.gov.cn" target="_blank" rel="noopener noreferrer">Chinese Ministry of Foreign Affairs</a> describe how legalization through embassies works.</p>
<h2>Ready to build your application file?</h2>
<p>A complete, consistent, properly translated file does half the work of admission. If you would like an experienced pair of eyes on your documents before you submit, book a <a href="/en/contact">free consultation with Bridge to China Edu</a> or read about our <a href="/en/services">application support services</a>. Small details, checked early, are what keep an application moving.</p>
<p><em>Last reviewed: November 2026. Requirements differ between universities and change from year to year — always confirm with the admissions office of your target university and with the official portals.</em></p>$$,
  $$<p>Поступление в китайский университет решает не одно блестящее эссе, а качество собранного пакета документов. Хорошая новость: список бумаг в китайских вузах на удивление предсказуем. Плохая — именно на деталях, вроде отсутствующего нотариального перевода или разнобоя в написании фамилии, заявки застревают или незаметно откладываются в сторону. В этом руководстве собраны все документы, которые обычно нужны иностранным студентам при поступлении, а также практические правила переводов, нотариального заверения и количества копий, которые большинство узнаёт на собственных ошибках. Если вы только начинаете разбираться в процессе в целом, сначала прочитайте наше <a href="/ru/blog/study-in-china-guide">полное руководство об учёбе в Китае</a>, а затем возвращайтесь сюда — собирать папку.</p>
<h2>Базовые документы любой заявки</h2>
<p>Четыре документа образуют каркас практически любой заявки — от бакалавриата до докторантуры:</p>
<ul>
<li><strong>Действующий загранпаспорт.</strong> Паспорт — это «хребет» всего досье: с ним сверяют каждый остальной документ. Убедитесь, что он действует заметно дольше планируемого периода учёбы — практическое правило: не меньше двух лет запаса на момент подачи на программу степени — и что в нём есть чистые страницы. Продление паспорта после подачи заявок создаёт расхождения в имени и номере, которые приходится распутывать неделями.</li>
<li><strong>Анкета поступающего.</strong> Большинство вузов сегодня принимает документы через онлайн-систему, а некоторые дополнительно просят подписанный PDF. Заполняйте анкету на английском или китайском строго так, как имя указано в паспорте, — не так, как оно написано в вашей электронной почте. Несоответствие анкеты остальным документам — самая частая причина возврата заявки на исправление.</li>
<li><strong>Диплом или аттестат о последнем образовании.</strong> Абитуриенты бакалавриата подают аттестат о среднем образовании, поступающие в магистратуру и докторантуру — дипломы о соответствующих степенях. Если вы ещё не завершили учёбу, вузы, как правило, принимают официальную справку о предстоящем окончании, выданную и подписанную вашим учебным заведением.</li>
<li><strong>Академическая справка с оценками.</strong> Полный перечень предметов и оценок за последнюю завершённую ступень, в идеале выданная или заверенная самим заведением. Некоторые вузы, особенно по исследовательским программам, просят выписки за все годы обучения после школы.</li>
</ul>
<p>Относитесь к этим четырём документам как к единому пакету: вместе они должны складываться в одну непротиворечивую историю о том, кто вы, что изучали и как пишется ваше имя.</p>
<h2>Подтверждение языка</h2>
<p>Языковой сертификат зависит исключительно от языка программы, и это единственный документ, который нельзя изготовить за ночь: даты экзаменов, подготовка и выпуск результатов требуют планирования.</p>
<h3>Программы на китайском: сертификат HSK</h3>
<p>Для программ на китайском вузы требуют сертификат HSK указанного ими уровня — как правило, примерно HSK 4 для бакалавриата и HSK 5 и выше для магистратуры и докторантуры, хотя точные требования различаются по вузам и специальностям. Сертификат выдаётся официальной экзаменационной системой; зарегистрироваться и проверить результаты можно на <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">официальном сайте китайских экзаменов</a>. Выбирайте дату теста так, чтобы сертификат оказался на руках до дедлайнов, и прочитайте наш подробный <a href="/ru/blog/hsk-levels-guide-study-china">гид по уровням HSK</a> — он объясняет, что подтверждает каждый уровень и как его читают вузы.</p>
<h3>Программы на английском: IELTS, TOEFL и альтернативы</h3>
<p>Для англоязычных программ стандартным подтверждением служит сертификат IELTS или TOEFL, а проходной балл устанавливает каждый вуз самостоятельно. Некоторые университеты принимают письмо о языке обучения от предыдущего учебного заведения, если вся ваша программа была на английском, — но это решение каждый вуз принимает индивидуально, и полагаться на него по умолчанию нельзя. В нашем <a href="/ru/blog/english-taught-degrees-china-guide">руководстве по англоязычным программам в Китае</a> показано, как эти требования различаются между направлениями.</p>
<h2>План обучения и рекомендательные письма</h2>
<p>Два документа несут на себе убеждающую нагрузку досье, особенно в магистратуре и докторантуре:</p>
<ul>
<li><strong>План обучения (Study Plan) или мотивационное письмо.</strong> Сфокусированный текст — обычно одна-две страницы, — объясняющий, почему эта программа, почему этот вуз и как всё это связано с вашим академическим и профессиональным путём. В исследовательских программах ожидается, что вы обопрётесь на свою научную базу и обозначите желаемое направление работы. Конкретный, личный план стабильно выигрывает у отполированного, но безликого: приёмные комиссии читают сотни вторых ежегодно.</li>
<li><strong>Рекомендательные письма.</strong> Поступающим в магистратуру и докторантуру обычно нужны два письма от преподавателей или научных руководителей. Одни вузы хотят их в запечатанных конвертах с подписью рекомендателя поперёк клапана, другие принимают подписанные PDF, загруженные в систему. Просите письма заранее: написанное впопыхах видно с первых строк.</li>
</ul>
<h2>Медицина, справки и специальные документы</h2>
<p>Поверх базового пакета, в зависимости от вуза, программы, а иногда и гражданства, появляются дополнительные бумаги:</p>
<h3>Медицинская форма для иностранцев</h3>
<p>Стандартную китайскую форму медицинского осмотра заполняет врач, а больница ставит печать; осмотр включает анализы крови, рентген и общий осмотр. Одни вузы просят форму на этапе подачи, другие — после зачисления или при оформлении визы. Проходите осмотр ближе к моменту, когда форма действительно нужна: у результатов ограниченный срок действия.</p>
<h3>Справка об отсутствии судимости</h3>
<p>Некоторые вузы и стипендиальные программы просят справку о несудимости, выданную в вашей стране. Сроки её изготовления сильно различаются — от нескольких дней до нескольких недель, поэтому заранее выясните, нужна ли она вашим целевым вузам.</p>
<h3>Портфолио для творческих программ</h3>
<p>Заявки на программы изящных искусств, дизайна, архитектуры и музыки обычно включают портфолио или видеозапись выступления по правилам формата и объёма, которые устанавливает каждый факультет. Портфолио оценивается наравне с академическим досье, а в самых конкурентных программах — в первую очередь.</p>
<h3>Финансовые подтверждения</h3>
<p>Ряд вузов просит банковскую выписку или письмо спонсора, подтверждающие способность покрыть обучение и проживание; финансовые документы фигурируют и в визовых досье ряда заявителей. Поскольку суммы и принимаемые форматы различаются, окончательными источниками считаются приёмная комиссия вуза и официальные визовые каналы.</p>
<h2>Перевод, нотариус и легализация</h2>
<p>Здесь спотыкается большинство досье, поэтому разделяйте три разных понятия:</p>
<ul>
<li><strong>Перевод.</strong> Документы, выданные не на китайском и не на английском, обычно требуют сертифицированного — как правило, нотариально заверенного — перевода. Когда вуз формулирует требование как «нотариальный перевод» дипломов и выписок, имеется в виду перевод, выполненный или заверенный лицензированным переводчиком либо нотариальной конторой, а не знакомым, владеющим двумя языками.</li>
<li><strong>Заверенные копии.</strong> Если вуз просит «нотариально заверенную копию» сертификата, нотариус подтверждает соответствие копии оригиналу — это делается дома, до любой загрузки в систему.</li>
<li><strong>Легализация.</strong> Некоторые вузы и инстанции хотят, чтобы иностранные официальные документы были легализованы для использования в Китае. С момента присоединения КНР к Гаагской конвенции об апостиле (действует с ноября 2023 года) для многих документов из стран-участниц достаточно апостиля от компетентного органа вашей страны; там, где это не применимо, остаётся прежний путь — консульская легализация через посольство или консульство КНР. Какой из маршрутов относится к вашим документам, зависит от страны и от того, что именно требует вуз, — проверьте и то и другое, прежде чем тратить деньги.</li>
</ul>
<p>Практический совет: заказывайте нотариальных переводов больше, чем кажется нужным. Подавать документы в несколько вузов с одним комплектом — классическая ложная экономия.</p>
<h2>Копии, сканы и сколько чего готовить</h2>
<p>Простая система удерживает бумаги под контролем:</p>
<ul>
<li><strong>Сначала цифровые сканы.</strong> Большинство заявок начинается онлайн. Сканируйте в цвете с разрешением 300 dpi и выше, полными страницами вместе с печатями и подписями и давайте файлам понятные имена.</li>
<li><strong>Два-три бумажных заверенных комплекта.</strong> Один храните нетронутым для себя, остальные используйте для подачи и позже — для визового досье. Нотариальные документы — самая дорогая часть папки, берегите их.</li>
<li><strong>Оригиналы остаются с вами.</strong> На этапе подачи вузу почти никогда не нужен оригинал диплома — нормой являются заверенные копии или сканы. Но привезите оригиналы в Китай: после приезда их обычно требуют при регистрации и оформлении вида на жительство.</li>
</ul>
<h2>Типичные ошибки в документах</h2>
<ul>
<li><strong>Отсутствующие или несертифицированные переводы</strong> — самодельные переводы и версии без нотариального штампа молча откладываются в сторону.</li>
<li><strong>Короткий срок действия паспорта</strong> — продление паспорта посреди подачи меняет номер документа и вынуждает переделывать часть досье.</li>
<li><strong>Разнобой в написании имени</strong> — расхождение в две буквы между паспортом, дипломом и сертификатом HSK порождает вопросы, на которые приходится отвечать новыми бумагами. Если документы действительно пишут ваше имя по-разному, заранее подготовьте нотариальное подтверждение вариантов написания.</li>
<li><strong>Обрезанные или блёклые сканы</strong> — обрезанная печать и нечитаемые оценки заставляют проверяющего сомневаться во всём документе.</li>
<li><strong>Старые версии бланков</strong> — всегда скачивайте медицинскую форму и шаблоны заявок текущего года из официального источника.</li>
</ul>
<h2>Ориентировочный график подготовки</h2>
<p>Если считать назад от типичного сентябрьского набора, комфортный ритм выглядит так:</p>
<ol>
<li><strong>За 8–10 месяцев:</strong> проверьте срок действия паспорта, составьте шорт-лист вузов — здесь помогает наш <a href="/ru/blog/choosing-chinese-university">гид по выбору китайского университета</a> — и запишитесь на нужный языковой экзамен.</li>
<li><strong>За 6–8 месяцев:</strong> сдайте HSK или IELTS/TOEFL, запросите выписки и справки о предстоящем окончании, начните нотариальные переводы.</li>
<li><strong>За 4–6 месяцев:</strong> напишите план обучения, соберите рекомендательные письма и подайте заявки до дедлайнов.</li>
<li><strong>За 2–4 месяца:</strong> пройдите медицинский осмотр, оформите справку о несудимости и финансовые документы там, где они нужны, и оперативно отвечайте на запросы вузов.</li>
<li><strong>После зачисления:</strong> соберите те же документы заново для визового досье — наш <a href="/ru/blog/china-student-visa-x1-x2-guide">гид по студенческим визам X1 и X2</a> объясняет, что попросит посольство. А пока ждёте решения, изучайте программы напрямую через наш <a href="/ru/universities">каталог университетов</a>.</li>
</ol>
<p>Если вы одновременно претендуете на государственную стипендию, готовьтесь к чуть более длинному списку бумаг: официальный портал <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">Campus China</a> публикует требования каждого приёмного раунда, а порядок консульской легализации через посольства описывают консульские страницы на <a href="https://www.mfa.gov.cn" target="_blank" rel="noopener noreferrer">сайте МИД КНР</a>.</p>
<h2>Готовы собрать своё досье?</h2>
<p>Полное, непротиворечивое и хорошо переведённое досье делает половину работы за поступление. Если хотите, чтобы на ваши документы до подачи взглянул опытный специалист, запишитесь на <a href="/ru/contact">бесплатную консультацию Bridge to China Edu</a> или посмотрите наши <a href="/ru/services">услуги по сопровождению поступления</a>. Мелочи, проверенные заранее, — это то, что не даёт заявке останавливаться на полпути.</p>
<p><em>Последняя проверка: ноябрь 2026. Требования различаются между вузами и меняются год от года — всегда сверяйтесь с приёмной комиссией целевого университета и официальными порталами.</em></p>$$,
  'scene:campus-library', 'tips', 'published', '2026-11-12T10:00:00+00', '2026-11-12T10:00:00+00'
)
on conflict (slug) do nothing;


-- china-application-timeline-guide.sql
--
-- Editorial batch 2 — one article: application timeline and deadlines
-- for Chinese universities (trilingual AR/EN/RU), written for the existing
-- `articles` table following the format of 0037_blog_batch_1.sql.
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Calendar presented as a TYPICAL pattern; readers directed to confirm
--     exact dates with each university and the official portals. No exact
--     deadlines stated as facts.
--   • Only official sources linked (campuschina.org, chinesetest.cn,
--     visaforchina.cn).
--   • Localized internal links into conversion paths + cross-links to
--     existing articles (study-in-china-guide,
--     chinese-government-scholarship-csc-guide, csc-scholarship-steps,
--     china-student-visa-x1-x2-guide, study-in-china-costs-guide).
--   • Cover image uses the site's built-in brand scene (scene:campus-gate).
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.

-- ===========================================================================
-- Application timeline and deadlines for Chinese universities
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'china-application-timeline-guide',
  $$الجدول الزمني للتقديم للجامعات الصينية: دليل شهري للمراحل والمواعيد$$,
  $$Application Timeline for Chinese Universities: A Month-by-Month Guide$$,
  $$Календарь поступления в китайские университеты: месяц за месяцем$$,
  $$متى تفتح الجامعات الصينية باب التقديم ومتى تغلقه؟ جولة شهرية في دورة الالتحاق الخريفي المعتادة، مع مواعيد منحة CSC والالتحاق الربيعي وخيارات المتأخرين.$$,
  $$When do Chinese universities open and close applications? A month-by-month walkthrough of the typical autumn intake cycle, CSC scholarship timing, the spring intake and options for late applicants.$$,
  $$Когда вузы Китая открывают и закрывают приём документов? Разбираем типичный цикл сентябрьского набора, сроки стипендии CSC, весенний набор и варианты для опоздавших абитуриентов.$$,
  $$<p>«متى أبدأ التقديم للجامعات الصينية؟» سؤالٌ يسبق كل الأسئلة الأخرى تقريباً، والإجابة الصادقة أنه لا يوجد موعد نهائي واحد للجميع: كل جامعة صينية تضع تقويمها الخاص بالقبول. لكن للسنة الدراسية إيقاع واضح يمكن قراءته مسبقاً، وحين تفهمه يصبح الطريق أقل غموضاً بكثير. في هذا الدليل نستعرض دورة تقديم نموذجية للالتحاق في سبتمبر (الفصل الخريفي الرئيسي)، بدءاً من التحضير قبل نحو اثني عشر شهراً وصولاً إلى وصولك إلى الحرم الجامعي. تعامل مع كل ما يلي كنمط معتاد لا كقائمة قواعد ثابتة: التواريخ تختلف من جامعة لأخرى ومن برنامج لآخر ومن سنة لأخرى، لذا أكّد دائماً المواعيد النهائية مع كل جامعة ومع البوابات الرسمية. ومن هنا عادةً يبدأ عملنا في جسر الصين التعليمية: تحويل مواعيد مبعثرة إلى تقويم شخصي واحد واضح.</p>
<h2>لماذا لا يوجد موعد نهائي واحد؟</h2>
<p>على عكس الدول التي تدير التقديم عبر نظام مركزي موحّد، تترك الصين شؤون القبول بيد كل جامعة على حدة. لهذا قد تجد برنامجين في الجامعة نفسها بموعدين نهائيين مختلفين، ولن يستطيع أي مقال — بما في ذلك هذا الدليل — أن يمنحك «التاريخ» القطعي. عملياً، تختلف نوافذ التقديم لأسباب عدة:</p>
<ul>
<li><strong>استقلالية الجامعات:</strong> كل مكتب قبول ينشر جدوله الخاص، وبعض الجامعات تراجع الطلبات كليةً بكلية.</li>
<li><strong>المرحلة الدراسية:</strong> برامج البكالوريوس والماجستير والدكتوراه واللغة الصينية تسير غالباً على إيقاعات مختلفة.</li>
<li><strong>لغة الدراسة:</strong> البرامج المُدرَّسة بالإنجليزية تفتح أحياناً وتُغلق قبل نظيراتها المُدرَّسة بالصينية.</li>
<li><strong>التمويل الذاتي مقابل المنح:</strong> مسارات المنح — خصوصاً منحة الحكومة الصينية CSC — تُغلق عادةً قبل مسارات التقديم الذاتي بوقت كافٍ.</li>
<li><strong>سعة المقاعد والسكن:</strong> البرامج الشهيرة قد تُغلق مبكراً بعد اكتمال الأعداد، لا سيما في نظام المراجعة المستمرة.</li>
</ul>
<p>الخلاصة العملية بسيطة: ابنِ قائمة برامجك المستهدفة، سجّل كل موعد نهائي في تقويم واحد، وأعد التحقق من الصفحات الرسمية قبل كل تقديم، فالجامعات تعدّل تواريخها من سنة لأخرى.</p>
<h2>الالتحاق الخريفي المعتاد في لمحة</h2>
<p>التحاق سبتمبر هو الدورة الرئيسية في معظم الجامعات الصينية. وبشكله العام، تبدو السنة النموذجية هكذا:</p>
<ol>
<li><strong>قبل الالتحاق بنحو 12 شهراً (تقريباً بين سبتمبر ونوفمبر من العام السابق):</strong> البحث عن الجامعات والبرامج، ووضع قائمة مختصرة، وبدء التحضير لاختبارات اللغة.</li>
<li><strong>أواخر الخريف والشتاء:</strong> استكمال ملف الوثائق بينما تبدأ نوافذ التقديم في الانفتاح عادةً.</li>
<li><strong>من الشتاء إلى الربيع:</strong> تقديم الطلبات، وتركّز معظم مواعيد المنح في هذه المرحلة.</li>
<li><strong>الربيع وأوائل الصيف:</strong> مراجعة الملفات وإعلان النتائج، ثم وصول خطاب القبول ونموذج JW202 لاحقاً.</li>
<li><strong>الصيف:</strong> التقديم على تأشيرة الطالب بعد اكتمال وثائق القبول.</li>
<li><strong>الأسابيع الأخيرة:</strong> حجز الطيران، وتأكيد السكن، والتحضير للوصول والتسجيل.</li>
</ol>
<p>وهذا هو الشكل المعتاد للسنة لا جدولها الرسمي: بعض الجامعات تفتح مبكراً وأخرى متأخراً، وقليل منها يسير خلف هذا النمط بفارق أشهر. حين يهمّك تاريخ بعينه، تحقّق منه في الموقع الرسمي للجامعة على نطاق edu.cn.</p>
<h2>العد التنازلي لاثني عشر شهراً، مرحلة بمرحلة</h2>
<h3>قبل عام تقريباً: البحث والقائمة المختصرة</h3>
<p>استغل الأشهر التي تسبق فتح باب التقديم لحسم القرارات التي ستحكم كل ما بعدها: المرحلة الدراسية، لغة الدراسة، المدينة، والميزانية. تصفّح <a href="/ar/universities">ملفات الجامعات لدينا</a>، واقرأ <a href="/ar/blog/study-in-china-guide">دليلنا الشامل للدراسة في الصين</a>، ثم اجمع قائمة واقعية من خمسة إلى ثمانية برامج. وإذا كنت بحاجة إلى شهادة HSK لبرنامج مُدرَّس بالصينية، فخطّط الآن لموعد الاختبار عبر <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">موقع اختبارات اللغة الصينية</a>، فالمواعيد ثابتة والمقاعد تمتلئ بسرعة في بعض المدن، وانتظار شهادة اللغة من أكثر أسباب تفويت نافذة التقديم شيوعاً.</p>
<h3>أواخر الخريف: وثائقك جاهزة</h3>
<p>ستطلب منك معظم الطلبات جواز سفر ساري المفعول، وكشوف الدرجات والشهادات مع ترجمات موثقة عند الحاجة، وخطابات توصية لمراحل الدراسات العليا، وخطة دراسية. ولا شيء من هذا يُنجز بين ليلة وضحاها: التوثيق والترجمة قد يستغرقان أسابيع، وأساتذتك يحتاجون وقتاً لكتابة خطاب جيد، والخطة الدراسية تحتاج مسودات متعددة. جهّز الملف كاملاً قبل فتح النوافذ حتى تتمكن من التقديم في أيام لا أسابيع. واحرص على نسخ ممسوحة ضوئياً واضحة ومرتبة التسمية، فمكاتب القبول تراجع آلاف الملفات، والترتيب يساعد فعلاً.</p>
<h3>من الشتاء إلى الربيع: نوافذ التقديم</h3>
<p>هذه ذروة الدورة. للالتحاق في سبتمبر، تُفتح نوافذ التقديم عادةً بين أواخر الخريف ومنتصف الشتاء وتمتد إلى الربيع — كثير من البرامج تستقبل الطلبات تقريباً من نوفمبر حتى أبريل، مع تكدّس مسارات المنح في الجزء الأسبق من هذه الفترة ومسارات التمويل الذاتي غالباً في الجزء اللاحق. توقّع رسوم تقديم غير مستردة لكل برنامج، عادةً في حدود بضع مئات من اليوانات، ورفع الوثائق عبر بوابة كل جامعة الإلكترونية. عادتان تصنعان فرقاً كبيراً هنا: التقديم مبكراً بقدر ما يسمح ملفك، وتتبّع ما قدّمته ومتى وإلى من في جدول واحد. وإذا طلبت الجامعة مقابلة أو اختبارات إضافية، فهي تأتي عادةً خلال أسابيع من الموعد النهائي.</p>
<h3>الربيع وأوائل الصيف: النتائج ونموذج JW202</h3>
<p>فترات المراجعة تتفاوت كثيراً: جامعات ترد خلال أسابيع وأخرى تحتاج أشهراً. يحصل المقبولون على خطاب القبول، ويصدر للطلاب الدوليين المقبولين في برامج الدرجات نموذج JW202، وهو استمارة طلب التأشيرة التي تصدرها الجامعة (أما طلاب منحة CSC فيستلمون نموذج JW201). هذه الوثائق هي ما يحوّل القبول إلى تأشيرة، فراقب بريدك وحسابك في البوابة باستمرار، واستجب فوراً لأي طلب وثائق إضافية، واحتفظ بنسخ ورقية ورقمية معاً. وإن وُضعت على قائمة انتظار أو طُلبت منك مستندات تكميلية، فسرعة ردك عنصر حاسم.</p>
<h3>الصيف: تأشيرة الطالب</h3>
<p>بعد حصولك على خطاب القبول ونموذج JW202 أو JW201 تصبح مؤهلاً للتقديم على تأشيرة الطالب: X1 للبرامج الأطول من 180 يوماً وX2 للأقصر. يمر التقديم عبر خدمة التأشيرات الصينية — راجع <a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">موقع التقديم على التأشيرات</a> أو القناة الرسمية في بلدك لمعرفة المتطلبات والمكاتب. مدة المعالجة تختلف باختلاف البلد والموسم، والأسابيع التي تسبق سبتمبر أزدحم أيام السنة، فقدّم الطلب فور اكتمال وثائقك ولا تراهن على أسرع معالجة ممكنة. ويغطي <a href="/ar/blog/china-student-visa-x1-x2-guide">دليلنا الكامل لتأشيرتي X1 وX2</a> قائمة الوثائق وخطوات ما بعد الوصول.</p>
<h3>الأسابيع الأخيرة: ما قبل السفر</h3>
<p>بعد صدور التأشيرة تبقى مهام عملية: حجز الطيران قبل ذروة الأسعار، وتأكيد السكن الجامعي أو البديل الخاص، وترتيب الميزانية ووسيلة دفع صالحة في الصين، وتجهيز وثائق الوصول. على حاملي تأشيرة X1 تحويلها إلى إقامة خلال 30 يوماً من الدخول، لذا ضع خطاب القبول ونموذج JW ونتائج الفحص الطبي في حقيبة اليد لا في الأمتعة المشحونة. وصورة واقعية عن النفقات — تجدها في <a href="/ar/blog/study-in-china-costs-guide">دليل تكاليف الدراسة في الصين</a> — تجعل أسابيعك الأولى أهدأ بكثير من التخمين.</p>
<h2>الالتحاق الربيعي: النافذة الثانية</h2>
<p>بعض الجامعات تفتح أيضاً التحاقاً ربيعياً يبدأ عادةً في مارس أو أبريل. وهو ليس قاعدة عامة: أشيع ما يكون في برامج اللغة الصينية وبعض برامج الماجستير الإنجليزية، مع مشاركة عدد محدود من برامج البكالوريوس. وحيث يوجد، ينزاح التقويم نحو نصف سنة تقريباً — تمتد الطلبات عادةً من أواخر الربيع إلى خريف العام السابق، وتأتي القرارات شتاءً، وتُستخرج التأشيرات في الأسابيع الأخيرة قبل بداية الفصل. قد يكون هذا المسار منقذاً حقيقياً للمتأخرين أو لمن ينهون برنامجاً في منتصف السنة، لكنه يتطلب الانضباط نفسه: تأكد أولاً من كل جامعة هل تُعرض فترة التحاق ربيعية أصلاً، وفي أي برامج، قبل أن تبني خطتك عليها.</p>
<h2>مواعيد منحة CSC</h2>
<p>إذا كنت تعتمد على منحة الحكومة الصينية في تمويل دراستك فسيتقلص تقويمك كثيراً. تُفتح نوافذ التقديم للمنحة عادةً حوالي ديسمبر ويناير وتُغلق بين يناير وأبريل حسب المسار: فالتقديم عبر سفارة بلدك (النوع A) والتقديم عبر الجامعة الصينية مباشرة (النوع B) لكل منهما مواعيد مختلفة غالباً. وتُعلن النتائج عادةً بين مايو ويوليو، ويتبعها نموذج JW201 لطلاب المنحة. عملياً، يعني هذا أن وثائقك يجب أن تكون جاهزة قبل أن يبلغ موسم التقديم العام ذروته. تنشر <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">بوابة Campus China الرسمية</a> قائمة الجامعات المشاركة والإعلان السنوي، ويشرح <a href="/ar/blog/chinese-government-scholarship-csc-guide">دليلنا الشامل لمنحة CSC</a> ما تغطيه المنحة، بينما يفصّل <a href="/ar/blog/csc-scholarship-steps">شرح خطوات التقديم على منحة CSC</a> كيف تتوالى المراحل واحدةً بعد الأخرى.</p>
<h2>المواعيد الثابتة مقابل المراجعة المستمرة</h2>
<p>تتعامل البرامج مع المواعيد النهائية بطريقتين عامتين. في النظام الثابت تُراجع جميع الطلبات دفعةً واحدة بعد تاريخ الإغلاق — لديك حتى ذلك التاريخ، والتقديم المبكر لا يغيّر شيئاً كثيراً. أما في المراجعة المستمرة (Rolling) فتُدرس الملفات فور وصولها وتُمنح المقاعد حتى اكتمال الأعداد — وهنا يصبح التبكير ميزة حقيقية، لأن المنافسة تجري عملياً على المقاعد المتاحة. المراجعة المستمرة شائعة في الجامعات الصينية، ولذلك فإن أنفع عادة في العملية كلها بسيطة: قدّم مبكراً بقدر ما تسمح وثائقك. الملف القوي المرسل في الأسابيع الأولى من نافذة مفتوحة غالباً أوفر حظاً من ملف مطابق يُرسل قرب الإغلاق، والمتقدمون المبكرون أقدر على ضمان غرف السكن الجامعي. صفحة البرنامج تذكر عادةً النظام المعتمد، وإن غمض الأمر فراسل مكتب القبول واسأل مباشرة.</p>
<h2>فاتك الموعد؟ خيارات المتأخرين</h2>
<p>تفويت موعد نهائي محبط، لكنه نادراً ما يكون نهاية الطريق:</p>
<ul>
<li><strong>اسأل الجامعة مباشرة:</strong> النوافذ تُمدَّد أو تُعاد فتحاً أحياناً حين تبقى مقاعد، ومكاتب القبول تستجيب للاستفسارات المهذبة والمحددة.</li>
<li><strong>ابحث عن برامج لا تزال مفتوحة:</strong> في كل موسم تُغلق جامعات مبكراً بينما تستقبل أخرى طلبات حتى أواخر الربيع — خصوصاً مسارات التمويل الذاتي وبرامج اللغة.</li>
<li><strong>فكّر في الالتحاق الربيعي</strong> حيثما توفر، فتخسر فصلاً واحداً بدل سنة كاملة.</li>
<li><strong>برامج اللغة الصينية</strong> هي الأكثر مرونة على الإطلاق، وبعض الجامعات تفتح مواعيد التحاق متعددة على مدار السنة.</li>
<li><strong>استثمر في الدورة القادمة:</strong> ارفع درجة HSK أو IELTS، وقوِّ خطتك الدراسية، وجهّز وثائقك الموثقة — الالتحاق المتأخر بمنحة كثيراً ما يتفوق على التحاق متعجل بلا تمويل.</li>
</ul>
<p>ما لا ينجح عادةً هو تمنّي ألا ينتبه أحد إلى الموعد. افترض أن التاريخ المنشور نهائي حتى تخبرك الجامعة نفسها بغير ذلك.</p>
<h2>حوّل التقويم إلى خطة</h2>
<p>سنة التقديم الصينية تكافئ المستعد وتعاقب المرتجل. ابدأ قبل نحو اثني عشر شهراً من التحاقك المخطط في سبتمبر، وجهّز وثائقك قبل فتح أول النوافذ، وقدّم مبكراً بدل حافة كل موعد، وتحقق من كل تاريخ مع الجامعة والبوابات الرسمية — فالتواريخ بالذات هي ما يتغير من سنة لأخرى. وإن كنت تفضّل أن يرسم أحدهم الدورة كاملة مقابل وضعك الدراسي وبرامجك المستهدفة، فهذا بالضبط ما نفعله: ابدأ <a href="/ar/contact">باستشارة مجانية من فريق جسر الصين التعليمية</a> أو اطّلع على <a href="/ar/services">خدماتنا في دعم التقديم</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. يصف هذا المقال نمطاً معتاداً لا تواريخ ثابتة — أكّد دائماً المواعيد النهائية مع كل جامعة ومع البوابات الرسمية لسنة الالتحاق التي تستهدفها.</em></p>$$,
  $$<p>When you start planning to study in China, one question comes up before almost any other: when do I actually need to apply? The honest answer: there is no single national deadline — Chinese universities set their own admission calendars. But the year has a recognizable rhythm, and understanding it makes the process far less mysterious. This guide walks through a typical cycle for the September (autumn) intake, from preparation twelve months before enrollment to your arrival on campus. Treat everything below as a general pattern rather than a rulebook: exact dates vary by university, program and year, so always confirm each deadline with the university itself and the official portals. This is usually where our work at Bridge to China Edu begins — turning a scattered set of deadlines into one personal calendar.</p>
<h2>Why there is no single application deadline</h2>
<p>Unlike countries that run a centralized application system, China leaves admissions largely in the hands of each university — which is why two programs at the same institution can have different deadlines, and why no article, this one included, can hand you "the" date. In practice, windows differ for several reasons:</p>
<ul>
<li><strong>University autonomy:</strong> each admissions office publishes its own schedule, and some universities review applications faculty by faculty.</li>
<li><strong>Program level:</strong> bachelor's, master's, PhD and Chinese language programs often run on different clocks.</li>
<li><strong>Language of instruction:</strong> English-taught programs sometimes open and close earlier than their Chinese-taught equivalents.</li>
<li><strong>Self-funded vs. scholarship:</strong> scholarship tracks — especially the CSC — usually close well before self-funded applications do.</li>
<li><strong>Seat and dormitory capacity:</strong> popular programs may close early once places fill, particularly under rolling review.</li>
</ul>
<p>The practical conclusion is simple: build your own list of target programs, record every deadline in one calendar, and re-check the official pages before each submission — universities really do shift dates from year to year.</p>
<h2>The typical autumn intake at a glance</h2>
<p>The September intake is the main cycle at nearly all Chinese universities. Stripped to its skeleton, a typical year looks like this:</p>
<ol>
<li><strong>About 12 months before enrollment (roughly September–November of the previous year):</strong> research universities and programs, shortlist targets, and start preparing language tests.</li>
<li><strong>Late autumn and winter:</strong> finalize your document set while application windows commonly begin to open.</li>
<li><strong>Winter through spring:</strong> submit applications; most scholarship deadlines fall in this stretch.</li>
<li><strong>Spring and early summer:</strong> universities review files and release results; successful applicants receive admission letters and, in due course, the JW202 form.</li>
<li><strong>Summer:</strong> apply for your student visa once your admission documents are complete.</li>
<li><strong>Final weeks:</strong> book flights, confirm accommodation and prepare for arrival and registration.</li>
</ol>
<p>This is the typical shape of the year, not a fixed schedule: some universities open earlier, some later, and a few run months behind. Whenever a date matters, verify it on the university's official .edu.cn page.</p>
<h2>The twelve-month countdown, phase by phase</h2>
<h3>A year out: research and shortlisting</h3>
<p>Use the months before applications open to settle the decisions that shape everything else: degree level, language of instruction, city and budget. Browse our <a href="/en/universities">university profiles</a>, read the broader <a href="/en/blog/study-in-china-guide">guide to studying in China</a>, and put together a realistic shortlist of five to eight programs. If you need an HSK certificate for a Chinese-taught program, plan the test date now — sessions listed on <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">chinesetest.cn</a> run on fixed dates, and seats in some cities fill quickly. Waiting for a language certificate is one of the most common reasons students miss their target window.</p>
<h3>Late autumn: documents in order</h3>
<p>Almost every application will ask for a valid passport, your transcripts and diploma (with notarized translations where required), recommendation letters for postgraduate programs, and a study plan. None of this can be produced overnight: notarization and translation take weeks, professors need time to write properly, and a study plan worth the name takes several drafts. Prepare the whole set before the windows open, so that when a deadline appears you submit in days rather than scramble for weeks. Keep scans clean, consistent and clearly named — admissions offices process thousands of files, and tidy materials genuinely help.</p>
<h3>Winter to spring: application windows</h3>
<p>This is the heart of the cycle. For the September intake, application windows commonly open between late autumn and mid-winter and run on into spring — many programs accept applications roughly from November through April, with scholarship tracks clustered earlier in that range and self-funded tracks often later. Expect a non-refundable application fee for each program, typically in the range of a few hundred yuan, and document uploads through each university's own online portal. Two habits pay off enormously here: applying as early as your file allows, and keeping a simple tracker of what you submitted, when, and to whom. If a university invites you to an interview or additional tests, these usually follow within weeks of the deadline.</p>
<h3>Spring to early summer: results and the JW202</h3>
<p>Review periods vary a great deal — some universities answer within weeks, others take months. Successful applicants receive an admission letter, and students admitted to degree programs are issued the JW202 form — the visa application form produced by the university (CSC scholarship students receive the JW201 instead). These documents turn an offer into a visa, so check your email and portal account regularly, respond to any document requests immediately, and keep both physical and digital copies. If you are waitlisted, speed of response matters.</p>
<h3>Summer: the student visa</h3>
<p>Once you hold the admission letter and your JW202 or JW201, you can apply for the student visa: X1 for programs longer than 180 days, X2 for shorter ones. Applications go through the Chinese visa service — check <a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">visaforchina.cn</a> or your national channel for requirements and office locations. Processing times vary by country and season, and the weeks before September are the busiest of the year, so apply as soon as your documents are complete rather than gambling on a fast turnaround. Our <a href="/en/blog/china-student-visa-x1-x2-guide">complete guide to the X1 and X2 visas</a> covers the document list and the steps that follow arrival.</p>
<h3>The final weeks: pre-departure</h3>
<p>With the visa secured, the remaining tasks are practical: booking flights before prices peak, confirming dormitory or private housing, arranging your budget and a payment method that works in China, and preparing arrival documents. Students on an X1 visa must convert it into a residence permit within 30 days of entering China, so pack your admission letter, JW form and medical results in your hand luggage rather than a checked suitcase. A realistic picture of expenses — see our <a href="/en/blog/study-in-china-costs-guide">guide to study costs in China</a> — will make the first weeks far calmer than guesswork.</p>
<h2>The spring intake: a second window</h2>
<p>Some universities also admit students for a spring intake, usually starting in March or April. It is far from universal: most common in Chinese language programs and some English-taught master's degrees, with few bachelor's programs taking part. Where it exists, the calendar shifts by roughly half a year — applications commonly run from late spring through the autumn of the previous year, decisions arrive in winter, and visas are issued in the final weeks before the semester. The spring intake can be a lifeline for late applicants or students finishing a program mid-year, but it demands the same discipline: confirm with each university whether a spring start is offered, and for which programs, before building your plan around it.</p>
<h2>CSC scholarship timing</h2>
<p>If you are funding your studies through the Chinese Government Scholarship, your calendar tightens considerably. Scholarship application windows typically open around December and January and close between January and April, depending on the route — applying through your national embassy (Type A) and applying through a Chinese university (Type B) usually carry different deadlines. Results are typically announced between May and July, and the JW201 form for scholarship students follows. In practice, your documents need to be ready before the general season reaches its peak. The official <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">Campus China portal</a> publishes the participating universities and the annual notice; our <a href="/en/blog/chinese-government-scholarship-csc-guide">complete CSC guide</a> explains what the scholarship covers, and the <a href="/en/blog/csc-scholarship-steps">step-by-step CSC application walkthrough</a> shows how the stages follow one another.</p>
<h2>Rolling versus fixed deadlines</h2>
<p>Programs handle deadlines in two broad ways. Under a fixed deadline, all applications are reviewed together after the closing date — you have until that date, and applying early changes little. Under rolling admission, files are reviewed as they arrive and places are awarded until the cohort is full — and here, applying early is a real advantage, because the competition is effectively for the seats still open. Rolling review is common at Chinese universities, which is why the single most useful habit in the whole process is simple: submit as early as your documents allow. A strong file sent in the first weeks of an open window often fares better than an identical file sent near the close, and early applicants are more likely to secure on-campus dormitory rooms. The program page usually states which system applies; if it is unclear, email the admissions office and ask directly.</p>
<h2>Missed a deadline? What late applicants can still do</h2>
<p>A missed deadline is frustrating, but it is rarely the end of the road:</p>
<ul>
<li><strong>Ask the university directly:</strong> windows are sometimes extended or reopened when seats remain, and admissions offices respond to polite, specific enquiries.</li>
<li><strong>Look for programs still open:</strong> in any season, some universities close early while others accept applications well into late spring — especially self-funded and language tracks.</li>
<li><strong>Consider the spring intake</strong> where it is offered, as a way to lose one semester rather than a full year.</li>
<li><strong>Chinese language programs</strong> often have the most flexible calendars of all, with several start dates across the year at some universities.</li>
<li><strong>Invest in the next cycle:</strong> raise your HSK or IELTS score, strengthen your study plan and prepare notarized documents — a later start with a scholarship often beats a rushed, self-funded one.</li>
</ul>
<p>What rarely works is hoping nobody noticed the deadline. Assume the published date is final until the university itself tells you otherwise.</p>
<h2>Turn the calendar into a plan</h2>
<p>The Chinese application year rewards the prepared and punishes the improviser. Start about twelve months before your intended September start, have your documents ready before the first windows open, apply early rather than at the edge of each deadline, and verify every date with the university and the official portals — because dates are exactly the thing that changes from year to year. If you would rather have the whole cycle mapped against your profile and target programs, that is precisely what we do: start with a <a href="/en/contact">free consultation with Bridge to China Edu</a> or explore our <a href="/en/services">application support services</a>.</p>
<p><em>Last reviewed: November 2026. This article describes a typical pattern, not fixed dates — always confirm exact deadlines with each university and the official portals for your intake year.</em></p>$$,
  $$<p>«Когда именно нужно подавать документы в китайский университет?» — этот вопрос возникает раньше почти всех остальных. Честный ответ: единого общенационального дедлайна не существует, каждый вуз в Китае устанавливает собственное расписание приёма. Но у учебного года есть различимый ритм, и стоит его понять — процесс перестаёт казаться загадкой. В этом руководстве мы разбираем типичный цикл подачи документов для сентябрьского (осеннего) набора: от подготовки за год до прибытия в кампус. Всё, что вы прочтёте ниже, — общая закономерность, а не свод правил: точные даты различаются по вузам, программам и годам, поэтому каждый срок подтверждайте напрямую в университете и на официальных порталах. Именно с этого обычно начинается наша работа в Bridge to China Edu — превращение разбросанных дедлайнов в один личный календарь.</p>
<h2>Почему не существует единого дедлайна</h2>
<p>В отличие от стран с централизованной системой поступления, Китай отдаёт приём документов на усмотрение каждого университета. Поэтому две программы в одном вузе могут иметь разные сроки, и ни одна статья — включая эту — не назовёт вам «ту самую» дату. На практике окна приёма различаются по нескольким причинам:</p>
<ul>
<li><strong>Самостоятельность вузов:</strong> каждый приёмный отдел публикует своё расписание, а некоторые университеты рассматривают заявления факультет за факультетом.</li>
<li><strong>Уровень программы:</strong> бакалавриат, магистратура, докторантура и языковые курсы часто живут в разном темпе.</li>
<li><strong>Язык обучения:</strong> англоязычные программы нередко открываются и закрываются раньше китайскоязычных аналогов.</li>
<li><strong>Собственные средства или стипендия:</strong> стипендиатские треки — особенно CSC — обычно закрываются заметно раньше платного приёма.</li>
<li><strong>Ёмкость мест и общежитий:</strong> популярные программы могут закрыться досрочно, как только набор заполнится, особенно при скользящем рассмотрении.</li>
</ul>
<p>Практический вывод прост: составьте собственный список целевых программ, занесите все дедлайны в один календарь и перед каждой подачей перепроверяйте официальные страницы — вузы действительно меняют сроки от года к году.</p>
<h2>Типичный осенний набор — общая картина</h2>
<p>Сентябрьский набор — главный цикл почти во всех китайских университетах. В самом общем виде год выглядит так:</p>
<ol>
<li><strong>Примерно за 12 месяцев до зачисления (условно сентябрь–ноябрь предыдущего года):</strong> поиск вузов и программ, шорт-лист, начало подготовки к языковым экзаменам.</li>
<li><strong>Поздняя осень и зима:</strong> финализация пакета документов, пока окна приёма обычно начинают открываться.</li>
<li><strong>Зима и весна:</strong> подача заявлений; на этот отрезок приходится большинство стипендиатских дедлайнов.</li>
<li><strong>Весна и начало лета:</strong> вузы рассматривают файлы и объявляют результаты; зачисленные получают письма о приёме, а затем форму JW202.</li>
<li><strong>Лето:</strong> подача на студенческую визу после полного комплекта документов о зачислении.</li>
<li><strong>Последние недели:</strong> билеты, жильё и подготовка к приезду и регистрации.</li>
</ol>
<p>И ещё раз: это типичная форма года, а не расписание. Одни вузы открываются раньше, другие позже, а некоторые идут с отставанием на месяцы. Если дата для вас принципиальна — сверяйтесь с официальной страницей университета в домене edu.cn.</p>
<h2>Обратный отсчёт на двенадцать месяцев, этап за этапом</h2>
<h3>За год: поиск и шорт-лист</h3>
<p>Используйте месяцы до открытия приёма для решений, которые определят всё остальное: уровень программы, язык обучения, город и бюджет. Посмотрите <a href="/ru/universities">наши профили университетов</a>, прочитайте общий <a href="/ru/blog/study-in-china-guide">гид по учёбе в Китае</a> и составьте реалистичный шорт-лист из пяти–восьми программ. Если для китайскоязычной программы нужен сертификат HSK, планируйте экзамен уже сейчас: сессии на <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">chinesetest.cn</a> проходят в фиксированные даты, и в ряде городов места разбирают быстро. Ожидание языкового сертификата — одна из самых частых причин, по которым студенты опаздывают к целевому окну.</p>
<h3>Поздняя осень: документы в порядке</h3>
<p>Почти каждая заявка потребует действующий загранпаспорт, транскрипты и диплом (с нотариальными переводами при необходимости), рекомендательные письма для постдипломных программ и план обучения. Ничто из этого не делается за вечер: нотариус и перевод занимают недели, преподавателям нужно время на письма, а план обучения заслуживает нескольких черновиков. Подготовьте весь комплект до открытия окон — тогда при появлении дедлайна вы подадитесь за дни, а не будете собираться неделями. Делайте чистые, аккуратно названные сканы: приёмные отделы просматривают тысячи файлов, и порядок в материалах действительно помогает.</p>
<h3>Зима и весна: окна приёма</h3>
<p>Это сердце цикла. Для сентябрьского набора окна приёма обычно открываются между поздней осенью и серединой зимы и тянутся до весны — многие программы принимают заявки примерно с ноября по апрель, причём стипендиатские треки сгущаются в начале этого отрезка, а платные чаще в конце. Закладывайте невозвратный сбор за каждую программу — обычно несколько сотен юаней — и загрузку документов через собственный портал каждого вуза. Две привычки здесь бесценны: подавать документы настолько рано, насколько позволяет файл, и вести простую таблицу — что, когда и куда вы подали. Если университет проводит интервью или дополнительные испытания, они обычно следуют в течение недель после дедлайна.</p>
<h3>Весна и начало лета: результаты и форма JW202</h3>
<p>Сроки рассмотрения сильно разнятся: одни вузы отвечают за недели, другим нужны месяцы. Зачисленные получают письмо о приёме, а иностранным студентам программ степени университет выдаёт форму JW202 — заявление на визу, которое оформляет вуз (стипендиаты CSC получают форму JW201). Именно эти документы превращают приглашение в визу, поэтому регулярно проверяйте почту и личный кабинет, мгновенно отвечайте на запросы дополнительных материалов и храните и бумажные, и электронные копии. Если вы в листе ожидания или у вас запросили уточнения, скорость ответа имеет значение.</p>
<h3>Лето: студенческая виза</h3>
<p>С письмом о приёме и формой JW202 или JW201 на руках можно подавать документы на студенческую визу: X1 для программ длиннее 180 дней, X2 для более коротких. Заявки идут через китайский визовый сервис — требования и адреса офисов смотрите на <a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">visaforchina.cn</a> или через национальный канал подачи. Сроки рассмотрения зависят от страны и сезона, а недели перед сентябрём — самые загруженные в году: подавайтесь сразу, как только комплект документов готов, а не рассчитывая на максимально быструю обработку. Наше <a href="/ru/blog/china-student-visa-x1-x2-guide">полное руководство по визам X1 и X2</a> разбирает список документов и шаги после приезда.</p>
<h3>Последние недели: перед отъездом</h3>
<p>Когда виза получена, остаются практические дела: билеты до пиковых цен, подтверждение общежития или частного жилья, бюджет и способ оплаты, работающий в Китае, и документы для приезда. Обладателям визы X1 нужно превратить её в вид на жительство в течение 30 дней после въезда — держите письмо о приёме, форму JW и результаты медосмотра в ручной клади, а не в чемодане. Реалистичное представление о расходах — см. наш <a href="/ru/blog/study-in-china-costs-guide">гид по стоимости учёбы в Китае</a> — сделает первые недели значительно спокойнее любых прикидок на глазок.</p>
<h2>Весенний набор: второе окно</h2>
<p>Некоторые университеты также набирают студентов на весенний набор, обычно с началом в марте или апреле. Это далеко не повсеместная история: чаще всего речь о языковых программах и части англоязычных магистратур, а бакалаврских программ в весеннем наборе участвует ограниченное число. Там, где он существует, календарь сдвигается примерно на полгода — заявки обычно принимают с поздней весны до осени предыдущего года, решения приходят зимой, а визы оформляют в последние недели перед семестром. Для опоздавших или заканчивающих программу в середине года это может стать настоящим спасением, но дисциплина нужна та же: сначала уточните в каждом вузе, предлагается ли весенний набор вообще и для каких программ, и лишь потом стройте вокруг него план.</p>
<h2>Сроки стипендии CSC</h2>
<p>Если вы рассчитываете финансировать учёбу стипендией правительства Китая, календарь заметно уплотняется. Окна подачи на стипендию обычно открываются около декабря–января и закрываются в промежутке с января по апрель в зависимости от канала: подача через посольство вашей страны (тип A) и напрямую через китайский университет (тип B) чаще всего имеют разные сроки. Результаты обычно объявляют с мая по июль, затем стипендиатам приходит форма JW201. На практике это значит, что документы должны быть готовы раньше, чем общий приём достигнет пика. Официальный портал <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">Campus China</a> публикует список участвующих вузов и ежегодное объявление; наше <a href="/ru/blog/chinese-government-scholarship-csc-guide">полное руководство по стипендии CSC</a> объясняет, что она покрывает, а <a href="/ru/blog/csc-scholarship-steps">пошаговый разбор подачи на CSC</a> показывает, как этапы следуют один за другим.</p>
<h2>Жёсткие дедлайны против скользящего приёма</h2>
<p>Программы обходятся с дедлайнами двумя способами. При жёстком сроке все заявления рассматриваются вместе после даты закрытия — она у вас есть, и ранняя подача почти ничего не меняет. При скользящем приёме файлы изучают по мере поступления, а места раздают, пока набор не заполнится, — и здесь ранняя подача становится реальным преимуществом: конкуренция идёт фактически за ещё открытые места. Скользящий приём в китайских вузах распространён, поэтому самая полезная привычка всего процесса проста: подавайте документы настолько рано, насколько позволяет ваш комплект. Сильный файл, отправленный в первые недели открытого окна, часто проходит лучше такого же файла, отправленного у закрытия, а ранние абитуриенты чаще получают места в общежитии. Страница программы обычно указывает, какая система действует; если неясно — напишите в приёмный отдел и спросите прямо.</p>
<h2>Опоздали к дедлайну? Что делать поздним абитуриентам</h2>
<p>Пропущенный срок неприятен, но редко означает конец дороги:</p>
<ul>
<li><strong>Спросите университет напрямую:</strong> окна иногда продлевают или открывают повторно, если остаются места, и приёмные отделы отвечают на вежливые и конкретные запросы.</li>
<li><strong>Поищите ещё открытые программы:</strong> в каждом сезоне одни вузы закрываются рано, а другие принимают заявки до поздней весны — особенно платные и языковые треки.</li>
<li><strong>Рассмотрите весенний набор</strong> там, где он есть, — потеряете семестр, а не целый год.</li>
<li><strong>Языковые программы китайского</strong> — самые гибкие по календарю: в ряде вузов несколько дат старта в течение года.</li>
<li><strong>Вложитесь в следующий цикл:</strong> поднимите балл HSK или IELTS, усильте план обучения, подготовьте нотариальные документы — более поздний старт со стипендией нередко выгоднее спешки за свой счёт.</li>
</ul>
<p>Что почти не работает — надеяться, что на дедлайн никто не обратил внимания. Считайте опубликованную дату окончательной, пока сам университет не сообщит иное.</p>
<h2>Превратите календарь в план</h2>
<p>Китайский год подачи документов награждает подготовленных и наказывает импровизаторов. Начинайте примерно за двенадцать месяцев до планируемого сентябрьского старта, готовьте документы до открытия первых окон, подавайте рано, а не на грани каждого срока, и каждую дату сверяйте с университетом и официальными порталами — ведь именно даты меняются от года к году. Если вам ближе вариант, когда весь цикл просчитывают под ваш профиль и целевые программы, — ровно этим мы и занимаемся: начните с <a href="/ru/contact">бесплатной консультации Bridge to China Edu</a> или посмотрите наши <a href="/ru/services">услуги по сопровождению поступления</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. В статье описан типичный сценарий, а не фиксированные даты — точные сроки всегда уточняйте в каждом университете и на официальных порталах вашего года набора.</em></p>$$,
  'scene:campus-gate', 'tips', 'published', '2026-11-12T10:00:00+00', '2026-11-12T10:00:00+00'
)
on conflict (slug) do nothing;


-- accommodation-in-china-international-students.sql
--
-- Editorial batch 2: student accommodation in China (dorms vs private
-- housing) — one researched, trilingual (AR/EN/RU) article written for the
-- existing `articles` table. Same architecture as batch 1 (0037): the post
-- behaves exactly like a CMS-published article (editable in /admin/articles,
-- listed on /{locale}/blog, included in sitemap.xml alternates automatically).
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Only official sources linked (campuschina.org, mfa.gov.cn,
--     visaforchina.cn).
--   • Cost figures are clearly framed as indicative ranges, never as exact
--     statistics; readers are directed to verify with universities and the
--     international students' office.
--   • No fabricated testimonials, statistics, rankings, or promises.
--   • Each version carries localized internal links into the site's
--     conversion paths (services, contact, universities) and cross-links to
--     relevant published articles (student-life-in-china,
--     study-in-china-costs-guide, study-in-china-guide).
--   • Cover image uses the site's built-in brand scenes (scene:*) so no
--     storage upload is required.
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ===========================================================================
-- 1 · Student accommodation in China: dorms vs private housing
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'accommodation-in-china-international-students',
  $$السكن الطلابي في الصين: السكن الجامعي مقابل السكن الخاص$$,
  $$Student Accommodation in China: Dorms vs Private Housing$$,
  $$Жильё для студентов в Китае: общежитие или частная квартира$$,
  $$أين تسكن أثناء دراستك في الصين؟ مقارنة عملية بين السكن الجامعي والشقق الخاصة: الغرف والتجهيزات والأسعار الاسترشادية والودائع والوثائق ونصائح الاستقرار بعد الوصول.$$,
  $$Where will you live while studying in China? Dorms vs private apartments compared: rooms, facilities, indicative costs, deposits, documents and settling-in tips for arrivals.$$,
  $$Где жить во время учёбы в Китае? Сравниваем общежития и частные квартиры: типы комнат, удобства, ориентировочные цены, депозиты, документы и советы по обустройству.$$,
  $$<p>بعد وصول خطاب القبول تبدأ الأسئلة العملية، وأولها عادةً: أين سأسكن؟ في الصين ينحصر الخيار غالباً بين مسارين: غرفة في سكن الجامعة، أو شقة خاصة خارج الحرم الجامعي. كلا المسارين صالح، لكن كل منهما يناسب ميزانية ومرحلة دراسية مختلفة. في هذا الدليل نشرح كيف يعمل كل خيار فعلياً: أنواع الغرف والتجهيزات، التكاليف الاسترشادية، خطوات التقديم على السكن الجامعي، ثم آجار الشقق الخاصة والعقود والودائع والوثائق المطلوبة، فالخيارات قصيرة الأمد لأيام الوصول الأولى، وأخيراً نصائح عملية قبل التوقيع وتفاصيل الفواتير والإنترنت — وهي التفاصيل نفسها التي نراجعها مع كل طالب نرافقه حتى ينتقل من المطار إلى غرفة مرتبة بلا مفاجآت. جميع الأرقام الواردة نطاقات استرشادية قابلة للتغير، والمرجع النهائي دائماً هو مكتب الطلاب الدوليين في جامعتك والبوابات الرسمية.</p>
<h2>القرار في موجز: سكن الجامعة أم شقة خاصة؟</h2>
<p>يبدأ معظم الطلاب الدوليين رحلتهم في سكن الجامعة، بل إن جامعات كثيرة تفضّل ذلك للطلاب المستجدين خصوصاً في برامج اللغة. السكن الجامعي أوفر وأبسط إدارياً — لا عقود ولا وسطاء ولا ودائع — ويضعك داخل الحياة الجامعية منذ اليوم الأول. أما السكن الخاص فيمنحك مساحة وخصوصية ومطبخاً واستقلالاً كاملاً، مقابل ودائع وعمولات وسطاء وعقد مكتوب بالصينية وفواتير باسمك. النمط الشائع بين الطلاب: سنة أو سنتان في السكن الجامعي، ثم الانتقال إلى الخارج بعد أن تعرف المدينة واللغة واعتياداتك اليومية. ولصورة أوسع عن الحياة داخل الحرم الجامعي وخارجه، اقرأ دليلنا عن <a href="/ar/blog/student-life-in-china">الحياة الطلابية في الصين</a>.</p>
<h2>السكن الجامعي: ما ستجده فعلياً</h2>
<h3>أنواع الغرف</h3>
<ul>
<li><strong>غرفة مزدوجة:</strong> الإعداد الكلاسيكي — سريران ومكتبان وخزانتان، وهي الخيار الأوفر والأكثر اجتماعية، وزميل الغرفة عادةً طالب دولي مثلك.</li>
<li><strong>غرفة مفردة:</strong> متاحة في جامعات كثيرة بتكلفة أعلى، وتُخصص عادةً بحسب أسبقية الطلب.</li>
<li><strong>وحدات وغرف بصالة مشتركة:</strong> بعض الحرم الجامعية الحديثة توفر غرفتي أو ثلاث غرف نوم بصالة وحمّام مشتركين.</li>
<li><strong>غرف ثلاثية ورباعية:</strong> ما زالت موجودة في بعض الجامعات، وهي الأوفر على الإطلاق.</li>
</ul>
<h3>التجهيزات والتكاليف الاسترشادية</h3>
<p>توفر معظم مباني السكن مطابخ مشتركة أو صالات عامة، ومغاسل، وموزعات مياه ساخنة في كل طابق، وأمناً على مدار الساعة ببطاقات دخول. أما التكييف والحمامات الخاصة والتدفئة فتختلف بحسب الحرم الجامعي والمناخ — اسأل عن مبنى محدد لا عن الجامعة عموماً.</p>
<ul>
<li><strong>غرفة مزدوجة مشتركة:</strong> عادةً 400–1,500 يوان شهرياً حسب المدينة والجامعة.</li>
<li><strong>غرفة مفردة أو غرفة بحمام خاص:</strong> عادةً 1,500–3,000 يوان شهرياً حيثما توفرت.</li>
<li>الدفع غالباً بالفصل الدراسي أو بالسنة الدراسية، وأحياناً شهرياً.</li>
</ul>
<p>هذه نطاقات استرشادية فقط؛ رسوم السكن تحددها كل جامعة وتتغير من سنة لأخرى، فاعتمد على الصفحة الرسمية للطلاب الدوليين في جامعتك. وتوفر <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">بوابة Campus China</a> قائمة الجامعات المشاركة وروابط صفحات القبول فيها.</p>
<h3>كيف تتقدم بطلب السكن الجامعي</h3>
<ol>
<li>حدد رغبتك في السكن الجامعي أثناء تقديمك للجامعة — معظم الاستمارات تسأل عن السكن ضمن الطلب نفسه.</li>
<li>راقب بريدك الإلكتروني بعد القبول: تصلك عادةً استمارة طلب سكن وموعد نهائي للسداد.</li>
<li>ادفع عربون السكن أو أول فترة إذا طُلب منك، واحتفظ بالإيصال.</li>
<li>احضر ومعك خطاب القبول وجواز السفر وتأكيد السكن — تُنجز إجراءات الاستلام عادةً في زيارة واحدة لمكتب استقبال السكن أو مكتب الطلاب الدوليين.</li>
</ol>
<p>قدّم طلبك مبكراً ما أمكن: التخصيص يتم بالأسبقية، والغرف المفردة تنفد أولاً.</p>
<h3>المزايا والعيوب</h3>
<p>يمتاز السكن الجامعي بخصائص يصعب منافستها في السنة الأولى:</p>
<ul>
<li><strong>التكلفة:</strong> غالباً أرخص سكن تجده في أي مدينة صينية.</li>
<li><strong>المجتمع:</strong> زملاء الغرفة والجوار والفعاليات المشتركة تصنع دائرة اجتماعية فورية.</li>
<li><strong>القرب:</strong> خمس دقائق سيراً إلى المحاضرات والمكتبة والمطعم الجامعي — لا تنقلات ولا ميزانية مواصلات.</li>
<li><strong>البساطة الإدارية:</strong> لا عقد ولا وسيط ولا مفاوضات ودائع، والجامعة تتولى تسجيل إقامتك.</li>
</ul>
<p>أما المقايضات فتشمل:</p>
<ul>
<li>خصوصية أقل وضجيجاً محتملاً، وحمامات مشتركة في معظم المباني.</li>
<li>ساعات منع تجول وقواعد للاستقبال في بعض السكنات — اسأل قبل أن تفترض.</li>
<li>تسهيلات طبخ محدودة، والاعتماد على المطاعم الجامعية والتوصيل.</li>
<li>أثاث وغرف عملية أكثر منها واسعة.</li>
</ul>
<h2>استئجار شقة خاصة خارج الجامعة</h2>
<h3>كيف يجري الاستئجار</h3>
<p>يستأجر معظم الطلاب عبر وكيل عقاري مرخص يعرض عليهم عدة شقق ويتفاوض مع المالك ويعدّ العقد. تأتي الشقق مفروشة أو نصف مفروشة. والعقود تُكتب بالصينية — اصطحب مترجماً موثوقاً أو اطلب من مكتب الطلاب الدوليين في جامعتك مراجعة العقد قبل التوقيع. وتأكد دائماً من أن الموقّع على العقد إما مالك الشقة بموجب سند الملكية، وإما وكيل مفوض رسمياً من المالك.</p>
<h3>الودائع وعمولات الوسطاء</h3>
<ul>
<li><strong>الوديعة:</strong> عادةً ما يعادل مبلغها شهراً إلى ثلاثة أشهر من الإيجار، وتُسترد عند نهاية العقد إذا سلّمت الشقة بحالة جيدة — صوّر كل شيء عند الاستلام.</li>
<li><strong>عمولة الوكيل:</strong> عادةً نحو نصف شهر إلى شهر إيجار كامل، تُدفع مرة واحدة، وتختلف العادات بين المدن.</li>
<li><strong>إيقاع السداد:</strong> يُدفع الإيجار غالباً كل ثلاثة أشهر أو ستة أشهر، وبعض الملاك يفضّلون دفعات مقدمة أطول؛ ويوجد أيضاً دفع شهري بوديعة شهر واحد. لا تحوّل أي مبلغ قبل توقيع العقد.</li>
</ul>
<h3>الوثائق المطلوبة منك</h3>
<ul>
<li><strong>جواز السفر</strong> بتأشيرة سارية أو <strong>تصريح إقامة</strong> ساري المفعول — سيصوّره المالك ويرفق نسخة منه مع العقد.</li>
<li>إثبات قيد أو بطاقة الطالب، تطلبه بعض الجهات لتسجيل دخولك في المجمعات السكنية المغلقة.</li>
<li>رقم هاتف صيني محلي — لا غنى عنه لكل شيء، من تطبيقات دفع الفواتير إلى أنظمة دخول المباني.</li>
</ul>
<h3>الإيجارات الاسترشادية حسب فئة المدينة</h3>
<ul>
<li><strong>المدن من الدرجة الأولى (بكين، شنجهاي، قوانغجو، شنتشن):</strong> غرفة في شقة مشتركة عادةً 1,500–4,000 يوان شهرياً؛ وشقة صغيرة بغرفة نوم واحدة عادةً 3,000–8,000 يوان.</li>
<li><strong>المدن من الدرجة الثانية وما يقاربها (هانغجو، تشنغدو، نانجينغ، ووهان، شيان وغيرها):</strong> غرفة عادةً 800–2,500 يوان؛ وشقة صغيرة عادةً 1,500–3,500 يوان.</li>
<li><strong>المدن الأصغر:</strong> غرفة عادةً 500–1,500 يوان؛ وشقة صغيرة عادةً 1,000–2,500 يوان.</li>
</ul>
<p>هذه نطاقات واسعة للاسترشاد فقط؛ الأسعار الفعلية تختلف كثيراً بحسب الحي وقرب المترو وعمر المبنى والطابق. ولترى كيف يندرج السكن في ميزانيتك الكلية، راجع دليلنا عن <a href="/ar/blog/study-in-china-costs-guide">تكلفة الدراسة والمعيشة في الصين</a>.</p>
<h2>خيارات قصيرة الأمد لأيام الوصول الأولى</h2>
<p>لست مضطراً إلى توقيع عقد سنة كاملة من المطار. يحجز الطلاب القادمون عادةً أسبوعين إلى أربعة أسابيع من السكن المؤقت أثناء معاينة الشقق أو انتظار تخصيص غرفة جامعية:</p>
<ul>
<li><strong>السكن الجامعي المؤقت:</strong> مكاتب الطلاب الدوليين كثيرةً ما ترتب إقامة قصيرة للقادمين الجدد — راسلهم قبل سفرك بأسابيع.</li>
<li><strong>النزل والفنادق الاقتصادية:</strong> عادةً 80–250 يواناً لليلة الواحدة.</li>
<li><strong>فنادق متوسطة:</strong> عادةً 250–600 يوان لليلة الواحدة في المدن الكبرى وأقل في غيرها، والأسعار تتحرك مع الموسم والفعاليات المحلية.</li>
<li><strong>الشقق الفندقية:</strong> أغلى، لكنها تشمل الفواتير والإنترنت ومدداً مرنة أسبوعية أو شهرية — جسر معقول لشهر واحد.</li>
</ul>
<p>احجز قريباً من الحرم الجامعي في الليالي الأولى: ستكون مشغولاً بأعمال التسجيل والفحص الطبي وإجراءات تصريح الإقامة، وقرب المسافة يريحك كثيراً في ذلك الأسبوع. وللصورة الكاملة عن تسلسل الوصول والبدء في الصين، اقرأ <a href="/ar/blog/study-in-china-guide">دليلنا الشامل للدراسة في الصين</a>.</p>
<h2>قائمة تحقق عملية قبل التوقيع</h2>
<ul>
<li><strong>اقرأ العقد كاملاً:</strong> الإيجار، والوديعة، وشروط استردادها، ومدة الإشعار المسبق، ومن يتحمل الإصلاحات، وغرامات إنهاء العقد مبكراً.</li>
<li><strong>تحقق من الملكية:</strong> اطلب رؤية سند الملكية وهوية المالك، أو تفويض الوكيل الخطي.</li>
<li><strong>جرد بالصور:</strong> كل خدش وجهاز وقطعة أثاث بتاريخه، ومشاركة الملف مع المالك.</li>
<li><strong>افحص الأمور العملية:</strong> قوة تدفق الماء والماء الساخن، والتدفئة في مدن الشمال، والتكييف في مدن الجنوب، وقوة شبكة الهاتف، وعلامات الرطوبة على الجدران.</li>
<li><strong>اسأل عن التكاليف الإضافية:</strong> رسوم إدارة العقار الشائعة في المجمعات السكنية، والمواقف، ومواعيد استحقاق الفواتير.</li>
<li><strong>تأكد من دعم التسجيل:</strong> يجب أن يعينك المالك أو الوكيل على تسجيل عنوان سكنك الجديد — تفاصيل ذلك في الفقرة التالية.</li>
</ul>
<h2>الفواتير والإنترنت والمدفوعات اليومية</h2>
<p>في السكن الجامعي تكون الخدمات عادةً مشمولة في رسوم الإقامة أو محسوبة بأسعار ثابتة رمزية؛ أما في السكن الخاص فالكهرباء والماء والغاز تنتقل إلى مسؤوليتك، وتُسدَّد عبر تطبيقات الهاتف أو المتاجر الصغيرة القريبة، ويُفترض أن تُثبَّت قراءات العدادات عند تسليمك الشقة في العقد نفسه. ويبقى التكييف عادةً أكبر بند متغير في الصيف والشتاء.</p>
<p>أما الإنترنت في الشقق الخاصة فيُركَّب عبر إحدى شركات الاتصالات الكبرى بعقد سنة أو أكثر ورسوم تركيب تُدفع لمرة واحدة؛ وشبكات الحرم الجامعي في السكنات الجامعية تُرتَّب عبر الجامعة وهي أبسط بكثير. وشريحة اتصالات محلية بباقة بيانات سخية رخيصة وتعمل في كل مكان — كثير من الطلاب يعتمدون عليها وحدها في أسابيعهم الأولى.</p>
<h2>قواعد التسجيل المرتبطة بالسكن</h2>
<p>أياً كان خيارك، يلزم القانون الصيني الأجانب بتسجيل عنوان سكناهم لدى الجهات المحلية — الفنادق تفعل ذلك تلقائياً، وفي سكن الجامعة يتولى مكتب الطلاب الدوليين الأمر عادةً، أما في الشقة الخاصة فتسجّل أنت (بمعاونة المالك) في مركز الشرطة المحلي خلال مهلة صارمة بعد الانتقال، هي عادةً 24 ساعة في المدن. احتفظ بوصل التسجيل: ستحتاجه عند التقديم على تصريح الإقامة وعند تجديده كل عام. وتنشر <a href="https://www.mfa.gov.cn/eng/" target="_blank" rel="noopener noreferrer">وزارة الخارجية الصينية</a> و<a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">سلطات التأشيرات الصينية</a> التفاصيل والمتطلبات الرسمية، ويبقى مكتب الطلاب الدوليين في جامعتك أسرع مصدر عن الممارسة المحلية.</p>
<h2>كيف نساعدك على الاستقرار بعد الوصول</h2>
<p>السكن أول عناصر الاستقرار وليس آخرها، والاختيار الدقيق للجامعة والمدينة يوفر عليك لاحقاً كثيراً من عناء التفاصيل. نساعدك في اختيار <a href="/ar/universities">الجامعة والمدينة المناسبتين لميزانيتك</a>، ثم نرافقك في إجراءات القبول والتأشيرة وما يليهما من خطوات الوصول — من التقديم على السكن الجامعي مبكراً إلى ترتيب أول أسبوع لك في الصين. اطلب <a href="/ar/contact">استشارة مجانية من فريق Bridge to China Edu</a>، أو تعرف أولاً على <a href="/ar/services">خدماتنا الكاملة في القبولات والالتحاق</a>.</p>
<p><em>آخر مراجعة: نوفمبر 2026. الأرقام نطاقات استرشادية تتغير؛ تحقق دائماً من جامعتك والمصادر الرسمية قبل أي التزام مالي.</em></p>$$,
  $$<p>Once your admission letter arrives, the practical questions begin — and the first is usually: where will I live? In China the answer generally comes down to two paths: a room in a university dormitory, or a private apartment off campus. Both work well, but each suits a different budget, personality and stage of student life. This guide walks through how each option actually works: room types and facilities, indicative costs, how to apply for dorm housing, then private rents, contracts, deposits and required documents, followed by short-term options for your first days and practical advice on contracts, utility bills and internet — the same details our team reviews with every student we accompany, so the move from the airport ends at a settled room rather than a surprise. All figures below are indicative ranges that change; the final word is always your university's international student office and the official portals.</p>
<h2>Dorm or private flat: the decision at a glance</h2>
<p>Most international students begin in a university dormitory, and many universities — especially for first-year students and Chinese language programs — expect exactly that. Dorms are cheaper and administratively simpler: no lease, no agent, no deposit negotiations, and you are inside campus life from day one. Private housing gives you space, privacy, a kitchen and full independence, but brings deposits, agent fees, a contract written in Chinese and utility bills in your own name. A common pattern among students: one or two years in the dorm, then moving out once you know the city, the language and your own daily rhythm. For a wider picture of life on and around campus, see our <a href="/en/blog/student-life-in-china">guide to student life in China</a>.</p>
<h2>On-campus dormitories: what you will actually find</h2>
<h3>Types of rooms</h3>
<ul>
<li><strong>Shared double room:</strong> the classic setup — two beds, two desks and wardrobes. The cheapest and most social option; your roommate is usually another international student.</li>
<li><strong>Single room:</strong> available at many universities for a higher fee, allocated on a first-come, first-served basis.</li>
<li><strong>Suite-style units:</strong> some newer campuses offer two or three bedrooms with a shared living room and bathroom.</li>
<li><strong>Triple and quad rooms:</strong> still found at some universities, and the most affordable of all.</li>
</ul>
<h3>Typical facilities and indicative costs</h3>
<p>Most dorm buildings provide shared kitchens or common rooms, laundry rooms, hot-water dispensers on every floor, and 24-hour security with card entry. Air conditioning, private bathrooms and heating vary by campus and climate — ask about your specific building, not the university in general.</p>
<ul>
<li><strong>Shared double room:</strong> typically CNY 400–1,500 per month, depending on the city and university.</li>
<li><strong>Single or ensuite room:</strong> typically CNY 1,500–3,000 per month where available.</li>
<li>Payment is usually per semester or academic year, sometimes monthly.</li>
</ul>
<p>These are indicative ranges only: accommodation fees are set by each university and change from year to year, so rely on your university's official international students page. The official <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">Campus China portal</a> lists participating universities and links to their admissions pages.</p>
<h3>How to apply for dormitory housing</h3>
<ol>
<li>State your dormitory preference while applying to the university — most application forms ask about housing in the application itself.</li>
<li>Watch your inbox after admission: a housing application form and a payment deadline usually follow.</li>
<li>Pay the accommodation deposit or first period if requested, and keep the receipt.</li>
<li>Arrive with your admission letter, passport and housing confirmation — check-in is normally completed in a single visit to the dorm reception or the international students' office.</li>
</ol>
<p>Apply as early as the window allows: rooms are allocated first-come, first-served, and singles run out first.</p>
<h3>Advantages and disadvantages</h3>
<p>In your first year, the dormitory's strengths are hard to beat:</p>
<ul>
<li><strong>Cost:</strong> usually the cheapest housing you will find in any Chinese city.</li>
<li><strong>Community:</strong> roommates, neighbors and shared events create an instant social circle.</li>
<li><strong>Proximity:</strong> a five-minute walk to lectures, the library and the canteen — no commute and no transport budget.</li>
<li><strong>Administrative simplicity:</strong> no lease, no agent, no deposit negotiations; the university registers your accommodation for you.</li>
</ul>
<p>The trade-offs:</p>
<ul>
<li>Less privacy and quiet; shared bathrooms in most buildings.</li>
<li>Curfews and visitor rules at some dorms — ask before you assume.</li>
<li>Limited cooking facilities; canteens and delivery fill the gap.</li>
<li>Furniture and rooms are functional rather than spacious.</li>
</ul>
<h2>Renting a private apartment off campus</h2>
<h3>How renting works</h3>
<p>Most students rent through a licensed agent who shows several flats, negotiates with the landlord and prepares the contract. Flats come furnished or semi-furnished. Contracts are written in Chinese — bring a trusted translator or ask your university's international office to review the document before you sign. Always verify that the person signing either owns the flat (property ownership certificate) or is formally authorized by the owner.</p>
<h3>Deposits and agent fees</h3>
<ul>
<li><strong>Deposit:</strong> commonly one to three months' rent, refunded at the end of the lease if the flat is returned in good condition — photograph everything at handover.</li>
<li><strong>Agent fee:</strong> commonly around half to one month's rent, paid once; practices differ by city.</li>
<li><strong>Payment rhythm:</strong> rent is often paid quarterly or semi-annually, and some landlords prefer longer prepayments; monthly payment with a one-month deposit also exists. Never transfer money before a contract is signed.</li>
</ul>
<h3>Documents you will need</h3>
<ul>
<li>Your <strong>passport</strong> with a valid visa or <strong>residence permit</strong> — the landlord will keep a copy attached to the lease.</li>
<li>Proof of enrollment or your student ID, which some compounds (gated residential communities) request for access registration.</li>
<li>A local Chinese mobile number — required for almost everything, from utility apps to building entry systems.</li>
</ul>
<h3>Indicative rents by city tier</h3>
<ul>
<li><strong>Tier-1 cities (Beijing, Shanghai, Guangzhou, Shenzhen):</strong> a room in a shared flat typically CNY 1,500–4,000 per month; a small one-bedroom flat typically CNY 3,000–8,000.</li>
<li><strong>Tier-2 and comparable cities (Hangzhou, Chengdu, Nanjing, Wuhan, Xi'an and similar):</strong> a room typically CNY 800–2,500; a small flat typically CNY 1,500–3,500.</li>
<li><strong>Smaller cities:</strong> a room typically CNY 500–1,500; a small flat typically CNY 1,000–2,500.</li>
</ul>
<p>These are broad ranges for orientation only: actual prices vary enormously by district, metro access, building age and floor. To see how housing fits into your overall budget, read our <a href="/en/blog/study-in-china-costs-guide">guide to the cost of studying and living in China</a>.</p>
<h2>Short-term options for your first days</h2>
<p>You do not need to sign a year-long lease from the airport. Arriving students commonly book two to four weeks of temporary housing while they view flats or wait for a dorm room to be allocated:</p>
<ul>
<li><strong>University temporary accommodation:</strong> many international student offices can arrange a short dorm stay for arriving students — email them a few weeks before you fly.</li>
<li><strong>Hostels and budget hotels:</strong> typically CNY 80–250 per night.</li>
<li><strong>Mid-range hotels:</strong> typically CNY 250–600 per night in major cities, and less elsewhere; prices move with the season and local events.</li>
<li><strong>Serviced apartments:</strong> more expensive, but include utilities, internet and flexible weekly or monthly terms — a reasonable bridge for one month.</li>
</ul>
<p>Book somewhere near campus for the first nights: that week will be busy with registration, health checks and residence permit paperwork, and short commutes matter. For the full sequence of arriving and starting out in China, see our <a href="/en/blog/study-in-china-guide">complete study-in-China guide</a>.</p>
<h2>Before you sign: a practical checklist</h2>
<ul>
<li><strong>Read the whole contract:</strong> rent, deposit, refund conditions, notice period, who pays for which repairs, and early-termination penalties.</li>
<li><strong>Verify ownership:</strong> ask to see the property certificate and the landlord's ID, or the agent's written authorization.</li>
<li><strong>Inventory with photos:</strong> every scratch, appliance and piece of furniture, dated and shared with the landlord.</li>
<li><strong>Check the practicals:</strong> water pressure and hot water, heating in northern cities, air conditioning in southern ones, mobile signal, and damp marks on the walls.</li>
<li><strong>Ask about extra costs:</strong> the property management fee common in gated compounds, parking, and when bills fall due.</li>
<li><strong>Confirm registration support:</strong> the landlord or agent must help you register your new address — more on this below.</li>
</ul>
<h2>Utilities, internet and everyday bills</h2>
<p>In a dormitory, utilities are usually included in the accommodation fee or charged at modest fixed rates; in private housing, electricity, water and gas move into your hands. They are paid through mobile apps or at convenience stores, and the previous tenant's meter readings should be recorded in the contract. Air conditioning is typically the single biggest variable item in summer and winter.</p>
<p>Internet in private flats is installed by one of the major carriers, usually with a contract of a year or more and a one-off installation fee; campus networks in dorms are arranged through the university and far simpler. A local SIM card with a generous data package is inexpensive and works everywhere — many students rely on it entirely for their first weeks.</p>
<h2>Registration rules behind your housing choice</h2>
<p>Whichever option you choose, Chinese law requires foreigners to register their residential address with the local authorities — hotels do it automatically, in a university dorm the international students' office normally handles it, and in a private flat you register yourself (with the landlord's help) at the local police station within a strictly enforced window after moving in, commonly 24 hours in cities. Keep the registration slip: you will need it when applying for your residence permit and renewing it each year. Details and requirements are published by the <a href="https://www.mfa.gov.cn/eng/" target="_blank" rel="noopener noreferrer">Chinese Ministry of Foreign Affairs</a> and the <a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">Chinese visa authorities</a>, while your university's international office remains the fastest source on local practice.</p>
<h2>How we help you settle in after arrival</h2>
<p>Accommodation is the first element of settling in, not the last — and choosing the right university and city spares you many headaches later. We help you select the <a href="/en/universities">university and city that fit your budget</a>, then guide you through admission, the visa and the steps that follow arrival — from applying for dormitory housing early to planning your first week in China. Book a <a href="/en/contact">free consultation with Bridge to China Edu</a>, or start by exploring our <a href="/en/services">full admission and enrollment services</a>.</p>
<p><em>Last reviewed: November 2026. Figures are indicative ranges and change — always verify with your university and official sources before any financial commitment.</em></p>$$,
  $$<p>Когда письмо о зачислении получено, начинается самое практичное — и первый вопрос обычно звучит так: где я буду жить? В Китае выбор, как правило, сводится к двум путям: комната в университетском общежитии или частная квартира за пределами кампуса. Оба варианта рабочие, но каждый подходит своему бюджету, характеру и этапу студенческой жизни. В этом руководстве — как устроен каждый вариант на самом деле: типы комнат и удобства, ориентировочные цены, порядок подачи заявки в общежитие, затем аренда квартир, договоры, депозиты и необходимые документы, краткосрочные решения на первые дни и практические советы по контрактам, коммунальным платежам и интернету — те самые детали, которые мы проговариваем с каждым своим студентом, чтобы переезд из аэропорта закончился в обустроенной комнате, а не в цепочке сюрпризов. Все цифры ниже — ориентировочные диапазоны, которые меняются: окончательное слово всегда за международным отделом вашего вуза и официальными порталами.</p>
<h2>Коротко: общежитие или частная квартира?</h2>
<p>Большинство иностранных студентов начинает с университетского общежития — многие вузы, особенно для первокурсников и языковых программ, его прямо предпочитают. Общежитие дешевле и административно проще: никакого договора, агента и переговоров о депозите, а вы с первого дня внутри кампусной жизни. Частное жильё даёт пространство, уединение, кухню и полную независимость, но приносит депозиты, агентские комиссии, договор на китайском языке и счета на ваше имя. Распространённая схема: год-два в общежитии, затем переезд, когда вы уже знаете город, язык и собственный ритм жизни. Более широкая картина — в нашем <a href="/ru/blog/student-life-in-china">путеводителе по студенческой жизни в Китае</a>.</p>
<h2>Университетское общежитие: что вы найдёте на деле</h2>
<h3>Типы комнат</h3>
<ul>
<li><strong>Двухместная комната:</strong> классика — две кровати, два стола и шкафы. Самый экономный и самый общительный вариант; соседом обычно оказывается такой же иностранный студент.</li>
<li><strong>Одноместная комната:</strong> есть во многих вузах за более высокую плату; места распределяются в порядке очереди заявок.</li>
<li><strong>Блочные юниты:</strong> на новых кампусах встречаются блоки из двух-трёх спален с общей гостиной и ванной.</li>
<li><strong>Трёх- и четырёхместные комнаты:</strong> кое-где сохранились и стоят дешевле всех.</li>
</ul>
<h3>Удобства и ориентировочные цены</h3>
<p>В большинстве общежитий есть общие кухни или холлы, прачечные, кулеры с горячей водой на каждом этаже и круглосуточная охрана с картами доступа. Кондиционер, собственная ванная и отопление зависят от кампуса и климата — уточняйте по конкретному зданию, а не по вузу в целом.</p>
<ul>
<li><strong>Двухместная комната:</strong> обычно 400–1 500 юаней в месяц в зависимости от города и вуза.</li>
<li><strong>Одноместная комната или комната с ванной:</strong> обычно 1 500–3 000 юаней в месяц там, где они есть.</li>
<li>Оплата обычно за семестр или учебный год, иногда помесячно.</li>
</ul>
<p>Это лишь ориентировочные диапазоны: плату за общежитие устанавливает каждый вуз, и она меняется из года в год — сверяйтесь с официальной страницей вашего университета для иностранных студентов. Официальный <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">портал Campus China</a> публикует списки участвующих университетов и ссылки на их страницы приёма.</p>
<h3>Как подать заявку на общежитие</h3>
<ol>
<li>Отметьте желание жить в общежитии прямо в заявке на поступление — анкеты большинства вузов содержат вопрос о жилье.</li>
<li>После зачисления следите за почтой: обычно приходят форма заявки на жильё и срок оплаты.</li>
<li>Внесите депозит или первую оплату, если они запрошены, и сохраните квитанцию.</li>
<li>Приезжайте с письмом о зачислении, паспортом и подтверждением жилья — заселение, как правило, оформляют за один визит на ресепшен общежития или в международном отделе.</li>
</ol>
<p>Подавайте заявку как можно раньше: комнаты распределяют по очереди, и одноместные заканчиваются первыми.</p>
<h3>Плюсы и минусы</h3>
<p>В первый год преимущества общежития трудно превзойти:</p>
<ul>
<li><strong>Цена:</strong> обычно самое дешёвое жильё, которое можно найти в любом китайском городе.</li>
<li><strong>Окружение:</strong> соседи по комнате и этажу и общие мероприятия создают мгновенный круг общения.</li>
<li><strong>Близость:</strong> пять минут пешком до лекций, библиотеки и столовой — без дороги и транспортных расходов.</li>
<li><strong>Простота:</strong> нет договора, агента и переговоров о депозите; регистрацию места жительства вуз оформляет за вас.</li>
</ul>
<p>Обратная сторона:</p>
<ul>
<li>Меньше уединения и тишины; в большинстве зданий ванные общие.</li>
<li>В некоторых общежитиях действуют комендантский час и правила для гостей — уточняйте заранее.</li>
<li>Ограниченные возможности для готовки; выручают столовые и доставка.</li>
<li>Обстановка функциональная, а не просторная.</li>
</ul>
<h2>Аренда частной квартиры за кампусом</h2>
<h3>Как устроена аренда</h3>
<p>Большинство студентов снимает жильё через лицензированного агента: он показывает несколько квартир, ведёт переговоры с хозяином и готовит договор. Квартиры сдаются с мебелью или полумеблированными. Договор составляется на китайском — возьмите с собой надёжного переводчика или попросите международный отдел вуза проверить документ до подписания. Всегда убеждайтесь, что подписант — либо собственник квартиры (по свидетельству о праве собственности), либо официально уполномоченное им лицо.</p>
<h3>Депозиты и комиссии агентов</h3>
<ul>
<li><strong>Депозит:</strong> обычно один–три месяца аренды, возвращается по окончании договора при сохранном состоянии квартиры — при заезде сфотографируйте всё подряд.</li>
<li><strong>Комиссия агента:</strong> обычно около половины или одного месяца аренды, единовременно; практика различается по городам.</li>
<li><strong>Ритм оплаты:</strong> аренду часто платят раз в квартал или полгода, некоторые хозяева предпочитают более длинные предоплаты; встречается и помесячная оплата с депозитом в один месяц. Не переводите деньги до подписания договора.</li>
</ul>
<h3>Необходимые документы</h3>
<ul>
<li><strong>Загранпаспорт</strong> с действующей визой или <strong>вид на жительство</strong> — хозяин снимет копию и приложит её к договору.</li>
<li>Справку о зачислении или студенческий билет — их иногда запрашивают для регистрации доступа в закрытых жилых комплексах.</li>
<li>Локальный китайский номер телефона — он нужен буквально для всего: от приложений оплаты услуг до домофонов.</li>
</ul>
<h3>Ориентировочная аренда по типам городов</h3>
<ul>
<li><strong>Города первой категории (Пекин, Шанхай, Гуанчжоу, Шэньчжэнь):</strong> комната в общей квартире — обычно 1 500–4 000 юаней в месяц; небольшая однокомнатная квартира — обычно 3 000–8 000 юаней.</li>
<li><strong>Города второй категории и близкие к ним (Ханчжоу, Чэнду, Нанкин, Ухань, Сиань и другие):</strong> комната — обычно 800–2 500 юаней; небольшая квартира — обычно 1 500–3 500 юаней.</li>
<li><strong>Небольшие города:</strong> комната — обычно 500–1 500 юаней; небольшая квартира — обычно 1 000–2 500 юаней.</li>
</ul>
<p>Это широкие ориентиры, а не цены: реальные суммы сильно зависят от района, близости метро, возраста дома и этажа. Как жильё встраивается в общий бюджет, разобрано в нашем <a href="/ru/blog/study-in-china-costs-guide">руководстве о стоимости учёбы и жизни в Китае</a>.</p>
<h2>Краткосрочные варианты на первые дни</h2>
<p>Подписывать годовой договор прямо из аэропорта не обязательно. Прибывающие студенты обычно бронируют две–четыре недели временного жилья, пока смотрят квартиры или ждут места в общежитии:</p>
<ul>
<li><strong>Временное жильё в вузе:</strong> многие международные отделы устраивают короткое проживание для новичков — напишите им за несколько недель до вылета.</li>
<li><strong>Хостелы и бюджетные отели:</strong> обычно 80–250 юаней за ночь.</li>
<li><strong>Отели среднего уровня:</strong> обычно 250–600 юаней за ночь в крупных городах и дешевле в остальных; цены колеблются по сезонам и местным событиям.</li>
<li><strong>Апарт-отели:</strong> дороже, но с коммунальными услугами, интернетом и гибкими недельными или месячными условиями — разумный мост на один месяц.</li>
</ul>
<p>Первые ночи бронируйте рядом с кампусом: эта неделя будет занята регистрацией, медосмотром и оформлением вида на жительство, и короткие перемещения в такие дни очень выручают. Полная последовательность действий по прибытии — в нашем <a href="/ru/blog/study-in-china-guide">общем руководстве по учёбе в Китае</a>.</p>
<h2>Чек-лист перед подписанием</h2>
<ul>
<li><strong>Прочитайте договор целиком:</strong> аренду, депозит, условия возврата, срок уведомления, кто оплачивает какой ремонт и штрафы за досрочное расторжение.</li>
<li><strong>Проверьте собственность:</strong> попросите свидетельство о праве собственности и удостоверение личности хозяина либо письменную доверенность агента.</li>
<li><strong>Опись с фото:</strong> каждая царапина, прибор и предмет мебели — с датой и передачей файла хозяину.</li>
<li><strong>Проверьте практичное:</strong> напор и горячую воду, отопление в северных городах, кондиционер в южных, качество сигнала связи и следы плесени на стенах.</li>
<li><strong>Спросите о доплатах:</strong> плату управляющей компании, обычную в закрытых комплексах, парковку и сроки выставления счетов.</li>
<li><strong>Уточните помощь с регистрацией:</strong> хозяин или агент должны помочь зарегистрировать ваш новый адрес — об этом ниже.</li>
</ul>
<h2>Коммунальные услуги, интернет и повседневные платежи</h2>
<p>В общежитии коммунальные услуги обычно включены в плату за жильё или тарифицируются по скромным фиксированным ставкам; в частной квартире электричество, вода и газ переходят на вас. Их оплачивают через мобильные приложения или в магазинах у дома, а показания счётчиков предыдущего жильца должны быть зафиксированы в договоре. Кондиционер, как правило, — самая большая переменная статья летом и зимой.</p>
<p>Интернет в частных квартирах устанавливает один из крупных операторов связи, обычно с договором от года и разовым монтажным сбором; кампусные сети в общежитиях оформляются через вуз и заметно проще. Локальная сим-карта со щедрым пакетом данных стоит недорого и работает везде — в первые недели на ней держится большинство студентов.</p>
<h2>Правила регистрации, связанные с жильём</h2>
<p>Какой бы вариант вы ни выбрали, китайское законодательство требует от иностранцев регистрировать адрес проживания в местных органах: отели делают это автоматически, в университетском общежитии всё обычно оформляет международный отдел, а в частной квартире вы регистрируетесь сами (при помощи хозяина) в местном полицейском участке в жёстко ограниченный срок после заселения — как правило, 24 часа в городах. Храните квитанцию о регистрации: она понадобится при подаче на вид на жительство и при его ежегодном продлении. Подробности и требования публикуют <a href="https://www.mfa.gov.cn/eng/" target="_blank" rel="noopener noreferrer">Министерство иностранных дел КНР</a> и <a href="https://www.visaforchina.cn" target="_blank" rel="noopener noreferrer">китайские визовые органы</a>, а самый быстрый источник о местной практике — международный отдел вашего вуза.</p>
<h2>Как мы помогаем обосноваться после приезда</h2>
<p>Жильё — первый элемент адаптации, но не последний, и точный выбор вуза и города избавляет от многих хлопот впоследствии. Мы поможем подобрать <a href="/ru/universities">университет и город под ваш бюджет</a>, сопроводим поступление, визу и первые шаги после прибытия — от ранней заявки на общежитие до плана вашей первой недели в Китае. Запишитесь на <a href="/ru/contact">бесплатную консультацию Bridge to China Edu</a> или начните с <a href="/ru/services">наших услуг по поступлению и зачислению</a>.</p>
<p><em>Последняя проверка: ноябрь 2026. Цифры ориентировочны и меняются; перед любыми финансовыми обязательствами сверяйтесь с вузом и официальными источниками.</em></p>$$,
  'scene:night-bridge', 'student_life', 'published', '2026-11-12T10:00:00+00', '2026-11-12T10:00:00+00'
)
on conflict (slug) do nothing;


-- university-scholarships-china-guide.sql
--
-- Editorial batch 2 — one article: the ecosystem of funding for international
-- students in China BEYOND the Chinese Government Scholarship (CSC):
-- university-level scholarships (freshman, partial and full tuition waivers),
-- provincial and municipal government scholarships, the International Chinese
-- Language Teachers Scholarship (formerly Confucius Institute Scholarship),
-- Silk Road scholarships as a CSC stream, and enterprise/institutional
-- programs — plus coverage tiers, application routes, stacking rules and
-- strategies for applicants without a scholarship offer.
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Only official sources linked (campuschina.org, chinesetest.cn).
--   • Provincial/enterprise schemes described as categories with examples of
--     provinces, never with invented amounts; stacking rules framed as
--     "policies vary — confirm with the university".
--   • No fabricated statistics, testimonials, rankings, or admission promises.
--   • Each version carries localized internal links into the site's
--     conversion paths (universities, services, contact) and cross-links to
--     the CSC guide, CSC steps, study-in-china and English-taught degrees
--     guides.
--   • Cover image uses the site's built-in brand scene (scene:beijing) so no
--     storage upload is required.
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.
-- Apply with: supabase db push (or paste into the SQL editor).

insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'university-scholarships-china-guide',
  $$منح الجامعات الصينية: دليل التمويل الدراسي إلى ما وراء منحة CSC$$,
  $$University Scholarships in China: The Complete Funding Guide Beyond the CSC$$,
  $$Стипендии университетов Китая: руководство по финансированию за рамками CSC$$,
  $$إلى ما وراء منحة CSC: منح الجامعات والمحافظات وبرامج كونفوشيوس وطريق الحرير والشركات — ماذا تغطي كل منحة، وكيف تتقدّم إليها، وهل يمكن الجمع بين المنح؟$$,
  $$Beyond the CSC: university, provincial and Confucius Institute scholarships, Silk Road funding and enterprise programs — what each covers, how to apply, and how to combine awards.$$,
  $$За рамками CSC: стипендии университетов, провинций и Института Конфуция, Silk Road и корпоративные программы — что покрывает каждая, как подавать заявку и совмещать ли награды.$$,
  $$<p>حين تسأل الطلاب عن المنح الدراسية في الصين، تأتي الإجابة نفسها في معظم الأحيان: منحة الحكومة الصينية (CSC). وهي فعلاً المنحة الأشهر والأوسع تمويلاً، لكنها أيضاً الأكثر تنافسية، وتمثل الطبقة الظاهرة فقط من منظومة تمويل أوسع بكثير. فتحت هذه الطبقة تمنح الجامعات الصينية نفسها منحها الخاصة، وتدير المحافظات والبلديات برامجها، وتموّل مؤسسات تعليم اللغة الصينية والشركات مسارات إضافية للطلاب الدوليين. إذا بنيت خطتك على هذه المنظومة كاملة بدلاً من الاعتماد على ورقة يانصيب واحدة، فإن فرصك في الوصول إلى الصين بدعم مالي تتحسن بشكل ملموس. يرسم هذا الدليل كل طبقة على حدة: ماذا تغطي، وكيف ومتى تتقدّم إليها، وماذا تفعل إن لم يصلك أي عرض.</p>
<h2>لماذا تنظر إلى ما هو أبعد من منحة CSC؟</h2>
<p>تجذب <a href="/ar/blog/chinese-government-scholarship-csc-guide">منحة الحكومة الصينية</a> ملفات ممتازة من كل أنحاء العالم، والتنافس عليها حاد لأن المقاعد محدودة. أما الطبقات الأخرى فتعمل بمنطق مختلف تماماً: جامعات وحكومات محلية تريد جذب الطلاب الدوليين إلى مؤسساتها ومناطقها تحديداً، ما يعني أن عدد المتقدمين أقل، وأن مستوى المنافسة أخف بشكل عام. بل إن بعض هذه المنح يُمنح تلقائياً انطلاقاً من ملف القبول نفسه دون طلب منفصل أصلاً. إن كنت ستتقدّم إلى منحة CSC، فاتبع <a href="/ar/blog/csc-scholarship-steps">دليلنا التفصيلي لخطوات التقديم</a> — لكن اعتبره مساراً واحداً ضمن استراتيجية أوسع، لا الاستراتيجية كلها.</p>
<h2>المنح التي تقدمها الجامعات بنفسها</h2>
<p>معظم الجامعات الصينية التي تستقطب الطلاب الدوليين بجدية لديها برامج منح خاصة بها. تختلف المسميات — «منح الطلاب الجدد»، «منحة الطلاب الدوليين»، «منحة رئيس الجامعة» — لكنها تصب جميعها في أنماط واضحة يمكن التعرف عليها بسرعة.</p>
<h3>منح الطلاب الجدد</h3>
<p>تُمنح عند القبول بناءً على قوة ملفك: الدرجات، ونتائج اللغة، وخطة الدراسة. بعضها يخفّض الرسوم للسنة الأولى فقط، وبعضها قابل للتجديد إذا حافظت على مستواك الأكاديمي. وتعتبر بعض الجامعات كل طالب مقبول تلقائياً ضمن التقييم، بينما تتطلب جامعات أخرى تحديد خيار معين أو كتابة فقرة قصيرة في بوابة التقديم. لذلك اقرأ صفحة المنح في موقع كل جامعة بعناية قبل أن تكتفي بإرسال طلب القبول.</p>
<h3>الإعفاءات الجزئية والكاملة من الرسوم</h3>
<p>توفر كثير من الجامعات خصومات على الرسوم تتراوح بين نسبة محدودة والإعفاء الكامل. الإعفاءات الجزئية أكثر شيوعاً بكثير من الكاملة، وكثيراً ما تُستخدم لسد الفجوة أمام طلاب واعدين يكاد ملفهم يكتمل. والمهم هنا أن هذه المنح بيد الجامعة وتقديرها، فأحياناً يمكن نقاشها: متقدم قوي يسأل بأدب قد يكتشف أن مكتب القبول الدولي يملك هامشاً من المرونة لم يُعلن عنه في الموقع.</p>
<h3>منح التفوق للطلاب المسجّلين</h3>
<p>بعد وصولك إلى الصين يُفتح باب فئة جديدة تماماً: منح سنوية تُمنح على أساس درجاتك والتزامك كطالب دولي داخل الحرم الجامعي. كثير من الجامعات ترصد ميزانية خاصة لهذه المنح، ما يعني أن سنة أولى على حسابك الخاص يمكن أن تتحول إلى سنة ممولة اعتباراً من السنة الثانية. والتفاصيل تُنشر عادةً على صفحات الطلاب الدوليين في الموقع الرسمي للجامعة تحت نطاق edu.cn.</p>
<h2>منح المحافظات والبلديات</h2>
<p>على المستوى المحلي، تدير محافظات صينية عديدة — مثل بكين وشنغهاي وجيانغسو وتشجيانغ وقوانغدونغ وفوجيان ويونان وغيرها — برامج منح تهدف إلى جذب الطلاب الدوليين إلى منطقتها، وتضيف بعض المدن الكبرى برامج بلدية فوق البرامج المحافظية. والمنطق هنا إقليمي وواضح: المحافظة التي تمول دراستك تتوقع أن تدرس في إحدى جامعاتها، ولذلك تُخصص هذه المنح للطلاب الملتحقين بمؤسسات داخل حدودها الإدارية.</p>
<p>عملياً، تُدار هذه البرامج عبر الجامعات نفسها: تتقدّم أو تُرشَّح من المؤسسة التي قبلتك أو سجّلتك فيها، ثم تُحوَّل الملفات إلى سلطات التعليم في المحافظة للموافقة النهائية. وتختلف التغطية من محافظة لأخرى اختلافاً كبيراً؛ فبعض البرامج يركز على الرسوم الدراسية، وبعضها يضيف السكن أو بدل معيشة شهرياً. ولأن هذه المنح أقل شهرة دولياً من منحة الحكومة المركزية، تكون المنافسة عليها أخف بوضوح في الغالب. اسأل كل جامعة في قائمتك سؤالاً مباشراً: هل ينطبق على طلابها الدوليين برنامج محافظة أو بلدية؟</p>
<h2>منحة المعلمين الدوليين للغة الصينية (منحة كونفوشيوس سابقاً)</h2>
<p>المعروفة سابقاً باسم منحة معاهد كونفوشيوس، أصبحت اليوم «منحة المعلمين الدوليين للغة الصينية»، وهي موجهة لدراسة اللغة الصينية تحديداً. تشمل مساراتها المعتادة برامج لغة لفصل دراسي واحد أو سنة أكاديمية كاملة، وبكالوريوس تعليم اللغة الصينية لغير الناطقين بها، وماجستيراً في التخصص نفسه. وللطلاب الذين تبدأ خطتهم بتدريب لغوي مكثف قبل الدرجة العلمية، تُعد هذه المنحة من أسهل الطرق الممولة للوصول إلى الصين على الإطلاق.</p>
<p>يشترط القبول عادةً شهادة HSK سارية، ويختلف المستوى المطلوب حسب البرنامج والجامعة، وتُعلن المتطلبات المحدثة سنوياً على البوابات الرسمية، فتحقق منها قبل أن تجدول اختباراتك. أما مواعيد اختبارات HSK والتسجيل فيها ومصادر التحضير فتجدها على <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">موقع chinesetest.cn الرسمي</a>. ويتم التقديم عادةً عبر معاهد كونفوشيوس في بلدك أو السفارات والقنصليات الصينية أو الجامعات المضيفة مباشرة. وإذا كانت غايتك النهائية شهادة جامعية بالصينية، فقد تكون هذه المنحة جسراً ممولاً نحوها: نتائج اللغة القوية توسّع خياراتك في البرامج الأكاديمية لاحقاً بدرجة كبيرة.</p>
<h2>منح طريق الحرير وبرامج الشركات</h2>
<h3>منح طريق الحرير</h3>
<p>ليست منحة طريق الحرير نظاماً منفصلاً، بل مسار ضمن منحة الحكومة الصينية نفسها، مرتبط بأولويات مبادرة الحزام والطريق. تُخصَّص مقاعدها عبر الجامعات المشاركة: تتقدّم إلى الجامعة، فترشّح المتقدمين المؤهلين إلى هذا المسار تحديداً. وغالباً ما تعكس شروط الأهلية أولويات البرنامج، من بينها جنسيتك وتخصصك الدراسي. وتنشر بوابة <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">campuschina.org</a> الرسمية قائمة الجامعات المشاركة وتفاصيل البرامج كل عام، وهي المرجع الأول للتحقق قبل التقديم.</p>
<h3>برامج الشركات والمؤسسات</h3>
<p>فئة أصغر حجماً لكنها حقيقية: شركات صينية وغرف صناعية ومؤسسات مانحة تموّل أحياناً اتفاقيات منح مع جامعات محددة، وترتبط عادةً بمجالات مثل الهندسة أو التجارة الدولية أو الخدمات اللوجستية، وقد تتضمن فرص تدريب عملي لدى الشركة الممولة. تتغير هذه البرامج كثيراً ونادراً ما يُعلن عنها دولياً، والطريق الموثوق إليها هو السؤال المباشر: اطلب من مكتب الطلاب الدوليين في جامعتك المستهدفة توضيح الشراكات المتاحة في تخصصك بالضبط.</p>
<h2>ما تغطيه هذه المنح عادةً: ثلاث فئات</h2>
<p>عبر كل هذه الطبقات، تصطف المنح في ثلاث فئات واضحة من السخاء، ومعرفة موقع أي عرض تحصل عليه منها تساعدك على مقارنة الخيارات بإنصاف:</p>
<ul>
<li><strong>الرسوم فقط:</strong> من تخفيض جزئي إلى إعفاء كامل — الفئة الأكثر شيوعاً على مستوى الجامعات.</li>
<li><strong>الرسوم مع السكن:</strong> تضيف سريراً في سكن الجامعة أو بدل سكن نقدياً؛ وهي صيغة شائعة في برامج المحافظات.</li>
<li><strong>تمويل كامل مع مخصص شهري:</strong> رسوم وسكن ومخصص معيشة وتأمين طبي — الفئة الأكثر ارتباطاً بمنحة CSC، ولا تقدمها الجامعات والمحافظات إلا بشكل انتقائي محدود.</li>
</ul>
<p>أما أنماط الأهلية فمتناسقة بدورها عبر البرامج: منح القبول تقيّم ملفك قبل التسجيل، ومنح التفوق تقيّم أداءك بعد الوصول؛ وكثير من البرامج يشترط إثبات لغة (HSK للبرامج المدرّسة بالصينية، وIELTS أو TOEFL <a href="/ar/blog/english-taught-degrees-china-guide">للبرامج المدرّسة بالإنجليزية</a>)؛ وبعض برامج المحافظات والشركات تقصر الأهلية على منطقة أو تخصص بعينه.</p>
<h2>كيف تتقدّم — وهل يمكن الجمع بين المنح؟</h2>
<h3>التوقيت والمسار</h3>
<p>تجري معظم منح الجامعات والمحافظات بالتوازي مع دورة القبول نفسها: للالتحاق في سبتمبر تفتح نوافذ التقديم عادةً بين ديسمبر والربيع، عبر البوابة ذاتها أو استمارة القبول نفسها أو قسم خاص بالمنح بجانبها. أما الفئة الأصغر — خاصة منح التفوق بعد الوصول — فلا تُفتح إلا بعد تسجيلك فعلياً. والوثائق المطلوبة هي غالباً التي حضّرتها أصلاً للقبول: كشوف الدرجات وشهادات اللغة وخطة الدراسة، بحيث يخدم الملف القوي الواحد عدة طلبات في آن واحد. ويشرح <a href="/ar/blog/study-in-china-guide">دليلنا الشامل للدراسة في الصين</a> كيف تجهّز هذا الملف خطوة بخطوة.</p>
<h3>هل يمكن الجمع بين منحتين؟</h3>
<p>هذا أكثر سؤال يطرحه الطلاب، والإجابة الصادقة الوحيدة: السياسات تختلف من مؤسسة لأخرى. كقاعدة عامة، لا يُسمح عادةً بالجمع بين منحتين حكوميتين صينيتين على المستوى الوطني في الوقت نفسه، وكثير من الجامعات لا تجمع منحتها الخاصة مع منحة خارجية كاملة. لكن بعض المؤسسات تركّب عن قصد: إعفاء جامعي فوق برنامج محافظة، أو مخصص شهري فوق منحة جزئية. لا تفترض شيئاً — أكّد قواعد الجمع مع مكتب الطلاب الدوليين في كل جامعة قبل أن تبني أي قرار مالي عليها.</p>
<h2>لم يصلك عرض؟ خمس استراتيجيات مجرّبة</h2>
<ol>
<li><strong>سجّل وتفوّق.</strong> كثير من الجامعات تحوّل طلاب السنة الأولى المتفوقين إلى حملة منح اعتباراً من السنة الثانية — تعامل مع سنتك الأولى كطلب ممتد أمام لجنة التقييم.</li>
<li><strong>اسأل مباشرة.</strong> بعض خصومات الطلاب الجدد تُطبَّق تلقائياً، وبعضها لا يوجد إلا بطلب. رسالة قصيرة مهذبة إلى مكتب القبول الدولي لا تكلفك شيئاً.</li>
<li><strong>وسّع قائمتك.</strong> جامعات أقل شهرة في مدن أصغر تدير غالباً برامج سخية بمنافسة أخف — وتكاليف معيشة أقل تكمل الصورة.</li>
<li><strong>استخدم دراسة اللغة جسراً.</strong> سنة لغة ممولة عبر منحة المعلمين الدوليين للغة الصينية قد تسبق طلب الشهادة العلمية بملف أقوى بكثير.</li>
<li><strong>أعد التقديم في الدورة التالية.</strong> الملفات التي لا تحالفها دورة واحدة كثيراً ما تنجح في الدورة التالية مع نتائج لغة أفضل وخطة دراسة أحدّ.</li>
</ol>
<h2>خطة تمويل متعددة الطبقات</h2>
<p>الطلاب الذين يموّلون دراستهم في الصين بنجاح هم قليلاً ما يكونون من فازوا بمنحة واحدة شهيرة؛ إنهم عادةً من ركّبوا خياراتهم فوق بعضها: إعفاء جامعي عند التقديم، وبرنامج محافظة بعد التسجيل، ومنحة تفوق من السنة الثانية. ارسم خريطة كل طبقة لكل جامعة في قائمتك قبل أن تلتزم باستراتيجية، وأكّد القواعد المحدثة مع كل مؤسسة مباشرة، فسياسات المنح تتغير من سنة إلى أخرى. وإن أردت مقارنة الجامعات وخيارات تمويلها، فتصفح <a href="/ar/universities">دليل الجامعات لدينا</a>، أو اطّلع على <a href="/ar/services">خدماتنا في القبولات والمنح</a>، أو احجز <a href="/ar/contact">استشارة مجانية</a> — نرافق الطلاب في هذه الرحلة تحديداً في كل موعد قبول.</p>
<p><em>آخر مراجعة: نوفمبر 2026. تتغير برامج المنح وقواعدها من سنة لأخرى — تحقّق دائماً من التفاصيل مع الجامعة أو البوابة الرسمية.</em></p>$$,
  $$<p>Ask most students about scholarships in China and you will hear one answer: the Chinese Government Scholarship. It is the flagship award, and rightly so — but it is also the most competitive, and it is only the visible layer of a much wider funding ecosystem. Underneath it, Chinese universities themselves award their own scholarships, provincial and municipal governments run their own programs, and Chinese language institutions and enterprises fund additional routes for international students. If you build your plan around this whole ecosystem instead of a single lottery ticket, your chances of arriving in China with financial support improve dramatically. This guide maps each layer — what it covers, how and when to apply, and what to do when no offer comes.</p>
<h2>Why look beyond the CSC</h2>
<p>The <a href="/en/blog/chinese-government-scholarship-csc-guide">Chinese Government Scholarship</a> attracts excellent files from all over the world, and competition is fierce because seats are limited. The layers beneath it work on different logic: universities and local governments want to attract international students to their specific institutions and regions, which means smaller applicant pools and generally lighter competition. Many of these scholarships are even awarded automatically from your admission file, with no separate application at all. If you plan to apply for the CSC, follow our step-by-step <a href="/en/blog/csc-scholarship-steps">CSC application walkthrough</a> — but treat it as one track within a broader strategy, not the whole strategy.</p>
<h2>Scholarships offered by the universities themselves</h2>
<p>Most Chinese universities that actively recruit international students maintain scholarship schemes of their own. The names differ — "freshman scholarship", "international student scholarship", "presidential scholarship" — but they fall into a few recognizable patterns.</p>
<h3>Freshman scholarships</h3>
<p>These are awarded at the moment of admission, based on the strength of your application: grades, language results and study plan. Some reduce tuition for the first year only; others are renewed annually if you maintain your academic performance. A few universities consider every admitted student automatically, while others require you to select an option or write a short paragraph in the application portal. Read each university's scholarship page carefully before you settle for sending a plain admission application.</p>
<h3>Partial and full tuition waivers</h3>
<p>Many universities offer tuition discounts that range from a modest percentage to a complete waiver. Partial waivers are far more common than full ones, and universities often use them to close the gap for promising applicants whose files are almost there. The key point: these awards sit at the university's discretion, which means they can sometimes be discussed — a strong applicant who asks politely may discover the international admissions office has more flexibility than the website suggests.</p>
<h3>Performance scholarships for enrolled students</h3>
<p>Once you arrive in China, a new category opens: annual scholarships awarded on the basis of your grades and conduct as an international student on campus. Many universities budget specifically for these awards, which means a self-funded first year can convert into a funded one from year two. Details are published on each university's international student pages under its official .edu.cn domain.</p>
<h2>Provincial and municipal government scholarships</h2>
<p>Below the national level, many provinces — such as Beijing, Shanghai, Jiangsu, Zhejiang, Guangdong, Fujian and Yunnan, among others — run scholarship programs designed to bring international students to their region, and some major cities add municipal schemes on top of the provincial ones. The logic is regional and transparent: a province that funds your studies expects you to study at one of its universities, so these awards are reserved for students enrolled at institutions within its borders.</p>
<p>In practice, these programs are administered through the universities themselves: you apply or are nominated by the institution where you hold admission or enrollment, and the files are then forwarded to the provincial education authorities for final approval. Coverage differs widely from province to province — some schemes focus on tuition, while others add accommodation or a monthly living allowance. Because these scholarships are far less famous internationally than the central government award, competition is often noticeably lighter. Ask every university on your shortlist one direct question: does a provincial or municipal scheme apply to its international students?</p>
<h2>The International Chinese Language Teachers Scholarship</h2>
<p>Formerly known as the Confucius Institute Scholarship, the International Chinese Language Teachers Scholarship funds Chinese language study specifically. Its typical tracks include one-semester and one-academic-year language programs, a bachelor's degree in Teaching Chinese to Speakers of Other Languages (BTCSOL) and a master's degree in the same field (MTCSOL). For students whose plan begins with intensive language training before a degree, it is one of the most accessible funded routes into China.</p>
<p>Admission generally requires a valid HSK certificate — the exact level depends on the program and the university, and current requirements are announced each year on the official portals, so verify them before you schedule your tests. Test dates, registration and preparation resources for HSK are available on the official <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">chinesetest.cn website</a>. Applications are typically submitted through Confucius Institutes in your country, Chinese embassies and consulates, or host universities directly. If your end goal is a degree taught in Chinese, this scholarship can serve as a funded bridge towards it: strong language results dramatically expand your academic options later.</p>
<h2>Silk Road and enterprise programs</h2>
<h3>Silk Road scholarships</h3>
<p>The Silk Road scholarship is not a separate system — it is a stream within the Chinese Government Scholarship itself, tied to Belt and Road cooperation priorities. Its seats are allocated through participating universities: you apply to the university, and the university nominates qualified candidates into this specific stream. Eligibility often reflects the program's priorities, including your country of citizenship and your field of study. The official CSC portal, <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">campuschina.org</a>, publishes the participating universities and program details each year, and it is the primary reference to check before applying.</p>
<h3>Enterprise and institutional programs</h3>
<p>A smaller but real category: Chinese companies, industry associations and foundations sometimes fund scholarship agreements with specific universities, usually tied to fields such as engineering, international trade or logistics, and occasionally paired with practical training with the sponsoring company. These programs change frequently and are rarely advertised internationally, so the reliable way to find them is a direct question: ask the international student office at your target university which partnerships exist in your exact field.</p>
<h2>What these scholarships typically cover</h2>
<p>Across all these layers, awards fall into three recognizable tiers of generosity — and knowing which tier an offer belongs to helps you compare options fairly:</p>
<ul>
<li><strong>Tuition only:</strong> from a partial reduction to a full waiver — the most common tier at university level.</li>
<li><strong>Tuition plus accommodation:</strong> adds a dormitory place or a cash housing allowance; a frequent format in provincial schemes.</li>
<li><strong>Full funding with stipend:</strong> tuition, accommodation, a monthly living allowance and medical insurance — the tier most associated with the CSC, offered only selectively by universities and provinces.</li>
</ul>
<p>Eligibility patterns are equally consistent across programs: admission-based awards evaluate your file before enrollment, while performance-based awards evaluate you after arrival; many programs require language proof (HSK for Chinese-taught programs, IELTS or TOEFL for <a href="/en/blog/english-taught-degrees-china-guide">English-taught degrees</a>); and some provincial and enterprise schemes restrict eligibility by region or field.</p>
<h2>How to apply — and whether awards can be combined</h2>
<h3>Timing and route</h3>
<p>Most university and provincial scholarships run alongside the admission cycle itself: for September intake, application windows typically open between December and spring, on the same portal or form as admission, or in a scholarship section beside it. The smaller group of awards — especially performance scholarships after arrival — opens only once you are actually enrolled. The documents requested are usually the ones you already prepared for admission: transcripts, language certificates and a study plan, which means one strong file can serve several applications at once. Our complete <a href="/en/blog/study-in-china-guide">guide to studying in China</a> covers how to assemble it step by step.</p>
<h3>Can you stack scholarships?</h3>
<p>This is the question students ask most, and the only honest answer is that policies differ from one institution to another. As a general pattern, holding two Chinese government scholarships at national level at the same time is not allowed, and many universities will not combine their own award with a full external one. But some institutions deliberately layer funding: a university tuition waiver on top of a provincial scheme, or a monthly stipend on top of a partial award. Never assume — confirm the combining rules with the international student office of each university before you base any financial decision on stacking.</p>
<h2>No scholarship offer? Five strategies that still work</h2>
<ol>
<li><strong>Enroll and perform.</strong> Many universities convert strong first-year students into scholarship holders from year two — treat your first year as an extended application in front of the evaluation committee.</li>
<li><strong>Ask directly.</strong> Some freshman discounts are applied automatically; others exist only on request. A short, polite email to the international admissions office costs you nothing.</li>
<li><strong>Widen your shortlist.</strong> Less famous universities in smaller cities often run generous schemes with lighter competition — and lower living costs complete the picture.</li>
<li><strong>Use language study as a bridge.</strong> A funded language year through the International Chinese Language Teachers Scholarship can precede a degree application with a much stronger profile.</li>
<li><strong>Reapply next cycle.</strong> Files that miss one season often succeed in the next — with better language results and a sharper study plan.</li>
</ol>
<h2>Building a layered funding plan</h2>
<p>The students who successfully fund their studies in China are rarely the ones who won a single famous award; they are the ones who stacked options: a university tuition waiver in the application, a provincial scheme after enrollment, a performance scholarship from year two. Map every layer for each university on your list before you commit to a strategy, and confirm the current rules directly with each institution, because scholarship policies change from year to year. If you want help comparing universities and their funding options, browse our <a href="/en/universities">university profiles</a>, explore our <a href="/en/services">admissions and scholarship services</a>, or book a <a href="/en/contact">free consultation</a> — we guide students through exactly this process every intake.</p>
<p><em>Last reviewed: November 2026. Scholarship schemes and rules change from year to year — always confirm details with the university or the official portal.</em></p>$$,
  $$<p>Спросите студентов о стипендиях в Китае — и почти все назовут одно: стипендию правительства КНР. Это действительно флагманская программа, но и самая конкурентная, к тому же лишь видимая часть гораздо более широкой системы финансирования. Под ней китайские университеты сами выделяют стипендии иностранным студентам, провинциальные и муниципальные власти ведут собственные программы, а языковые образовательные структуры и компании поддерживают дополнительные маршруты. Если строить план на всей этой экосистеме, а не на одном «лотерейном билете», шансы приехать в Китай с финансовой поддержкой заметно вырастают. Это руководство разбирает каждый уровень: что он покрывает, как и когда подавать заявку и что делать, если предложения не пришло.</p>
<h2>Зачем смотреть дальше CSC</h2>
<p><a href="/ru/blog/chinese-government-scholarship-csc-guide">Стипендия правительства Китая</a> собирает сильнейшие файлы со всего мира, мест мало, конкуренция высока. Нижние уровни устроены иначе: университеты и региональные власти заинтересованы привлечь студентов именно к себе, поэтому поток претендентов меньше и обычно слабее подготовлен. Многие из этих стипендий вообще назначаются автоматически по вашему заявлению о поступлении, без отдельной анкеты. Если подаётесь на CSC, воспользуйтесь нашим пошаговым <a href="/ru/blog/csc-scholarship-steps">разбором процедуры подачи</a> — но считайте его одним из треков широкой стратегии, а не всей стратегией.</p>
<h2>Стипендии самих университетов</h2>
<p>Большинство китайских вузов, активно набирающих иностранцев, ведут собственные стипендиальные программы. Названия различаются — «стипендия первокурсника», «стипендия для иностранных студентов», «стипендия ректора», — но по сути это несколько узнаваемых моделей.</p>
<h3>Стипендии для первокурсников</h3>
<p>Назначаются при зачислении — по силе вашего файла: оценкам, языковым результатам и плану обучения. Одни снижают оплату только в первый год, другие продлеваются ежегодно при сохранении успеваемости. Некоторые вузы автоматически рассматривают каждого поступившего, другие просят отметить опцию или написать короткий абзац в портале. Внимательно прочитайте стипендиальную страницу каждого вуза, прежде чем ограничиться обычной заявкой на поступление.</p>
<h3>Частичные и полные освобождения от оплаты</h3>
<p>Многие университеты предлагают скидки на обучение — от умеренного процента до полного освобождения. Частичные встречаются гораздо чаще полных, и вузы нередко используют их, чтобы «закрыть разрыв» для перспективного кандидата, которому чуть-чуть не хватает. Важно другое: эти награды остаются на усмотрение университета, а значит, иногда их можно обсудить — сильный абитуриент, вежливо спросивший, порой обнаруживает, что приёмная комиссия располагает большей гибкостью, чем показывает сайт.</p>
<h3>Стипендии за успеваемость</h3>
<p>После приезда в Китай открывается новая категория: ежегодные стипендии, присуждаемые по оценкам и поведению иностранного студента в кампусе. Многие вузы закладывают на них отдельный бюджет, поэтому оплаченный самостоятельно первый год нередко превращается в финансируемый уже со второго. Детали публикуются на страницах для иностранных студентов в официальных доменах вузов .edu.cn.</p>
<h2>Стипендии провинций и муниципалитетов</h2>
<p>На региональном уровне многие провинции — например, Пекин, Шанхай, Цзянсу, Чжэцзян, Гуандун, Фуцзянь, Юньнань и другие — ведут собственные стипендиальные программы, чтобы привлекать иностранных студентов в свой регион; крупные города иногда добавляют муниципальные схемы поверх провинциальных. Логика прозрачна: провинция, оплачивающая учёбу, ждёт, что вы будете учиться в одном из её университетов, поэтому такие награды зарезервированы для студентов её вузов.</p>
<p>На практике эти программы администрируются через сами университеты: вы подаёте документы или номинируетесь учреждением, куда поступили или где учитесь, а файлы передаются в провинциальные органы образования для окончательного утверждения. Покрытие сильно различается: одни схемы ориентированы на оплату обучения, другие добавляют общежитие или ежемесячное прожиточное пособие. Из-за меньшей международной известности конкуренция здесь обычно заметно ниже, чем на центральной государственной программе. Задайте каждому вузу из вашего списка прямой вопрос: действуют ли для его иностранных студентов провинциальные или муниципальные схемы?</p>
<h2>Стипендия для преподавателей китайского языка (бывшая стипендия Конфуция)</h2>
<p>Известная прежде как стипендия Институтов Конфуция, сегодня это International Chinese Language Teachers Scholarship — программа, финансирующая именно изучение китайского языка. Типичные треки: семестровые и годовые языковые программы, бакалавриат по преподаванию китайского как иностранного (BTCSOL) и магистратура того же профиля (MTCSOL). Для тех, чей путь начинается с интенсивного языка перед поступлением на степень, это один из самых доступных финансируемых маршрутов в Китай.</p>
<p>Для зачисления обычно нужен действующий сертификат HSK — конкретный уровень зависит от программы и вуза, а актуальные требования ежегодно публикуются на официальных порталах, поэтому сверяйтесь с ними до регистрации на экзамены. Даты тестов, запись и материалы для подготовки — на официальном <a href="https://www.chinesetest.cn" target="_blank" rel="noopener noreferrer">сайте chinesetest.cn</a>. Заявки, как правило, подаются через Институты Конфуция в вашей стране, посольства и консульства КНР или напрямую через принимающие университеты. Если конечная цель — степень на китайском, эта стипендия может стать финансируемым мостом к ней: сильные языковые результаты резко расширяют академический выбор впоследствии.</p>
<h2>Silk Road и корпоративные программы</h2>
<h3>Стипендии Шёлкового пути</h3>
<p>Стипендия Silk Road — не отдельная система, а поток внутри стипендии правительства Китая, связанный с приоритетами инициативы «Пояс и путь». Квоты распределяются через участвующие университеты: вы поступаете в вуз, и он номинирует подходящих кандидатов именно в этот поток. Условия часто отражают приоритеты программы, включая гражданство и специальность. Официальный портал CSC <a href="https://www.campuschina.org" target="_blank" rel="noopener noreferrer">campuschina.org</a> ежегодно публикует списки участвующих вузов и детали программ — это первый источник, который стоит проверить перед подачей.</p>
<h3>Корпоративные и институциональные программы</h3>
<p>Меньшая, но реальная категория: китайские компании, отраслевые ассоциации и фонды иногда финансируют стипендии по соглашениям с конкретными вузами — как правило, по инженерным, международным торговым или логистическим направлениям, иногда с практической стажировкой у компании-спонсора. Эти программы часто меняются и редко рекламируются за рубежом, поэтому надёжный способ их найти — прямой вопрос международному отделу целевого университета о партнёрствах именно по вашей специальности.</p>
<h2>Что обычно покрывают такие стипендии</h2>
<p>На всех уровнях награды складываются в три узнаваемых уровня щедрости — и понимание того, к какому из них относится ваше предложение, помогает честно сравнивать варианты:</p>
<ul>
<li><strong>Только обучение:</strong> от частичной скидки до полного освобождения — самый распространённый уровень на университетском уровне.</li>
<li><strong>Обучение и общежитие:</strong> плюс место в общежитии или денежная жилищная компенсация; частый формат в провинциальных схемах.</li>
<li><strong>Полное финансирование со стипендией:</strong> обучение, общежитие, ежемесячное пособие и медицинская страховка — уровень, ассоциирующийся прежде всего с CSC; университеты и провинции предлагают его лишь выборочно.</li>
</ul>
<p>Модели отбора тоже предсказуемы: стипендии при поступлении оценивают ваш файл до зачисления, стипендии за успеваемость — уже после приезда; многие программы требуют подтверждения языка (HSK для программ на китайском, IELTS или TOEFL для <a href="/ru/blog/english-taught-degrees-china-guide">программ на английском</a>); часть провинциальных и корпоративных схем ограничивает участие регионом или специальностью.</p>
<h2>Как подавать заявку — и можно ли совмещать награды</h2>
<h3>Сроки и маршрут</h3>
<p>Большинство университетских и провинциальных стипендий идёт параллельно приёмной кампании: при сентябрьском наборе окна заявок обычно открываются с декабря до весны — в том же портале и анкете, что и поступление, либо в соседнем разделе. Меньшая часть наград — особенно стипендии за успеваемость — открывается только после фактического зачисления. Документы — те, что вы уже собрали для поступления: транскрипты, языковые сертификаты и план обучения, так что один сильный файл работает сразу на несколько заявок. Как собрать его шаг за шагом, описано в нашем <a href="/ru/blog/study-in-china-guide">полном руководстве об учёбе в Китае</a>.</p>
<h3>Можно ли совмещать стипендии?</h3>
<p>Это самый частый вопрос, и единственный честный ответ — правила различаются между учреждениями. Общая закономерность: одновременно удерживать две государственные стипендии национального уровня, как правило, нельзя, и многие вузы не разрешают совмещать собственную награду с полной внешней. Но некоторые учреждения сознательно комбинируют финансирование: университетское освобождение от оплаты поверх провинциальной схемы или ежемесячное пособие поверх частичной стипендии. Ничего не принимайте на веру — условия совмещения уточняйте в международном отделе каждого вуза, прежде чем строить на них любое финансовое решение.</p>
<h2>Нет предложения? Пять работающих стратегий</h2>
<ol>
<li><strong>Поступить и показывать результат.</strong> Многие вузы переводят отличников первого курса в стипендиаты со второго года — считайте первый год продлённой заявкой перед отборочной комиссией.</li>
<li><strong>Спросить напрямую.</strong> Часть скидок для первокурсников применяется автоматически, часть существует только по запросу. Короткое вежливое письмо в приёмную комиссию ничего не стоит.</li>
<li><strong>Расширить список вузов.</strong> Менее известные университеты в небольших городах нередко ведут щедрые программы с более низкой конкуренцией — а более дешёвая жизнь дополняет картину.</li>
<li><strong>Использовать язык как мост.</strong> Финансируемый языковой год по стипендии для преподавателей китайского может предшествовать поступлению на степень с куда более сильным профилем.</li>
<li><strong>Подать снова в следующем цикле.</strong> Файлы, не прошедшие один сезон, часто проходят следующий — с лучшими языковыми результатами и более чётким планом обучения.</li>
</ol>
<h2>Многослойный финансовый план</h2>
<p>Студенты, успешно финансирующие учёбу в Китае, — редко обладатели одной громкой награды; как правило, это те, кто скомбинировал варианты: университетское освобождение при поступлении, провинциальная схема после зачисления, стипендия за успеваемость со второго года. Нанесите на карту все уровни для каждого вуза из списка до того, как выберете стратегию, и уточняйте актуальные правила напрямую у учреждений — стипендиальная политика меняется год от года. Если нужна помощь в сравнении университетов и их программ финансирования, посмотрите наши <a href="/ru/universities">профили университетов</a>, изучите <a href="/ru/services">услуги по поступлению и стипендиям</a> или запишитесь на <a href="/ru/contact">бесплатную консультацию</a> — мы сопровождаем студентов именно на этом пути в каждый приём.</p>
<p><em>Последняя проверка: ноябрь 2026. Стипендиальные программы и правила меняются ежегодно — всегда сверяйте детали с университетом или официальным порталом.</em></p>$$,
  'scene:beijing', 'tips', 'published', '2026-11-12T10:00:00+00', '2026-11-12T10:00:00+00'
)
on conflict (slug) do nothing;


-- banking-payments-china-students-guide.sql
--
-- Editorial batch 2 — one trilingual (AR/EN/RU) article for the existing
-- `articles` table: banking and payments in China for international
-- students. No schema changes, no parallel content system: after this
-- migration the post behaves exactly like a CMS-published article
-- (editable in /admin/articles, listed on /{locale}/blog, included in
-- sitemap.xml alternates automatically).
--
-- Content rules followed:
--   • Original writing in each language (not machine translation).
--   • Bank options presented as categories, not endorsements.
--   • Foreign-exchange content framed as awareness, never legal advice —
--     readers are directed to their bank and university finance office.
--   • Only official sources linked (safe.gov.cn, customs.gov.cn).
--   • No fabricated statistics, testimonials or fee claims; costs framed
--     as indicative ranges with "check with your bank/university" guidance.
--   • Localized internal links into the site's conversion paths
--     (services, contact, universities) and cross-links to existing
--     articles (study-in-china-guide, study-in-china-costs-guide,
--     student-life-in-china).
--   • Cover image uses the site's built-in brand scene (scene:shanghai)
--     so no storage upload is required.
--
-- Idempotent: on conflict (slug) do nothing — safe to re-run.
-- Apply with: supabase db push (or paste into the SQL editor).

-- ===========================================================================
-- 1 · Banking and payments in China for international students (student_life)
-- ===========================================================================
insert into public.articles (
  slug, title_ar, title_en, title_ru,
  excerpt_ar, excerpt_en, excerpt_ru,
  content_ar, content_en, content_ru,
  cover_image, category, status, created_at, updated_at
)
values (
  'banking-payments-china-students-guide',
  $$البنوك والمدفوعات في الصين للطلاب الدوليين: الدليل العملي$$,
  $$Banking and Payments in China for International Students: The Practical Guide$$,
  $$Банки и платежи в Китае для иностранных студентов: практическое руководство$$,
  $$دليل عملي للطلاب الدوليين في الصين: فتح حساب بنكي بعد الوصول، وربط WeChat Pay وAlipay ببطاقتك، ودفع الرسوم الدراسية، والتعامل الواعي مع النقد والبطاقات والاحتيال.$$,
  $$How to open a bank account after arrival, set up WeChat Pay and Alipay, pay tuition from abroad, and keep your money safe as an international student in China — a practical guide.$$,
  $$Как открыть счёт в китайском банке после приезда, подключить WeChat Pay и Alipay, оплатить учёбу и организовать наличные, карты и финансовую безопасность студенту в Китае.$$,
  $$<p>المال من أولى الأمور العملية التي ستحتاج إلى ترتيبها بعد وصولك إلى الصين. خلال أيام قليلة ستواجه رموز الدفع في مطعم الجامعة، وفاتورة رسوم باليوان، وبطاقة هاتف تطلب وسيلة دفع محلية — وقليل من ذلك يسير بسلاسة على بطاقة أجنبية وحدها. الخبر الجيد أن ترتيب أمورك المالية كطالب دولي مسلك واضح سلكه آلاف الطلاب قبلك كل فصل دراسي. يستعرض هذا الدليل التسلسل كاملاً: فتح حساب بنكي بعد الوصول، وتفعيل الدفع عبر WeChat Pay وAlipay، وتحويل أموال الرسوم الدراسية، وفهم حدود النقد والبطاقات الدولية، ثم كيف تبعد نفسك عن الاحتيال الذي يستهدف الوافدين الجدد. وإن كنت في مرحلة أبكر من الرحلة، فإن <a href="/ar/blog/study-in-china-guide">دليلنا الشامل للدراسة في الصين</a> يغطي كل شيء من اختيار البرنامج حتى التأشيرة، وفريق جسر الصين التعليمية يرافق الطلاب في كل مرحلة من هذه المراحل.</p>
<h2>لماذا تحتاج إلى حساب بنكي صيني؟</h2>
<p>قد تظن أن بطاقة دولية وبعض النقد سيكفيانك الفصل كله، لكن الحياة اليومية في الصين مبنية حول الحسابات المحلية ومحافظ الهاتف، والحساب الصيني هو الحجر الأساس الذي يقوم عليه كل شيء:</p>
<ul>
<li>محافظ الدفع مثل WeChat Pay وAlipay ترتبط بأفضل صورة ببطاقة صينية، من دون مفاجآت في الرسوم عند كل عملية.</li>
<li>الجامعات تحصّل الرسوم وأجور السكن باليوان، وكثير من هذه الفوترة صار يتم عبر أنظمة محلية إلكترونية.</li>
<li>المبالغ المستردة والمكافآت وأي دخل مرخّص يُودَع عادة في حساب باسمك أنت في بنك صيني.</li>
<li>السحب من أجهزة صراف بنكك نفسه يجنّبك رسوم البطاقات الدولية التي تتراكم مع كل عملية سحب.</li>
</ul>
<p>هذا لا يعني إغلاق حساباتك في بلدك — ستبقى بحاجة إليها لتحويلات الأهل وللطوارئ — بل أن الحساب الصيني هو قاعدتك للتشغيل اليومي داخل البلد.</p>
<h2>فتح حساب بنكي بعد الوصول</h2>
<p>يفتح معظم الطلاب حسابهم في الأسبوع الأول أو الثاني بعد الوصول، ويُستحسن بمساعدة مكتب الطلبة الدوليين في الجامعة الذي يعرف عادة أقرب فرع يتعامل مع حسابات الطلاب بسلاسة. الوثائق المطلوبة عادةً:</p>
<ul>
<li>جواز سفر ساري المفعول مع تأشيرة طالب سارية (X1 أو X2).</li>
<li>خطاب القبول ونموذج JW202 (أو JW201 لطلاب المنح الحكومية).</li>
<li>استمارة تسجيل الإقامة المؤقتة من مركز الشرطة المحلي — ستحتاج إلى تسجيل عنوانك في أيامك الأولى على أي حال، فاحتفظ بالورقة جيداً.</li>
<li>رقم هاتف صيني مسجّل باسمك أنت، لأنه غالباً شرط لتفعيل الخدمات المصرفية الإلكترونية.</li>
<li>مبلغ إيداع افتتاحي صغير يختلف من بنك لآخر.</li>
</ul>
<p>في الفرع ستعبّئ الاستمارات وتختار رمزاً سرياً وتخرج في الغالب ببطاقة صراف من نوع UnionPay في الزيارة نفسها. تفصيلة تبدو صغيرة لكنها مهمة: تأكد أن الاسم المطبوع على البطاقة مطابق حرفياً لتهجئة اسمك في جواز السفر، فأي اختلاف بسيط قد يعطّل ربط البطاقة بمحفظة الدفع لاحقاً. وإذا كانت صينيتك ما زالت في بداياتها فاصطحب صديقاً أو اطلب من مكتب الطلبة الدوليين الاتصال مسبقاً — فروع الجامعات تفتح حسابات الطلاب كل أسبوع وتعرف الإجراء بحذافيره.</p>
<h2>اختيار البنك: فئات لا توصيات</h2>
<p>نمتنع عمداً عن التوصية ببنك بعينه، لأن الخيار الصحيح يتوقف على مدينتك وجامعتك وعاداتك. الأجدى أن تفهم الفئات التي يختار الطلاب من بينها:</p>
<ul>
<li><strong>البنوك الحكومية الكبرى:</strong> أوسع شبكات فروع وأجهزة صراف على مستوى البلد، وخبرة طويلة مع العملاء الأجانب، وخدمات تحويل دولي راسخة.</li>
<li><strong>البنوك التجارية المساهمة الوطنية:</strong> تطبيقات هاتف حديثة وتجربة رقمية مريحة يجدها كثير من الطلاب أسهل في الاستخدام اليومي.</li>
<li><strong>الفروع القريبة من الحرم الجامعي والبنوك المتعاونة مع الجامعة:</strong> موظفون يرون وثائق الطلاب يومياً ويعرفون بالضبط الاستمارات التي تحتاجها حالتك، وهذه وحدها توفر ساعات.</li>
</ul>
<p>أبسط استراتيجية أن تسأل مكتب الطلبة الدوليين عن الفرع الذي يحيل إليه الطلاب عادة وتبدأ منه. وأياً كان اختيارك، احفظ من اليوم الأول تطبيق البنك ورقم خدمة العملاء وتفاصيل حسابك في مكان آمن.</p>
<h2>الدفع عبر الهاتف: تفعيل WeChat Pay وAlipay</h2>
<p>الصين اقتصاد يبدأ من الهاتف: من عربات الطعام الليلية إلى طوابير المستشفيات، رمز الاستجابة السريعة هو وسيلة الدفع الافتراضية. وتهيمن محفظتان على المشهد: WeChat Pay المدمجة في أشهر تطبيق محادثة في البلد، وAlipay المنتمية إلى منظومة علي بابا. وبعد فتح حسابك البنكي، يكون الإعداد مسألة دقائق:</p>
<ol>
<li>حمّل التطبيق وسجّل برقم هاتفك الصيني.</li>
<li>أكمل التحقق من الهوية بجواز سفرك — خطوة «الاسم الحقيقي» الإلزامية التي تفتح الدفع.</li>
<li>أضف بطاقة UnionPay الصادرة عن حسابك الصيني الجديد.</li>
<li>عيّن رمز دفع مختلفاً عن رمز البنك، وفعّل قفل الشاشة داخل التطبيق.</li>
</ol>
<h3>المحفظتان في الحياة اليومية</h3>
<p>ستدفع إما بمسح رمز التاجر أو بعرض رمزك ليمسحه هو. هذه الحركة الواحدة تغطي مطاعم الجامعة والدكاكين، وركوب المترو والحافلات، والدراجات المشتركة، وسلاسل البقالة وأكشاك الأسواق، والتسوق الإلكتروني، وفواتير الكهرباء والماء، والإيجار والودائع، وتقاسم الفواتير مع الزملاء. وخلال أسابيع قليلة يصبح رمز الاستجابة محفظتك الفعلية، وتعيش البطاقة خلفه في الظل.</p>
<h3>وماذا عن ربط بطاقة دولية بدلاً من الحساب الصيني؟</h3>
<p>فتحت المحفظتان باباً محدوداً لبعض البطاقات الدولية، وهو أمر مفيد فعلاً في أيامك الأولى قبل وجود حسابك المحلي. لكن توقّع حدوداً على المبالغ وسقوفاً أدنى ورسوماً محتملة. أما لأشهر من الاستخدام اليومي فالحساب البنكي الصيني يبقى الطريق الأكثر سلاسة والأقل كلفة.</p>
<h2>دفع الرسوم الدراسية وتحويل الأموال إلى الصين</h2>
<p>الرسوم الدراسية عادة أكبر دفعة في سنتك الجامعية، فخطط لها مبكراً بدل ضغط اللحظات الأخيرة. وتنقسم الخيارات الشائعة إلى ثلاث فئات:</p>
<ul>
<li><strong>بوابات الدفع الإلكترونية الجامعية:</strong> تتيح كثير من الجامعات صفحة دفع رسمية، غالباً عبر منصة شريكة، تقبل البطاقات الدولية مقابل رسوم خدمة إضافية في العادة. احتفظ بالإيصال جيداً.</li>
<li><strong>التحويل البنكي الدولي:</strong> تأتي تفاصيل الحساب البنكي للجامعة عادة مع وثائق قبولك أو تسجيلك. ضع رقمك الجامعي أو رقم طلبك في خانة الغرض حتى يطابق مكتب الشؤون المالية المبلغ باسمك بسهولة، واحسب عدة أيام عمل لتنفيذ التحويل، وقارن رسوم التحويل لدى بنكك قبل الإرسال.</li>
<li><strong>السداد محلياً باليوان:</strong> بعد فتح حسابك الصيني تسمح معظم الجامعات بتسديد الفاتورة في مكتب الشؤون المالية بتحويل محلي أو بطاقة، وهو غالباً الطريق الأوفر للفصول اللاحقة.</li>
</ul>
<h3>قواعد النقد الأجنبي: وعي لا استشارة قانونية</h3>
<p>بلدك والصين معاً ينظّمان تحويل العملات عبر الحدود، وتتبدل الضوابط المتعلقة بالمبالغ والغرض والوثائق من فترة لأخرى. تعامل مع هذه الفقرة كتوجيه عام لا كنصيحة قانونية: أكّد الإجراء الصحيح لحالتك مع بنكك ومع مكتب الشؤون المالية في جامعتك، واحتفظ بكل إيصالات التحويل، ولا تنقل الأموال إلا عبر القنوات الرسمية. «محوّلو العملات» غير الرسميين في مجموعات الدردشة سيناريو احتيال كلاسيكي قد يضيف إلى خسارتك المالية مشكلات قانونية. وتنشر إدارة الدولة للنقد الأجنبي القواعد المحدّثة عبر <a href="https://www.safe.gov.cn" target="_blank" rel="noopener noreferrer">موقعها الرسمي</a>. ولكي تتكوّن لديك صورة عن كلفة سنة كاملة في الصين اطّلع على <a href="/ar/blog/study-in-china-costs-guide">دليلنا لتكاليف الدراسة في الصين</a>.</p>
<h2>النقد والبطاقات الدولية: ما الواقع؟</h2>
<p>من الأسواق الليلية إلى المجمعات الكبرى، الهاتف هو وسيلة الدفع المعتادة، والنقد احتياط لا أداة أساسية. ومع ذلك يبقى للاثنين مكان في ترتيب متوازن:</p>
<ul>
<li><strong>النقد:</strong> يظل مفيداً للبائع المتنقل الذي لا يقبل سوى الأوراق، وللودائع الصغيرة، وللمعابد وللرحلات إلى الأرياف. اسحب من أجهزة صراف بنكك نفسه لتجنّب الرسوم، واحتفظ بمبلغ معقول لا بكومة كبيرة.</li>
<li><strong>البطاقات الدولية:</strong> تحسّن قبولها في الفنادق والسلاسل الكبرى وبعض أجهزة الصراف، لكنه يبقى محدوداً عند التجار الصغار، وتراكم رسوم تحويل العملة ورسوم السحب. اجعلها احتياطاً للطوارئ لا أداة يومية.</li>
<li><strong>إدخال النقد إلى الصين:</strong> تسري إجراءات تصريح جمركي عند تجاوز مبالغ محددة، فراجع <a href="https://www.customs.gov.cn" target="_blank" rel="noopener noreferrer">التوجيهات الرسمية للجمارك الصينية</a> قبل سفرك بدل الاعتماد على الشائعات.</li>
</ul>
<h2>السلامة والاحتيال: ما يجب أن تعرفه</h2>
<p>الطلاب الجدد هدف مغرٍ للمحتالين تحديداً لأن الإجراءات ما زالت غير مألوفة لديهم والمتصل المتقن يبدو مقنعاً. والأنماط تتكرر كل عام:</p>
<ul>
<li><strong>مكالمة «الشرطة المزيفة»:</strong> متصل يزعم انخراطك في قضية ويطلب تحويل أموالك إلى «حساب آمن». الشرطة الحقيقية لا تطلب تحويل الأموال هاتفياً أبداً، مطلقاً.</li>
<li><strong>دعم العملاء المزيف:</strong> رسالة عن «مشكلة في طلبك» تقود إلى صفحة تقتنص بيانات بطاقتك. لا تُدخل معلومات الدفع إلا داخل التطبيقات الرسمية.</li>
<li><strong>رموز الاستجابة المزيفة:</strong> تأمل الرمز قبل مسحه، وارتَب بالملصقات المغشوشة فوق الرمز الأصلي على طاولة المتجر.</li>
<li><strong>تحويل العملات غير الرسمي:</strong> سعر مغرٍ يُعرض في مجموعة دردشة هو الطُعم الكلاسيكي، والمال يختفي ببساطة.</li>
<li><strong>التحويل «الخاطئ»:</strong> غريب يحوّل لك مبلغاً «بالخطأ» ثم يطلب إعادته إلى حساب آخر — فقد تجعل منك وسيلاً لتمرير أموال غير نظيفة من حيث تدري أو لا تدري.</li>
</ul>
<p>قواعد ذهبية قليلة تغطي معظم الحالات: لا تشارك أحداً رموز التحقق التي تصلك برسالة نصية، فالبنوك والشرطة لا تطلبها أبداً؛ إذا ضغطت عليك مكالمة أنهِها وتحقق عبر رقم رسمي؛ خط مكافحة الاحتيال في الصين هو 96110 ورقم الطوارئ العام 110؛ وعند أي شك ادخل إلى مكتب الطلبة الدوليين في جامعتك — فمعظم الجامعات توزّع تنبيهات الاحتيال كل فصل.</p>
<h2>نصائح للميزانية والمعيشة</h2>
<ul>
<li>خطط باليوان من اليوم الأول، واستند إلى النطاقات الاسترشادية في دليل التكاليف.</li>
<li>استخدم تقارير الإنفاق الشهرية المدمجة في المحفظتين — خمس دقائق من المراجعة آخر كل شهر تغيّر العادات بسرعة.</li>
<li>كُل في مطعم الجامعة قدر الإمكان: تطبيقات التوصيل مريحة وتضاعف ميزانية الطعام من حيث لا تشعر.</li>
<li>احتفظ باحتياطي للشهر الأول الذي تصلك فيه الأغطية وأدوات المطبخ والودائع والمشتريات الصغيرة دفعة واحدة.</li>
<li>جدول تحويلات الرسوم قبل المواعيد بوقت كافٍ حتى لا تختر بين رسوم الاستعجال ومتاعب التأخير.</li>
<li>اسأل عن خصومات الطلبة — فبطاقات النقل والمتاحف وحجوزات القطار كثيراً ما تتوفر لها.</li>
</ul>
<p>وللصورة الأشمل عن ما بعد الوصول — شرائح الهاتف والتنقل والسكن — اقرأ دليلنا عن <a href="/ar/blog/student-life-in-china">حياة الطلبة في الصين</a>.</p>
<h2>من خطاب القبول إلى الحياة اليومية</h2>
<p>حساب بنكي في أسابيعك الأولى، ومحفظتا دفع بعده مباشرة، وخطة واضحة للرسوم الدراسية، وعادات يقظة أمام الاحتيال: هذه الخطوات الأربع هي ما يحوّل الصين من أحجية إدارية إلى مكان تعيش فيه فحسب. وخلال فصل واحد سيصبح دفع ثمن وجبة برمز استجابة أمراً عادياً كضرب بطاقتك في بلدك، وأكثر عادية من انتظار الباقي.</p>
<p>وفريق جسر الصين التعليمية يرافق طلابه إلى ما هو أبعد من خطاب القبول. إن أردت عوناً في تجهيز تسجيلك ومدفوعاتك ووصولك، <a href="/ar/contact">احجز استشارة مجانية</a>، أو تصفّح <a href="/ar/services">خدماتنا</a>، أو استكشف <a href="/ar/universities">جامعاتنا الشريكة</a> لبناء قائمتك المستهدفة.</p>
<p><em>آخر مراجعة: نوفمبر 2026. متطلبات البنوك وقواعد المدفوعات تتغير — أكّد دائماً التفاصيل الحالية لدى بنكك ومكتب الشؤون المالية بجامعتك والمصادر الرسمية.</em></p>$$,
  $$<p>Money is one of the first practical things you will sort out after landing in China. Within days of arrival you will meet QR codes at the campus canteen, a tuition invoice quoted in yuan, and a mobile plan that insists on a local payment method — and very little of that runs smoothly on a foreign card alone. The good news is that setting up your finances as an international student is a well-trodden path. This guide walks through the whole sequence: opening a bank account after arrival, activating WeChat Pay and Alipay, moving money to China for tuition, what cash and international cards can really do, and staying clear of the scams that target newcomers. If you are still earlier in the journey, our <a href="/en/blog/study-in-china-guide">complete guide to studying in China</a> covers everything from choosing a program to securing your visa — and at Bridge to China Edu we support students at every one of those stages.</p>
<h2>Why you need a Chinese bank account</h2>
<p>It is tempting to assume that an international card plus some cash will carry you through the semester. In reality, daily life in China is organized around local accounts and mobile wallets, and the bank account is the anchor that holds it all together:</p>
<ul>
<li>Mobile wallets such as WeChat Pay and Alipay link most reliably to a Chinese card, with no per-transaction surprises.</li>
<li>Universities collect tuition and dormitory fees in yuan, and much of that billing now runs through local online systems.</li>
<li>Refunds, stipends and any authorized income are normally deposited into an account held in your own name at a Chinese bank.</li>
<li>Withdrawing cash from your own bank's ATMs avoids international-card fees that quietly accumulate with every withdrawal.</li>
</ul>
<p>None of this means closing your accounts at home — keep those for family transfers and emergencies, and treat the Chinese account as your operating base inside the country.</p>
<h2>Opening a bank account after arrival</h2>
<p>Most students open their account in the first or second week after arrival, ideally with help from the university's international student office, which knows the nearest branch that handles student accounts smoothly. Documents typically requested:</p>
<ul>
<li>Your passport with a valid student visa (X1 or X2).</li>
<li>Your admission letter and the JW202 form (or JW201 for government scholarship students).</li>
<li>The temporary residence registration form from the local police station — you must register your address in your first days anyway, so keep the slip carefully.</li>
<li>A Chinese mobile number registered in your own name — usually required for online banking.</li>
<li>A small opening deposit; the amount varies from bank to bank.</li>
</ul>
<p>At the branch you will fill in forms, choose a PIN and, in most cases, walk out with a UnionPay debit card the same day. One detail matters more than it sounds: the name printed on the card must match your passport spelling exactly, or the card may not link to a mobile wallet later. If your Chinese is still basic, bring a friend or ask the international office to call ahead — branches near campus open student accounts every week and know the routine.</p>
<h2>Choosing a bank: categories, not endorsements</h2>
<p>We deliberately do not recommend one specific bank, because the right choice depends on your city, your campus and your habits. It helps more to understand the categories students commonly choose from:</p>
<ul>
<li><strong>Large state-owned banks:</strong> the widest networks of branches and ATMs across the country, long experience with foreign customers, and established cross-border transfer services.</li>
<li><strong>National joint-stock commercial banks:</strong> modern, polished apps and a smooth digital experience that many students find easier for everyday use.</li>
<li><strong>Campus-adjacent branches and university partner banks:</strong> staff who see student documents daily and know exactly which forms your situation requires — that alone saves hours.</li>
</ul>
<p>The simplest strategy is to ask the international student office which branch they normally direct students to, and start there. Whatever you choose, keep the bank's app, hotline and account details somewhere safe from day one.</p>
<h2>Mobile payments: setting up WeChat Pay and Alipay</h2>
<p>China is a mobile-first economy: from night-market stalls to hospital queues, the QR code is the default way to pay. Two wallets dominate: WeChat Pay, built into the country's main messaging app, and Alipay, part of the Alibaba ecosystem. With your account in hand, setup takes minutes:</p>
<ol>
<li>Download the app and register with your Chinese phone number.</li>
<li>Complete identity verification with your passport — the mandatory "real-name" step that unlocks payments.</li>
<li>Add the UnionPay card from your new Chinese account.</li>
<li>Set a payment PIN that is different from your bank PIN, and enable the in-app screen lock.</li>
</ol>
<h3>Using the wallets in daily life</h3>
<p>You will either scan the merchant's QR code or show your own to be scanned. That single gesture covers canteens and corner shops, metro and bus rides, shared bikes, supermarkets and market stalls, online shopping, utility bills, rent and deposits, and splitting the bill with classmates. Within a few weeks the QR code quietly becomes your real wallet.</p>
<h3>What about linking an international card instead?</h3>
<p>Both wallets now accept certain international cards, which is genuinely useful in your first days, before your local account exists — but expect transaction limits, lower caps and possible fees. For months of daily life, a Chinese bank account remains the smoother and cheaper path.</p>
<h2>Paying tuition and transferring money to China</h2>
<p>Tuition is usually the largest single payment of your student year, so plan it early rather than in the deadline rush. Options generally fall into three categories:</p>
<ul>
<li><strong>University online payment portals:</strong> many universities offer an official payment page, often through a partner platform, that accepts international cards — usually with an added service fee. The receipt it generates is worth saving.</li>
<li><strong>International bank transfer:</strong> your admission or enrollment documents normally include the university's bank details. Put your student or application number in the payment reference so the finance office can match the money to your name, allow several business days for processing, and compare your home bank's fees before sending.</li>
<li><strong>Paying locally in yuan:</strong> once your Chinese account is open, most universities let you settle the bill at the finance office by local transfer or card — often the cheapest route for later semesters.</li>
</ul>
<h3>Foreign exchange rules: awareness, not legal advice</h3>
<p>Both your home country and China regulate cross-border currency transfers, and the requirements around amounts, purpose and documentation change over time. Treat this section as orientation, not legal advice: confirm the correct procedure for your situation with your bank and your university's finance office, keep every transfer receipt, and move money only through official channels. Informal "money changers" in social media groups are a classic fraud scenario that can add legal problems to the financial loss. Current rules are published by the State Administration of Foreign Exchange (<a href="https://www.safe.gov.cn" target="_blank" rel="noopener noreferrer">safe.gov.cn</a>). For a realistic picture of what a full year in China costs, see our <a href="/en/blog/study-in-china-costs-guide">guide to study costs in China</a>.</p>
<h2>Cash and international cards: the reality</h2>
<p>From night markets to shopping malls, the phone is the default way to pay, and cash is a backup rather than the main tool. That said, a balanced setup still has room for both:</p>
<ul>
<li><strong>Cash:</strong> still handy for the stall that only takes notes, small deposits, temples and trips to smaller towns. Withdraw from your own bank's ATMs to avoid fees, and keep a modest amount, not a stash.</li>
<li><strong>International cards:</strong> acceptance has improved at hotels, major chains and some ATMs, but it remains limited at small merchants, and currency conversion plus withdrawal fees add up. Treat them as an emergency backup, not your daily instrument.</li>
<li><strong>Bringing cash into China:</strong> customs declaration rules apply once amounts pass set thresholds — check the <a href="https://www.customs.gov.cn" target="_blank" rel="noopener noreferrer">official guidance of China Customs</a> before you fly rather than relying on hearsay.</li>
</ul>
<h2>Safety and scam awareness</h2>
<p>Newly arrived students are attractive targets precisely because procedures are still unfamiliar and a convincing caller sounds plausible. The patterns repeat every year:</p>
<ul>
<li><strong>The fake police call:</strong> someone claims you are implicated in a case and must move your money to a "safe account". Real police never demand transfers by phone, ever.</li>
<li><strong>Fake customer service and refund scams:</strong> a message about a "problem with your order" links to a page that harvests your card details. Enter payment information only inside the official apps.</li>
<li><strong>Phishing QR codes:</strong> look at a code before scanning it, and be suspicious of stickers pasted over the genuine one on a shop counter.</li>
<li><strong>Unofficial currency exchange:</strong> an attractive rate offered in a group chat is the classic bait; the money simply disappears.</li>
<li><strong>The accidental transfer:</strong> a stranger "mistakenly" sends you money and asks you to return it to a different account — you may be moving someone else's dirty money unknowingly.</li>
</ul>
<p>A few golden rules cover most of it: never share the SMS verification codes — banks and police never ask for them; when a call pressures you, hang up and verify through an official number; China's anti-fraud hotline is 96110 and the emergency number is 110; and when in doubt, walk into your university's international office, which circulates scam alerts every semester.</p>
<h2>Budgeting tips for student life</h2>
<ul>
<li>Plan in yuan from day one, and anchor your estimates in the indicative ranges of our costs guide.</li>
<li>Use the built-in monthly spending reports of both wallets — a five-minute review at the end of each month changes habits fast.</li>
<li>Eat at the canteen when you can: delivery apps are convenient and quietly double food budgets.</li>
<li>Keep a buffer for the first month, when bedding, kitchen basics, deposits and small purchases arrive all at once.</li>
<li>Schedule tuition transfers well before deadlines so you are never choosing between rush fees and late-payment trouble.</li>
<li>Ask about student discounts — transport cards, museums and rail bookings often have them.</li>
</ul>
<p>For the wider picture of settling in — SIM cards, getting around, accommodation — read our <a href="/en/blog/student-life-in-china">guide to student life in China</a>.</p>
<h2>From admission letter to daily life</h2>
<p>A bank account in your first weeks, mobile wallets right after it, a clear plan for tuition, and alert habits against scams: these four steps turn China from an administrative puzzle into a place you simply live. Within one semester, paying for dumplings by QR code will feel as ordinary as tapping a card at home.</p>
<p>The Bridge to China Edu team supports students well beyond the admission letter. If you would like help preparing your enrollment, payments and arrival, <a href="/en/contact">book a free consultation</a>, browse our <a href="/en/services">services</a>, or explore our <a href="/en/universities">partner universities</a> to build your target list.</p>
<p><em>Last reviewed: November 2026. Banking requirements and payment rules change — always confirm current details with your bank, your university's finance office and official sources such as the State Administration of Foreign Exchange (<a href="https://www.safe.gov.cn" target="_blank" rel="noopener noreferrer">safe.gov.cn</a>) and China Customs (<a href="https://www.customs.gov.cn" target="_blank" rel="noopener noreferrer">customs.gov.cn</a>).</em></p>$$,
  $$<p>Деньги — один из первых практических вопросов, которые приходится решать после прилёта в Китай. Уже через несколько дней вы столкнётесь с QR-кодами в студенческой столовой, счётом за обучение в юанях и мобильным тарифом, которому нужен местный способ оплаты, — и почти ничего из этого не работает гладко на одной иностранной карте. Хорошая новость: настройка финансов для иностранного студента — вполне протоптанная тропа, которую каждую сессию проходят тысячи студентов. Это руководство проведёт вас по всей последовательности: открытие счёта после приезда, подключение WeChat Pay и Alipay, перевод денег на учёбу, понимание того, на что реально годятся наличные и международные карты, и защита от мошенничества, нацеленного на новичков. Если вы пока на более раннем этапе пути, начните с нашего <a href="/ru/blog/study-in-china-guide">полного руководства по учёбе в Китае</a> — команда Bridge to China Edu сопровождает студентов на каждом из этих шагов.</p>
<h2>Зачем нужен китайский банковский счёт</h2>
<p>Может казаться, что международной карты и пачки наличных хватит на весь семестр. В реальности повседневная жизнь в Китае устроена вокруг местных счетов и мобильных кошельков, и китайский счёт — фундамент, на котором всё держится:</p>
<ul>
<li>Кошельки WeChat Pay и Alipay надёжнее всего привязываются к китайской карте — без сюрпризов с комиссиями в каждой операции.</li>
<li>Университеты принимают оплату обучения и общежития в юанях, и заметная часть счетов выставляется через локальные онлайн-системы.</li>
<li>Возвраты, стипендии и любой разрешённый доход обычно приходят на счёт, открытый на ваше имя в китайском банке.</li>
<li>Снятие наличных в банкоматах своего банка избавляет от комиссий международной карты, которые незаметно накапливаются с каждым снятием.</li>
</ul>
<p>Это не значит, что нужно закрывать счета дома — они останутся для переводов от семьи и экстренных случаев. Просто китайский счёт становится вашей операционной базой внутри страны.</p>
<h2>Открытие счёта после приезда</h2>
<p>Большинство студентов открывает счёт в первую или вторую неделю после прибытия — лучше всего с помощью международного отдела университета, который обычно знает ближайшее отделение, где студенческие счета оформляют без лишней волокиты. Обычно просят:</p>
<ul>
<li>действующий загранпаспорт со студенческой визой (X1 или X2);</li>
<li>письмо о зачислении и форму JW202 (или JW201 для государственных стипендиатов);</li>
<li>справку о регистрации по месту пребывания из местного отделения полиции — она в любом случае нужна в первые дни, так что сохраните её;</li>
<li>китайский номер телефона, оформленный на ваше имя: без него часто не подключить мобильный банк;</li>
<li>небольшой стартовый взнос — сумма зависит от банка.</li>
</ul>
<p>В отделении вы заполните анкеты, придумаете PIN-код и, как правило, выйдете с дебетовой картой UnionPay уже в тот же визит. Одна деталь важнее, чем кажется: проследите, чтобы имя на карте буква в букву совпадало с написанием в паспорте — даже мелкое расхождение потом мешает привязать карту к платёжному кошельку. Если китайский пока на старте, возьмите с собой друга или попросите международный отдел позвонить заранее: отделения у кампусов каждую неделю открывают счета студентам и знают процедуру наизусть.</p>
<h2>Выбор банка: категории, а не реклама</h2>
<p>Мы сознательно не рекламируем конкретный банк: правильный выбор зависит от вашего города, вуза и привычек. Полезнее понимать, из каких категорий выбирают студенты:</p>
<ul>
<li><strong>Крупные государственные банки:</strong> самые широкие сети отделений и банкоматов в стране, многолетний опыт работы с иностранцами и устоявшиеся услуги международных переводов.</li>
<li><strong>Национальные акционерные коммерческие банки:</strong> современные приложения и удобный цифровой опыт, который многим студентам даётся проще в быту.</li>
<li><strong>Отделения рядом с кампусом и банки-партнёры вуза:</strong> сотрудники ежедневно видят студенческие документы и точно знают, какие формы нужны именно вам, — одно это экономит часы.</li>
</ul>
<p>Простейшая стратегия — спросить в международном отделе, куда обычно направляют студентов, и начать оттуда. Какой бы банк вы ни выбрали, с первого дня сохраните в надёжном месте его приложение, горячую линию и реквизиты счёта.</p>
<h2>Мобильные платежи: подключаем WeChat Pay и Alipay</h2>
<p>Китай — экономика, начинающаяся со смартфона: от ночных рынков до очередей в поликлинике QR-код является способом оплаты по умолчанию. Доминируют два кошелька: WeChat Pay, встроенный в главный мессенджер страны, и Alipay из экосистемы Alibaba. С готовым банковским счётом настройка занимает минуты:</p>
<ol>
<li>Установите приложение и зарегистрируйтесь по китайскому номеру.</li>
<li>Пройдите проверку личности по загранпаспорту — обязательный шаг «реального имени», открывающий платежи.</li>
<li>Привяжите карту UnionPay из вашего нового китайского счёта.</li>
<li>Задайте платёжный PIN-код, отличный от банковского, и включите блокировку экрана в приложении.</li>
</ol>
<h3>Кошельки в повседневной жизни</h3>
<p>Вы либо сканируете QR-код продавца, либо показываете свой. Одно это движение покрывает столовые и ларьки, метро и автобусы, аренду велосипедов и самокатов, супермаркеты и рыночные лотки, интернет-магазины, счета за электричество и воду, аренду и залоги, разделение общего счёта с одногруппниками. Через пару недель QR-код незаметно становится вашим настоящим кошельком, а банковская карта живёт у него за спиной.</p>
<h3>А если привязать международную карту?</h3>
<p>Оба кошелька частично открылись международным картам, и это действительно выручает в первые дни, пока локального счёта ещё нет. Но рассчитывайте на лимиты по операциям, пониженные потолки сумм и возможные комиссии. На месяцы повседневных трат китайский счёт остаётся самым простым и дешёвым путём.</p>
<h2>Оплата учёбы и перевод денег в Китай</h2>
<p>Плата за обучение — обычно самый крупный платёж студенческого года, поэтому планируйте его заранее, а не в преддедлайнной спешке. Распространённые варианты делятся на три категории:</p>
<ul>
<li><strong>Университетские онлайн-порталы:</strong> многие вузы предлагают официальную платёжную страницу, часто через платформу-партнёра, принимающую международные карты — как правило, с дополнительной сервисной комиссией. Квитанцию стоит сохранить.</li>
<li><strong>Международный банковский перевод:</strong> реквизиты университета обычно указаны в документах о зачислении. Укажите свой студенческий или аппликационный номер в назначении платежа, чтобы финансовый отдел быстрее сопоставил деньги с вашим именем, заложите несколько рабочих дней и сравните комиссии своего банка до отправки.</li>
<li><strong>Оплата на месте в юанях:</strong> после открытия китайского счёта большинство вузов позволяет оплатить счёт в финансовом отделе локальным переводом или картой — на следующие семестры это часто самый выгодный путь.</li>
</ul>
<h3>Валютное регулирование: ориентир, а не юридическая консультация</h3>
<p>И ваша страна, и Китай регулируют трансграничные переводы валюты, и требования к суммам, цели и документам со временем меняются. Воспринимайте этот раздел как ориентир, а не как юридическую консультацию: процедуру для вашего случая уточняйте в своём банке и в финансовом отделе вуза, сохраняйте все квитанции о переводах и переводите деньги только по официальным каналам. «Частные менялы» из чатов — классическая схема мошенничества, которая помимо потери денег может добавить и проблемы с законом. Действующие правила публикует Государственное управление валютного контроля (<a href="https://www.safe.gov.cn" target="_blank" rel="noopener noreferrer">safe.gov.cn</a>). Чтобы понять, во сколько реально обходится учебный год, загляните в наш <a href="/ru/blog/study-in-china-costs-guide">гид по стоимости учёбы в Китае</a>.</p>
<h2>Наличные и международные карты: как на самом деле</h2>
<p>От ночных рынков до торговых центров смартфон — основной способ оплаты, а наличные скорее резерв, чем рабочий инструмент. При этом в сбалансированной схеме находится место и тому и другому:</p>
<ul>
<li><strong>Наличные:</strong> выручают у редкого лоточника, берущего только бумажные деньги, при небольших залогах, в храмах и в поездках по небольшим городам. Снимайте в банкоматах своего банка, чтобы не платить комиссию, и держите умеренную сумму, а не заначку.</li>
<li><strong>Международные карты:</strong> их приём улучшился в отелях, крупных сетях и части банкоматов, но у мелких продавцов остаётся ограниченным, а конвертация валюты и комиссии за снятие накапливаются. Держите карту как аварийный запас, а не как ежедневный инструмент.</li>
<li><strong>Ввоз наличных в Китай:</strong> при превышении установленных порогов требуются таможенные процедуры — проверьте <a href="https://www.customs.gov.cn" target="_blank" rel="noopener noreferrer">официальные правила китайской таможни</a> до вылета, а не по слухам.</li>
</ul>
<h2>Безопасность и мошенничество: что нужно знать</h2>
<p>Новоприбывшие студенты — лакомая цель именно потому, что процедуры ещё незнакомы, а убедительный голос в трубке звучит правдоподобно. Сценарии повторяются из года в год:</p>
<ul>
<li><strong>Звонок от «полиции»:</strong> вам сообщают, что вы фигурируете в деле, и требуют перевести деньги на «безопасный счёт». Настоящая полиция никогда и ни при каких условиях не делает этого по телефону.</li>
<li><strong>Фальшивая служба поддержки:</strong> сообщение о «проблеме с заказом» ведёт на страницу, собирающую данные вашей карты. Платёжные данные вводятся только внутри официальных приложений.</li>
<li><strong>Поддельные QR-коды:</strong> рассмотрите код перед сканированием и опасайтесь наклеек поверх настоящего кода на кассе.</li>
<li><strong>Неофициальный обмен валюты:</strong> выгодный курс из группового чата — классическая приманка, после которой деньги просто исчезают.</li>
<li><strong>«Случайный» перевод:</strong> незнакомец переводит вам сумму «по ошибке» и просит вернуть её на другой счёт — так вас могут использовать для проведения чужих сомнительных денег, заметите вы это или нет.</li>
</ul>
<p>Несколько золотых правил закрывают большинство сценариев: никому не сообщайте коды подтверждения из СМС — банки и полиция их никогда не спрашивают; если звонок давит, положите трубку и проверьте информацию по официальному номеру; горячая линия по борьбе с мошенничеством в Китае — 96110, общий номер экстренных служб — 110; а при любых сомнениях зайдите в международный отдел вуза — большинство университетов рассылает предупреждения о мошенничестве каждый семестр.</p>
<h2>Бюджет студенческой жизни: практические советы</h2>
<ul>
<li>Планируйте в юанях с первого дня и опирайтесь на ориентировочные диапазоны из гида по расходам.</li>
<li>Используйте встроенные отчёты о тратах в обоих кошельках — пятиминутная ревизия в конце месяца быстро меняет привычки.</li>
<li>Ешьте в столовой, когда возможно: приложения доставки удобны и незаметно удваивают бюджет на еду.</li>
<li>Держите резерв на первый месяц, когда постельное бельё, кухонные мелочи, залоги и покупки обрушиваются разом.</li>
<li>Готовьте переводы на учёбу задолго до дедлайна, чтобы не выбирать между комиссиями за срочность и проблемами просрочки.</li>
<li>Спрашивайте про студенческие скидки — они часто есть на транспортные карты, музеи и железнодорожные билеты.</li>
</ul>
<p>Широкая картина жизни после приезда — сим-карты, транспорт, жильё — собрана в нашем руководстве о <a href="/ru/blog/student-life-in-china">студенческой жизни в Китае</a>.</p>
<h2>От письма о зачислении до повседневной жизни</h2>
<p>Счёт в первые недели, мобильные кошельки сразу за ним, понятный план оплаты учёбы и внимательность к мошенничеству — эти четыре шага за один семестр превращают Китай из административной головоломки в место, где вы просто живёте. Оплата пельменей по QR-коду станет такой же будничной, как оплата картой дома, — и куда более будничной, чем ожидание сдачи.</p>
<p>Команда Bridge to China Edu сопровождает студентов и после письма о зачислении. Если хотите помощь с подготовкой зачисления, платежей и приезда, <a href="/ru/contact">запишитесь на бесплатную консультацию</a>, посмотрите наши <a href="/ru/services">услуги</a> или изучите <a href="/ru/universities">университеты-партнёры</a>, чтобы собрать собственный целевой список.</p>
<p><em>Последняя проверка: ноябрь 2026. Требования банков и правила платежей меняются — всегда сверяйте актуальные детали со своим банком, финансовым отделом вуза и официальными источниками.</em></p>$$,
  'scene:shanghai', 'student_life', 'published', '2026-11-12T10:00:00+00', '2026-11-12T10:00:00+00'
)
on conflict (slug) do nothing;


