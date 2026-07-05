import { Separator as ShadSeparator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import './Separator.css'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  label?:       string
  className?:   string
}

export function Separator({
  orientation = 'horizontal',
  label,
  className,
}: SeparatorProps) {
  if (label) {
    return (
      <div className={cn('separator-label', className)}>
        {label}
      </div>
    )
  }

  return (
    <ShadSeparator
      orientation={orientation}
      className={cn(
        orientation === 'horizontal' ? 'separator-horizontal' : 'separator-vertical',
        className,
      )}
    />
  )
}