"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ClipboardCheck, Mail, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { AdminHeading, Button, StatusNote, inputClass } from "./ui";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import type { Lead, LeadSource, LeadStatus } from "@/lib/types";

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "جديد",
  reviewed: "تمت المراجعة",
  awaiting_reply: "بانتظار الرد",
  qualified: "مؤهل",
  contracted: "تعاقد",
  unqualified: "غير مؤهل",
  deferred: "مؤجل",
  // legacy values kept readable for rows saved before the status list was widened
  contacted: "تم التواصل",
  completed: "مكتمل",
};

const STATUS_ORDER: LeadStatus[] = [
  "new",
  "reviewed",
  "awaiting_reply",
  "qualified",
  "contracted",
  "unqualified",
  "deferred",
];

const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "bg-china-red/10 text-china-red",
  reviewed: "bg-trust-blue/10 text-trust-blue",
  awaiting_reply: "bg-imperial-gold/20 text-[#6b5410]",
  qualified: "bg-trust-blue/10 text-trust-blue",
  contracted: "bg-jade/15 text-jade",
  unqualified: "bg-charcoal/8 text-charcoal/55",
  deferred: "bg-charcoal/8 text-charcoal/55",
  contacted: "bg-imperial-gold/20 text-[#6b5410]",
  completed: "bg-jade/15 text-jade",
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  contact_form: "نموذج التواصل",
  eligibility_check: "فحص الأهلية السريع",
};

const QUALIFICATION_LABEL: Record<string, string> = {
  high_school: "ثانوي",
  bachelor: "بكالوريوس",
  master: "ماجستير",
  phd: "دكتوراه",
};

const LEVEL_LABEL: Record<string, string> = {
  none: "لا يوجد",
  beginner: "مبتدئ",
  hsk1_2: "HSK 1-2",
  hsk3_4: "HSK 3-4",
  hsk5_6: "HSK 5-6",
};

const CONTACT_LABEL: Record<string, string> = {
  whatsapp: "واتساب",
  email: "إيميل",
  phone: "هاتف",
};

const LANGUAGE_LABEL: Record<string, string> = {
  ar: "العربية",
  en: "English",
  ru: "Русский",
};

