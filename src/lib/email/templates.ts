/**
 * Transactional email templates (Phase 4 — Resend integration).
 *
 * Two emails, both mobile-friendly, inline-styled, image-free (fast,
 * privacy-friendly, no broken-image risk):
 *
 *   1. Applicant confirmation — localized to the visitor's submitted
 *      language (ar/en/ru), Arabic rendered RTL. Confirms receipt only —
 *      never implies admission or a scholarship decision.
 *   2. Owner notification — English, addressed to the configured
 *      LEAD_NOTIFICATION_TO, with every follow-up-relevant field and a
 *      link to the admin leads dashboard.
 *
 * Brand palette mirrors the site tokens (globals.css):
 *   china-red #C8102E · trust-blue #1B3A6B · imperial-gold #D4AF37
 */

import type { LeadSource } from "@/lib/types";
import type { Locale } from "@/i18n/config";

export type NotifiableLead = {
  id: string;
  full_name: string;
  country: string;
  current_qualification: string;
  desired_major: string | null;
  chinese_level: string | null;
  preferred_contact: string;
  phone: string;
  email: string | null;
  message: string | null;
  language: string;
  source?: LeadSource | null;
  wants_scholarship?: boolean | null;
  desired_start_year?: number | null;
  created_at: string;
};

type Bilingual = { ar: string; en: string; ru: string };

const QUALIFICATION_LABELS: Record<string, Bilingual> = {
  high_school: { ar: "الثانوية العامة", en: "High school", ru: "Средняя школа" },
  bachelor: { ar: "بكالوريوس", en: "Bachelor's degree", ru: "Бакалавриат" },
  master: { ar: "ماجستير", en: "Master's degree", ru: "Магистратура" },
  phd: { ar: "دكتوراه", en: "PhD", ru: "Докторантура" },
};

const CONTACT_LABELS: Record<string, Bilingual> = {
  whatsapp: { ar: "واتساب", en: "WhatsApp", ru: "WhatsApp" },
  email: { ar: "البريد الإلكتروني", en: "Email", ru: "Электронная почта" },
  phone: { ar: "الهاتف", en: "Phone", ru: "Телефон" },
};

const LEVEL_LABELS: Record<string, Bilingual> = {
  none: { ar: "لا يوجد", en: "None", ru: "Нет" },
  beginner: { ar: "مبتدئ", en: "Beginner", ru: "Начальный" },
  hsk1_2: { ar: "HSK 1–2", en: "HSK 1–2", ru: "HSK 1–2" },
  hsk3_4: { ar: "HSK 3–4", en: "HSK 3–4", ru: "HSK 3–4" },
  hsk5_6: { ar: "HSK 5–6", en: "HSK 5–6", ru: "HSK 5–6" },
};

const SOURCE_LABELS: Record<string, Bilingual> = {
  contact_form: {
    ar: "طلب استشارة مجانية",
    en: "Free consultation request",
    ru: "Запрос на бесплатную консультацию",
  },
  eligibility_check: {
    ar: "فحص أهلية سريع",
    en: "Quick eligibility check",
    ru: "Быстрая проверка соответствия",
  },
};

function label(
  table: Record<string, Bilingual>,
  key: string | null | undefined,
  locale: Locale,
): string {
  if (!key) return "—";
  return table[key]?.[locale] ?? key;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Submission time rendered once as an unambiguous UTC string. */
function utcStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())} UTC`
  );
}

/* ------------------------------------------------------------------ */
/* Shared layout                                                       */
/* ------------------------------------------------------------------ */

const ARABIC_FONT = "'Segoe UI', Tahoma, 'Noto Kufi Arabic', Arial, sans-serif";
const LATIN_FONT = "'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function shell(opts: {
  dir: "rtl" | "ltr";
  lang: string;
  preheader: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  const font = opts.dir === "rtl" ? ARABIC_FONT : LATIN_FONT;
  const align = opts.dir === "rtl" ? "right" : "left";
  return `<!doctype html>
