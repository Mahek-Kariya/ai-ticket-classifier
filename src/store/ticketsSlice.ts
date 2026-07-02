/**
 * ticketsSlice.ts
 *
 * Redux Toolkit slice for ticket state management.
 * Pre-populated with MOCK_TICKETS for Phase 1 (static dashboard UI).
 * Once Supabase is wired, the initial items will default to [] and
 * be hydrated via an async thunk.
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Ticket,
  TicketCategory,
  TicketUrgency,
  TicketStatus,
  TicketFilters,
} from "@/types";
import { MOCK_TICKETS } from "@/modules/dashboard/lib/mock-data";

// ============================================================
// STATE SHAPE
// ============================================================

interface TicketsState {
  items: Ticket[];
  filters: TicketFilters;
  selectedTicketId: string | null;
  isPanelOpen: boolean;
}

const initialState: TicketsState = {
  items: MOCK_TICKETS,
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
      action: PayloadAction<{ id: string; status: TicketStatus }>
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
