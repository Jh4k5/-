# Editorial Content Plan — Bridge to China Edu Blog

**Started:** 2026-11 (session 4) · **Blog:** `/{locale}/blog` (independent section, existing CMS)
**Languages:** Arabic (primary audience), English, Russian — every published article is written
natively in all three languages; no machine-published translations.
**Integrity rules:** official sources only (campuschina.org, csc.edu.cn, chinesetest.cn,
visaforchina.cn, mfa.gov.cn, university websites); costs stated as indicative ranges with an
explicit "verify with the university" caveat; no fabricated search volumes, rankings, testimonials
or admission promises; every article carries a review date and localized internal links into the
site's conversion paths (`/{locale}/contact`, `/{locale}/services`).

## Publication pipeline status

Articles are stored in the existing `articles` table. **Batch 1 is written and committed as
migration `0037_blog_batch_1.sql`** — this environment has no Supabase management credentials, so
the migration must be applied (`supabase db push` or SQL editor) before the posts appear at the
URLs below; after application they behave exactly like CMS-published posts (editable at
`/admin/articles`, listed in the blog archive and sitemap automatically). Future batches should be
published directly through the admin CMS once credentials/storage access are available.

---

## Batch 1 — written, pending migration application (migration 0037)

| # | Topic / slug | Primary keywords (AR · EN · RU) | Intent · Audience | Category | Sources | URL (post-apply) | Status |
|---|---|---|---|---|---|---|---|
| 1 | Chinese Government Scholarship (CSC) complete guide · `chinese-government-scholarship-csc-guide` | منحة الحكومة الصينية CSC · Chinese Government Scholarship CSC · стипендия правительства Китая | Act now · scholarship seekers | tips | campuschina.org, csc.edu.cn | `/{locale}/blog/chinese-government-scholarship-csc-guide` | ✍️ written (AR/EN/RU) |
| 2 | China student visa X1 vs X2 · `china-student-visa-x1-x2-guide` | تأشيرة الطالب الصينية X1 X2 · China student visa X1 X2 · студенческая виза X1 X2 | Act now · admitted students | tips | visaforchina.cn, mfa.gov.cn | `/{locale}/blog/china-student-visa-x1-x2-guide` | ✍️ written (AR/EN/RU) |
| 3 | English-taught bachelor's & master's · `english-taught-degrees-china-guide` | الدراسة في الصين بالإنجليزية · study in China in English · учёба в Китае на английском | Research · no-Chinese applicants | universities | campuschina.org, university sites | `/{locale}/blog/english-taught-degrees-china-guide` | ✍️ written (AR/EN/RU) |
| 4 | HSK levels & university requirements · `hsk-levels-guide-study-china` | اختبار HSK مستويات · HSK levels requirements · уровни HSK | Learn · Chinese-taught applicants | about_china | chinesetest.cn | `/{locale}/blog/hsk-levels-guide-study-china` | ✍️ written (AR/EN/RU) |
| 5 | Costs of studying & living in China · `study-in-china-costs-guide` | تكلفة الدراسة في الصين · cost of studying in China · стоимость учёбы в Китае | Research/budget · families | student_life | university fee pages (indicative ranges) | `/{locale}/blog/study-in-china-costs-guide` | ✍️ written (AR/EN/RU) |

**Cover images:** batch 1 uses the site's built-in brand scenes (`scene:campus-gate`,
`scene:night-bridge`, `scene:campus-library`, `scene:xian`, `scene:hangzhou`) — unique per
article, no storage upload required. When Supabase storage access is available, batches 2+
should use unique optimized uploaded images (WebP/AVIF) with localized alt text per the owner's
directive; batch 1 covers can be upgraded at any time through the CMS.

---

## Batches 2–6 — planned (25 further topics, publish 4–5 per batch)

