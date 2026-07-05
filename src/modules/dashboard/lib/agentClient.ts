import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { getClassificationPrompt } from "./systemPrompts";

/**
 * Generates classification and draft reply text for a customer message.
 * Calls Groq dynamically based on configured environment variables.
 *
 * @param message The customer support message.
 * @returns The raw string response from the model.
 */
export async function generateClassification(message: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;
  const modelName = process.env.AI_MODEL;

  if (!modelName) {
    throw new Error("AI_MODEL environment variable is not defined");
  }

  // Create the Groq provider dynamically using env vars
  const groq = createGroq({
    apiKey,
    baseURL,
  });

  // Call the text generator using the system prompt from the builder function
  const { text } = await generateText({
    model: groq(modelName),
    system: getClassificationPrompt(),
    prompt: message,
  });

  return text;
}
