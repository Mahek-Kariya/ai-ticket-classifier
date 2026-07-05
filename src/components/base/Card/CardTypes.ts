import type { ReactNode } from 'react'

export type CardVariant = 'stat' | 'hero-live' | 'panel-section'

export interface StatCardProps {
  icon:       ReactNode
  stat:       string | number
  label:      string
  subLabel?:  ReactNode        // e.g. "12 new today" link or "High urgency"
  subColor?:  string           // CSS color value for subLabel
  className?: string
}

export interface HeroLiveCardProps {
  count:      number
  className?: string
}

export interface PanelSectionCardProps {
  title:      string
  children:   ReactNode
  className?: string
}