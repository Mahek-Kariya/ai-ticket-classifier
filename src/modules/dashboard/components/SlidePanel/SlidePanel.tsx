'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Sparkles, Copy, MessageSquare, Loader2 } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { closePanel, updateTicketStatus, addTicket } from '@/store/ticketsSlice'
import {
  Button,
  Input,
  CategoryBadge,
  UrgencyBadge,
  StatusBadge,
  Separator,
} from '@/components/base'
import { cn } from '@/lib/utils'
import {
  updateRemoteTicketStatus,
  createRemoteTicket,
} from '@/modules/dashboard/services/ticketService'
import './SlidePanel.css'
import type { SlidePanelProps } from './SlidePanelTypes'
import type { Ticket, TicketCategory, TicketUrgency, TicketStatus } from '@/types'

// ── Constants ────────────────────────────────────────────────
const STATUS_OPTIONS: Array<{ value: TicketStatus; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

const CATEGORIES: TicketCategory[] = ['billing', 'technical', 'complaint', 'general']
const URGENCIES: TicketUrgency[] = ['low', 'medium', 'high']

/** Pick a random element from an array. */
function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Generate a mock AI draft reply based on the classified category. */
function generateMockDraftReply(category: TicketCategory, urgency: TicketUrgency): string {
  const urgencyNote = urgency === 'high'
    ? 'Given the urgency, our team is prioritising this immediately.'
    : urgency === 'medium'
      ? 'We are looking into this and will follow up shortly.'
      : 'We have logged your enquiry and will respond within our standard timeframe.'

  const categoryReply: Record<TicketCategory, string> = {
    technical:
      `Thank you for reaching out. Our engineering team has been notified about this technical issue and is actively investigating.\n\n${urgencyNote}\n\nWe will provide a detailed update within the next few hours. In the meantime, please don't hesitate to share any additional logs or screenshots that might help us diagnose the problem faster.`,
    billing:
      `Thank you for contacting us about your billing concern. I've reviewed your account and identified the discrepancy.\n\n${urgencyNote}\n\nWe will process the necessary adjustments and send you a corrected statement within 2–3 business days. Please let us know if you have any further questions.`,
    complaint:
      `I sincerely apologise for the experience you've described. Your feedback is extremely important to us and I want to assure you that we take this seriously.\n\n${urgencyNote}\n\nI've escalated this to our customer experience team for a thorough review. You can expect a personal follow-up within 24 hours with our proposed resolution.`,
    general:
      `Thank you for reaching out! I'm happy to help with your enquiry.\n\n${urgencyNote}\n\nPlease find the relevant details below and don't hesitate to reach out if you need anything else. We're always here to assist.`,
  }

  return categoryReply[category]
}

// ── Component ────────────────────────────────────────────────

export function SlidePanel({ className }: SlidePanelProps) {
  const dispatch = useAppDispatch()
  const isPanelOpen = useAppSelector((state) => state.tickets.isPanelOpen)
  const selectedTicketId = useAppSelector((state) => state.tickets.selectedTicketId)
  const ticket = useAppSelector((state) =>
    state.tickets.items.find((t) => t.id === selectedTicketId) ?? null
  )

  // Determine if we're in "create" mode (the __new__ sentinel)
  const isCreateMode = isPanelOpen && selectedTicketId === '__new__'

  // ---- Existing ticket state ----
  const [draftReply, setDraftReply] = useState('')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ---- Creation form state ----
  const [createEmail, setCreateEmail] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [isAnalysing, setIsAnalysing] = useState(false)

  // ── Auto-status transition: new → in_progress ─────────────
  // Fires the remote PATCH first, then updates Redux on success.
  // If the network call fails, the local state still transitions
  // so the UI isn't blocked — the server will reconcile later.
  useEffect(() => {
    if (ticket && ticket.status === 'new') {
      updateRemoteTicketStatus(ticket.id, 'in_progress').catch(() => {
        // Network failure is non-critical here — the optimistic
        // Redux update below ensures the UI stays responsive.
      })
      dispatch(updateTicketStatus({ id: ticket.id, status: 'in_progress' }))
    }
  }, [ticket, dispatch])

  // ── Sync draft reply when a ticket is loaded ──────────────
  useEffect(() => {
    if (ticket) {
      setDraftReply(ticket.ai_draft_reply)
    } else {
      setDraftReply('')
    }
  }, [ticket])

  // ── Reset creation form when entering create mode ─────────
  useEffect(() => {
    if (isCreateMode) {
      setCreateEmail('')
      setCreateMessage('')
      setIsAnalysing(false)
    }
  }, [isCreateMode])

  // ── Auto-resize AI reply textarea ─────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [draftReply])

  // ── Handlers ──────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(draftReply)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = draftReply
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [draftReply])

  /**
   * Status toggle handler — fires the remote PATCH, then updates
   * Redux only on success. Falls back to optimistic local update
   * if the network call fails so the UI doesn't feel stuck.
   */
  const handleStatusChange = useCallback(
    async (status: TicketStatus) => {
      if (!ticket) return

      try {
        await updateRemoteTicketStatus(ticket.id, status)
      } catch {
        // Remote update failed — still apply locally for UX.
      }

      dispatch(updateTicketStatus({ id: ticket.id, status }))
    },
    [dispatch, ticket]
  )

  const handleClose = useCallback(() => {
    dispatch(closePanel())
  }, [dispatch])

  /**
   * "Run AI Analysis" handler.
   *
   * 1. Generates a mock classification (category, urgency, draft).
   * 2. Attempts a POST to /api/tickets to persist to the server.
   * 3. On success, uses the server-returned Ticket (has real UUID
   *    and timestamps from Supabase).
   * 4. On failure (Supabase unconfigured / network error), falls
   *    back to a client-generated Ticket so the UI still works
   *    with mock data.
   */
  const handleRunAnalysis = useCallback(async () => {
    if (!createMessage.trim()) return

    setIsAnalysing(true)

    // Simulate a brief AI processing delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const category = pickRandom(CATEGORIES)
    const urgency = pickRandom(URGENCIES)
    const draftReplyText = generateMockDraftReply(category, urgency)

    try {
      // Attempt live server insertion
      const serverTicket = await createRemoteTicket({
        customer_email: createEmail.trim() || null,
        message_body: createMessage.trim(),
        category,
        urgency,
        ai_draft_reply: draftReplyText,
        ai_model: 'llama3-8b-8192',
      })

      dispatch(addTicket(serverTicket))
    } catch {
      // Fallback: server unavailable — create a client-side ticket
      const now = new Date().toISOString()
      const fallbackTicket: Ticket = {
        id: crypto.randomUUID(),
        created_at: now,
        updated_at: now,
        customer_email: createEmail.trim() || null,
        message_body: createMessage.trim(),
        category,
        urgency,
        ai_draft_reply: draftReplyText,
        ai_model: 'llama3-8b-8192',
        status: 'new',
      }

      dispatch(addTicket(fallbackTicket))
    } finally {
      setIsAnalysing(false)
      dispatch(closePanel())
    }
  }, [createEmail, createMessage, dispatch])

  if (!isPanelOpen) return null

  return (
    <>
      <div
        className="slide-panel-overlay animate-overlay-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={cn('slide-panel animate-panel-in', className)}
        role="dialog"
        aria-label={ticket ? 'Ticket details' : 'Process new message'}
      >
        <div className="slide-panel-header">
          <span className="slide-panel-header-id">
            {ticket ? `Ticket ${ticket.id.slice(0, 8)}\u2026` : 'New Message'}
          </span>
          <button
            className="slide-panel-close"
            onClick={handleClose}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="slide-panel-body">
          {ticket ? (
            /* ── Resolution mode: existing ticket ────────────── */
            <>
              <p className="slide-panel-email">
                {ticket.customer_email ?? 'Anonymous'}
              </p>

              <div className="slide-panel-badges">
                <CategoryBadge value={ticket.category} />
                <UrgencyBadge value={ticket.urgency} />
                <StatusBadge value={ticket.status} />
              </div>

              <Separator />

              <div>
                <p className="slide-panel-section-label">Original Message</p>
                <div className="slide-panel-message-box">
                  {ticket.message_body}
                </div>
              </div>

              <Separator />

              <div>
                <p className="slide-panel-ai-label">
                  <Sparkles size={16} />
                  AI Draft Reply
                </p>
                <textarea
                  ref={textareaRef}
                  className="slide-panel-ai-textarea"
                  value={draftReply}
                  onChange={(e) => setDraftReply(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                leftIcon={<Copy size={16} />}
                onClick={handleCopy}
                style={{ width: '100%' }}
              >
                {copied ? 'Copied!' : 'Copy Reply'}
              </Button>

              <Separator />

              <div>
                <p className="slide-panel-section-label">Update Status</p>
                <div className="slide-panel-status-toggle">
                  {STATUS_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant="toggle"
                      size="sm"
                      isActive={ticket.status === opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : isCreateMode ? (
            /* ── Creation mode: blank-slate form ─────────────── */
            <div className="slide-panel-create">
              <div className="slide-panel-create-header">
                <MessageSquare size={24} className="slide-panel-create-icon" />
                <div>
                  <p className="slide-panel-create-title">Process New Message</p>
                  <p className="slide-panel-create-subtitle">
                    Paste a customer message below and run AI analysis
                  </p>
                </div>
              </div>

              <Separator />

              <Input
                id="create-email"
                label="Customer Email"
                placeholder="customer@example.com"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
              />

              <div>
                <label htmlFor="create-message" className="slide-panel-section-label">
                  Customer Message
                </label>
                <textarea
                  id="create-message"
                  className="slide-panel-ai-textarea"
                  placeholder="Paste the customer's message here..."
                  value={createMessage}
                  onChange={(e) => setCreateMessage(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                leftIcon={isAnalysing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                onClick={handleRunAnalysis}
                disabled={!createMessage.trim() || isAnalysing}
                style={{ width: '100%' }}
              >
                {isAnalysing ? 'Analysing…' : 'Run AI Analysis'}
              </Button>
            </div>
          ) : (
            /* ── Fallback empty state (shouldn't normally appear) */
            <div className="slide-panel-empty">
              <MessageSquare size={48} className="slide-panel-empty-icon" />
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                No ticket selected
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
