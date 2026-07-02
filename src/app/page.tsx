/**
 * app/page.tsx
 *
 * Root route — immediately redirects to /dashboard.
 * This is a Server Component using Next.js redirect().
 */

import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/dashboard')
}
