"use client";

import { X, Sparkles, Copy, MessageSquare, Loader2 } from "lucide-react";
import {
  Button,
  Input,
  CategoryBadge,
  UrgencyBadge,
  StatusBadge,
  Separator,
} from "@/components/base";
import { cn } from "@/lib/utils";
import { useSlidePanel } from "../../hooks/useSlidePanel";
import "./SlidePanel.css";
import type { SlidePanelProps } from "./SlidePanelTypes";
import type { TicketStatus } from "@/types";

// ── Constants ────────────────────────────────────────────────
const STATUS_OPTIONS: Array<{ value: TicketStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export function SlidePanel({ className }: SlidePanelProps) {
  const {
    isPanelOpen,
    isCreateMode,
    ticket,
    draftReply,
    setDraftReply,
    copied,
    textareaRef,
    createEmail,
    setCreateEmail,
    createMessage,
    setCreateMessage,
    isAnalysing,
    analysisError,
    handleClose,
    handleCopy,
    handleStatusChange,
    handleRunAnalysis,
  } = useSlidePanel();

  if (!isPanelOpen) return null;

  return (
    <>
      <div
        className="slide-panel-overlay animate-overlay-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      <aside
        className={cn("slide-panel animate-panel-in", className)}
        role="dialog"
        aria-label={ticket ? "Ticket details" : "Process new message"}
      >
        <div className="slide-panel-header">
          <span className="slide-panel-header-id">
            {ticket ? `Ticket ${ticket.id.slice(0, 8)}\u2026` : "New Message"}
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
                {ticket.customer_email ?? "Anonymous"}
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
                style={{ width: "100%" }}
              >
                {copied ? "Copied!" : "Copy Reply"}
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
                  <p className="slide-panel-create-title">
                    Process New Message
                  </p>
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
                <label
                  htmlFor="create-message"
                  className="slide-panel-section-label"
                >
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

              {analysisError && (
                <div className="p-3 text-xs rounded-md bg-urgency-high-bg text-urgency-high-text border border-urgency-high-text/20">
                  {analysisError}
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                leftIcon={
                  isAnalysing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )
                }
                onClick={handleRunAnalysis}
                disabled={!createMessage.trim() || isAnalysing}
                style={{ width: "100%" }}
              >
                {isAnalysing ? "Analysing…" : "Run AI Analysis"}
              </Button>
            </div>
          ) : (
            /* ── Fallback empty state (shouldn't normally appear) */
            <div className="slide-panel-empty">
              <MessageSquare size={48} className="slide-panel-empty-icon" />
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--font-weight-semibold)",
                  color: "var(--color-text-primary)",
                }}
              >
                No ticket selected
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
