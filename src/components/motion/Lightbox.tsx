"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Locale } from "@/i18n/config";

/** Accessible names for the lightbox controls, in each site language. */
const LIGHTBOX_LABELS: Record<Locale, { close: string; previous: string; next: string; dialog: string }> = {
  ar: { close: "إغلاق", previous: "السابق", next: "التالي", dialog: "عرض الصورة" },
  en: { close: "Close", previous: "Previous", next: "Next", dialog: "Image viewer" },
  ru: { close: "Закрыть", previous: "Предыдущий", next: "Следующий", dialog: "Просмотр изображения" },
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Full-screen viewer shared by the admission strip and university galleries. */
export default function Lightbox({
  open,
  slides,
  index,
  onIndexChange,
  onClose,
  caption,
  locale,
}: {
  open: boolean;
  slides: ReactNode[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  caption?: ReactNode;
  locale: Locale;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const labels = LIGHTBOX_LABELS[locale];

  // Focus management: when the dialog opens, remember which element invoked it
  // and move focus to the close button; when it closes, hand focus back so
  // keyboard users never land at the top of the page (modal focus pattern).
  useEffect(() => {
    if (!open) return;

    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    return () => {
      openerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % slides.length);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + slides.length) % slides.length);
      if (event.key === "Tab") {
        // Trap Tab inside the dialog — focus may not escape while it is open.
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (event.shiftKey) {
          if (active === first || !dialog.contains(active)) {
            event.preventDefault();
            last.focus();
          }
        } else if (active === last || !dialog.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, slides.length, onClose, onIndexChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[rgba(6,14,30,0.94)] p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={labels.dialog}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="absolute top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 end-5"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[82vh] w-full max-w-5xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            {slides[index]}
          </motion.div>

          {caption && (
            <div
              className="mt-5 max-w-2xl text-center text-sm text-white/80"
              onClick={(event) => event.stopPropagation()}
            >
              {caption}
            </div>
          )}

          {slides.length > 1 && (
            <div
              className="mt-6 flex items-center gap-4"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => onIndexChange((index - 1 + slides.length) % slides.length)}
                aria-label={labels.previous}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="text-sm font-bold text-white/70">
                {index + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => onIndexChange((index + 1) % slides.length)}
                aria-label={labels.next}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
