import type {
  DestinationMedia,
  Service,
  SettingRow,
  SuccessStory,
} from "./types";

/**
 * Content shipped with the codebase. It seeds the database on first run and is
 * also used as an offline fallback so the site never renders empty if the
 * database is unreachable.
 */

export const SEED_SERVICES: Service[] = [
  {
    id: "seed-1",
    icon: "graduation-cap",
    display_order: 1,
    title_ar: "القبول الجامعي",
    title_en: "University admission",
    title_ru: "Поступление в университет",
    description_ar:
      "نساعدك في التقديم لبرامج البكالوريوس والماجستير والدكتوراه عبر المنصات الرسمية للجامعات الصينية: اختيار الجامعة المناسبة لملفك، تجهيز المستندات وترجمتها وتوثيقها، متابعة الطلب حتى صدور خطاب القبول.",
    description_en:
      "We help you apply for bachelor's, master's and PhD programmes through the official portals of Chinese universities: choosing the university that fits your profile, preparing, translating and authenticating documents, and following the application until the admission letter is issued.",
    description_ru:
      "Помогаем подать документы на программы бакалавриата, магистратуры и докторантуры через официальные порталы китайских университетов: подбор вуза под ваш профиль, подготовка, перевод и легализация документов, сопровождение до получения письма о зачислении.",
  },
  {
    id: "seed-2",
    icon: "languages",
    display_order: 2,
    title_ar: "برامج اللغة الصينية (HSK)",
    title_en: "Chinese language programmes (HSK)",
    title_ru: "Программы китайского языка (HSK)",
    description_ar:
      "توجيهك للتسجيل في برامج تعلّم اللغة الصينية داخل الصين أو عن بُعد، وتحديد المستوى المناسب لك، والتخطيط للوصول إلى مستوى HSK المطلوب للقبول في تخصصك.",
    description_en:
      "Guidance on enrolling in Chinese language programmes inside China or remotely, assessing your current level, and planning the path to the HSK level required by your target major.",
    description_ru:
      "Помощь в поступлении на программы китайского языка в Китае или онлайн, определение вашего уровня и построение плана до нужного уровня HSK для вашей специальности.",
  },
  {
    id: "seed-3",
    icon: "award",
    display_order: 3,
    title_ar: "المنح الدراسية",
    title_en: "Scholarships",
    title_ru: "Стипендии",
    description_ar:
      "شرح واضح لأنواع المنح: المنحة الحكومية الصينية (CSC)، منح المقاطعات، والمنح الجامعية — مع مساعدتك في تجهيز ملف التقديم وخطاب الدوافع وخطة الدراسة ورسائل التوصية.",
    description_en:
      "A clear explanation of scholarship types — the Chinese Government Scholarship (CSC), provincial scholarships and university scholarships — plus help preparing your application file, motivation letter, study plan and recommendation letters.",
    description_ru:
      "Понятное объяснение типов стипендий: государственная стипендия Китая (CSC), провинциальные и университетские стипендии, а также помощь в подготовке пакета документов, мотивационного письма, учебного плана и рекомендаций.",
  },
  {
    id: "seed-4",
    icon: "book-open-check",
    display_order: 4,
    title_ar: "التحضير للاختبارات",
    title_en: "Test preparation",
    title_ru: "Подготовка к экзаменам",
    description_ar:
      "تدريب مركّز على اختبارات HSK وHSKK واختبارات القبول الجامعي، مع خطة زمنية واقعية ونماذج تدريبية ومتابعة مستواك حتى يوم الاختبار.",
    description_en:
      "Focused training for HSK, HSKK and university entrance exams, with a realistic timeline, practice papers and progress tracking up to exam day.",
    description_ru:
      "Целенаправленная подготовка к HSK, HSKK и вступительным экзаменам вузов: реалистичный график, пробные задания и контроль прогресса до дня экзамена.",
  },
  {
    id: "seed-5",
    icon: "messages-square",
    display_order: 5,
    title_ar: "التحضير للمقابلات",
    title_en: "Interview preparation",
    title_ru: "Подготовка к собеседованиям",
    description_ar:
      "تجهيزك لمقابلات القبول الجامعي: الأسئلة المتوقعة، طريقة عرض خطتك الدراسية، ولغة الجسد والتقديم أمام لجنة القبول لرفع فرص نجاحك.",
    description_en:
      "Getting you ready for admission interviews: expected questions, how to present your study plan, and delivery in front of the admission panel to raise your chances.",
    description_ru:
      "Подготовка к вступительным собеседованиям: ожидаемые вопросы, презентация учебного плана и уверенное выступление перед приёмной комиссией.",
  },
  {
    id: "seed-6",
    icon: "plane-landing",
    display_order: 6,
    title_ar: "الاستقبال والاستقرار",
    title_en: "Arrival and settling in",
    title_ru: "Встреча и обустройство",
    description_ar:
      "استقبالك في المطار عند وصولك، ومرافقتك في إجراءات الاستقرار الأولى: التسجيل في الجامعة، السكن، الشريحة والحساب البنكي، والفحص الطبي وتصريح الإقامة.",
    description_en:
      "Meeting you at the airport on arrival and walking you through the first settling-in steps: university registration, accommodation, SIM card and bank account, medical check and residence permit.",
    description_ru:
      "Встреча в аэропорту и сопровождение на первых этапах: регистрация в университете, жильё, SIM-карта и банковский счёт, медосмотр и вид на жительство.",
  },
];

