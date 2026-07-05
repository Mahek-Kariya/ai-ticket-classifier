/**
 * api/tickets/[id]/route.ts
 *
 * Next.js App Router handler for a single ticket identified by
 * its UUID path parameter.
 *
 * PATCH → Update mutable fields (currently just `status`) on an
 *         existing ticket row and return the modified record.
 */

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ApiResponse, Ticket, TicketStatus } from '@/types'

// ── Allowed status values for validation ─────────────────────

const VALID_STATUSES: ReadonlySet<TicketStatus> = new Set([
  'new',
  'in_progress',
  'resolved',
])

// ── PATCH /api/tickets/[id] ──────────────────────────────────
// Reads the ticket UUID from the dynamic route segment.
// Accepts a JSON body with `{ status: TicketStatus }`.
// Runs an UPDATE against the Supabase tickets table, sets
// `updated_at` to now(), and returns the patched row.

interface PatchTicketBody {
  status: TicketStatus
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Ticket>>> {
  const { id } = await params

  if (!supabase) {
    return NextResponse.json(
      { data: null, error: 'Supabase client is not configured. Check your environment variables.' },
      { status: 503 }
    )
  }

  let body: PatchTicketBody

  try {
    body = (await request.json()) as PatchTicketBody
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  // Validate the incoming status value
  if (!body.status || !VALID_STATUSES.has(body.status)) {
    return NextResponse.json(
      {
        data: null,
        error: `Invalid status value. Must be one of: ${[...VALID_STATUSES].join(', ')}.`,
      },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('tickets')
    .update({
      status: body.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { data: null, error: `No ticket found with id "${id}".` },
      { status: 404 }
    )
  }

  return NextResponse.json(
    { data: data as Ticket, error: null },
    { status: 200 }
  )
}
