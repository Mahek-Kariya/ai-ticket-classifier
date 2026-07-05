/**
 * tokens/typography.ts
 *
 * TypeScript mirror of the typography tokens in variables.css.
 * Use ONLY when Tailwind utility classes cannot reach.
 * Same escape-hatch rule as tokens/common.ts.
 */

/* ============================================================
   FONT FAMILIES
   ============================================================ */
export const fontFamily = {
  sans: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  mono: 'var(--font-jetbrains-mono), ui-monospace, "Cascadia Code", monospace',
} as const;

/* ============================================================
   FONT SIZES (rem strings)
   ============================================================ */
export const fontSize = {
  "2xs": "0.625rem", // 10px — tiny labels, uppercase caps
  xs: "0.75rem", // 12px — timestamps, hints, mono data
  sm: "0.875rem", // 14px — body, table cells, descriptions
  base: "1rem", // 16px — default body
  lg: "1.125rem", // 18px — card numbers sub-label
  xl: "1.25rem", // 20px — section subheadings
  "2xl": "1.5rem", // 24px — section headings
  "3xl": "1.875rem", // 30px — stat card numbers
  "4xl": "2.25rem", // 36px — hero heading
} as const;

/* ============================================================
   FONT WEIGHTS
   ============================================================ */
export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/* ============================================================
   LINE HEIGHTS
   ============================================================ */
export const lineHeight = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
} as const;

/* ============================================================
   LETTER SPACING
   ============================================================ */
export const letterSpacing = {
  tight: "-0.025em", // headings
  normal: "0em",
  wide: "0.025em",
  widest: "0.1em", // uppercase caps labels
} as const;