export const SEED_DESTINATIONS: DestinationMedia[] = [
  {
    id: "d-hero-1",
    image_url: "scene:night-bridge",
    category: "hero",
    display_order: 1,
    is_featured: true,
    title_ar: "جسرك إلى مستقبل أوسع",
    title_en: "Your bridge to a wider future",
    title_ru: "Ваш мост в большое будущее",
  },
  {
    id: "d-hero-2",
    image_url: "scene:shanghai",
    category: "hero",
    display_order: 2,
    is_featured: true,
    title_ar: "شنغهاي ليلاً",
    title_en: "Shanghai by night",
    title_ru: "Шанхай ночью",
  },
  {
    id: "d-hero-3",
    image_url: "scene:beijing",
    category: "hero",
    display_order: 3,
    is_featured: true,
    title_ar: "بكين التاريخية",
    title_en: "Historic Beijing",
    title_ru: "Исторический Пекин",
  },
  {
    id: "d-city-1",
    image_url: "scene:shanghai",
    category: "city",
    display_order: 1,
    is_featured: false,
    title_ar: "شنغهاي — العاصمة الاقتصادية",
    title_en: "Shanghai — the economic capital",
    title_ru: "Шанхай — экономическая столица",
  },
  {
    id: "d-city-2",
    image_url: "scene:beijing",
    category: "city",
    display_order: 2,
    is_featured: false,
    title_ar: "بكين — قلب التعليم والتاريخ",
    title_en: "Beijing — the heart of education and history",
    title_ru: "Пекин — сердце образования и истории",
  },
  {
    id: "d-city-3",
    image_url: "scene:guangzhou",
    category: "city",
    display_order: 3,
    is_featured: false,
    title_ar: "قوانغتشو — بوابة التجارة",
    title_en: "Guangzhou — the trade gateway",
    title_ru: "Гуанчжоу — ворота торговли",
  },
  {
    id: "d-city-4",
    image_url: "scene:hangzhou",
    category: "city",
    display_order: 4,
    is_featured: false,
    title_ar: "هانغتشو — مدينة البحيرة والتقنية",
    title_en: "Hangzhou — lake and technology city",
    title_ru: "Ханчжоу — город озера и технологий",
  },
  {
    id: "d-city-5",
    image_url: "scene:xian",
    category: "city",
    display_order: 5,
    is_featured: false,
    title_ar: "شيان — عاصمة طريق الحرير",
    title_en: "Xi'an — capital of the Silk Road",
    title_ru: "Сиань — столица Шёлкового пути",
  },
  {
    id: "d-campus-1",
    image_url: "scene:campus-library",
    category: "campus",
    display_order: 6,
    is_featured: false,
    title_ar: "مكتبة الحرم الجامعي",
    title_en: "The campus library",
    title_ru: "Университетская библиотека",
  },
  {
    id: "d-campus-2",
    image_url: "scene:campus-quad",
    category: "campus",
    display_order: 7,
    is_featured: false,
    title_ar: "ساحات الطلاب",
    title_en: "Student squares",
    title_ru: "Студенческие площади",
  },
  {
    id: "d-campus-3",
    image_url: "scene:campus-gate",
    category: "campus",
    display_order: 8,
    is_featured: false,
    title_ar: "بوابة الجامعة",
    title_en: "The university gate",
    title_ru: "Университетские ворота",
  },
];

