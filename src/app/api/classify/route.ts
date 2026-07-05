import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateClassification } from '@/utils/agentClient'
import type { ApiResponse, Ticket, TicketCategory, TicketUrgency } from '@/types'

interface ClassifyRequestBody {
  message: string
  customer_email?: string
}

interface ParsedResult {
  category: TicketCategory
  urgency: TicketUrgency
  ai_draft_reply: string
}

/**
 * Safely cleans up the raw model text and parses it to JSON.
 * Falls back to default values and heuristic extraction if JSON is malformed.
 */
function cleanAndParseResponse(rawText: string): ParsedResult {
  let cleaned = rawText.trim()
  
  // Strip markdown code blocks if the model wrapped it in ```json ... ``` or similar
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  }
  
  cleaned = cleaned.trim()

  try {
    const parsed = JSON.parse(cleaned)
    
    // Validate classification fields against known union types
    const validCategories: TicketCategory[] = ['billing', 'technical', 'complaint', 'general']
    const validUrgencies: TicketUrgency[] = ['low', 'medium', 'high']

    const category = validCategories.includes(parsed.category) 
      ? (parsed.category as TicketCategory) 
      : 'general'

    const urgency = validUrgencies.includes(parsed.urgency) 
      ? (parsed.urgency as TicketUrgency) 
      : 'medium'

    const ai_draft_reply = typeof parsed.ai_draft_reply === 'string' && parsed.ai_draft_reply.trim().length > 0
      ? parsed.ai_draft_reply.trim()
      : 'Thank you for reaching out. We have received your message and will review it shortly.'

    return { category, urgency, ai_draft_reply }
  } catch (error) {
    console.error('Failed to parse AI classification response. Raw text:', rawText, 'Error:', error)
    
    // Secondary fallback heuristics if JSON parsing fails completely
    let category: TicketCategory = 'general'
    let urgency: TicketUrgency = 'medium'
    const lowerText = cleaned.toLowerCase()
    
    if (lowerText.includes('billing') || lowerText.includes('invoice') || lowerText.includes('charge') || lowerText.includes('refund') || lowerText.includes('payment') || lowerText.includes('price')) {
      category = 'billing'
    } else if (lowerText.includes('bug') || lowerText.includes('login') || lowerText.includes('error') || lowerText.includes('technical') || lowerText.includes('broken') || lowerText.includes('fail')) {
      category = 'technical'
    } else if (lowerText.includes('angry') || lowerText.includes('terrible') || lowerText.includes('cancel') || lowerText.includes('complain') || lowerText.includes('worst') || lowerText.includes('dissatisfied')) {
      category = 'complaint'
    }

    if (lowerText.includes('urgent') || lowerText.includes('downtime') || lowerText.includes('high') || lowerText.includes('critical') || lowerText.includes('immediately')) {
      urgency = 'high'
    } else if (lowerText.includes('low') || lowerText.includes('request') || lowerText.includes('idea') || lowerText.includes('suggestion')) {
      urgency = 'low'
    }

    return {
      category,
      urgency,
      ai_draft_reply: 'Thank you for contacting support. We have received your message and our team is looking into it.',
    }
  }
}

/**
 * POST /api/classify
 * Accepts { message, customer_email }
 * Classifies the support message and saves the resulting ticket to the Supabase tickets table.
 */
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<Ticket>>> {
  // Check if Supabase is configured
  if (!supabase) {
    return NextResponse.json(
      { data: null, error: 'Supabase client is not configured. Check your environment variables.' },
      { status: 503 }
    )
  }

  let body: ClassifyRequestBody

  try {
    body = (await request.json()) as ClassifyRequestBody
  } catch {
    return NextResponse.json(
      { data: null, error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  // Validate request parameters
  if (!body.message || typeof body.message !== 'string') {
    return NextResponse.json(
      { data: null, error: 'message is required and must be a string.' },
      { status: 400 }
    )
  }

  const modelUsed = process.env.AI_MODEL || 'llama3-8b-8192'

  try {
    // Generate raw response from AI provider
    const rawResult = await generateClassification(body.message)
    
    // Clean and parse the response into structured fields
    const { category, urgency, ai_draft_reply } = cleanAndParseResponse(rawResult)

    // Save the classified ticket to the Supabase tickets table
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        customer_email: body.customer_email ?? null,
        message_body: body.message,
        category,
        urgency,
        ai_draft_reply,
        ai_model: modelUsed,
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
  } catch (error: any) {
    console.error('Classification error:', error)
    return NextResponse.json(
      { data: null, error: error.message || 'An unexpected error occurred during classification.' },
      { status: 500 }
    )
  }
}
