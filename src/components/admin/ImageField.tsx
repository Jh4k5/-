"use client";

import { useRef, useState } from "react";
import { ImageUp, Link2, Trash2 } from "lucide-react";
import MediaImage from "@/components/ui/MediaImage";
import { SCENE_KEYS } from "@/components/art/SceneArt";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { inputClass } from "./ui";

export default function ImageField({
  value,
  onChange,
  label = "الصورة",
  hint = "ارفع صورة عالية الدقة، أو الصق رابط صورة، أو اختر رسمة من رسمات الهوية.",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setError("تعذّر رفع الصورة. تأكد أن حجمها أقل من 10 ميجابايت وأنها بصيغة صورة مدعومة.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-trust-blue">{label}</p>
      <p className="mb-3 text-xs text-charcoal/50">{hint}</p>

      <div className="grid gap-4 sm:grid-cols-[13rem_1fr]">
        <div className="relative h-32 overflow-hidden rounded-2xl border border-trust-blue/12 bg-ivory">
          <MediaImage src={value} alt="" />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full bg-trust-blue px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-trust-blue-dark disabled:opacity-60"
            >
              <ImageUp className="h-4 w-4" />
              {uploading ? "جارٍ الرفع…" : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-2 rounded-full border border-china-red/30 px-4 py-2 text-xs font-bold text-china-red transition-colors hover:bg-china-red/10"
              >
                <Trash2 className="h-4 w-4" />
                إزالة
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = "";
            }}
          />

          <div className="relative">
            <Link2 className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/35 start-3" />
            <input
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value || null)}
              dir="ltr"
              placeholder="https://…"
              className={`${inputClass} ps-9`}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SCENE_KEYS.map((scene) => (
              <button
                key={scene}
                type="button"
                onClick={() => onChange(`scene:${scene}`)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                  value === `scene:${scene}`
                    ? "bg-china-red text-white"
                    : "bg-trust-blue/8 text-trust-blue hover:bg-trust-blue/16"
                }`}
              >
                {scene}
              </button>
            ))}
          </div>

          {error && <p className="text-xs font-semibold text-china-red">{error}</p>}
        </div>
      </div>
    </div>
  );
}
