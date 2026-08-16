import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group fixed bottom-6 z-50 inline-flex items-center gap-2 rounded-full bg-jade px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_-14px_rgba(0,161,112,0.85)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#008a60] end-6"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-jade/40" aria-hidden="true" />
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
