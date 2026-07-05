/**
 * mock-data.ts
 *
 * Realistic mock dataset for the dashboard UI (Phase 1).
 * Each ticket mirrors the Supabase `tickets` table schema exactly.
 * This file lives inside the dashboard module because only the
 * dashboard consumes it — it will be removed once Supabase is wired.
 */

import type { Ticket } from "@/types";

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    created_at: "2026-06-30T08:14:00Z",
    updated_at: "2026-06-30T08:14:00Z",
    customer_email: "dev.ops@acmestartup.io",
    message_body:
      "Our production deployment is failing with a 502 Bad Gateway error whenever we hit the /api/v2/inventory endpoint under load. We've scaled horizontally to 4 instances but the bottleneck seems to be at the API gateway layer. This is blocking our entire fulfilment pipeline — over 200 orders are stuck in limbo right now. We need an immediate resolution or a workaround within the hour.",
    category: "technical",
    urgency: "high",
    ai_draft_reply:
      "Thank you for reporting this, and I understand the urgency given the impact on your fulfilment pipeline.\n\nOur engineering team is investigating the 502 errors on the /api/v2/inventory endpoint right now. Initial analysis suggests the API gateway's connection pool is saturating under concurrent load across your 4 instances.\n\nAs an immediate workaround, please try enabling request queuing on your gateway configuration (set MAX_CONCURRENT_REQUESTS=150). We'll provide a permanent fix within the next 2 hours.\n\nI'll keep you updated every 30 minutes until this is fully resolved.",
    ai_model: "llama3-8b-8192",
    status: "new",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    created_at: "2026-06-29T15:42:00Z",
    updated_at: "2026-06-30T09:10:00Z",
    customer_email: "sarah.chen@brightsideclinic.com",
    message_body:
      "I just received invoice #INV-2026-0884 for $349.00 but my subscription plan is the Starter tier at $149/month. It looks like I've been double-charged for the analytics add-on that I cancelled back in April. I have the cancellation confirmation email (ref: CXL-04182026). Please issue a refund for the $200 overcharge and correct my billing going forward.",
    category: "billing",
    urgency: "medium",
    ai_draft_reply:
      "Hi Sarah,\n\nThank you for bringing this to our attention, and I apologise for the billing discrepancy.\n\nI've located your cancellation confirmation (ref: CXL-04182026) and can confirm the analytics add-on should have been removed from your subscription in April. I'm processing a refund of $200.00 to your card on file — please allow 5–7 business days for it to appear.\n\nI've also updated your billing profile to reflect only the Starter tier at $149/month going forward. You'll receive a corrected invoice by email shortly.\n\nPlease don't hesitate to reach out if you have any further questions.",
    ai_model: "llama3-8b-8192",
    status: "in_progress",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    created_at: "2026-06-28T11:05:00Z",
    updated_at: "2026-06-28T11:05:00Z",
    customer_email: "mike.johnson@urbanpetshop.com",
    message_body:
      "Hi there! I was wondering what your holiday hours look like for the upcoming long weekend (July 4th). We're planning a big pet adoption event at our shop and want to coordinate with your delivery schedule so the supplies arrive on time. Also, do you offer any bulk discount for orders over 50 units? Thanks!",
    category: "general",
    urgency: "low",
    ai_draft_reply:
      "Hi Mike,\n\nGreat to hear about the pet adoption event — sounds wonderful!\n\nFor the July 4th weekend, our hours are:\n• Friday, July 3rd: 8 AM – 5 PM (regular)\n• Saturday, July 4th: Closed\n• Sunday, July 5th: Closed\n• Monday, July 6th: 8 AM – 5 PM (regular)\n\nTo ensure your supplies arrive before the weekend, I'd recommend placing your order by Wednesday, July 1st for guaranteed Friday delivery.\n\nRegarding bulk pricing — yes, we offer a 12% discount on orders of 50+ units. I'll send over a custom quote if you share the specific items you need.\n\nLooking forward to helping make your event a success!",
    ai_model: "llama3-8b-8192",
    status: "new",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    created_at: "2026-06-27T09:30:00Z",
    updated_at: "2026-06-29T14:22:00Z",
    customer_email: "rachel.kumar@greenleafcatering.co",
    message_body:
      "I'm extremely disappointed with the service we received last Thursday. We ordered catering supplies for a 150-person corporate event, and the delivery arrived 3 hours late with several items missing (the full chafing dish set and 4 cases of napkins). We had to scramble to find replacements at the last minute which cost us an additional $380 out of pocket. This level of service is completely unacceptable for what we're paying. I expect a full explanation and compensation.",
    category: "complaint",
    urgency: "high",
    ai_draft_reply:
      "Dear Rachel,\n\nI sincerely apologise for the experience you had with your order for the corporate event. Late and incomplete deliveries are absolutely not the standard we hold ourselves to, and I understand how stressful this must have been.\n\nI've escalated this to our logistics manager for a full investigation into what went wrong. Here's what I'm doing right now:\n\n1. Issuing a credit of $380.00 to cover your out-of-pocket replacement costs\n2. Applying a 25% discount to your next order as a goodwill gesture\n3. Assigning a dedicated account coordinator to your future orders to prevent recurrence\n\nYou'll receive the credit confirmation within 24 hours. I'll also follow up personally with the investigation findings by end of week.\n\nThank you for your patience, and again, I'm sorry we let you down.",
    ai_model: "llama3-8b-8192",
    status: "resolved",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    created_at: "2026-06-30T06:55:00Z",
    updated_at: "2026-06-30T06:55:00Z",
    customer_email: "t.williams@nexgendigital.agency",
    message_body:
      "We're getting intermittent SSL handshake failures on our custom domain (app.nexgendigital.agency) since this morning. The cert was auto-renewed 2 days ago but some requests are still hitting the old expired certificate. Our clients are seeing browser security warnings and it's damaging our credibility. This is urgent — we're a digital agency and our own website can't look insecure.",
    category: "technical",
    urgency: "high",
    ai_draft_reply:
      "Hi there,\n\nI understand how critical this is — security warnings on an agency website directly impact client trust.\n\nThe intermittent SSL issue you're describing is consistent with a stale certificate cached at the CDN edge nodes. Here's what I'm doing:\n\n1. Forcing a global cache purge of the old SSL certificate across all edge locations (this typically propagates within 15–20 minutes)\n2. Verifying the renewed certificate chain is correctly installed with no intermediate cert gaps\n3. Running a full SSL diagnostic on app.nexgendigital.agency to confirm proper HTTPS handshake\n\nYou should see the warnings disappear within 30 minutes. I'll reply here with the diagnostic results as soon as the purge completes.\n\nIn the meantime, you can verify the fix on your end by running: curl -vI https://app.nexgendigital.agency",
    ai_model: "llama3-8b-8192",
    status: "new",
  },
  {
    id: "f6a7b8c9-d0e1-2345-fabc-456789012345",
    created_at: "2026-06-29T18:20:00Z",
    updated_at: "2026-06-30T10:05:00Z",
    customer_email: "lisa.park@sunrisemedispa.com",
    message_body:
      "Hi, I noticed that my monthly subscription was charged twice this month — once on June 1st and again on June 15th. The second charge of $79 wasn't authorised. I'd also like to know if it's possible to switch my billing cycle from the 1st to the 15th of each month going forward, since that aligns better with our accounting period. Thanks for looking into this.",
    category: "billing",
    urgency: "medium",
    ai_draft_reply:
      "Hi Lisa,\n\nThank you for flagging the duplicate charge — I've confirmed that the $79 charge on June 15th was indeed a system error and not an authorised transaction.\n\nI've initiated a refund for the duplicate charge. Please allow 5–7 business days for it to reflect on your statement.\n\nRegarding switching your billing cycle to the 15th — absolutely, I can do that for you. Starting next month, your subscription will be billed on the 15th. Your July charge will be prorated to cover the period from July 1st to July 15th, and then full monthly billing resumes from the 15th onward.\n\nI'll send you a confirmation email once both changes have been processed. Let me know if you have any other questions!",
    ai_model: "llama3-8b-8192",
    status: "in_progress",
  },
];
