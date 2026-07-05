/**
 * api/tickets/route.ts
 *
 * Next.js App Router handler for the base /api/tickets endpoint.
 *
 * GET  → Fetch all tickets from Supabase (or mock fallback).
 * POST → Insert a new ticket record into the tickets table.
 *
 * All responses conform to the ApiResponse<T> contract defined in
 * src/types/index.ts so consumers never need to guess the shape.
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { MOCK_TICKETS } from '@/modules/dashboard/lib/mock-data'
import type { ApiResponse, Ticket } from '@/types'

// ── GET /api/tickets ─────────────────────────────────────────
// Returns every ticket, newest first.
// Falls back to the static MOCK_TICKETS collection when the
// Supabase client is unavailable (missing env vars / offline).

export async function GET(): Promise<NextResponse<ApiResponse<Ticket[]>>> {
  if (!supabase) {
    return NextResponse.json(
      { data: MOCK_TICKETS, error: null },
      { status: 200 }
    )
  }

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data: data as Ticket[], error: null },
    { status: 200 }
  )
}

// ── POST /api/tickets ────────────────────────────────────────
// Inserts a new ticket and returns the created row.
// Expects a JSON body with the required ticket fields:
//   { customer_email?, message_body, category, urgency,
//     ai_draft_reply, ai_model }

interface CreateTicketBody {
  customer_email?: string | null
  message_body: string
  category: Ticket['category']
  urgency: Ticket['urgency']
  ai_draft_reply: string
  ai_model: string
}

export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<Ticket>>> {
  if (!supabase) {
    return NextResponse.json(
      { data: null, error: 'Supabase client is not configured. Check your environment variables.' },
      { status: 503 }
    )
  }

  let body: CreateTicketBody

  try {
    body = (await request.json()) as CreateTicketBody
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  // Basic validation — message_body is the bare minimum
  if (!body.message_body || typeof body.message_body !== 'string') {
    return NextResponse.json(
      { data: null, error: 'message_body is required and must be a string.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('tickets')
    .insert({
      customer_email: body.customer_email ?? null,
      message_body: body.message_body,
      category: body.category,
      urgency: body.urgency,
      ai_draft_reply: body.ai_draft_reply,
      ai_model: body.ai_model,
      status: 'new' as const,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { data: data as Ticket, error: null },
    { status: 201 }
  )
}
