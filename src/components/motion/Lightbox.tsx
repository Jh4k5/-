"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Full-screen viewer shared by the admission strip and university galleries. */
export default function Lightbox({
  open,
  slides,
  index,
  onIndexChange,
  onClose,
  caption,
}: {
  open: boolean;
  slides: ReactNode[];
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
  caption?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % slides.length);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + slides.length) % slides.length);
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
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[rgba(6,14,30,0.94)] p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            className="absolute top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 end-5"
          >
            <X className="h-5 w-5" />
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
                aria-label="previous"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-bold text-white/70">
                {index + 1} / {slides.length}
              </span>
              <button
                type="button"
                onClick={() => onIndexChange((index + 1) % slides.length)}
                aria-label="next"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
