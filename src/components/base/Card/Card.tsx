import { Card as ShadCard } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import './Card.css'
import type { StatCardProps, HeroLiveCardProps, PanelSectionCardProps } from './CardTypes'

export function StatCard({
  icon,
  stat,
  label,
  subLabel,
  subColor,
  className,
}: StatCardProps) {
  return (
    <ShadCard className={cn('card-stat', className)}>
      <span className="card-stat-icon" aria-hidden="true">
        {icon}
      </span>

      <p className="card-stat-number">{stat}</p>
      <p className="card-stat-label">{label}</p>

      {subLabel && (
        <p
          className="card-stat-sublabel"
          style={subColor ? { color: subColor } : undefined}
        >
          {subLabel}
        </p>
      )}
    </ShadCard>
  )
}

export function HeroLiveCard({ count, className }: HeroLiveCardProps) {
  return (
    <div className={cn('card-hero-live', className)}>
      <div className="card-hero-live-indicator">
        <span
          className="card-hero-live-dot animate-pulse-dot"
          aria-hidden="true"
        />
        <span className="card-hero-live-label">Live</span>
      </div>

      <p className="card-hero-live-count">
        {count} new ticket{count !== 1 ? 's' : ''}
      </p>
      <p className="card-hero-live-sub">in the last hour</p>
    </div>
  )
}

export function PanelSectionCard({
  title,
  children,
  className,
}: PanelSectionCardProps) {
  return (
    <div className={cn('card-panel-section', className)}>
      <p className="card-panel-section-title label-caps">{title}</p>
      {children}
    </div>
  )
}