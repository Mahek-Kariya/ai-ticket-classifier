'use client'

import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import './Select.css'
import type { BaseSelectProps } from './SelectTypes'

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Select…',
  className,
}: BaseSelectProps) {
  return (
    <ShadSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('select-trigger', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="select-content">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="select-item"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  )
}