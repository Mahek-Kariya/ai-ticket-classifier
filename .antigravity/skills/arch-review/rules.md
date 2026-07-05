# Architecture Rules — AI Support Ticket Classifier

These rules are derived from AGENTS.md, industry best practices
for Next.js 16 App Router, and React + TypeScript conventions.
Every rule has a WHY so the reviewer understands intent, not
just the letter of the rule.

---

## RULE SET 1 — FILE PLACEMENT & SCOPE

RULE 1.1 — Module-first placement
A file lives inside the module that owns it.
It is only promoted to global (hooks/, utils/, services/, lib/)
when a SECOND module needs it.
WHY: Prevents premature abstraction and keeps features self-contained.

VIOLATION EXAMPLES:
❌ src/utils/agentClient.ts used only by dashboard module
❌ src/hooks/useTicketPanel.ts used only by dashboard module
✅ src/modules/dashboard/lib/agentClient.ts
✅ src/modules/dashboard/hooks/useTicketPanel.ts

RULE 1.2 — Global lib/ is for infrastructure only
lib/ contains singleton clients and pure config only.
No business logic, no feature logic.
WHY: lib/ is the foundation layer — mixing feature code here
creates circular dependencies.

✅ src/lib/supabaseClient.ts
✅ src/lib/utils.ts (cn() helper only)
❌ src/lib/classifyTicket.ts (business logic — belongs in module)

