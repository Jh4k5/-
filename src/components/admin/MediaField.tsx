"use client";

import { useRef, useState } from "react";
import { FileVideo, ImageUp, Link2, Loader2, Trash2 } from "lucide-react";
import MediaFrame, { isVideoSrc } from "@/components/ui/MediaFrame";
import { SCENE_KEYS } from "@/components/art/SceneArt";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/config";
import { inputClass } from "./ui";

const MAX_BYTES = 50 * 1024 * 1024;

/**
 * Every media slot in the dashboard: upload a photo or a video, paste a link,
 * or pick one of the built-in animated brand scenes.
 */
export default function MediaField({
  value,
  onChange,
  label = "الصورة أو الفيديو",
  hint = "ارفع صورة عالية الدقة أو فيديو قصير (حتى 50 ميجابايت)، أو الصق رابطاً، أو اختر رسمة من رسمات الهوية.",
  allowVideo = true,
  showScenes = true,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  allowVideo?: boolean;
  showScenes?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");

    if (file.size > MAX_BYTES) {
      setError("حجم الملف أكبر من 50 ميجابايت. اضغط الملف ثم أعد المحاولة.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch {
      setError("تعذّر رفع الملف. تأكد من نوعه (صورة أو فيديو) وحجمه ثم حاول مرة أخرى.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-trust-blue">{label}</p>
      <p className="mb-3 text-xs text-charcoal/50">{hint}</p>

      <div className="grid gap-4 sm:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="relative h-32 overflow-hidden rounded-2xl border border-trust-blue/12 bg-ivory">
          <MediaFrame src={value} alt="" />
          {isVideoSrc(value) && (
            <span className="absolute bottom-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[0.625rem] font-bold text-white start-2">
              <FileVideo className="h-3 w-3" aria-hidden="true" />
              فيديو
            </span>
          )}
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-trust-blue px-4 text-xs font-bold text-white transition-colors hover:bg-trust-blue-dark disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <ImageUp className="h-4 w-4" aria-hidden="true" />
              )}
              {uploading ? "جارٍ الرفع…" : allowVideo ? "رفع صورة أو فيديو" : "رفع صورة"}
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-china-red/30 px-4 text-xs font-bold text-china-red transition-colors hover:bg-china-red/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                إزالة
              </button>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept={allowVideo ? "image/*,video/mp4,video/webm" : "image/*"}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) upload(file);
              event.target.value = "";
            }}
          />

          <div className="relative">
            <Link2 className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/35 start-3" aria-hidden="true" />
            <input
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value || null)}
              dir="ltr"
              placeholder="https://…"
              className={`${inputClass} ps-9`}
            />
          </div>

          {showScenes && (
            <div className="flex flex-wrap gap-1.5">
              {SCENE_KEYS.map((scene) => (
                <button
                  key={scene}
                  type="button"
                  onClick={() => onChange(`scene:${scene}`)}
                  className={`rounded-lg px-2.5 py-1.5 text-[0.6875rem] font-bold transition-colors ${
                    value === `scene:${scene}`
                      ? "bg-china-red text-white"
                      : "bg-trust-blue/8 text-trust-blue hover:bg-trust-blue/16"
                  }`}
                >
                  {scene}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-xs font-semibold text-china-red">{error}</p>}
        </div>
      </div>
    </div>
  );
}
