import type { TextareaHTMLAttributes } from "react";

export type TextareaVariant = "default" | "inset" | "ai-reply";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  label?: string;
  hint?: string;
  error?: string;
  minRows?: number;
}
