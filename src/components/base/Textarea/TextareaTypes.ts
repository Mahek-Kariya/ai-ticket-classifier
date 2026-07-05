import type { TextareaHTMLAttributes } from 'react'

export type TextareaVariant = 'default' | 'inset' | 'ai-reply'

export interface BaseTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?:  TextareaVariant
  label?:    string
  hint?:     string
  error?:    string
  minRows?:  number
}