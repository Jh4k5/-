# جسر إلى الصين · Bridge to China · Мост в Китай

منصة مكتب استشارات تعليمية متخصص حصرياً في الدراسة بالصين — موقع تعريفي ثلاثي اللغة (عربي / إنجليزي / روسي) مع لوحة تحكم كاملة وقاعدة بيانات.

A trilingual (Arabic / English / Russian) marketing site with a full admin dashboard for an educational consultancy focused exclusively on studying in China.

---

## التقنيات · Stack

| الطبقة | التقنية |
|---|---|
| الواجهة | Next.js 15 (App Router) · React 19 · TypeScript |
| التصميم | Tailwind CSS v4 + نظام تصميم مخصص (ألوان الهوية) |
| الخطوط | Cairo + Tajawal (عربي) · Manrope Variable (لاتيني وسيريلي) — مستضافة محلياً عبر Fontsource |
| قاعدة البيانات | Supabase (PostgreSQL + Row Level Security) |
| التخزين | Supabase Storage (bucket `media`) لرفع الصور من لوحة التحكم |
| المصادقة | Supabase Auth (كلمات المرور مشفّرة bcrypt) + حراسة عبر middleware |
| النشر | Vercel |

## نظام اللغات

- ثلاث لغات كاملة: `ar` (RTL، الافتراضية) · `en` (LTR) · `ru` (LTR).
- التوجيه عبر `/[locale]/…`، ومبدّل لغة ثابت في الهيدر يحفظ الاختيار في كوكي `jisr_locale`.
- `middleware.ts` يوجّه الزائر تلقائياً حسب الكوكي ثم حسب `Accept-Language`، ويمرّر اللغة إلى `<html lang dir>`.
- كل محتوى قابل للترجمة مخزّن بثلاثة أعمدة (`*_ar` / `*_en` / `*_ru`)، وإن غابت الترجمة تُعرض النسخة العربية تلقائياً (`pick()` في `src/i18n/config.ts`).
- نصوص الواجهة الثابتة في `src/i18n/dictionaries/{ar,en,ru}.ts`.

## الصفحات العامة

`/` (تحويل تلقائي) · `/[locale]` الرئيسية · `/about` · `/services` · `/universities` · `/universities/[slug]` · `/admissions` · `/why-china` · `/stories` · `/blog` · `/blog/[slug]` · `/contact`

**الصفحة الرئيسية** تُرسَم من جدول `site_sections`: ترتيب الأقسام وظهورها وعناوينها تُدار من لوحة التحكم. الأقسام: الهيرو السينمائي، شريط الثقة، شريط نماذج القبولات، عرض الجامعات ثلاثي الأبعاد، «استكشف الصين معنا»، الخدمات، لماذا الصين، قصص النجاح، أحدث المقالات، والأسئلة الشائعة — مع زر واتساب عائم في كل الصفحات.

## نظام الحركة (`src/components/motion`)

| المكوّن | الوظيفة |
|---|---|
| `Reveal` / `RevealGroup` | ظهور متدرّج عند التمرير |
| `Tilt3D` | إمالة ثلاثية الأبعاد: بالماوس على الكمبيوتر، وبموضع العنصر أثناء التمرير + إمالة الجهاز على الجوال |
| `Coverflow3D` | كاروسيل ثلاثي الأبعاد بالسحب واللمس (الجامعات) |
| `TextReveal` | ظهور العناوين كلمة كلمة |
| `Lightbox` | عارض ملء الشاشة للصور والفيديو (مع حصر التركيز وملصقات مترجمة) |

رسمات `SceneArt` نفسها متحركة (سحب، نوافذ تتلألأ، تموّج ماء، فوانيس)، وكل الحركات تعمل على جميع الأجهزة وتُقاس بشدة الحركة المختارة من اللوحة، مع احترام `prefers-reduced-motion`.

## نماذج القبولات والجامعات

- **القبولات** (`admissions`): ترفع صورة القبول فقط، ويوضع فوقها تلقائياً مستطيل تمويه على اسم الطالب — قابل للسحب والتحجيم من اللوحة، ويبقى مطبقاً داخل العارض المكبّر.
- **الجامعات** (`universities`): لكل جامعة غلاف (صورة أو فيديو)، معرض متعدد، نبذة ونقاط مميزة بثلاث لغات، ومعلومات دقيقة (الترتيب العالمي، سنة التأسيس، عدد الطلاب، الطلاب الدوليون، لغة الدراسة، نطاق الرسوم). المميّزة منها تظهر في الرئيسية، والباقي في `/universities`.

## لوحة التحكم (عربية الواجهة)

