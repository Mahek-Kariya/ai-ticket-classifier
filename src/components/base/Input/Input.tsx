import { Input as ShadInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import './Input.css'
import type { BaseInputProps } from './InputTypes'

export function Input({
  leftIcon,
  rightIcon,
  error,
  label,
  hint,
  className,
  id,
  ...props
}: BaseInputProps) {
  return (
    <div className="input-wrapper">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span className="input-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        <ShadInput
          id={id}
          className={cn(
            'input-field',
            leftIcon  && 'has-left-icon',
            rightIcon && 'has-right-icon',
            className,
          )}
          data-error={error ? 'true' : undefined}
          {...props}
        />

        {rightIcon && (
          <span className="input-icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>

      {error  && <p className="input-error-text" role="alert">{error}</p>}
      {!error && hint && <p className="input-hint">{hint}</p>}
    </div>
  )
}