import type { Ticket, TicketCategory } from "@/types";

const CATEGORY_ORDER: TicketCategory[] = [
  "technical",
  "billing",
  "complaint",
  "general",
];

export interface CalculatedStats {
  total: number;
  newToday: number;
  highUrgency: number;
  resolutionRate: number;
  byCategory: Record<TicketCategory, number>;
}

/**
 * Computes dashboard statistics from a list of tickets.
 */
export function calculateStats(tickets: Ticket[]): CalculatedStats {
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
}
