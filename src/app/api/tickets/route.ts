/**
 * api/tickets/route.ts
 *
 * Next.js App Router handler for the base /api/tickets endpoint.
 * Thin controller delegating to ticketDbService.
 *
 * GET  → Fetch all tickets from Supabase (or mock fallback).
 * POST → Insert a new ticket record into the tickets table.
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MOCK_TICKETS } from "@/modules/dashboard/lib/mockData";
import {
  getTicketsFromDb,
  createTicketInDb,
} from "@/services/ticketDbService";
import type { ApiResponse, Ticket } from "@/types";

// ── GET /api/tickets ─────────────────────────────────────────
// Returns every ticket, newest first.
// Falls back to the static MOCK_TICKETS collection when the
// Supabase client is unavailable (missing env vars / offline).
export async function GET(): Promise<NextResponse<ApiResponse<Ticket[]>>> {
  if (!supabase) {
    return NextResponse.json(
      { data: MOCK_TICKETS, error: null },
      { status: 200 },
    );
  }

  try {
    const tickets = await getTicketsFromDb();
    return NextResponse.json(
      { data: tickets, error: null },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to fetch tickets.";
    return NextResponse.json(
      { data: null, error: errMessage },
      { status: 500 },
    );
  }
}

// ── POST /api/tickets ────────────────────────────────────────
// Inserts a new ticket and returns the created row.
interface CreateTicketBody {
  customer_email?: string | null;
  message_body: string;
  category: Ticket["category"];
  urgency: Ticket["urgency"];
  ai_draft_reply: string;
  ai_model: string;
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<Ticket>>> {
  if (!supabase) {
    return NextResponse.json(
      {
        data: null,
        error:
          "Supabase client is not configured. Check your environment variables.",
      },
      { status: 503 },
    );
  }

  let body: CreateTicketBody;

  try {
    body = (await request.json()) as CreateTicketBody;
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  // Basic validation — message_body is the bare minimum
  if (!body.message_body || typeof body.message_body !== "string") {
    return NextResponse.json(
      { data: null, error: "message_body is required and must be a string." },
      { status: 400 },
    );
  }

  try {
    const createdTicket = await createTicketInDb({
      customer_email: body.customer_email ?? null,
      message_body: body.message_body,
      category: body.category,
      urgency: body.urgency,
      ai_draft_reply: body.ai_draft_reply,
      ai_model: body.ai_model,
    });

    return NextResponse.json(
      { data: createdTicket, error: null },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to create ticket.";
    return NextResponse.json(
      { data: null, error: errMessage },
      { status: 500 },
    );
  }
}
