# AGENTS.md — AI Support Ticket Classifier

This file is the source of truth for any AI agent working on this codebase.
Read this fully before making any changes. When in doubt, follow this file
over your own assumptions.

---

## 1. Project Overview

**What this is:** A privacy-conscious, full-stack AI tool that helps small
businesses (shops, agencies, clinics, SaaS tools) handle customer support
messages automatically.

**The problem it solves:** Small businesses receive customer messages across
email and chat all day. Someone has to manually read each one, judge urgency,
pick a category, and draft a reply. This is slow, inconsistent, and a single
person can miss a critical complaint buried under routine questions.

**What it does:**
A business pastes a customer message into the app. The app:

1. Classifies it by category (billing, technical, complaint, general)
2. Classifies it by urgency (low, medium, high)
3. Generates a professional draft reply
4. Saves everything to a database with timestamps
5. Shows it on a dashboard with stats, filters, and a detail panel

**End goal:** A complete, deployable, demoable product. Someone should be
able to paste an angry customer email and watch it get classified,
prioritized, and drafted in real time — in under 20 seconds. This is also
a sellable freelance product ("I'll build an AI helpdesk tool for your
business").

**Current phase:** Building the dashboard UI with mock data (Phase 1).
No live AI or database wiring yet. See Section 8 for the full roadmap.

---

## 2. Tech Stack

| Layer             | Technology                      | Notes                                                                                                      |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------------|
| Framework         | Next.js 16 (App Router)         | TypeScript, no Pages Router                                                                                |
| Styling           | Tailwind CSS v4                 | Tokens defined via `@theme` in CSS, not `tailwind.config.ts`                                               |
| Component base    | shadcn/ui                       | Never edit `components/ui/*` directly — wrap it                                                            |
| AI / streaming    | Vercel AI SDK v6 (`ai` package) |                                                                                                            |
| AI provider       | Groq (`@ai-sdk/groq`)           | Model: `llama3-8b-8192`. Abstracted behind `agentClient.ts` so swapping providers later is a 3-line change |
| Database          | Supabase (PostgreSQL)           | Single `tickets` table, no auth yet                                                                        |
| State management  | Redux Toolkit + react-redux     | Global store for tickets, filters, and slide panel state. See Section 3a                                   |
| Icons             | lucide-react                    | Only icon library used                                                                                     |
| Package manager   | npm                             | Not yarn or pnpm                                                                                           |
| Deployment target | Vercel                          | Frontend only — Supabase and Groq are external services                                                    |

**Explicitly NOT used:** Zustand, Jotai, Recoil, MUI, Chakra UI,
Headless UI, `@ai-sdk/openai` (use `@ai-sdk/groq` instead). Redux Toolkit
is the ONLY global state library — do not introduce a second one
alongside it.

**Install command:**

```bash
npm install @reduxjs/toolkit react-redux
```

---

## 3. Folder Structure — STRICT, do not deviate

```
src/
├── app/                              Next.js App Router — routing only
│   ├── api/
│   │   ├── tickets/route.ts          GET tickets, POST new ticket
│   │   └── classify/route.ts         POST → Groq classification
│   ├── layout.tsx
│   ├── page.tsx                      Redirects to /dashboard
│   └── dashboard/
│       └── page.tsx                  Imports <DashboardModule /> only
│
├── modules/                          FEATURE MODULES — self-contained
│   └── dashboard/
│       ├── components/               Dashboard-only UI (StatCards, TicketLedger, SlidePanel)
│       ├── services/                 Dashboard-only API calls (fetchTickets, updateStatus)
│       ├── utils/                    Dashboard-only helpers (formatRelativeTime, getUrgencyColor)
│       ├── lib/                      Dashboard-only third-party config, mock-data.ts
│       └── DashboardModule.tsx       Single entry point — wires everything together
│
├── components/
│   ├── base/                         OUR design system, wraps shadcn
│   │   └── <ComponentName>/
│   │       ├── <ComponentName>.tsx
│   │       ├── <ComponentName>.css
│   │       ├── <ComponentName>Styles.ts    variant/size class maps
│   │       ├── <ComponentName>Types.ts     prop interfaces
│   │       └── index.ts                    barrel export
│   └── ui/                           RAW shadcn — installed via CLI, NEVER hand-edit
│
├── hooks/                            GLOBAL hooks used by 2+ modules
├── lib/
│   ├── utils.ts                      cn() helper — already exists, do not duplicate
│   └── supabaseClient.ts             Supabase client singleton
├── services/                         GLOBAL API calls used by 2+ modules
├── types/
│   └── index.ts                      Already exists — Ticket, TicketCategory,
│                                      TicketUrgency, TicketStatus, etc.
├── utils/
│   └── agentClient.ts                AI provider wrapper (Groq today, swappable later)
└── styles/
    ├── globals.css                   Entry point — imports order matters, see file
    ├── variables.css                 ALL CSS custom properties + Tailwind @theme
    ├── typography.css                Font application, heading scale, mono styles
    ├── animations.css                Keyframes + animation utility classes
    └── tokens/
        ├── typography.ts             TS constants — escape hatch when Tailwind can't reach
        └── common.ts                 TS constants — colours, spacing, shadows, radius
```

**Rule:** if a component/hook/util is used by exactly one module, it lives
inside that module's folder. It only gets promoted to the global `hooks/`,
`services/`, or `utils/` folder once a SECOND module needs it. Do not
pre-emptively globalize things "just in case."

---

## 4. Design System

### Colour palette — "Option B: Violet + Slate"

This is a premium, sophisticated palette. Deep violet hero gradient fading
into a warm off-white page. Colour is used as ACCENT, never as decoration.
Calm and composed — NOT alarming. High urgency uses amber, not red.

All values live in `src/styles/variables.css` under the `@theme` block.
Always reference the CSS variables / Tailwind classes generated from them —
never hardcode hex values in component files.

```
Hero gradient:     #1e1b4b → #4c1d95 → #7c3aed (dark violet to violet)
Page background:   #fafaf9  (warm off-white)
Card background:   #ffffff
Card border:       #ede9fe  (violet-tinted, very faint)
Primary accent:    #7c3aed  (violet-600 — buttons, active states, links)
Text primary:      #1c1917  (warm near-black)
Text muted:        #78716c  (warm stone-500)

Category badges (soft tint bg / matching text):
  technical   → violet-100 / violet-700
  billing     → amber-100  / amber-700
  complaint   → rose-100   / rose-700
  general     → green-100  / green-700

Urgency badges (soft tint + small coloured dot):
  high   → amber-100 / amber-800   (NOT red — calm, not alarming)
  medium → blue-100  / blue-700
  low    → green-100 / green-700

Status badges:
  new          → violet-50 / violet-600
  in_progress  → amber-50  / amber-700
  resolved     → green-50  / green-700 (+ checkmark icon)
```

### Typography

- **Inter** for all headings and UI text. Headings use `font-bold
  tracking-tight` for a crisp, premium Linear/Vercel feel.
- **JetBrains Mono** for ticket IDs, timestamps, customer emails, and any
  tabular/technical data. Use the `.font-mono`, `.ticket-id`, `.email-mono`,
  or `.timestamp` utility classes already defined in `typography.css`.
- Font loading happens in `layout.tsx` via `next/font/google`, exposed as
  CSS variables `--font-inter` and `--font-jetbrains-mono`. Do not import
  fonts anywhere else.

### Component patterns — base component anatomy

Every component in `src/components/base/` follows this exact 5-file
pattern (see `Button/` as the reference implementation):

```
ComponentName/
├── ComponentName.tsx        "use client" if interactive. Wraps the shadcn
│                              primitive from components/ui/. Uses cn() from
│                              lib/utils.ts to merge classes.
├── ComponentName.css         Component-specific styles not expressible
│                              cleanly in Tailwind utility classes.
├── ComponentNameStyles.ts    Exported variant/size class maps, e.g.
│                              variantClasses, sizeClasses — objects keyed
│                              by the prop union type.
├── ComponentNameTypes.ts     Prop interface extends the relevant native
│                              HTML element attributes. Export the variant/
│                              size union types from here too.
└── index.ts                  export * from './ComponentName'
```

Always check `src/components/base/index.ts` — every new base component
must be added to this barrel export.

---

## 5. Coding Standards

- **TypeScript strict mode.** No `any`. Use `unknown` and narrow, or define
  a proper interface in the relevant `types.ts` / `Types.ts` file.
- **Styling:** Tailwind utility classes by default. Only drop into a
  component-level `.css` file when Tailwind genuinely cannot express it
  (complex animations, pseudo-elements stacked in specific ways). Inline
  styles are a last resort — use `tokens/typography.ts` or `tokens/common.ts`
  constants if you must.
- **Components:** one component per file. File name matches the exported
  component name (PascalCase). Props interface named `[ComponentName]Props`.
- **Client vs Server components:** default to Server Components. Only add
  `"use client"` when the component needs interactivity (state, effects,
  event handlers, browser APIs).
- **No inline event handler logic beyond a few lines** — extract to a named
  function within the component or to `utils/`.
- **Imports:** use the `@/` alias for all `src/` imports. Never use deep
  relative paths like `../../../components`.
- **No premature abstraction.** Don't build a generic system for something
  that only has one use case today.

---

## 6. Git Workflow

```
main          stable, production-ready only. Never commit directly.
└── dev       active development base. All feature branches fork from here.
    ├── feature/setup-config         DONE — merged
    ├── feature/dashboard-ui         CURRENT — static layout, mock data
    ├── feature/database-connect     NEXT — Supabase wiring
    ├── feature/resolution-panel     NEXT — slide panel interactivity
    └── feature/ai-classifier        NEXT — Groq integration
```

**Commit convention (Conventional Commits):**

```
feat:     new user-facing feature
fix:      bug fix
chore:    tooling, deps, config, scaffolding (not user-facing)
refactor: restructuring without behaviour change
docs:     documentation only
style:    formatting only, no logic change
```

One logical change per commit. Lowercase after the colon. No period at
the end. Imperative mood ("add" not "added").

**Before proposing any change:** confirm which branch is currently
checked out. Never assume `main` or `dev` is safe to commit to directly.

---

## 7. The UI — Reference Screenshots

The dashboard has already been designed and a v0 prototype generated.
The general shape is approved; pasted code is being refined into the
real component tree. Structure, top to bottom:

1. **Top nav** — 56px, white, sparkle icon + "AI Support Classifier" title,
   avatar circle on the right.

2. **Hero banner** (~220px tall) — full-width violet gradient
   (`#1e1b4b → #4c1d95 → #7c3aed`). Left side: "AI-POWERED SUPPORT" tiny
   uppercase label, "Support Intelligence" large white heading, subtitle
   below. Right side: a glassmorphism floating card showing a pulsing
   green "Live" dot + "3 new tickets in the last hour".

3. **Stat cards** (4 cards, white, OVERLAPPING the hero's bottom edge by
   ~40px so they visually float between the hero and the page body):
    - Total Tickets (violet number, Inbox icon)
    - Needs Attention (violet number — NOT red, Clock icon)
    - By Category (2x2 grid of soft pill badges, no big number)
    - Resolution Rate (green %, progress bar)

4. **Page action row** — "Support Tickets" heading + subtitle on the left,
   "+ Process New Message" violet solid button on the right.

5. **Ticket ledger** — full-width white card. Filter pills
   (All/Technical/Billing/Complaint/General), urgency dropdown, email
   search. Table columns: # | Customer Email | Category | Urgency |
   Status | Received | Action. Status badges use Title Case with spaces
   ("In Progress" not "in_progress"). Footer shows pagination + count.

6. **Slide panel** — opens from the right (480px wide) when a ticket row
   is clicked, or when "+ Process New Message" is clicked (blank state).
   Contains: ticket ID + close button, customer email, 3 badges
   (category/urgency/status), divider, original message in an inset box,
   divider, "AI Draft Reply" section with a full-size editable textarea
   (no internal scroll — must show the full reply) + "Copy Reply" button,
   divider, 3-way status toggle (New / In Progress / Resolved).

Known issues from the first v0 pass that must be fixed when implementing:

- Hero subtitle text must not be hidden behind the overlapping stat cards
  — needs more vertical clearance.
- AI Draft Reply textarea must auto-size to fit content, not scroll
  internally.
- Status badges must render as "In Progress" / "Resolved", not raw enum
  values with underscores.
- The progress bar on the Resolution Rate card must be clearly visible.
- The "Needs Attention" number must be coloured violet, not plain black.
- There is no "Send Reply" button anywhere in this app's flow — only
  "Copy Reply". Do not add a send action.

---

## 8. Application Flow (for context when building interactivity)

**Creation mode:** User clicks "+ Process New Message" → slide panel
opens with a blank textarea → user pastes a customer message → clicks
"Run AI Analysis" → POST to `/api/classify` → Groq streams back category,
urgency, and a draft reply → panel populates in real time → on completion,
the full ticket is saved to Supabase → the background ledger table and
stat cards update to reflect the new ticket at the top.

**Resolution mode:** User clicks any row in the ledger → slide panel
opens, pre-filled with that ticket's saved data (original message, AI
draft, current badges) → opening a `new` ticket auto-transitions its
status to `in_progress` in the background → user copies the draft reply,
sends it via their own email client → user manually toggles status to
`resolved` inside the panel → closing the panel drops the row out of
the "new"/"in_progress" active view if filtered, or just updates its
status badge in place.

