/**
 * types/index.ts
 *
 * Global TypeScript types shared across the entire application.
 * All database shapes, API contracts, and shared enums live here.
 */

// ============================================================
// ENUMS — mirror the Supabase PostgreSQL enums exactly
// ============================================================

export type TicketCategory = 'billing' | 'technical' | 'complaint' | 'general'

export type TicketUrgency = 'low' | 'medium' | 'high'

export type TicketStatus = 'new' | 'in_progress' | 'resolved'

// ============================================================
// CORE ENTITY — mirrors the tickets table in Supabase
// ============================================================

export interface Ticket {
  id: string
  created_at: string
  updated_at: string
  customer_email: string | null
  message_body: string
  category: TicketCategory
  urgency: TicketUrgency
  ai_draft_reply: string
  ai_model: string
  status: TicketStatus
}

// ============================================================
// API CONTRACTS
// ============================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ClassifyRequest {
  message: string
  customer_email?: string
}

export interface ClassifyResponse {
  category: TicketCategory
  urgency: TicketUrgency
  ai_draft_reply: string
  ai_model: string
}

// ============================================================
// UI STATE — not persisted, only used in components
// ============================================================

export interface TicketFilters {
  category: TicketCategory | 'all'
  urgency: TicketUrgency | 'all'
  search: string
}

export interface DashboardStats {
  total: number
  newToday: number
  highUrgency: number
  resolvedThisWeek: number
  byCategory: Record<TicketCategory, number>
}