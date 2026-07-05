import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  setCategoryFilter,
  setUrgencyFilter,
  setSearchFilter,
} from "@/store/ticketsSlice";
import type { TicketCategory, TicketUrgency } from "@/types";
import { TICKETS_PER_PAGE } from "../components/TicketLedger/TicketLedgerStyles";

/**
 * Custom hook managing the state, filtering, and pagination logic
 * for the support ticket ledger.
 */
export function useTicketLedger() {
  const dispatch = useAppDispatch();
  const tickets = useAppSelector((state) => state.tickets.items);
  const filters = useAppSelector((state) => state.tickets.filters);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = useMemo(() => {
    let result = tickets;

    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.urgency !== "all") {
      result = result.filter((t) => t.urgency === filters.urgency);
    }
    if (filters.search.trim()) {
      const search = filters.search.toLowerCase();
      result = result.filter((t) =>
        t.customer_email?.toLowerCase().includes(search),
      );
    }

    return result;
  }, [tickets, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / TICKETS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = filteredTickets.slice(
    startIdx,
    startIdx + TICKETS_PER_PAGE,
  );

  function handleCategoryFilter(value: TicketCategory | "all") {
    dispatch(setCategoryFilter(value));
    setCurrentPage(1);
  }

  function handleUrgencyFilter(value: string) {
    dispatch(setUrgencyFilter(value as TicketUrgency | "all"));
    setCurrentPage(1);
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchFilter(e.target.value));
    setCurrentPage(1);
  }

  return {
    tickets,
    filters,
    currentPage: safeCurrentPage,
    totalPages,
    startIdx,
    paginatedTickets,
    filteredTicketsCount: filteredTickets.length,
    handleCategoryFilter,
    handleUrgencyFilter,
    handleSearch,
    setCurrentPage,
  };
}