<html dir="${opts.dir}" lang="${opts.lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>Bridge to China Edu</title>
</head>
<body style="margin:0;padding:0;background:#f2f0ea;font-family:${font};color:#232323;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0ea;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
<tr><td style="background:#1B3A6B;border-radius:14px 14px 0 0;padding:26px 32px;">
<div style="color:#ffffff;font-size:19px;font-weight:700;letter-spacing:0.2px;">Bridge to China Edu</div>
<div style="height:4px;width:56px;background:#D4AF37;margin-top:10px;border-radius:2px;"></div>
</td></tr>
<tr><td style="background:#ffffff;border-radius:0 0 14px 14px;padding:32px 28px;text-align:${align};font-size:15.5px;line-height:1.85;">
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:18px 12px 4px;text-align:center;color:#8b8b8b;font-size:12px;line-height:1.7;">
${esc(opts.footerNote)}<br />
jisr-to-china-henna.vercel.app
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function referenceBlock(reference: string, caption: string): string {
  return `
<div style="background:#fbedef;border-radius:12px;padding:18px 20px;margin:26px 0;text-align:center;">
<div style="font-size:13px;font-weight:700;color:#7a2833;margin-bottom:6px;">${esc(caption)}</div>
<div dir="ltr" style="font-size:24px;font-weight:800;letter-spacing:1.5px;color:#C8102E;font-family:'Courier New',monospace;">${esc(reference)}</div>
</div>`;
}

