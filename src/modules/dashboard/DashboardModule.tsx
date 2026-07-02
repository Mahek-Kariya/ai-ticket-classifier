'use client'

/**
 * DashboardModule.tsx
 *
 * Single entry point for the dashboard feature module.
 * Composes HeroBanner, StatCards, TicketLedger, and SlidePanel
 * into the full-page layout described in AGENTS.md Section 7.
 *
 * Layout order (top → bottom):
 *   1. Top nav bar (56px, white)
 *   2. HeroBanner (violet gradient)
 *   3. StatCards (overlapping hero bottom by ~40px)
 *   4. Page action row ("Support Tickets" + "+ Process New Message")
 *   5. TicketLedger (full-width white card)
 *   6. SlidePanel (conditional overlay from right)
 */

import { useCallback } from 'react'
import { Sparkles, Plus } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { openPanel } from '@/store/ticketsSlice'
import { Button } from '@/components/base'

import './DashboardModule.css'

import { HeroBanner } from './components/HeroBanner'
import { StatCards } from './components/StatCards'
import { TicketLedger } from './components/TicketLedger'
import { SlidePanel } from './components/SlidePanel'

export default function DashboardModule() {
  const dispatch = useAppDispatch()
  const isPanelOpen = useAppSelector((state) => state.tickets.isPanelOpen)

  /**
   * Opens the SlidePanel in "create" mode by dispatching openPanel
   * with a sentinel value. The SlidePanel component shows its blank
   * "Process New Message" state when it cannot find a matching ticket.
   */
  const handleProcessNewMessage = useCallback(() => {
    dispatch(openPanel('__new__'))
  }, [dispatch])

  return (
    <div className="dashboard-shell">
      {/* ── 1. Top Nav ──────────────────────────────────────────── */}
      <header className="dashboard-topnav">
        <div className="dashboard-topnav-inner">
          <div className="dashboard-topnav-brand">
            <Sparkles size={20} className="dashboard-topnav-icon" />
            <span className="dashboard-topnav-title">AI Support Classifier</span>
          </div>
          <div className="dashboard-topnav-avatar" aria-label="User avatar" />
        </div>
      </header>

      {/* ── 2. Hero Banner ──────────────────────────────────────── */}
      <HeroBanner />

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
        <TicketLedger />
      </section>

      {/* ── 6. Slide Panel (conditional) ────────────────────────── */}
      {isPanelOpen && <SlidePanel />}
    </div>
  )
}
