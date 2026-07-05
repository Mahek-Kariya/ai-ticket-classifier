/**
 * api/tickets/[id]/route.ts
 *
 * Next.js App Router handler for a single ticket identified by
 * its UUID path parameter.
 * Thin controller delegating to ticketDbService.
 *
 * PATCH → Update mutable fields (currently just `status`) on an
 *         existing ticket row and return the modified record.
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { updateTicketStatusInDb } from "@/services/ticketDbService";
import type { ApiResponse, Ticket, TicketStatus } from "@/types";

const VALID_STATUSES: ReadonlySet<TicketStatus> = new Set([
  "new",
  "in_progress",
  "resolved",
]);

interface PatchTicketBody {
  status: TicketStatus;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<Ticket>>> {
  const { id } = await params;

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

  let body: PatchTicketBody;

  try {
    body = (await request.json()) as PatchTicketBody;
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  // Validate the incoming status value
  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json(
      {
        data: null,
        error: `Invalid status value. Must be one of: ${[...VALID_STATUSES].join(", ")}.`,
      },
      { status: 400 },
    );
  }

  try {
    const updatedTicket = await updateTicketStatusInDb(id, body.status);
    return NextResponse.json(
      { data: updatedTicket, error: null },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error ? error.message : "Failed to update ticket status.";
    // Map not found error to 404
    const status = errMessage.includes("No ticket found") ? 404 : 500;
    return NextResponse.json(
      { data: null, error: errMessage },
      { status },
    );
  }
}
