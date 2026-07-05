Here is your comprehensive, production-ready `README.md` file. It completely outlines the full-stack architecture of the
**AI Support Ticket Classifier**, catalogs the tech stack, documents setup instructions, and proudly highlights your
live, production Vercel deployment link.

---

# AI Support Ticket Classifier 🚀

An enterprise-grade, high-performance, intelligent support ticket processing system. The application intercepts raw
inbound customer support messages, routes them through an AI classification engine using state-of-the-art inference to
determine category, structural urgency, and draft context-aware automated email replies, all while syncing states
instantly with a persistent cloud database.

🔗 **Live Production Deployment:
** [ai-ticket-classifier-a4hp.vercel.app](https://www.google.com/search?q=https://ai-ticket-classifier-a4hp.vercel.app/dashboard)

---

## 🎨 Architectural Foundations

The engineering workflows and visual mechanics of this application are guided strictly by the layout parameters
specified in **Option B (Violet + Slate)**:

* **Design Tokens:** Driven by clean custom CSS custom property parameters (`variables.css`). Banned inline hex
  variations preserve unified aesthetic design across components.
* **Typography:** Accessible UI copy leverages the clean proportions of **Inter**, paired alongside high-clarity *
  *JetBrains Mono** (`font-mono`) for operational technical metrics, ticket identifiers, email records, and
  chronological timestamps.
* **Visual Balance:** Features a full-width high-clearance violet gradient Hero Banner feeding a floating grid framework
  of 4 responsive analytic Stat Cards overlapping the layout core via negative margin configurations (`-mt-12`).

---

## 🛠️ The Full-Stack Technology Matrix

```
       [ Frontend UI Layer ]          ➔     [ State Machine ]      ➔     [ Full-Stack Server ]
   Next.js 16 (App Router) + Tailwind       Redux Toolkit Core         Next API Routes + Supabase SDK

```

### 🔹 Frontend Client & Presentation

* **Core Framework:** Next.js 16 (App Router architecture using server/client operational boundary splits).
* **Style Engine:** Tailwind CSS v4 utilizing strict modular utility classes and custom layout tokens.
* **Interface Foundations:** Labeled atomic base layouts constructed from scratch (Badge, Button, Card, Input, Textarea,
  Select, Skeleton, Separator) mapping conditional strings via `cn()`.
* **Iconography Grid:** Premium visual asset anchors managed uniformly through `lucide-react`.

### 🔹 Global State Hub

* **Engine Core:** Redux Toolkit (RTK) acting as the single, authoritative project state machine.
* **Reactive Slices:** Synchronized ticket array caching, filter presets, dropdown queries, and real-time animation
  drawer visibility contexts (`ticketsSlice.ts`).
* **Data Boundaries:** Deep client isolation via typed selectors (`useAppSelector`, `useAppDispatch`) routed out of
  `@/store/hooks`.

### 🔹 Database Infrastructure

* **Cloud PostgreSQL:** Managed instances deployed securely on **Supabase**.
* **Instance Handler:** Resilient singleton client implementation configured to run gracefully in mock-memory isolation
  formats if system keys are missing, preventing build-time environmental compilation breaks.

### 🔹 Intelligent Classification Router

* **AI Engine Framework:** Vercel AI SDK integration layers.
* **Inference Compute:** Low-latency API processing powered by **Groq Cloud**.
* **Model Parameter:** Dedicated `llama3-8b-8192` orchestration model.
* **Structured Output:** Strictly outputs robust JSON tokens parsed natively down to three core schema definitions:
  `category`, `urgency`, and `ai_draft_reply`.

---

## 🚀 Local Installation & Developer Workflow

Follow these chronological steps to stand up a local instance of the application on your machine:

### 1. Clone the Workspace

```bash
git clone https://github.com/your-username/ai-ticket-classifier.git
cd ai-ticket-classifier

```

### 2. Supply System Environment Keys

Create a `.env.local` sheet at the root of your directory and populate it with your cloud connection strings:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_BASE_URL=
AI_MODEL=
NEXT_PUBLIC_AI_MODEL=
AI_API_KEY=

```

### 3. Install Target Dependencies

```bash
npm install

```

### 4. Execute the Local Development Server

```bash
npm run dev

```

Once booted, access the interface workspace directly via your local browser link: 👉 **`http://localhost:3000`**

### 5. Verify Strict Type Safety

Ensure code validation passes compile testing before committing features to remote tracking:

```bash
npx tsc --noEmit

```

---

## 📂 System Directory Framework

```
src/
├── app/                      # Next.js App Router endpoints and API route configurations
│   ├── api/
│   │   ├── analyze/          # Live Vercel AI SDK + Groq Classification router
│   │   └── tickets/          # Full database persistence API pathways
│   └── dashboard/            # Core view routing node entry
├── components/
│   └── base/                 # Rigid design system atomic primitive controls
├── lib/
│   └── supabase/             # Safe database connection orchestrator setup
├── modules/
│   └── dashboard/            # Unified Feature Module
│       ├── components/       # HeroBanner, StatCards, TicketLedger, SlidePanel
│       ├── lib/              # Fallback mock engine schemas
│       └── services/         # Async server communication layers
└── store/                    # Authoritative RTK Global State Core engine

```

---

## 📈 System Feature Operations

* **Real-time Lifecycle Mutation:** Opening any ticket marked with a **New** status badge triggers a lifecycle hook that
  dispatches a status modification back to the cloud, instantly shifting its classification status to **In Progress**.
* **Interactive Toggles:** Using the 3-way toggle sheet inside the right side drawer (`SlidePanel`) initiates
  asynchronous PATCH updates that instantly refresh row colors across the dashboard table layout.
* **Asynchronous Creation Streams:** Submitting a raw message via the `+ Process New Message` action form provides
  instant visual layout feedback with spinning load tokens, prompts the live AI model to categorize and compose
  responses, and inserts the result at the top of the processing grid.

---