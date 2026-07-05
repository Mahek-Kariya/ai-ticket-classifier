import type { CategoryKey, UrgencyKey, StatusKey } from "./BadgeTypes";

export const categoryStyles: Record<
  CategoryKey,
  { bg: string; text: string; label: string }
> = {
  technical: {
    bg: "var(--color-category-technical-bg)",
    text: "var(--color-category-technical-text)",
    label: "Technical",
  },
  billing: {
    bg: "var(--color-category-billing-bg)",
    text: "var(--color-category-billing-text)",
    label: "Billing",
  },
  complaint: {
    bg: "var(--color-category-complaint-bg)",
    text: "var(--color-category-complaint-text)",
    label: "Complaint",
  },
  general: {
    bg: "var(--color-category-general-bg)",
    text: "var(--color-category-general-text)",
    label: "General",
  },
};

export const urgencyStyles: Record<
  UrgencyKey,
  { bg: string; text: string; dot: string; label: string }
> = {
  high: {
    bg: "var(--color-urgency-high-bg)",
    text: "var(--color-urgency-high-text)",
    dot: "var(--color-urgency-high-dot)",
    label: "High",
  },
  medium: {
    bg: "var(--color-urgency-medium-bg)",
    text: "var(--color-urgency-medium-text)",
    dot: "var(--color-urgency-medium-dot)",
    label: "Medium",
  },
  low: {
    bg: "var(--color-urgency-low-bg)",
    text: "var(--color-urgency-low-text)",
    dot: "var(--color-urgency-low-dot)",
    label: "Low",
  },
};

export const statusStyles: Record<
  StatusKey,
  { bg: string; text: string; label: string; icon?: string }
> = {
  new: {
    bg: "var(--color-status-new-bg)",
    text: "var(--color-status-new-text)",
    label: "New",
  },
  in_progress: {
    bg: "var(--color-status-progress-bg)",
    text: "var(--color-status-progress-text)",
    label: "In Progress",
  },
  resolved: {
    bg: "var(--color-status-resolved-bg)",
    text: "var(--color-status-resolved-text)",
    label: "Resolved",
    icon: "✓",
  },
};
