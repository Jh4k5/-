"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Save } from "lucide-react";
import { AdminHeading, Button, Card, Field, StatusNote, inputClass } from "./ui";
import MediaField from "./MediaField";
import MediaFrame from "@/components/ui/MediaFrame";
import { LogoMark } from "@/components/site/Logo";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_THEME } from "@/lib/theme";
import type { DestinationMedia, MotionIntensity, SettingRow } from "@/lib/types";

const MOTION_OPTIONS: { value: MotionIntensity; label: string; hint: string }[] = [
  { value: "calm", label: "هادئة", hint: "حركة خفيفة ومباشرة" },
  { value: "balanced", label: "متوازنة", hint: "حركة واضحة بلا مبالغة" },
  { value: "cinematic", label: "سينمائية", hint: "أقصى إحساس بالعمق والحركة" },
];

type State = {
  brand_primary: string;
  brand_gold: string;
  brand_blue: string;
  motion_intensity: MotionIntensity;
  logo_url: string;
  hero_overlay_opacity: string;
};

export default function ThemeEditor({
  settings,
  heroSlides,
}: {
  settings: SettingRow[];
  heroSlides: DestinationMedia[];
}) {
  const router = useRouter();
  const initial = (key: string, fallback: string) =>
    settings.find((row) => row.key === key)?.value?.trim() || fallback;

  const [state, setState] = useState<State>({
    brand_primary: initial("brand_primary", DEFAULT_THEME.primary),
    brand_gold: initial("brand_gold", DEFAULT_THEME.gold),
    brand_blue: initial("brand_blue", DEFAULT_THEME.blue),
    motion_intensity: initial("motion_intensity", DEFAULT_THEME.motion) as MotionIntensity,
    logo_url: initial("logo_url", ""),
    hero_overlay_opacity: initial("hero_overlay_opacity", String(DEFAULT_THEME.overlay)),
  });

  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const set = (key: keyof State, value: string) =>
    setState((current) => ({ ...current, [key]: value }) as State);

  async function save() {
    setSaving(true);
    setNote(null);

    const supabase = createClient();
    const payload = (Object.keys(state) as (keyof State)[]).map((key) => ({
      key,
      value: state[key],
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("settings").upsert(payload, { onConflict: "key" });

    setSaving(false);

    if (error) {
      setNote({ type: "error", text: "تعذّر حفظ الهوية." });
      return;
    }

    setNote({ type: "ok", text: "تم الحفظ. سيظهر التغيير في الموقع خلال لحظات." });
    router.refresh();
  }

  const reset = () =>
    setState({
      brand_primary: DEFAULT_THEME.primary,
      brand_gold: DEFAULT_THEME.gold,
      brand_blue: DEFAULT_THEME.blue,
      motion_intensity: DEFAULT_THEME.motion,
      logo_url: "",
      hero_overlay_opacity: String(DEFAULT_THEME.overlay),
    });

  const colorField = (key: keyof State, label: string) => (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={state[key]}
          onChange={(event) => set(key, event.target.value)}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-trust-blue/12 bg-white p-1"
          aria-label={label}
        />
        <input
          dir="ltr"
          className={inputClass}
          value={state[key]}
          onChange={(event) => set(key, event.target.value)}
        />
      </div>
    </Field>
  );

  return (
    <div>
      <AdminHeading
        title="الهوية والحركة"
        subtitle="ألوان العلامة، شدة الحركة، الشعار، وشفافية الطبقة فوق واجهة الموقع."
        action={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              استعادة الافتراضي
            </Button>
            <Button onClick={save} loading={saving}>
              <Save className="h-4 w-4" />
              حفظ
            </Button>
          </div>
        }
      />

      {note && (
        <div className="mb-5">
          <StatusNote status={note} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <h2 className="text-lg font-extrabold text-trust-blue">ألوان الهوية</h2>
          {colorField("brand_primary", "الأحمر الصيني (أساسي)")}
          {colorField("brand_gold", "الذهبي الإمبراطوري")}
          {colorField("brand_blue", "الأزرق الموثوق")}

          <div
            className="mt-2 flex h-24 items-center justify-center rounded-2xl text-sm font-extrabold text-white"
            style={{
              backgroundImage: `linear-gradient(115deg, ${state.brand_primary} 0%, ${state.brand_blue} 55%, ${state.brand_gold} 100%)`,
            }}
          >
            معاينة التدرّج
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-lg font-extrabold text-trust-blue">شدة الحركة</h2>
            <div className="grid gap-2 sm:grid-cols-3">
              {MOTION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => set("motion_intensity", option.value)}
                  className={`rounded-2xl border p-4 text-start transition-colors ${
                    state.motion_intensity === option.value
                      ? "border-china-red bg-china-red/8"
                      : "border-trust-blue/12 hover:bg-trust-blue/5"
                  }`}
                >
                  <span className="block font-extrabold text-trust-blue">{option.label}</span>
                  <span className="mt-1 block text-xs text-charcoal/55">{option.hint}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-extrabold text-trust-blue">الشعار</h2>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-trust-blue/8">
                {state.logo_url ? (
                  <MediaFrame src={state.logo_url} alt="" className="object-contain" />
                ) : (
                  <LogoMark className="h-12 w-12" />
                )}
              </span>
              <p className="text-xs text-charcoal/55">
                ارفع شعار المكتب ليحل محل الرسمة الافتراضية في الهيدر والفوتر ولوحة التحكم.
              </p>
            </div>
            <MediaField
              label="ملف الشعار"
              hint="يفضَّل PNG أو SVG بخلفية شفافة."
              value={state.logo_url || null}
              onChange={(url) => set("logo_url", url ?? "")}
              allowVideo={false}
              showScenes={false}
            />
          </Card>

          <Card className="space-y-4">
            <h2 className="text-lg font-extrabold text-trust-blue">واجهة الموقع (الهيرو)</h2>
            <Field
              label={`شفافية الطبقة فوق الخلفية: ${state.hero_overlay_opacity}%`}
              hint="كلما زادت، ظهر النص أوضح وخفتت الصورة."
            >
              <input
                type="range"
                min={20}
                max={95}
                value={state.hero_overlay_opacity}
                onChange={(event) => set("hero_overlay_opacity", event.target.value)}
                className="w-full accent-[var(--color-china-red)]"
              />
            </Field>

            <div className="rounded-2xl bg-ivory p-4">
              <p className="text-xs text-charcoal/60">
                صور وفيديوهات الواجهة تُدار من صفحة{" "}
                <span className="font-bold text-trust-blue">معرض الوجهات</span> — أي عنصر تضع عليه
                علامة «صورة مميّزة» يظهر في خلفية الواجهة الرئيسية.
              </p>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {heroSlides.map((slide) => (
                  <span
                    key={slide.id}
                    className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-trust-blue/12"
                  >
                    <MediaFrame src={slide.image_url} alt="" />
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-4 mt-6 lg:hidden">
        <Button onClick={save} loading={saving} className="w-full shadow-lg">
          <Save className="h-4 w-4" />
          حفظ الهوية
        </Button>
      </div>
    </div>
  );
}
