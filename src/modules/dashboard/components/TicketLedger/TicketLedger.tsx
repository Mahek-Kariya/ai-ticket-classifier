import { Search } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { openPanel } from "@/store/ticketsSlice";
import {
  Button,
  Input,
  Select,
  CategoryBadge,
  UrgencyBadge,
  StatusBadge,
} from "@/components/base";
import { cn } from "@/lib/utils";
import { useTicketLedger } from "../../hooks/useTicketLedger";
import { formatRelativeTime } from "../../utils/formatRelativeTime";
import "./TicketLedger.css";
import type { TicketLedgerProps } from "./TicketLedgerTypes";
import type { TicketCategory } from "@/types";

const CATEGORY_FILTERS: Array<{
  value: TicketCategory | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "complaint", label: "Complaint" },
  { value: "general", label: "General" },
];

const URGENCY_OPTIONS = [
  { value: "all", label: "All Urgency" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

function generateTicketId(index: number, total: number): string {
  const num = total - index;
  return `TK-${num.toString().padStart(4, "0")}`;
}

export function TicketLedger({ className }: TicketLedgerProps) {
  const dispatch = useAppDispatch();
  const {
    tickets,
    filters,
    currentPage,
    totalPages,
    startIdx,
    paginatedTickets,
    filteredTicketsCount,
    handleCategoryFilter,
    handleUrgencyFilter,
    handleSearch,
    setCurrentPage,
  } = useTicketLedger();

  return (
    <div className={cn("ticket-ledger", className)}>
      <div className="ticket-ledger-header">
        <h3>All Tickets</h3>
      </div>

      <div className="ticket-ledger-filters">
        <div className="ticket-ledger-filter-pills">
          {CATEGORY_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant="outline"
              size="sm"
              isActive={filters.category === f.value}
              onClick={() => handleCategoryFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="ticket-ledger-filter-right">
          <Select
            options={URGENCY_OPTIONS}
            value={filters.urgency}
            onValueChange={handleUrgencyFilter}
            placeholder="All Urgency"
          />
          <Input
            className="ticket-ledger-search"
            placeholder="Search by email..."
            leftIcon={<Search size={16} />}
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <table className="ticket-ledger-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Email</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Received</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTickets.map((ticket, idx) => (
            <tr key={ticket.id} onClick={() => dispatch(openPanel(ticket.id))}>
              <td>
                <span className="ticket-id">
                  {generateTicketId(startIdx + idx, tickets.length)}
                </span>
              </td>
              <td>
                <span className="email-mono">
                  {ticket.customer_email ?? "\u2014"}
                </span>
              </td>
              <td>
                <CategoryBadge value={ticket.category} />
              </td>
              <td>
                <UrgencyBadge value={ticket.urgency} />
              </td>
              <td>
                <StatusBadge value={ticket.status} />
              </td>
              <td>
                <span className="timestamp">
                  {formatRelativeTime(ticket.created_at)}
                </span>
              </td>
              <td>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(openPanel(ticket.id));
                  }}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ticket-ledger-footer">
        <span className="ticket-ledger-footer-count">
          Showing {paginatedTickets.length} of {filteredTicketsCount} tickets
        </span>
        <div className="ticket-ledger-footer-nav">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            ← Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