RULE 1.3 — API routes are thin controllers
app/api/*/route.ts files must only:

- Parse the request
- Call a service or util function
- Return a response
  No business logic, no direct DB queries inside the route handler.
  WHY: Fat route handlers are untestable and hard to reuse.

RULE 1.4 — app/ folder is routing only
page.tsx files import and render one module component only.
No JSX logic, no data fetching, no state in page.tsx.
WHY: Keeps routing and feature logic cleanly separated.

✅ export default function DashboardPage() { return <DashboardModule /> }
❌ page.tsx with useState, useEffect, or complex JSX

---

## RULE SET 2 — COMPONENT RULES

RULE 2.1 — TSX files are UI only
A .tsx component file renders UI.
It may: render JSX, call hooks, dispatch Redux actions,
handle user events.
It must NOT: contain business logic, data transformation,
API calls, or complex conditional logic beyond UI concerns.
WHY: Pure UI components are testable, reusable, and readable.

VIOLATION EXAMPLES:
❌ Filtering/sorting arrays inside a component body
❌ Making fetch() calls directly inside a component
❌ Complex data transformation inside JSX
✅ Extract logic to a custom hook or utils file

RULE 2.2 — One component per file
Each .tsx file exports exactly one component.
File name matches the exported component name (PascalCase).
WHY: Predictable file structure, easier to navigate.

RULE 2.3 — Props interface naming
Props interface must be named [ComponentName]Props.
Defined in the same file or in ComponentNameTypes.ts.
No anonymous prop types inline.
WHY: Consistent, searchable, self-documenting.

✅ interface StatCardsProps { ... }
❌ function StatCards({ total }: { total: number })

RULE 2.4 — Never import shadcn/ui directly in feature code
Feature components and module components must import
base components from @/components/base only.
shadcn primitives live in @/components/ui/ and are only
touched by base component wrappers.
WHY: Design system changes happen in one place, not scattered
across the codebase.

❌ import { Button } from '@/components/ui/button' in a module component
✅ import { Button } from '@/components/base'

RULE 2.5 — Client boundary is explicit
"use client" is only added when the component needs:
state (useState, useReducer), effects (useEffect),
event handlers, browser APIs, or Redux hooks.
Server Components are the default. Do not add "use client"
to components that don't need it.

---

## RULE SET 3 — CONSTANTS, FUNCTIONS & PROMPTS

RULE 3.1 — Dynamic values are functions, not constants
If a value needs context, parameters, or future flexibility
it must be a function, not a raw exported constant.
WHY: Functions are composable, testable, and extensible.

✅ export function getClassificationPrompt(): string
❌ export const CLASSIFICATION_PROMPT = `...`

✅ export function getUrgencyColor(urgency: TicketUrgency): string
❌ export const URGENCY_COLORS = { high: '...', medium: '...', low: '...' }
(when used with dynamic input — use a function)

RULE 3.2 — Truly static constants are fine as constants
Values that never change and need no context are constants.
WHY: Not everything needs to be a function.

✅ export const APP_NAME = 'AI Support Classifier'
✅ export const MAX_EMAIL_LENGTH = 254
✅ export const TICKET_CATEGORIES = ['billing', 'technical', ...] as const

RULE 3.3 — No hardcoded config values in source files
Model names, API URLs, timeouts, and external service names
must come from environment variables.
A fallback default is acceptable as a string literal,
but the primary value must always be env-driven.
WHY: Config changes should never require a code change.

✅ process.env.AI_MODEL ?? 'openai/gpt-oss-20b'
❌ const model = 'openai/gpt-oss-20b' (hardcoded, no env)

RULE 3.4 — AI prompts live in systemPrompts.ts as functions
All AI system prompts live in the module's lib/systemPrompts.ts.
Each prompt is exported as a builder function, not a constant.
WHY: Prompts are dynamic configuration, not static strings.

✅ src/modules/dashboard/lib/systemPrompts.ts
export function getClassificationPrompt(): string

---

## RULE SET 4 — IMPORTS & DEPENDENCIES

RULE 4.1 — Always use @/ alias
All imports within src/ use the @/ alias.
No relative path imports that go up more than one level.
WHY: Alias imports survive file moves and are easier to read.

✅ import { Ticket } from '@/types'
✅ import { cn } from '@/lib/utils'
❌ import { Ticket } from '../../../types'

RULE 4.2 — No cross-module imports
Modules must not import from each other directly.
If two modules need shared code, it is promoted to global.
WHY: Cross-module imports create tight coupling and
circular dependency risks.

❌ import { something } from '@/modules/analytics/utils'
(inside dashboard module)

RULE 4.3 — Dependency direction
The dependency flow is strictly one-way:
components → hooks → services → lib/utils → types
Nothing lower in this chain imports from something higher.
WHY: Prevents circular dependencies and keeps the
architecture predictable.

---

## RULE SET 5 — TYPESCRIPT

RULE 5.1 — No any
The any type is never used. Use unknown and narrow,
or define a proper interface.
WHY: any defeats the purpose of TypeScript.

RULE 5.2 — All types in the right place
Types used by one component: defined in ComponentNameTypes.ts
Types used by one module: defined in module-level types file
Types used across the app: defined in src/types/index.ts
WHY: Types are documentation — they should be where
readers expect to find them.

RULE 5.3 — API response shapes are always typed
No untyped fetch responses. Every API call returns
a typed value matching ApiResponse<T> from src/types/index.ts.

---

## RULE SET 6 — REDUX

RULE 6.1 — Redux is for truly global shared state only
Only state that is genuinely needed by multiple,
distant components belongs in Redux.
Local UI state (open/close, hover, input value) stays in useState.
WHY: Overusing Redux makes the store a dumping ground
and slows down development.

RULE 6.2 — Always use typed hooks
useAppSelector and useAppDispatch from src/store/hooks.ts
are always used instead of raw useSelector/useDispatch.
WHY: Type safety across all store interactions.

RULE 6.3 — No direct store imports in components
Components never import the store directly.
They use hooks only.
WHY: Keeps components decoupled from store implementation.

---

## RULE SET 7 — NAMING CONVENTIONS

RULE 7.1 — Files
Components: PascalCase (StatCards.tsx)
Hooks: camelCase with use prefix (useTicketFilters.ts)
Utils/services: camelCase (ticketService.ts)
Types files: PascalCase with Types suffix (StatCardsTypes.ts)
Style files: match component name (StatCards.css)
Constants files: camelCase (systemPrompts.ts)

RULE 7.2 — Functions and variables
Functions: camelCase, imperative verbs
(getClassificationPrompt, fetchTickets, updateStatus)
Constants: SCREAMING_SNAKE_CASE for truly global constants
(APP_NAME, MAX_EMAIL_LENGTH)
Local constants: camelCase (const defaultFilters = ...)
Boolean variables: is/has/can prefix
(isLoading, hasError, canSubmit)

RULE 7.3 — No abbreviations
Variable and function names are not abbreviated.
WHY: Readability over brevity.

❌ const tk = ticket
❌ function calcUrgency()
✅ const ticket = ticket
✅ function calculateUrgency()