export default function LeadsTable({ initial }: { initial: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [language, setLanguage] = useState<"all" | "ar" | "en" | "ru">("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (status !== "all" && lead.status !== status) return false;
      if (source !== "all" && (lead.source ?? "contact_form") !== source) return false;
      if (language !== "all" && lead.language !== language) return false;
      if (!needle) return true;
      return `${lead.full_name} ${lead.country} ${lead.phone} ${lead.email ?? ""} ${lead.desired_major ?? ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [leads, status, source, language, query]);

  const newCount = useMemo(() => leads.filter((lead) => lead.status === "new").length, [leads]);

  async function updateStatus(id: string, next: LeadStatus) {
    const previous = leads;
    setLeads((rows) => rows.map((row) => (row.id === id ? { ...row, status: next } : row)));

    const supabase = createClient();
    const { error } = await supabase.from("leads").update({ status: next }).eq("id", id);

    if (error) {
      setLeads(previous);
      setNote({ type: "error", text: "تعذّر تحديث حالة الطلب." });
    } else {
      setNote({ type: "ok", text: "تم تحديث حالة الطلب." });
    }
  }

  async function remove(id: string) {
    if (!window.confirm("حذف هذا الطلب نهائياً؟")) return;
    const previous = leads;
    setLeads((rows) => rows.filter((row) => row.id !== id));

    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      setLeads(previous);
      setNote({ type: "error", text: "تعذّر حذف الطلب." });
    }
  }

  return (
    <div>
      <AdminHeading
        title="صندوق الطلبات الواردة"
        subtitle="كل طلب مرسل من نموذج التواصل، مع اللغة التي استخدمها الزائر وحالة المتابعة."
      />

      <div className="surface-card mb-6 flex flex-wrap items-center gap-3 p-4">
        {newCount > 0 && (
          <span className="rounded-full bg-china-red/10 px-3 py-1.5 text-xs font-bold text-china-red">
            {newCount} جديد
          </span>
        )}

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className={`${inputClass} w-auto`}
        >
          <option value="all">كل الحالات</option>
          {STATUS_ORDER.map((key) => (
            <option key={key} value={key}>
              {STATUS_LABEL[key]}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(event) => setSource(event.target.value as typeof source)}
          className={`${inputClass} w-auto`}
        >
          <option value="all">كل المصادر</option>
          <option value="contact_form">{SOURCE_LABEL.contact_form}</option>
          <option value="eligibility_check">{SOURCE_LABEL.eligibility_check}</option>
        </select>

        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as typeof language)}
          className={`${inputClass} w-auto`}
        >
          <option value="all">كل اللغات</option>
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>

        <label className="relative ms-auto w-full sm:w-64">
          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40 start-3" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث بالاسم أو الهاتف…"
            className={`${inputClass} ps-9`}
          />
        </label>
      </div>

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="surface-card p-12 text-center text-sm text-charcoal/55">
          لا توجد طلبات مطابقة.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const open = expanded === lead.id;
            return (
              <article key={lead.id} className="surface-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : lead.id)}
                  className="flex w-full flex-wrap items-center gap-4 p-5 text-start"
                >
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold ${STATUS_COLOR[lead.status]}`}
                  >
                    {lead.full_name.trim().charAt(0)}
                  </span>

                  <span className="min-w-40 flex-1">
                    <span className="block font-extrabold text-trust-blue">{lead.full_name}</span>
                    <span className="block text-xs text-charcoal/55">
                      {lead.country} · {QUALIFICATION_LABEL[lead.current_qualification]} ·{" "}
                      {LANGUAGE_LABEL[lead.language]}
                    </span>
                  </span>

                  {lead.source === "eligibility_check" && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-trust-blue/10 px-2.5 py-1 text-[0.625rem] font-bold text-trust-blue">
                      <ClipboardCheck className="h-3 w-3" aria-hidden="true" />
                      {SOURCE_LABEL.eligibility_check}
                    </span>
                  )}

                  <span className="text-xs text-charcoal/55">{formatDate(lead.created_at, "ar")}</span>

                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[lead.status]}`}>
                    {STATUS_LABEL[lead.status]}
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 text-charcoal/40 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="border-t border-trust-blue/8 bg-ivory/60 p-5">
                    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        ["الهاتف / واتساب", lead.phone],
                        ["البريد الإلكتروني", lead.email || "—"],
                        ["التخصص المرغوب", lead.desired_major || "—"],
                        ["سنة البدء المتوقعة", lead.desired_start_year ? String(lead.desired_start_year) : "—"],
                        ["مستوى الصينية", lead.chinese_level ? LEVEL_LABEL[lead.chinese_level] : "—"],
                        [
                          "يبحث عن منحة؟",
                          lead.wants_scholarship === null || lead.wants_scholarship === undefined
                            ? "—"
                            : lead.wants_scholarship
                              ? "نعم"
                              : "لا",
                        ],
                        ["وسيلة التواصل المفضلة", CONTACT_LABEL[lead.preferred_contact]],
                        ["مصدر الطلب", SOURCE_LABEL[lead.source ?? "contact_form"]],
                        ["لغة الإرسال", LANGUAGE_LABEL[lead.language]],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs font-bold text-charcoal/45">{label}</dt>
                          <dd className="mt-0.5 text-sm font-semibold text-trust-blue" dir="auto">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {lead.message && (
                      <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-charcoal/80">
                        {lead.message}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^\d]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-jade px-4 py-2 text-xs font-bold text-white"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                        واتساب
                      </a>
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-full bg-trust-blue/10 px-4 py-2 text-xs font-bold text-trust-blue"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        اتصال
                      </a>
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-2 rounded-full bg-trust-blue/10 px-4 py-2 text-xs font-bold text-trust-blue"
                        >
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          إيميل
                        </a>
                      )}

                      <select
                        value={lead.status}
                        onChange={(event) => updateStatus(lead.id, event.target.value as LeadStatus)}
                        className={`${inputClass} w-auto py-2 text-xs`}
                      >
                        {STATUS_ORDER.map((key) => (
                          <option key={key} value={key}>
                            {STATUS_LABEL[key]}
                          </option>
                        ))}
                        {!STATUS_ORDER.includes(lead.status) && (
                          <option value={lead.status}>{STATUS_LABEL[lead.status]}</option>
                        )}
                      </select>

                      <Button variant="danger" className="ms-auto" onClick={() => remove(lead.id)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        حذف
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