`/admin/login` ثم: لوحة القيادة · الطلبات الواردة · نماذج القبولات · الجامعات · المقالات (محرر نصوص غني) · الخدمات · قصص النجاح · معرض الوجهات · معرض الصور · **أقسام الصفحة** (إظهار/إخفاء + ترتيب + عناوين بثلاث لغات) · **الهوية والحركة** (ألوان العلامة، شدة الحركة، رفع الشعار، شفافية طبقة الهيرو) · إعدادات الموقع.

اللوحة مبنية للجوال أولاً: قائمة جانبية منزلقة صحيحة الاتجاه في RTL وLTR، شريط علوي ثابت، قفل تمرير الخلفية، مساحات لمس لا تقل عن 44px، وحقول إدخال بحجم يمنع تكبير iOS التلقائي.

كل محتوى قابل للترجمة يُحرَّر عبر تبويبات (عربي / English / Русский)، ويمكن حفظ العربية أولاً وإضافة الترجمات لاحقاً.

## الصور

أي حقل صورة يقبل ثلاثة أشكال:

1. **رفع ملف** (صورة أو فيديو حتى 50 ميجابايت) إلى Supabase Storage من لوحة التحكم.
2. **رابط خارجي** يُلصق مباشرة.
3. **`scene:<key>`** — رسمات متجهية (SVG) من داخل المشروع بألوان الهوية (`shanghai`, `beijing`, `guangzhou`, `hangzhou`, `xian`, `campus-library`, `campus-quad`, `campus-gate`, `night-bridge`).

المحتوى المبدئي يستخدم رسمات `scene:` كي يعمل الموقع دون أي اعتماد خارجي؛ استبدلها بصور فوتوغرافية حقيقية من لوحة التحكم متى شئت — دون أي تعديل برمجي.

## قاعدة البيانات

الجداول (19): `users` · `articles` · `services` · `process_steps` · `process_stages` · `process_trust_badges` · `study_paths` · `why_china_points` · `cost_factors` · `faqs` · `destination_media` · `success_stories` · `gallery` · `universities` · `admissions` · `site_sections` · `leads` · `settings` · `analytics_events`.

المخطط موزّع على ملفات هجرة مرقّمة في `supabase/migrations/` (من `0001_init.sql` حتى آخر هجرة).

المخطط الكامل مع سياسات RLS في `supabase/migrations/0001_init.sql`. القراءة العامة مسموحة للمحتوى المنشور فقط، وإدراج الطلبات (`leads`) مسموح للزوار، بينما القراءة والتعديل والحذف محصورة بحساب الإدارة.

> ملاحظة: كلمات المرور لا تُخزَّن في جدول `users` — تديرها Supabase Auth داخل `auth.users` بتشفير bcrypt، وجدول `users` يحمل الدور والاسم والبريد.

## التشغيل محلياً

```bash
npm install
cp .env.example .env.local   # اختياري — القيم الافتراضية مضمّنة
npm run dev                   # http://localhost:3000
```

المفتاح العام (`anon` / publishable) آمن للنشر في المتصفح لأن كل الجداول محمية بـ RLS.

## حماية نموذج التواصل

`/api/leads` يتحقق من الحقول ويطبّق حقل خفي (honeypot) وحداً زمنياً (5 طلبات لكل IP كل 10 دقائق) قبل الإدراج.

---

## النشر · Deployment

- **الموقع الحي:** https://jisr-to-china-henna.vercel.app
- **لوحة التحكم:** https://jisr-to-china-henna.vercel.app/admin/login
- **المستودع:** https://github.com/Jh4k5/- (فرع `claude/jisr-china-trilingual-platform-wzojbr`)

المشروع منشور على Vercel كمشروع إنتاج باسم `jisr-to-china`. أمر التثبيت في إعدادات المشروع يسحب الشيفرة من هذا المستودع أثناء البناء:

```bash
curl -fsSL -o repo.tgz https://codeload.github.com/Jh4k5/-/tar.gz/refs/heads/claude/jisr-china-trilingual-platform-wzojbr \
  && tar xzf repo.tgz --strip-components=1 && rm -f repo.tgz && npm install
```

> للحصول على نشر تلقائي مع كل commit، اربط حساب GitHub بحساب Vercel من
> Settings ← Git ثم اربط المشروع بالمستودع مباشرة؛ عندها يمكن حذف أمر التثبيت المخصص أعلاه.

### بيانات الدخول

حساب المدير أُنشئ داخل Supabase Auth، وكلمة المرور تُسلَّم خارج المستودع (لا تُحفظ في الشيفرة).
لتغييرها أو لإضافة مدير آخر: Supabase Dashboard ← Authentication ← Users، ثم أضف صفاً مقابلاً في جدول `public.users` بالدور `admin`.

### ملاحظات أمنية

- كل الجداول تعمل بـ Row Level Security؛ الكتابة محصورة بحسابات `public.users` ذات الدور `admin`/`editor`.
- يُنصح بتفعيل **Leaked Password Protection** من Supabase Dashboard ← Authentication ← Policies.
