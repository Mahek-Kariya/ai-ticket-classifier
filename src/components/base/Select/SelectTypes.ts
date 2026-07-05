export interface SelectOption {
  value: string
  label: string
}

export interface BaseSelectProps {
  options:      SelectOption[]
  value:        string
  onValueChange: (value: string) => void
  placeholder?: string
  className?:   string
}