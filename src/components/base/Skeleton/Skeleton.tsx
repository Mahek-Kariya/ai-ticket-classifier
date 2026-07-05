/**
 * NOTE: Architecture Rule Exception
 * These Skeleton variants (Skeleton, SkeletonTableRow, SkeletonStatCard) are tightly
 * related and intentionally co-located in this file for simplicity and ease of use.
 */
import { Skeleton as ShadSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import "./Skeleton.css";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ className, width, height, style }: SkeletonProps) {
  return (
    <ShadSkeleton
      className={cn("skeleton-base animate-shimmer", className)}
      style={{ width, height, ...style }}
    />
  );
}

export function SkeletonTableRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <Skeleton width={64} height={14} className="skeleton-text" />
      <Skeleton width={180} height={14} className="skeleton-text" />
      <Skeleton
        width={80}
        height={22}
        className="skeleton-base"
        style={{ borderRadius: "var(--radius-full)" }}
      />
      <Skeleton
        width={72}
        height={22}
        className="skeleton-base"
        style={{ borderRadius: "var(--radius-full)" }}
      />
      <Skeleton
        width={60}
        height={22}
        className="skeleton-base"
        style={{ borderRadius: "var(--radius-full)" }}
      />
      <Skeleton
        width={56}
        height={11}
        className="skeleton-text-sm"
        style={{ marginLeft: "auto" }}
      />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div
      style={{
        background: "var(--color-bg-card)",
        border: "1px solid var(--color-border-default)",
        borderRadius: "var(--radius-2xl)",
        padding: "var(--space-6)",
      }}
      aria-hidden="true"
    >
      <Skeleton
        width={40}
        height={40}
        className="skeleton-circle"
        style={{ marginBottom: "var(--space-4)" }}
      />
      <Skeleton
        width={72}
        height={30}
        className="skeleton-text"
        style={{ marginBottom: "var(--space-2)" }}
      />
      <Skeleton
        width={100}
        height={14}
        className="skeleton-text"
        style={{ marginBottom: "var(--space-2)" }}
      />
      <Skeleton width={80} height={11} className="skeleton-text-sm" />
    </div>
  );
}
