import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  closePanel,
  updateTicketStatus,
  addTicket,
  openPanel,
} from "@/store/ticketsSlice";
import { updateRemoteTicketStatus } from "../services/ticketService";
import type { TicketStatus, ApiResponse, Ticket } from "@/types";

/**
 * Custom hook to encapsulate the SlidePanel state and behavior, including
 * copy-to-clipboard, status transitions, keyboard navigation, and AI classification.
 */
export function useSlidePanel() {
  const dispatch = useAppDispatch();
  const isPanelOpen = useAppSelector((state) => state.tickets.isPanelOpen);
  const selectedTicketId = useAppSelector(
    (state) => state.tickets.selectedTicketId,
  );
  const ticket = useAppSelector(
    (state) =>
      state.tickets.items.find((t) => t.id === selectedTicketId) ?? null,
  );

  const isCreateMode = isPanelOpen && selectedTicketId === "__new__";

  // ---- Existing ticket state ----
  const [draftReply, setDraftReply] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---- Creation form state ----
  const [createEmail, setCreateEmail] = useState("");
  const [createMessage, setCreateMessage] = useState("");
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Close handler
  const handleClose = useCallback(() => {
    dispatch(closePanel());
  }, [dispatch]);

  // ── Auto-status transition: new → in_progress ─────────────
  useEffect(() => {
    if (ticket && ticket.status === "new") {
      updateRemoteTicketStatus(ticket.id, "in_progress").catch(() => {
        // Network failure is non-critical here — the optimistic
        // Redux update below ensures the UI stays responsive.
      });
      dispatch(updateTicketStatus({ id: ticket.id, status: "in_progress" }));
    }
  }, [ticket, dispatch]);

  // ── Sync draft reply when a ticket is loaded ──────────────
  useEffect(() => {
    if (ticket) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraftReply(ticket.ai_draft_reply);
    } else {
      setDraftReply("");
    }
  }, [ticket]);

  // ── Reset creation form when entering create mode ─────────
  useEffect(() => {
    if (isCreateMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCreateEmail("");
      setCreateMessage("");
      setIsAnalysing(false);
      setAnalysisError(null);
    }
  }, [isCreateMode]);

  // ── Auto-resize AI reply textarea ─────────────────────────
  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [draftReply]);

  // ── Keyboard: Escape to close ──────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (isPanelOpen) {
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
  }, [isPanelOpen, handleClose]);

  // ── Handlers ──────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(draftReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = draftReply;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [draftReply]);

  const handleStatusChange = useCallback(
    async (status: TicketStatus) => {
      if (!ticket) return;

      try {
        await updateRemoteTicketStatus(ticket.id, status);
      } catch {
        // Remote update failed — still apply locally for UX.
      }

      dispatch(updateTicketStatus({ id: ticket.id, status }));
    },
    [dispatch, ticket],
  );

  const handleRunAnalysis = useCallback(async () => {
    if (!createMessage.trim()) return;

    setIsAnalysing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: createMessage.trim(),
          customer_email: createEmail.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData?.error || `Server returned status ${response.status}`,
        );
      }

      const result: ApiResponse<Ticket> = await response.json();
      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to classify message.");
      }

      const serverTicket = result.data;

      // Add to Redux store so the dashboard updates
      dispatch(addTicket(serverTicket));

      // Transition slide panel to show the newly created ticket
      dispatch(openPanel(serverTicket.id));
    } catch (error: unknown) {
      console.error("AI Analysis failed:", error);
      const errMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during analysis.";
      setAnalysisError(errMessage);
    } finally {
      setIsAnalysing(false);
    }
  }, [createEmail, createMessage, dispatch]);

  return {
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
  };
}