function summaryTable(rows: [string, string][], dir: "rtl" | "ltr"): string {
  // In RTL the label column sits on the right, so the gutter goes the other way.
  const labelGutter = dir === "rtl" ? "padding:10px 0 10px 14px;" : "padding:10px 14px 10px 0;";
  const valueGutter = dir === "rtl" ? "padding:10px 14px 10px 0;" : "padding:10px 0 10px 14px;";
  const cells = rows
    .map(
      ([name, value]) =>
        `<tr>
<td style="${labelGutter}border-bottom:1px solid #efefef;font-size:13.5px;font-weight:700;color:#5a6472;white-space:nowrap;vertical-align:top;">${esc(name)}</td>
<td dir="auto" style="${valueGutter}border-bottom:1px solid #efefef;font-size:14.5px;font-weight:600;color:#232323;">${esc(value)}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;"><tbody>${cells}</tbody></table>`;
}

function infoBox(html: string, dir: "rtl" | "ltr"): string {
  const border = dir === "rtl" ? "border-right:4px solid #D4AF37;" : "border-left:4px solid #D4AF37;";
  return `<div style="background:#faf8f1;${border}border-radius:10px;padding:16px 18px;margin:22px 0;font-size:14.5px;line-height:1.9;color:#3d3d3d;">${html}</div>`;
}

/* ------------------------------------------------------------------ */
/* 1 · Applicant confirmation (localized)                              */
/* ------------------------------------------------------------------ */

export function applicantConfirmationSubject(locale: Locale): string {
  const subjects: Record<Locale, string> = {
    ar: "تم استلام طلبك بنجاح — Bridge to China Edu",
    en: "Your Request Has Been Received Successfully — Bridge to China Edu",
    ru: "Ваш запрос успешно получен — Bridge to China Edu",
  };
  return subjects[locale];
}

function applicantCopy(locale: Locale) {
  if (locale === "en") {
    return {
      greeting: (name: string) => `Hello ${name},`,
      intro:
        "Thank you for contacting <strong>Bridge to China Edu</strong>. This email confirms that your request was received successfully and is now with our team.",
      referenceCaption: "Your request reference",
      summaryCaption: "Request summary",
      nextTitle: "What happens next?",
      nextBody:
        "Our team will review your request within <strong>one business day</strong> and reach out through your preferred contact method with the study tracks that fit your profile.",
      disclaimer:
        "This message confirms that we received your request. It is not a university admission decision and not a scholarship award.",
      contactNote: "Need to reach us sooner? Simply reply to this email.",
      footer: "This is an automated confirmation from Bridge to China Edu.",
      rows: {
        request: "Request type",
        track: "Target study track",
        major: "Desired major",
        scholarship: "Scholarship interest",
        contactVia: "Preferred contact",
        submitted: "Submitted",
        yes: "Yes",
        no: "No",
      },
    };
  }
  if (locale === "ru") {
    return {
      greeting: (name: string) => `Здравствуйте, ${name}!`,
      intro:
        "Спасибо, что обратились в <strong>Bridge to China Edu</strong>. Это письмо подтверждает, что ваш запрос успешно получен и уже находится у нашей команды.",
      referenceCaption: "Номер вашего запроса",
      summaryCaption: "Краткая информация о запросе",
      nextTitle: "Что дальше?",
      nextBody:
        "Наша команда рассмотрит ваш запрос в течение <strong>одного рабочего дня</strong> и свяжется с вами удобным для вас способом, чтобы рассказать о направлениях, которые подходят вашему профилю.",
      disclaimer:
        "Это письмо лишь подтверждает получение вашего запроса. Оно не является решением о зачислении в университет и не является присуждением стипендии.",
      contactNote: "Хотите связаться с нами быстрее? Просто ответьте на это письмо.",
      footer: "Это автоматическое подтверждение от Bridge to China Edu.",
      rows: {
        request: "Тип запроса",
        track: "Целевая ступень обучения",
        major: "Желаемая специальность",
        scholarship: "Интерес к стипендии",
        contactVia: "Предпочтительный способ связи",
        submitted: "Дата отправки",
        yes: "Да",
        no: "Нет",
      },
    };
  }
  return {
    greeting: (name: string) => `مرحباً ${name}،`,
    intro:
      "شكراً لتواصلك مع <strong>Bridge to China Edu</strong>. تؤكّد هذه الرسالة أنه تم استلام طلبك بنجاح، وهو الآن لدى فريقنا للدراسة.",
    referenceCaption: "رقم طلبك المرجعي",
    summaryCaption: "ملخّص الطلب",
    nextTitle: "ما الخطوة التالية؟",
    nextBody:
      "سيراجع فريقنا طلبك خلال <strong>يوم عمل واحد</strong> ويتواصل معك عبر الوسيلة التي اخترتها لشرح المسارات الدراسية المناسبة لملفك.",
    disclaimer:
      "هذه الرسالة تأكيد لاستلام طلبك فقط، وليست قرار قبول جامعياً ولا منحة دراسية.",
    contactNote: "تريد التواصل معنا أسرع؟ يمكنك الردّ على هذه الرسالة مباشرة.",
    footer: "هذه رسالة تأكيد تلقائية من Bridge to China Edu.",
    rows: {
      request: "نوع الطلب",
      track: "المسار الدراسي المستهدف",
      major: "التخصص المرغوب",
      scholarship: "الاهتمام بالمنحة",
      contactVia: "وسيلة التواصل المفضلة",
      submitted: "تاريخ الإرسال",
      yes: "نعم",
      no: "لا",
    },
  };
}

export function applicantConfirmationEmail(
  lead: NotifiableLead,
  reference: string,
): { subject: string; html: string; text: string } {
  const locale = (["ar", "en", "ru"].includes(lead.language) ? lead.language : "ar") as Locale;
  const copy = applicantCopy(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const rows: [string, string][] = [
    [copy.rows.request, label(SOURCE_LABELS, lead.source ?? "contact_form", locale)],
    [copy.rows.track, label(QUALIFICATION_LABELS, lead.current_qualification, locale)],
  ];
  if (lead.desired_major) rows.push([copy.rows.major, lead.desired_major]);
  if (lead.wants_scholarship !== null && lead.wants_scholarship !== undefined) {
    rows.push([copy.rows.scholarship, lead.wants_scholarship ? copy.rows.yes : copy.rows.no]);
  }
  rows.push([copy.rows.contactVia, label(CONTACT_LABELS, lead.preferred_contact, locale)]);
  rows.push([copy.rows.submitted, utcStamp(lead.created_at)]);

  const html = shell({
    dir,
    lang: locale,
    preheader: copy.referenceCaption + ": " + reference,
    footerNote: copy.footer,
    bodyHtml: `
<p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#1B3A6B;">${esc(copy.greeting(lead.full_name))}</p>
<p style="margin:0 0 6px;">${copy.intro}</p>
${referenceBlock(reference, copy.referenceCaption)}
<div style="font-size:13px;font-weight:800;letter-spacing:0.6px;color:#5a6472;margin-bottom:2px;">${esc(copy.summaryCaption).toUpperCase()}</div>
${summaryTable(rows, dir)}
<p style="font-size:17px;font-weight:800;color:#1B3A6B;margin:28px 0 6px;">${esc(copy.nextTitle)}</p>
${infoBox(copy.nextBody, dir)}
<p style="margin:0 0 18px;font-size:13.5px;color:#6d6d6d;">${copy.disclaimer}</p>
<p style="margin:0;font-size:14px;font-weight:600;color:#1B3A6B;">${copy.contactNote}</p>`,
  });

  const text = [
    copy.greeting(lead.full_name).replace(/<[^>]+>/g, ""),
    copy.intro.replace(/<[^>]+>/g, ""),
    "",
    `${copy.referenceCaption}: ${reference}`,
    "",
    copy.summaryCaption + ":",
    ...rows.map(([name, value]) => `- ${name}: ${value}`),
    "",
    copy.nextTitle,
    copy.nextBody.replace(/<[^>]+>/g, ""),
    copy.disclaimer,
    copy.contactNote,
    "",
    "Bridge to China Edu · jisr-to-china-henna.vercel.app",
  ].join("\n");

  return { subject: applicantConfirmationSubject(locale), html, text };
}

/* ------------------------------------------------------------------ */
/* 2 · Owner notification (English, to LEAD_NOTIFICATION_TO)           */
/* ------------------------------------------------------------------ */

export const OWNER_NOTIFICATION_SUBJECT = "New Student Inquiry — Bridge to China Edu";

export function ownerNotificationEmail(
  lead: NotifiableLead,
  reference: string,
  adminUrl: string,
): { subject: string; html: string; text: string } {
  const languageName = lead.language === "ar" ? "Arabic" : lead.language === "ru" ? "Russian" : "English";
  const scholarship =
    lead.wants_scholarship === null || lead.wants_scholarship === undefined
      ? "—"
      : lead.wants_scholarship
        ? "Yes"
        : "No";

  const rows: [string, string][] = [
    ["Student name", lead.full_name],
    ["Email", lead.email ?? "— (not provided)"],
    ["Phone / WhatsApp", lead.phone],
    ["Country", lead.country],
    ["Requested service", label(SOURCE_LABELS, lead.source ?? "contact_form", "en")],
    ["Target study track", label(QUALIFICATION_LABELS, lead.current_qualification, "en")],
    ["Desired major", lead.desired_major ?? "—"],
    ["Chinese level", lead.chinese_level ? label(LEVEL_LABELS, lead.chinese_level, "en") : "—"],
    ["Scholarship interest", scholarship],
    ["Preferred contact", label(CONTACT_LABELS, lead.preferred_contact, "en")],
    ["Desired start year", lead.desired_start_year ? String(lead.desired_start_year) : "—"],
    ["Submitted", utcStamp(lead.created_at)],
    ["Website language", languageName],
    ["Lead reference", reference],
    ["Lead ID", lead.id],
  ];

  const html = shell({
    dir: "ltr",
    lang: "en",
    preheader: `${lead.full_name} (${lead.country}) — ${reference}`,
    footerNote: "You receive this message because a new inquiry was submitted on the website.",
    bodyHtml: `
<p style="margin:0 0 6px;font-size:18px;font-weight:800;color:#C8102E;">New Student Inquiry</p>
<p style="margin:0 0 8px;">A new inquiry was just submitted on Bridge to China Edu and saved to the leads dashboard.</p>
${referenceBlock(reference, "Lead reference")}
${summaryTable(rows, "ltr")}
${
  lead.message
    ? `<div style="background:#faf8f1;border-radius:10px;padding:14px 16px;margin:20px 0 6px;font-size:14px;line-height:1.8;color:#3d3d3d;"><strong style="display:block;margin-bottom:4px;color:#1B3A6B;">Student message</strong>${esc(lead.message)}</div>`
    : ""
}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 8px;">
<tr><td style="border-radius:999px;background:#C8102B;">
<a href="${esc(adminUrl)}" style="display:inline-block;padding:14px 30px;border-radius:999px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Open the leads dashboard</a>
</td></tr>
</table>
<p style="margin:0;font-size:12.5px;color:#8b8b8b;">Lead ID: ${esc(lead.id)}</p>`,
  });

  const text = [
    "NEW STUDENT INQUIRY — Bridge to China Edu",
    "",
    ...rows.map(([name, value]) => `${name}: ${value}`),
    "",
    lead.message ? `Student message:\n${lead.message}\n` : "",
    `Open the leads dashboard: ${adminUrl}`,
  ].join("\n");

  return { subject: OWNER_NOTIFICATION_SUBJECT, html, text };
}
