import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * House rules that keep the generic "AI template" look from creeping back in.
 * Each one encodes a decision already made for this brand, so a future edit has
 * to argue with the linter rather than quietly undo the identity.
 */
const houseStyle = {
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-syntax": [
      "error",
      {
        // The purple→blue gradient is the single most recognisable AI tell.
        selector:
          "Literal[value=/(from-purple|to-purple|via-purple|from-violet|to-violet|#a855f7|#8b5cf6|#7c3aed)/]",
        message:
          "Purple/violet gradients are the archetypal AI-template look. Use the brand palette: china-red, imperial-gold, trust-blue.",
      },
      {
        selector: "Literal[value=/\\bfont-(inter|roboto|arial)\\b/i]",
        message:
          "Inter/Roboto/Arial are the generic defaults. Headings use Cairo (ar) or Manrope (en/ru) via --font-display.",
      },
      {
        // Gradients on flat UI (rules, chips, icon tiles) rather than photos.
        // A scrim that fades a photograph always ends at `to-transparent`, and
        // that is legitimate — it buys text legibility — so it is excluded via
        // the negative lookahead rather than being flagged and then disabled.
        selector:
          "Literal[value=/bg-gradient-to-[a-z]+ (?![^\"]*to-transparent)[^\"]*from-(china-red|trust-blue|imperial-gold)/]",
        message:
          "Decorative gradients on UI chrome read as AI-generated. Use a solid brand colour; gradients over photographs (ending in to-transparent) are fine.",
      },
      {
        selector: "Literal[value=/backdrop-blur-(2xl|3xl)/]",
        message:
          "Heavy glassmorphism is an AI tell. Keep blur subtle and limited to one focal element.",
      },
    ],
  },
};

/**
 * JSON-LD is the one place raw HTML injection is legitimate: we serialise our
 * own objects with JSON.stringify, never user input. Everything else must go
 * through the server-rendered tree.
 */
const noRawHtml = {
  files: ["src/**/*.tsx"],
  ignores: ["src/lib/seo.ts", "src/app/**/layout.tsx"],
  rules: {
    "react/no-danger": "warn",
  },
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  houseStyle,
  noRawHtml,
];

export default eslintConfig;
