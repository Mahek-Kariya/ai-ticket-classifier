/**
 * tokens/common.ts
 *
 * TypeScript mirror of the design tokens in variables.css.
 * Use ONLY when Tailwind utility classes cannot reach:
 *   - Inline styles on dynamic/computed values
 *   - Third-party component style props
 *   - Canvas / WebGL rendering
 *   - Programmatic animation (e.g. Framer Motion `animate={{ ... }}`)
 *
 * For everything else, use the Tailwind classes generated from variables.css.
 */

/* ============================================================
   BRAND — Violet + Slate
   ============================================================ */
export const brand = {
  darkest: "#1e1b4b",
  dark: "#2e1a6e",
  mid: "#4c1d95",
  primary: "#7c3aed",
  light: "#a78bfa",
  subtle: "#ede9fe",
  ghost: "#f5f3ff",
} as const;

/* ============================================================
   SURFACE & BACKGROUND
   ============================================================ */
export const surface = {
  page: "#fafaf9",
  card: "#ffffff",
  inset: "#faf9f7",
  overlay: "rgba(30, 27, 75, 0.35)",
} as const;

/* ============================================================
   TEXT
   ============================================================ */
export const text = {
  primary: "#1c1917",
  secondary: "#44403c",
  muted: "#78716c",
  faint: "#a8a29e",
  onHero: "#ffffff",
  onHeroSub: "#ddd6fe",
} as const;

/* ============================================================
   BORDERS
   ============================================================ */
export const border = {
  default: "#ede9fe",
  subtle: "#f5f3ff",
  input: "#e8e5f0",
} as const;

/* ============================================================
   SEMANTIC — CATEGORY BADGES
   ============================================================ */
export const category = {
  technical: { bg: "#ede9fe", text: "#5b21b6" },
  billing: { bg: "#fef3c7", text: "#92400e" },
  complaint: { bg: "#ffe4e6", text: "#9f1239" },
  general: { bg: "#dcfce7", text: "#166534" },
} as const;

export type CategoryKey = keyof typeof category;

/* ============================================================
   SEMANTIC — URGENCY BADGES
   ============================================================ */
export const urgency = {
  high: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  medium: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  low: { bg: "#dcfce7", text: "#166534", dot: "#22c55e" },
} as const;

export type UrgencyKey = keyof typeof urgency;

/* ============================================================
   SEMANTIC — STATUS BADGES
   ============================================================ */
export const status = {
  new: { bg: "#f5f3ff", text: "#7c3aed" },
  in_progress: { bg: "#fef3c7", text: "#92400e" },
  resolved: { bg: "#dcfce7", text: "#166534" },
} as const;

export type StatusKey = keyof typeof status;

/* ============================================================
   SEMANTIC — FEEDBACK
   ============================================================ */
export const feedback = {
  success: "#22c55e",
  successMuted: "#dcfce7",
  warning: "#f59e0b",
  warningMuted: "#fef3c7",
  error: "#ef4444",
  errorMuted: "#ffe4e6",
  info: "#3b82f6",
  infoMuted: "#dbeafe",
} as const;

/* ============================================================
   SPACING — 4px base grid (in px as numbers for inline styles)
   ============================================================ */
export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/* ============================================================
   BORDER RADIUS (in px as numbers)
   ============================================================ */
export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  full: 9999,
} as const;

/* ============================================================
   SHADOWS
   ============================================================ */
export const shadow = {
  card: "0 1px 6px rgba(124, 58, 237, 0.07)",
  panel: "-8px 0 32px rgba(124, 58, 237, 0.09)",
  float: "0 4px 24px rgba(124, 58, 237, 0.12)",
  subtle: "0 1px 3px rgba(0, 0, 0, 0.06)",
} as const;

/* ============================================================
   TRANSITIONS
   ============================================================ */
export const duration = {
  fast: 100,
  normal: 150,
  slow: 300,
  panel: 350,
} as const;

export const ease = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  panel: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/* ============================================================
   Z-INDEX SCALE
   ============================================================ */
export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 100,
  overlay: 200,
  panel: 300,
  toast: 400,
} as const;
