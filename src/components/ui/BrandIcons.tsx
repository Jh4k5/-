type IconProps = { className?: string };

/** Minimal brand glyphs — kept in-repo so the icon set stays dependency-free. */

export function FacebookIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.12V9.9H7.6V13h2.68v8h3.22Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21.6 7.2c-.23-.87-.9-1.55-1.76-1.79C18.27 5 12 5 12 5s-6.27 0-7.84.41c-.86.24-1.53.92-1.76 1.79C2 8.8 2 12 2 12s0 3.2.4 4.8c.23.87.9 1.55 1.76 1.79C5.73 19 12 19 12 19s6.27 0 7.84-.41c.86-.24 1.53-.92 1.76-1.79.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
    </svg>
  );
}

export function TiktokIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3c.4 1.9 1.6 3.3 3.5 3.6v2.6c-1.3.1-2.6-.3-3.8-1v5.9c0 3.4-2.6 5.9-5.9 5.9A5.6 5.6 0 0 1 4.7 14c0-3.2 2.8-5.7 6.1-5.4v2.8c-.3-.1-.7-.2-1-.2-1.6 0-2.8 1.3-2.8 2.9 0 1.6 1.3 2.8 2.9 2.8 1.6 0 2.9-1.2 2.9-3V3h3.7Z" />
    </svg>
  );
}

export function WhatsappIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.9.53 3.68 1.45 5.2L2 22l5.1-1.6a9.8 9.8 0 0 0 4.94 1.33h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.76 9.76 0 0 0 12.04 2Zm0 17.9h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.02.95.96-2.95-.2-.31a8.14 8.14 0 0 1-1.25-4.34c0-4.5 3.67-8.17 8.18-8.17 2.18 0 4.24.85 5.78 2.4a8.12 8.12 0 0 1 2.39 5.78c0 4.51-3.67 8.17-8.17 8.17Zm4.49-6.12c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.15-.25-.02-.39.1-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.13.17 1.73 2.64 4.2 3.7.58.26 1.04.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.15-1.17-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}
