import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'

const CLASSIFICATION_SYSTEM_PROMPT = `You are an expert AI customer support assistant.
Your job is to analyze an incoming customer support message and classify it with 100% precision.

You must output a single, valid JSON object and absolutely nothing else.
Do NOT wrap your response in markdown code blocks (like \`\`\`json or \`\`\`).
Do NOT include any explanations, greetings, or trailing notes.
The response must be pure JSON that can be parsed directly.

The JSON object must contain exactly these three keys:
1. "category": Must be one of:
   - "billing": For pricing, invoices, subscription changes, payment failures, refunds, or billing queries.
   - "technical": For bugs, error messages, login issues, app downtime, API issues, integration problems, or product configuration.
   - "complaint": For angry customers, severe dissatisfaction, cancellation threats, bad user experience reports, or escalation requests.
   - "general": For routine questions, product feedback, new feature requests, partnership inquiries, greetings, or unspecified topics.

2. "urgency": Must be one of:
   - "high": Critical issues like system outages/downtime, double-billing, security/privacy concerns, or highly angry customers making cancellation/legal threats.
   - "medium": Active bugs, billing discrepancies that don't block operations, or mildly frustrated queries.
   - "low": Feature requests, general queries, thank you notes, or questions with no operational urgency.

3. "ai_draft_reply": A professional, empathetic draft reply to the customer.
   Follow these drafting rules strictly:
   - Match the customer's sentiment. If they are angry (high urgency/complaint), validate their frustration, apologize sincerely, and outline clear next steps without being defensive.
   - If the message is vague, write a polite reply acknowledging their query and asking specific clarifying questions to gather necessary details.
   - Do NOT include placeholders (e.g. [Your Name], [Company Name]). Write a complete draft. Sign off as "Customer Support Team".
   - Keep the reply concise and professional.

Example output:
{
  "category": "technical",
  "urgency": "medium",
  "ai_draft_reply": "Hello, thank you for reporting this issue. We apologize for the inconvenience caused by the app loading error. Our engineering team is currently investigating, and we will update you as soon as we have a resolution. If you have any further details to share, please let us know."
}`

/**
 * Generates classification and draft reply text for a customer message.
 * Calls Groq dynamically based on configured environment variables.
 *
 * @param message The customer support message.
 * @returns The raw string response from the model.
 */
export async function generateClassification(message: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY
  const baseURL = process.env.AI_BASE_URL
  const modelName = process.env.AI_MODEL

  if (!modelName) {
    throw new Error('AI_MODEL environment variable is not defined')
  }

  // Create the Groq provider dynamically using env vars
  const groq = createGroq({
    apiKey,
    baseURL,
  })

  // Call the text generator
  const { text } = await generateText({
    model: groq(modelName),
    system: CLASSIFICATION_SYSTEM_PROMPT,
    prompt: message,
  })

  return text
}