### Batch 2 · Scholarship cluster (deepens article #1, the pillar)
| # | Topic | Primary keyword direction | Notes |
|---|---|---|---|
| 6 | How to write a CSC study plan that wins | خطة الدراسة CSC / CSC study plan | Highest-leverage advice topic; links to #1 |
| 7 | University & provincial scholarships in China | منح الجامعات الصينية | Alternatives when CSC is missed; less competitive |
| 8 | Scholarship interview questions & preparation | مقابلة المنحة | Common real questions; no invented insider data |
| 9 | Types of scholarships in China (government / provincial / university / Confucius) | أنواع المنح في الصين | Comparison page; hub for the cluster |
| 10 | Application documents checklist (with translation/notarization notes) | وثائق التقديم للجامعات الصينية | Downloadable-style checklist formatting |

### Batch 3 · Admissions cluster
| # | Topic | Primary keyword direction | Notes |
|---|---|---|---|
| 11 | Undergraduate admission requirements for international students | شروط البكالوريوس في الصين | |
| 12 | Master's admission in China: requirements & process | القبول للماجستير في الصين | |
| 13 | PhD in China: finding a supervisor & the research proposal | الدكتوراه في الصين | Contact-supervisor culture explained |
| 14 | Application timeline for September intake (month-by-month) | مواعيد التقديم للجامعات الصينية | Links to #1, #2 |
| 15 | 10 common application mistakes (and how to avoid them) | أخطاء التقديم | Honest, non-promotional |

### Batch 4 · Programs & language cluster
| # | Topic | Primary keyword direction | Notes |
|---|---|---|---|
| 16 | The Chinese language year (preparatory program) explained | سنة اللغة الصينية | Links to #4 |
| 17 | Chinese-taught vs English-taught: how to choose | الدراسة بالصينية أم الإنجليزية | Balanced comparison; links #3, #4 |
| 18 | MBBS in China: what to verify before you apply | دراسة الطب في الصين | Recognition/licensing emphasis |
| 19 | Business & engineering degrees in China | دراسة الهندسة في الصين | Links to /universities |
| 20 | Recognized & accredited Chinese universities (how to verify) | الجامعات المعترف بها | MOE verification guidance |

### Batch 5 · Life & parents cluster
| # | Topic | Primary keyword direction | Notes |
|---|---|---|---|
| 21 | Student accommodation: dorm vs private apartment | السكن الجامعي في الصين | Links to #5 |
| 22 | Student life in China: first expectations | الحياة الطلابية في الصين | Authentic, no invented testimonials |
| 23 | Parents' guide: sending your child to study in China | دليل أهالي الطلاب | Trust content for the paying decision-maker |
| 24 | Comparing Chinese student cities (Beijing · Shanghai · Guangzhou · others) | أفضل المدن الصينية للدراسة | Links to /destinations |
| 25 | Rules international students must know (residence, work limits) | قوانين الطلاب الأجانب في الصين | Official-source accuracy |

### Batch 6 · Journey cluster (conversion-oriented)
| # | Topic | Primary keyword direction | Notes |
|---|---|---|---|
| 26 | Preparing for departure: the complete checklist | التحضير للسفر إلى الصين | |
| 27 | Your first 30 days in China | أول شهر في الصين | Post-arrival residence permit links #2 |
| 28 | Monthly student budgeting in China | ميزانية الطالب في الصين | Follow-up to #5 |
| 29 | How a study-in-China consultancy helps (and how to choose one) | مكتب استشارات دراسية | Careful, non-salesy; explains our model honestly |
| 30 | The complete study-in-China journey: research → arrival | الدراسة في الصين من الألف إلى الياء | Pillar page interlinking the whole library |

**Research basis for the plan:** the owner's 30 direction areas (master directive Phase 6),
mapped against the site's services and audience; final topics chosen for business relevance and
audience questions. Search-volume figures are intentionally absent — none were measured; when
Google Search Console data accumulates, this plan should be re-prioritized using real impressions
and queries from the owner's account.

---

## Maintenance log

| Date | Action |
|---|---|
| 2026-11 (session 4) | Plan created; batch 1 (5 articles × 3 languages) written into migration 0037; commit pending push |
