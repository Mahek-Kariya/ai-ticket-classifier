"use client";

import { useMemo } from "react";
import { Inbox, Clock, LayoutGrid, CheckCircle } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { StatCard } from "@/components/base";
import { cn } from "@/lib/utils";
import "./StatCards.css";
import type { StatCardsProps } from "./StatCardsTypes";
import type { TicketCategory } from "@/types";

const CATEGORY_ORDER: TicketCategory[] = [
  "technical",
  "billing",
  "complaint",
  "general",
];

const CATEGORY_COLORS: Record<
  TicketCategory,
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
    label: "Complaints",
  },
  general: {
    bg: "var(--color-category-general-bg)",
    text: "var(--color-category-general-text)",
    label: "General",
  },
};

export function StatCards({ className }: StatCardsProps) {
  const tickets = useAppSelector((state) => state.tickets.items);

  const stats = useMemo(() => {
    const total = tickets.length;
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const newToday = tickets.filter(
      (t) => new Date(t.created_at) >= todayStart,
    ).length;
    const highUrgency = tickets.filter(
      (t) => t.urgency === "high" && t.status !== "resolved",
    ).length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const byCategory = CATEGORY_ORDER.reduce(
      (acc, cat) => {
        acc[cat] = tickets.filter((t) => t.category === cat).length;
        return acc;
      },
      {} as Record<TicketCategory, number>,
    );
    return { total, newToday, highUrgency, resolutionRate, byCategory };
  }, [tickets]);

  return (
    <div className={cn("stat-cards-grid stagger-children", className)}>
      {/* Total Tickets */}
      <StatCard
        className="animate-fade-in"
        icon={<Inbox size={22} />}
        stat={stats.total}
        label="Total Tickets"
        subLabel={`${stats.newToday} new today`}
        subColor="var(--color-brand-primary)"
      />

      {/* Needs Attention — custom card for violet number */}
      <div className="card-stat animate-fade-in">
        <span
          className="card-stat-icon"
          style={{ color: "var(--color-warning)" }}
          aria-hidden="true"
        >
          <Clock size={22} />
        </span>
        <p
          className="card-stat-number"
          style={{ color: "var(--color-brand-primary)" }}
        >
          {stats.highUrgency}
        </p>
        <p className="card-stat-label">Needs Attention</p>
        <p
          className="card-stat-sublabel"
          style={{ color: "var(--color-text-muted)" }}
        >
          High urgency
        </p>
      </div>

      {/* By Category */}
      <div className="card-stat animate-fade-in">
        <span className="card-stat-icon" aria-hidden="true">
          <LayoutGrid size={22} />
        </span>
        <p className="stat-cards-category-title">By Category</p>
        <div className="card-stat-category-grid">
          {CATEGORY_ORDER.map((cat) => {
            const styles = CATEGORY_COLORS[cat];
            return (
              <span
                key={cat}
                className="stat-category-pill"
                style={{ backgroundColor: styles.bg, color: styles.text }}
              >
                {styles.label} {stats.byCategory[cat]}
              </span>
            );
          })}
        </div>
      </div>

      {/* Resolution Rate */}
      <div className="card-stat animate-fade-in">
        <span
          className="card-stat-icon"
          style={{ color: "var(--color-success)" }}
          aria-hidden="true"
        >
          <CheckCircle size={22} />
        </span>
        <p
          className="card-stat-number"
          style={{ color: "var(--color-success)" }}
        >
          {stats.resolutionRate}%
        </p>
        <p className="card-stat-label">Resolved this week</p>
        <div className="card-stat-progress-track">
          <div
            className="card-stat-progress-fill animate-progress"
            style={
              {
                "--progress-target": `${stats.resolutionRate}%`,
                width: `${stats.resolutionRate}%`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </div>
  );
}