export const SEED_STORIES: SuccessStory[] = [
  {
    id: "s-1",
    student_name: "Omar A.",
    photo: null,
    display_order: 1,
    achievement_ar: "قبول + منحة حكومية (CSC) — هندسة ميكانيكية",
    achievement_en: "Admission + CSC government scholarship — Mechanical engineering",
    achievement_ru: "Зачисление + государственная стипендия CSC — машиностроение",
    quote_ar:
      "كنت أظن أن المنحة الحكومية حلم بعيد. رتّبوا لي الملف خطوة بخطوة وصححوا خطة الدراسة معي أكثر من مرة حتى قُبلت.",
    quote_en:
      "I thought the government scholarship was a distant dream. They organised my file step by step and revised my study plan with me until I was accepted.",
    quote_ru:
      "Я думал, что государственная стипендия — далёкая мечта. Мне помогли собрать документы шаг за шагом и не раз доработали учебный план, пока меня не приняли.",
  },
  {
    id: "s-2",
    student_name: "Lina M.",
    photo: null,
    display_order: 2,
    achievement_ar: "برنامج لغة صينية ثم بكالوريوس طب",
    achievement_en: "Chinese language programme, then an MBBS bachelor's",
    achievement_ru: "Программа китайского языка, затем бакалавриат по медицине",
    quote_ar: "بدأت من الصفر في اللغة. اليوم أدرس الطب وأتحدث الصينية في المستشفى الجامعي.",
    quote_en: "I started from zero in the language. Today I study medicine and speak Chinese at the university hospital.",
    quote_ru: "Я начинала язык с нуля. Сегодня я учусь на врача и говорю по-китайски в университетской клинике.",
  },
  {
    id: "s-3",
    student_name: "Yusuf K.",
    photo: null,
    display_order: 3,
    achievement_ar: "ماجستير علوم حاسب + سكن جامعي مدعوم",
    achievement_en: "Master's in computer science + subsidised campus housing",
    achievement_ru: "Магистратура по информатике + субсидированное общежитие",
    quote_ar: "أكثر ما ساعدني هو التحضير للمقابلة. دخلت واثقاً وأجبت عن كل سؤال توقعناه تقريباً.",
    quote_en: "The interview preparation helped the most. I walked in confident and answered nearly every question we had rehearsed.",
    quote_ru: "Больше всего помогла подготовка к собеседованию. Я вошёл уверенно и ответил почти на все отработанные вопросы.",
  },
];

export const SEED_SETTINGS: SettingRow[] = [
  { key: "whatsapp_number", value: "+8613800000000", value_ar: null, value_en: null, value_ru: null },
  { key: "contact_email", value: "info@bridgetochina.com", value_ar: null, value_en: null, value_ru: null },
  { key: "contact_phone", value: "+86 138 0000 0000", value_ar: null, value_en: null, value_ru: null },
  { key: "instagram_url", value: "https://instagram.com/", value_ar: null, value_en: null, value_ru: null },
  { key: "facebook_url", value: "https://facebook.com/", value_ar: null, value_en: null, value_ru: null },
  { key: "tiktok_url", value: "https://tiktok.com/", value_ar: null, value_en: null, value_ru: null },
  { key: "youtube_url", value: "https://youtube.com/", value_ar: null, value_en: null, value_ru: null },
  { key: "stat_students_helped", value: "480", value_ar: null, value_en: null, value_ru: null },
  { key: "stat_years_experience", value: "8", value_ar: null, value_en: null, value_ru: null },
  { key: "stat_universities", value: "35", value_ar: null, value_en: null, value_ru: null },
  { key: "stat_satisfaction_rate", value: "97", value_ar: null, value_en: null, value_ru: null },
  {
    key: "office_location",
    value: null,
    value_ar: "الصين — دبي",
    value_en: "China — Dubai",
    value_ru: "Китай — Дубай",
  },
  {
    key: "footer_note",
    value: null,
    value_ar: "جسر إلى الصين… مستقبل بلا حدود.",
    value_en: "Bridge to China… a future without borders.",
    value_ru: "Мост в Китай… будущее без границ.",
  },
];

export const UNIVERSITY_NAMES = [
  "Tsinghua University",
  "Peking University",
  "Fudan University",
  "Zhejiang University",
  "Shanghai Jiao Tong University",
  "Wuhan University",
  "Sun Yat-sen University",
  "Nanjing University",
  "Harbin Institute of Technology",
  "Beijing Normal University",
];
