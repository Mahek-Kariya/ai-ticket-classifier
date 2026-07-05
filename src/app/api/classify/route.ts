import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { classifyAndSaveTicket } from "@/services/classificationService";
import type { ApiResponse, Ticket } from "@/types";

interface ClassifyRequestBody {
  message: string;
  customer_email?: string;
}

/**
 * POST /api/classify
 * Accepts { message, customer_email }
 * Classifies the support message and saves the resulting ticket to the Supabase tickets table.
 *
 * This handler is a thin controller delegating to classificationService.
 */
export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse<Ticket>>> {
  // Check if Supabase is configured
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

  let body: ClassifyRequestBody;

  try {
    body = (await request.json()) as ClassifyRequestBody;
  } catch {
    return NextResponse.json(
      { data: null, error: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  // Validate request parameters
  if (!body.message || typeof body.message !== "string") {
    return NextResponse.json(
      { data: null, error: "message is required and must be a string." },
      { status: 400 },
    );
  }

  try {
    const savedTicket = await classifyAndSaveTicket(
      body.message,
      body.customer_email,
    );

    return NextResponse.json(
      { data: savedTicket, error: null },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Classification error:", error);
    const errMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during classification.";
    return NextResponse.json(
      { data: null, error: errMessage },
      { status: 500 },
    );
  }
}
