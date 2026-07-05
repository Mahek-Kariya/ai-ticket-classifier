export type CategoryKey = "technical" | "billing" | "complaint" | "general";
export type UrgencyKey = "low" | "medium" | "high";
export type StatusKey = "new" | "in_progress" | "resolved";

export type BadgeVariant = "category" | "urgency" | "status";

export interface CategoryBadgeProps {
  value: CategoryKey;
  className?: string;
}

export interface UrgencyBadgeProps {
  value: UrgencyKey;
  className?: string;
}

export interface StatusBadgeProps {
  value: StatusKey;
  className?: string;
}
