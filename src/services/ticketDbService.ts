import { supabase } from "@/lib/supabase";
import type { Ticket, TicketStatus } from "@/types";

/**
 * Fetches all tickets from the Supabase database, ordered newest first.
 * Throws an error if Supabase is unconfigured or if the query fails.
 */
export async function getTicketsFromDb(): Promise<Ticket[]> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Ticket[];
}

/**
 * Inserts a new ticket record into the Supabase database.
 * Throws an error if Supabase is unconfigured or if the insert fails.
 */
export async function createTicketInDb(params: {
  customer_email: string | null;
  message_body: string;
  category: Ticket["category"];
  urgency: Ticket["urgency"];
  ai_draft_reply: string;
  ai_model: string;
}): Promise<Ticket> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      customer_email: params.customer_email ?? null,
      message_body: params.message_body,
      category: params.category,
      urgency: params.urgency,
      ai_draft_reply: params.ai_draft_reply,
      ai_model: params.ai_model,
      status: "new" as const,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Ticket;
}

/**
 * Updates a single ticket's status in the Supabase database.
 * Throws an error if Supabase is unconfigured, if the update fails, or if no ticket is found.
 */
export async function updateTicketStatusInDb(
  id: string,
  status: TicketStatus,
): Promise<Ticket> {
  if (!supabase) {
    throw new Error("Supabase client is not configured.");
  }

  const { data, error } = await supabase
    .from("tickets")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(`No ticket found with id "${id}".`);
  }

  return data as Ticket;
}