---

## 9. Database Schema (Supabase)

Single table, no joins, enums for data integrity:

```sql
CREATE TYPE ticket_category AS ENUM ('billing', 'technical', 'complaint', 'general');
CREATE TYPE ticket_urgency AS ENUM ('low', 'medium', 'high');
CREATE TYPE ticket_status AS ENUM ('new', 'in_progress', 'resolved');

CREATE TABLE tickets
(
    id             UUID PRIMARY KEY         DEFAULT gen_random_uuid(),
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_email VARCHAR(254), -- nullable: supports anonymous chat widgets
    message_body   TEXT                                                          NOT NULL,
    category       ticket_category                                               NOT NULL,
    urgency        ticket_urgency                                                NOT NULL,
    ai_draft_reply TEXT                                                          NOT NULL,
    ai_model       VARCHAR(100)             DEFAULT 'llama3-8b-8192'             NOT NULL,
    status         ticket_status            DEFAULT 'new'                        NOT NULL
);
```

This already exists in Supabase. `src/types/index.ts` mirrors this schema
exactly — keep them in sync if either changes.

---

## 10. AI Classification Behaviour (for Phase 4, not yet built)

- All AI calls go through `src/utils/agentClient.ts` — a thin wrapper
  around the Vercel AI SDK + `@ai-sdk/groq`. No component or service ever
  imports Groq directly.
