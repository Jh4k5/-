"use client";

import { useRef, useState } from "react";
import MediaFrame from "@/components/ui/MediaFrame";
import { BLUR_LEVEL_PX } from "@/lib/blur";
import type { BlurBox, BlurLevel } from "@/lib/types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Live preview of an admission letter with the privacy patch on top.
 * The patch can be dragged, and resized from its corner handle; values are
 * stored as percentages so they stay correct at any rendered size.
 */
export default function BlurBoxEditor({
  image,
  box,
  level,
  onChange,
}: {
  image: string | null;
  box: BlurBox;
  level: BlurLevel;
  onChange: (box: BlurBox) => void;
}) {
  const enabled = level !== "none";
  const blurPx = BLUR_LEVEL_PX[level];
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"idle" | "move" | "resize">("idle");
  const origin = useRef({ x: 0, y: 0, box });

  const percent = (event: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  };

  const start = (event: React.PointerEvent, next: "move" | "resize") => {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    origin.current = { ...percent(event), box };
    setMode(next);
  };

  const move = (event: React.PointerEvent) => {
    if (mode === "idle") return;
    const point = percent(event);
    const dx = point.x - origin.current.x;
    const dy = point.y - origin.current.y;
    const base = origin.current.box;

    if (mode === "move") {
      onChange({
        ...base,
        x: clamp(base.x + dx, 0, 100 - base.w),
        y: clamp(base.y + dy, 0, 100 - base.h),
      });
    } else {
      onChange({
        ...base,
        w: clamp(base.w + dx, 6, 100 - base.x),
        h: clamp(base.h + dy, 4, 100 - base.y),
      });
    }
  };

  const end = () => setMode("idle");

  return (
    <div
      ref={frameRef}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      className="relative mx-auto w-full max-w-sm touch-none overflow-hidden rounded-2xl border border-trust-blue/12 bg-ivory"
      style={{ aspectRatio: "3 / 4" }}
    >
      <MediaFrame src={image} alt="" className="object-contain" />

      {enabled && (
        <div
          onPointerDown={(event) => start(event, "move")}
          className="absolute cursor-move rounded-md border-2 border-dashed border-china-red bg-white/25"
          style={{
            left: `${box.x}%`,
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`,
            backdropFilter: `blur(${blurPx}px)`,
            WebkitBackdropFilter: `blur(${blurPx}px)`,
          }}
        >
          <span
            onPointerDown={(event) => start(event, "resize")}
            className="absolute -bottom-2.5 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-white bg-china-red shadow-md -end-2.5"
            aria-hidden="true"
          />
        </div>
      )}

      <span className="pointer-events-none absolute bottom-2 rounded-full bg-black/60 px-2.5 py-1 text-[0.625rem] font-bold text-white start-2">
        اسحب المستطيل لتغطية اسم الطالب
      </span>
    </div>
  );
}
