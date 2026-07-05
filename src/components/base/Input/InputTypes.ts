import type { InputHTMLAttributes, ReactNode } from 'react'

export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?:    ReactNode
  rightIcon?:   ReactNode
  error?:       string
  label?:       string
  hint?:        string
}