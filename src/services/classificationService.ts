import { generateClassification } from "@/modules/dashboard/lib/agentClient";
import { createTicketInDb } from "./ticketDbService";
import type { Ticket, TicketCategory, TicketUrgency } from "@/types";

interface ParsedResult {
  category: TicketCategory;
  urgency: TicketUrgency;
  ai_draft_reply: string;
}

/**
 * Safely cleans up the raw model text and parses it to JSON.
 * Falls back to default values and heuristic extraction if JSON is malformed.
 */
export function cleanAndParseResponse(rawText: string): ParsedResult {
  let cleaned = rawText.trim();

  // Strip markdown code blocks if the model wrapped it in ```json ... ``` or similar
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  cleaned = cleaned.trim();

  try {
    const parsed = JSON.parse(cleaned);

    // Validate classification fields against known union types
    const validCategories: TicketCategory[] = [
      "billing",
      "technical",
      "complaint",
      "general",
    ];
    const validUrgencies: TicketUrgency[] = ["low", "medium", "high"];

    const category = validCategories.includes(parsed.category)
      ? (parsed.category as TicketCategory)
      : "general";

    const urgency = validUrgencies.includes(parsed.urgency)
      ? (parsed.urgency as TicketUrgency)
      : "medium";

    const ai_draft_reply =
      typeof parsed.ai_draft_reply === "string" &&
      parsed.ai_draft_reply.trim().length > 0
        ? parsed.ai_draft_reply.trim()
        : "Thank you for reaching out. We have received your message and will review it shortly.";

    return { category, urgency, ai_draft_reply };
  } catch (error) {
    console.error(
      "Failed to parse AI classification response. Raw text:",
      rawText,
      "Error:",
      error,
    );

    // Secondary fallback heuristics if JSON parsing fails completely
    let category: TicketCategory = "general";
    let urgency: TicketUrgency = "medium";
    const lowerText = cleaned.toLowerCase();

    if (
      lowerText.includes("billing") ||
      lowerText.includes("invoice") ||
      lowerText.includes("charge") ||
      lowerText.includes("refund") ||
      lowerText.includes("payment") ||
      lowerText.includes("price")
    ) {
      category = "billing";
    } else if (
      lowerText.includes("bug") ||
      lowerText.includes("login") ||
      lowerText.includes("error") ||
      lowerText.includes("technical") ||
      lowerText.includes("broken") ||
      lowerText.includes("fail")
    ) {
      category = "technical";
    } else if (
      lowerText.includes("angry") ||
      lowerText.includes("terrible") ||
      lowerText.includes("cancel") ||
      lowerText.includes("complain") ||
      lowerText.includes("worst") ||
      lowerText.includes("dissatisfied")
    ) {
      category = "complaint";
    }

    if (
      lowerText.includes("urgent") ||
      lowerText.includes("downtime") ||
      lowerText.includes("high") ||
      lowerText.includes("critical") ||
      lowerText.includes("immediately")
    ) {
      urgency = "high";
    } else if (
      lowerText.includes("low") ||
      lowerText.includes("request") ||
      lowerText.includes("idea") ||
      lowerText.includes("suggestion")
    ) {
      urgency = "low";
    }

    return {
      category,
      urgency,
      ai_draft_reply:
        "Thank you for contacting support. We have received your message and our team is looking into it.",
    };
  }
}

/**
 * High-level orchestration for message classification.
 * Runs AI analysis, cleans/parses the model response,
 * and saves the generated ticket to the Supabase database.
 */
export async function classifyAndSaveTicket(
  message: string,
  customerEmail?: string,
): Promise<Ticket> {
  const modelUsed = process.env.AI_MODEL || "openai/gpt-oss-20b";

  // Generate raw response from AI provider
  const rawResult = await generateClassification(message);

  // Clean and parse the response into structured fields
  const { category, urgency, ai_draft_reply } =
    cleanAndParseResponse(rawResult);

  // Save the classified ticket to the Supabase tickets table
  return await createTicketInDb({
    customer_email: customerEmail ?? null,
    message_body: message,
    category,
    urgency,
    ai_draft_reply,
    ai_model: modelUsed,
  });
}
