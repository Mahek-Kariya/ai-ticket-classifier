import { Textarea as ShadTextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import './Textarea.css'
import type { BaseTextareaProps, TextareaVariant } from './TextareaTypes'

const variantClass: Record<TextareaVariant, string> = {
  'default':  'textarea-default',
  'inset':    'textarea-inset',
  'ai-reply': 'textarea-ai-reply',
}

export function Textarea({
  variant = 'default',
  label,
  hint,
  error,
  minRows = 4,
  className,
  id,
  style,
  ...props
}: BaseTextareaProps) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={id} className="textarea-label">
          {label}
        </label>
      )}

      <ShadTextarea
        id={id}
        className={cn('textarea-base', variantClass[variant], className)}
        rows={minRows}
        style={style}
        {...props}
      />

      {error  && <p className="textarea-error-text" role="alert">{error}</p>}
      {!error && hint && <p className="textarea-hint">{hint}</p>}
    </div>
  )
}