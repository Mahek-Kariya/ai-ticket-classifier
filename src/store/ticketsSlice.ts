/**
 * ticketsSlice.ts
 *
 * Redux Toolkit slice for ticket state management.
 * Items start empty and are hydrated from the API on mount.
 * The API route falls back to MOCK_TICKETS when Supabase is
 * unconfigured, so the client layer needs no mock awareness.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Ticket,
  TicketCategory,
  TicketUrgency,
  TicketStatus,
  TicketFilters,
} from "@/types";

// ============================================================
// STATE SHAPE
// ============================================================

interface TicketsState {
  items: Ticket[];
  isLoading: boolean;
  error: string | null;
  filters: TicketFilters;
  selectedTicketId: string | null;
  isPanelOpen: boolean;
}

const initialState: TicketsState = {
  items: [],
  isLoading: true,
  error: null,
  filters: {
    category: "all",
    urgency: "all",
    search: "",
  },
  selectedTicketId: null,
  isPanelOpen: false,
};

// ============================================================
// SLICE
// ============================================================

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // ---- Hydration / async lifecycle ----
    setTickets(state, action: PayloadAction<Ticket[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // ---- Filter actions ----
    setCategoryFilter(state, action: PayloadAction<TicketCategory | "all">) {
      state.filters.category = action.payload;
    },
    setUrgencyFilter(state, action: PayloadAction<TicketUrgency | "all">) {
      state.filters.urgency = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    resetFilters(state) {
      state.filters = { category: "all", urgency: "all", search: "" };
    },

    // ---- Ticket CRUD ----
    addTicket(state, action: PayloadAction<Ticket>) {
      state.items.unshift(action.payload);
    },
    updateTicketStatus(
      state,
      action: PayloadAction<{ id: string; status: TicketStatus }>,
    ) {
      const ticket = state.items.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket.status = action.payload.status;
        ticket.updated_at = new Date().toISOString();
      }
    },

    // ---- Slide panel ----
    openPanel(state, action: PayloadAction<string>) {
      state.selectedTicketId = action.payload;
      state.isPanelOpen = true;
    },
    closePanel(state) {
      state.selectedTicketId = null;
      state.isPanelOpen = false;
    },
  },
});

export const {
  setTickets,
  setLoading,
  setError,
  setCategoryFilter,
  setUrgencyFilter,
  setSearchFilter,
  resetFilters,
  addTicket,
  updateTicketStatus,
  openPanel,
  closePanel,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
