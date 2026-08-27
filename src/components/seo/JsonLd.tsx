/**
 * The single place in the app that injects raw HTML.
 *
 * Structured data has to reach the page as the text content of a
 * <script type="application/ld+json"> tag, and React offers no other way to do
 * that — so rather than scatter dangerouslySetInnerHTML across a dozen pages,
 * every schema goes through here.
 *
 * The escaping matters: JSON.stringify happily emits the literal characters
 * `</script>` if any field contains them, which would close the tag early and
 * let the rest of the string be parsed as markup. These fields include
 * admin-editable settings and article titles, so that is a reachable injection
 * path, not a theoretical one. Rewriting the characters below to their \u form
 * keeps the JSON byte-for-byte valid while making tag breakout impossible.
 *
 * The pattern is built from escape sequences rather than written as a literal:
 * U+2028 and U+2029 are line terminators in JavaScript source, so a regex
 * literal containing them would not parse.
 */
const ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  // Valid inside JSON strings, but they terminate a line in an inline script.
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

const UNSAFE = new RegExp("[<>&\\u2028\\u2029]", "g");

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(UNSAFE, (char) => ESCAPES[char]);
}

export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- audited: escaped above, no raw HTML reaches the DOM
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
