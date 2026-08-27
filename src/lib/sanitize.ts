import sanitizeHtml from "sanitize-html";

/**
 * Cleans rich-text HTML written in the admin panel before it is rendered.
 *
 * Article bodies are stored as HTML and injected into the page, so anyone who
 * can reach the editor could otherwise persist a <script> tag or a javascript:
 * href that runs for every visitor. This runs on the server at render time, so
 * the browser never receives the unsafe markup in the first place.
 *
 * The allowlist covers exactly what the editor can produce — anything else is
 * dropped rather than escaped, so a stray tag disappears instead of showing up
 * as visible angle brackets in the article.
 */
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "hr", "span", "div",
];

export function sanitizeRichText(html: string): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["dir"],
    },
    // Only these schemes may appear in an href or src — this is what blocks
    // javascript: and data: URI payloads.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    transformTags: {
      // Any link that leaves the site opens safely: noopener stops the new tab
      // from reaching back through window.opener.
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.target === "_blank" ? { rel: "noopener noreferrer" } : {}),
        },
      }),
      // Editor images are never above the fold on an article page.
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
  });
}
