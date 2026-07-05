/**
 * app/dashboard/page.tsx
 *
 * Next.js route for /dashboard.
 * This is a clean Server Component — all interactivity lives inside
 * DashboardModule (which is a Client Component).
 */

import type { Metadata } from 'next'
import DashboardModule from '@/modules/dashboard/DashboardModule'

export const metadata: Metadata = {
  title: 'Dashboard — AI Support Classifier',
  description:
    'View and manage AI-classified support tickets. Track categories, urgency, and resolution rates at a glance.',
}

export default function DashboardPage() {
  return <DashboardModule />
}