- Model: `llama3-8b-8192`, configured via env vars (`AI_BASE_URL`,
  `AI_MODEL`, `AI_API_KEY`) so switching providers later is a config
  change, not a code change.
- The system prompt must force strict structured output (category,
  urgency, draft reply) — no freeform commentary mixed in.
- Categories and urgency levels are intentionally fixed (not
  user-configurable) for v1 — see rationale below if asked to make them
  dynamic.

**Why categories are fixed, not dynamic:** different businesses would
want different categories (a clinic vs. a SaaS tool), but making this
configurable requires a categories table, a dynamic prompt builder, and
configurable badge styling — all out of scope for v1. The four fixed
categories (billing, technical, complaint, general) cover the large
majority of real support volume. This is documented, not an oversight.

---

## 11. What NOT to do

- Do not add Redux, Zustand, or any global state library.
- Do not edit files inside `src/components/ui/` directly — they are
  managed by the shadcn CLI.
- Do not invent new folders outside the structure in Section 3 without
  flagging it for review first.
- Do not make ticket categories or urgency levels dynamic/configurable —
  this is an intentional v1 constraint, not a missing feature.
- Do not call Groq or Supabase directly from a component — always go
  through `agentClient.ts` / `services/` / API routes.
- Do not add authentication — explicitly deferred to a later phase.
- Do not commit directly to `main` or `dev` — always work on a
  `feature/*` branch and open a PR.
- Do not add a "Send Reply" button or any direct email-sending feature —
  the app only generates and lets the user copy the draft; sending
  happens in the user's own email client.
- Do not use red for high urgency — use amber. This is a deliberate
  calm-not-alarming design decision.

---

## 12. Working With This Agent

When given a task:

1. State which branch you're on before making changes.
2. If the task touches more than 2-3 files, propose a short plan first
   and wait for approval before executing.
3. Keep changes scoped to exactly what was asked — do not refactor
   unrelated code in the same pass.
4. After making changes, summarize exactly what was changed and why,
   referencing the relevant section of this file if a standard was
   applied.
5. Flag anything that conflicts with this file rather than silently
   resolving it your own way.