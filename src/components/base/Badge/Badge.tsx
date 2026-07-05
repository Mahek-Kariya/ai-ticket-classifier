import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import "./Badge.css";
import { categoryStyles, urgencyStyles, statusStyles } from "./BadgeStyles";
import type {
  CategoryBadgeProps,
  UrgencyBadgeProps,
  StatusBadgeProps,
} from "./BadgeTypes";
export function CategoryBadge({ value, className }: CategoryBadgeProps) {
  const s = categoryStyles[value];

  return (
    <Badge
      variant="outline"
      className={cn("badge-base border-0", className)}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </Badge>
  );
}

export function UrgencyBadge({ value, className }: UrgencyBadgeProps) {
  const s = urgencyStyles[value];

  return (
    <Badge
      variant="outline"
      className={cn("badge-base border-0", className)}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      <span
        className="badge-dot animate-pulse-dot"
        style={{ backgroundColor: s.dot }}
        aria-hidden="true"
      />
      {s.label}
    </Badge>
  );
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  const s = statusStyles[value];

  return (
    <Badge
      variant="outline"
      className={cn("badge-base border-0", className)}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.icon && (
        <span className="badge-check" aria-hidden="true">
          {s.icon}
        </span>
      )}
      {s.label}
    </Badge>
  );
}
