"use client";

/**
 * DashboardModule.tsx
 *
 * Single entry point for the dashboard feature module.
 * Composes HeroBanner, StatCards, TicketLedger, and SlidePanel
 * into the full-page layout described in AGENTS.md Section 7.
 *
 * On mount, fetches live ticket data from the API via the
 * ticketService layer and hydrates the Redux store. Renders a
 * premium skeleton layout while the data is in flight.
 *
 * Layout order (top → bottom):
 *   1. Top nav bar (56px, white)
 *   2. HeroBanner (violet gradient)
 *   3. StatCards (overlapping hero bottom by ~40px)
 *   4. Page action row ("Support Tickets" + "+ Process New Message")
 *   5. TicketLedger (full-width white card)
 *   6. SlidePanel (conditional overlay from right)
 */

import { useCallback, useEffect, useMemo } from "react";
import { Sparkles, Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  openPanel,
  setTickets,
  setLoading,
  setError,
} from "@/store/ticketsSlice";
import {
  Button,
  Skeleton,
  SkeletonStatCard,
  SkeletonTableRow,
} from "@/components/base";

import "./DashboardModule.css";

import { HeroBanner } from "./components/HeroBanner";
import { StatCards } from "./components/StatCards";
import { TicketLedger } from "./components/TicketLedger";
import { SlidePanel } from "./components/SlidePanel";
import { fetchDashboardTickets } from "./services/ticketService";

export default function DashboardModule() {
  const dispatch = useAppDispatch();
  const isPanelOpen = useAppSelector((state) => state.tickets.isPanelOpen);
  const isLoading = useAppSelector((state) => state.tickets.isLoading);
  const loadError = useAppSelector((state) => state.tickets.error);
  const tickets = useAppSelector((state) => state.tickets.items);

  // Count tickets where created_at is within the last 60 minutes
  const newTicketsLastHour = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return tickets.filter((ticket) => {
      const createdAtTime = new Date(ticket.created_at).getTime();
      return createdAtTime >= oneHourAgo;
    }).length;
  }, [tickets]);

  // ── Hydrate tickets from API on mount ─────────────────────
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const tickets = await fetchDashboardTickets();
        if (!cancelled) {
          dispatch(setTickets(tickets));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load tickets";
          dispatch(setError(message));
        }
      } finally {
        if (!cancelled) {
          dispatch(setLoading(false));
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  /**
   * Opens the SlidePanel in "create" mode by dispatching openPanel
   * with a sentinel value. The SlidePanel component shows its blank
   * "Process New Message" state when it cannot find a matching ticket.
   */
  const handleProcessNewMessage = useCallback(() => {
    dispatch(openPanel("__new__"));
  }, [dispatch]);

  // ── Loading skeleton layout ───────────────────────────────
  if (isLoading) {
    return (
      <div className="dashboard-shell">
        {/* ── 1. Top Nav (always visible) ────────────────────── */}
        <header className="dashboard-topnav">
          <div className="dashboard-topnav-inner">
            <div className="dashboard-topnav-brand">
              <Sparkles size={20} className="dashboard-topnav-icon" />
              <span className="dashboard-topnav-title">
                AI Support Classifier
              </span>
            </div>
            <div className="dashboard-topnav-avatar" aria-label="User avatar" />
          </div>
        </header>

        {/* ── 2. Hero Banner skeleton ────────────────────────── */}
        <div className="dashboard-loading-hero">
          <div className="dashboard-loading-hero-inner">
            <Skeleton width={160} height={14} />
            <Skeleton
              width={320}
              height={36}
              className="dashboard-loading-hero-title"
            />
            <Skeleton width={260} height={14} />
          </div>
        </div>

        {/* ── 3. Stat Cards skeleton ─────────────────────────── */}
        <div className="dashboard-loading-stats">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>

        {/* ── 4. Action Row skeleton ─────────────────────────── */}
        <section className="dashboard-action-row">
          <div className="dashboard-action-row-inner">
            <div>
              <Skeleton width={180} height={28} />
              <Skeleton
                width={280}
                height={14}
                className="dashboard-loading-action-sub"
              />
            </div>
            <Skeleton
              width={200}
              height={44}
              className="dashboard-loading-btn"
            />
          </div>
        </section>

        {/* ── 5. Table skeleton ───────────────────────────────── */}
        <section className="dashboard-ledger-section">
          <div className="dashboard-loading-table">
            <div className="dashboard-loading-table-header">
              <Skeleton
                width={120}
                height={32}
                className="dashboard-loading-pill"
              />
              <Skeleton
                width={80}
                height={32}
                className="dashboard-loading-pill"
              />
              <Skeleton
                width={80}
                height={32}
                className="dashboard-loading-pill"
              />
              <Skeleton
                width={80}
                height={32}
                className="dashboard-loading-pill"
              />
            </div>
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
            <SkeletonTableRow />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* ── 1. Top Nav ──────────────────────────────────────────── */}
      <header className="dashboard-topnav">
        <div className="dashboard-topnav-inner">
          <div className="dashboard-topnav-brand">
            <Sparkles size={20} className="dashboard-topnav-icon" />
            <span className="dashboard-topnav-title">
              AI Support Classifier
            </span>
          </div>
          <div className="dashboard-topnav-avatar" aria-label="User avatar" />
        </div>
      </header>

      {/* ── 2. Hero Banner ──────────────────────────────────────── */}
      <HeroBanner newTicketsLastHour={newTicketsLastHour} />

      {/* ── 3. Stat Cards (overlap hero by -40px via CSS) ───────── */}
      <StatCards />

      {/* ── 4. Page Action Row ──────────────────────────────────── */}
      <section className="dashboard-action-row">
        <div className="dashboard-action-row-inner">
          <div>
            <h2 className="dashboard-action-heading">Support Tickets</h2>
            <p className="dashboard-action-subtitle">
              AI-powered classification and response drafting
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus size={18} />}
            onClick={handleProcessNewMessage}
          >
            Process New Message
          </Button>
        </div>
      </section>

      {/* ── 5. Ticket Ledger ────────────────────────────────────── */}
      <section className="dashboard-ledger-section">
        {loadError && (
          <div className="dashboard-error-banner" role="alert">
            <p className="dashboard-error-text">
              <strong>Error loading tickets:</strong> {loadError}
            </p>
          </div>
        )}
        <TicketLedger />
      </section>

      {/* ── 6. Slide Panel (conditional) ────────────────────────── */}
      {isPanelOpen && <SlidePanel />}
    </div>
  );
}
