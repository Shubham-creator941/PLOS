# FRONTEND WIDGET & COMPONENT RESPONSIBILITY ARCHITECTURE (FWCRA)

==================================================
SECTION 1 — WIDGET INVENTORY
==================================================

### Mission Control
- **Today's Mission:** 
  - *Purpose:* Single CTA to start the next recommended learning block.
  - *Experience owner:* Mission Control
  - *Backend owner:* Learning Intelligence
  - *Lifecycle:* Mounts with route, destroyed on navigation.
  - *Visibility:* Always visible on Dashboard.
  - *Route scope:* `/mission`
  - *Session scope:* Outside session.
- **Momentum:** 
  - *Purpose:* Visualize streaks and daily consistency.
  - *Backend owner:* Dashboard Engine.

### Studio
- **Learning Workspace:**
  - *Purpose:* Renders the core learning material (Markdown, Video).
  - *Experience owner:* Studio
  - *Backend owner:* Resource Engine
  - *Lifecycle:* Persists for duration of the session.
- **Focus Timer:**
  - *Purpose:* Deterministic countdown/countup clock.
  - *Backend owner:* Learning Session Engine.
- **Adaptive Nudge:**
  - *Purpose:* Displays real-time interventions (e.g., "Take a break").
  - *Backend owner:* Adaptive Runtime.
  - *Visibility:* Hidden by default, triggered by WS event.

### Map
- **Roadmap Graph:**
  - *Purpose:* Interactive DAG visualization of the syllabus.
  - *Experience owner:* Map
  - *Backend owner:* Planning Engine.
- **Skill Radar:**
  - *Purpose:* Visualizes mastery across different domains.
  - *Backend owner:* Dashboard Engine.

### Mirror
- **Teach-back Input:**
  - *Purpose:* Capture reflective or assessment text/audio.
  - *Experience owner:* Mirror
  - *Backend owner:* Assessment Engine.

### Library
- **Resource Grid:**
  - *Purpose:* Searchable list of saved materials.
  - *Backend owner:* Resource Engine.

### Engine Room
- **Profile Card:**
  - *Purpose:* Manage identity and core preferences.
  - *Backend owner:* Learner Engine.

### Global
- **Command Palette:**
  - *Purpose:* Keyboard-first navigation and global actions.
  - *Backend owner:* Platform Engine.

==================================================
SECTION 2 — WIDGET RESPONSIBILITY MATRIX
==================================================

| Widget | Backend Owner | Consumes APIs | Produces Events | Consumes Events | Editable | Read Only | Realtime | Offline | Reusable | Criticality |
|---|---|---|---|---|---|---|---|---|---|---|
| **Today's Mission** | Intelligence | Yes | `SESSION_START` | `PLAN_UPDATED` | No | Yes | No | Yes | No | P0 |
| **Focus Timer** | Session | Yes | `SESSION_PAUSE`, `END`| `INTERVENTION` | Yes | No | Yes | Yes | Yes | P0 |
| **Adaptive Nudge**| Runtime | No | `NUDGE_ACCEPTED` | `INTERVENTION` | Yes | No | Yes | No | Yes | P1 |
| **Roadmap Graph** | Planning | Yes | `NODE_SELECT` | `PLAN_UPDATED` | No | Yes | No | Yes | No | P1 |
| **Teach-back** | Assessment | Yes | `ASSESS_SUBMIT` | None | Yes | No | No | Partial| No | P1 |
| **Command Palette**| Platform | Yes | `NAVIGATE` | None | Yes | No | No | Yes | Yes | P1 |

==================================================
SECTION 3 — GLOBAL COMPONENTS
==================================================

- **Command Palette:**
  - *Owner:* Platform
  - *Persistence:* Permanent (Hidden).
  - *Mount point:* App Root Layout.
  - *Communication:* React Context (Open/Close state).
- **Floating AI Companion:**
  - *Owner:* Learning Intelligence
  - *Persistence:* Permanent (Rendered over all non-Studio routes).
  - *Mount point:* App Root Layout.
  - *Communication:* Event Bus / WebSocket.
- **Notification Center / Toast Host:**
  - *Owner:* Notification Engine
  - *Persistence:* Permanent.
  - *Mount point:* App Root Layout (z-index highest).
  - *Communication:* Event Bus (`NOTIFICATION_RECEIVED`).
- **Connection Status Banner:**
  - *Owner:* Platform Engine
  - *Persistence:* Conditional (Mounts only on offline).
  - *Mount point:* Top of App Layout.
  - *Communication:* `window.addEventListener('offline')`.

==================================================
SECTION 4 — EXPERIENCE COMPOSITION
==================================================

- **Mission Control**
  ↓ Today's Mission
  ↓ AI Coach Insights (Snippet)
  ↓ Momentum & Mastery Stats
  ↓ Quick Actions (Log external learning)
- **Studio**
  ↓ Learning Workspace (Content Renderer)
  ↓ Focus Timer
  ↓ Adaptive Nudges (Overlays)
  ↓ Scratchpad (Notes)
- **Map**
  ↓ Roadmap Graph (Visualizer)
  ↓ Milestones List
  ↓ Skill Radar
- **Mirror**
  ↓ Reflection Prompt
  ↓ Teach-back Assessment (Audio/Text)
  ↓ Previous Mastery Summary
- **Library**
  ↓ Resource Grid
  ↓ Generated Concept Flashcards
- **Engine Room**
  ↓ User Profile
  ↓ UI Preferences
  ↓ Integrations

==================================================
SECTION 5 — WIDGET COMMUNICATION
==================================================

| Producer | Consumer | Mechanism | Frequency | Payload | Synchronization |
|---|---|---|---|---|---|
| **Focus Timer** | **Workspace** | Event Bus | On `END` | `{ duration }` | Async (Triggers Mirror route) |
| **AI Coach (WS)** | **Adaptive Nudge** | Event Bus | Low (Interventions) | `{ type: 'BREAK' }` | Sync (Immediate mount) |
| **Nudge** | **Focus Timer** | Event Bus | On Accept | `{ action: 'PAUSE' }` | Sync (Pauses timer) |
| **Mirror Form** | **Mission Control**| React Query | On Submit | Null | Async (Invalidates cache) |
| **Command Palette**| **Router** | URL | User driven | `{ path }` | Sync |

*Note: No direct coupling allowed. Widgets only emit events or rely on shared cache.*

==================================================
SECTION 6 — COMPONENT HIERARCHY
==================================================

App
↓ Providers (QueryClient, AuthContext, ThemeProvider)
↓ Global Overlays (Command Palette, Toast Host)
↓ Layout (Ambient Sidebar, Router Outlet)
  ↓ Experience (e.g., The Studio)
    ↓ Workspace (e.g., Focus Zone container)
      ↓ Widgets (e.g., Focus Timer, Content Reader)
        ↓ Primitive Components (e.g., Button, Card, Typography)

==================================================
SECTION 7 — LIFECYCLE MODEL
==================================================

- **Creation:** Widget mounts into the DOM. Memory allocated.
- **Initialization:** Reads initial state from props, URL, or initiates React Query fetch.
- **Loading:** Renders Skeleton or Suspense fallback while API resolves.
- **Interaction:** Handles user inputs, binds to Event Bus listeners.
- **Suspension:** If user swaps tabs or minimizes, widget pauses non-critical animations (via Page Visibility API).
- **Recovery:** Restores active state from cache when refocused.
- **Destruction:** Unbinds Event Bus listeners, cancels pending Axios requests, unmounts.

==================================================
SECTION 8 — LAZY LOADING STRATEGY
==================================================

- **Always loaded:** Core Providers, Global UI (Command Palette, Sidebar), Primitive Design System. *Why: Instant interactivity and critical path.*
- **Route loaded:** Experiences (Mission Control, Map, Mirror). *Why: Standard code-splitting to reduce initial bundle size.*
- **Lazy loaded:** Roadmap DAG (heavy D3/WebGl libraries), Markdown Parser. *Why: These widgets carry heavy third-party dependencies.*
- **Prefetched:** The Mirror Experience. *Why: Prefetched automatically when the Focus Timer drops below 60 seconds to ensure zero latency post-session.*
- **Background loaded:** Resource Library thumbnails. *Why: Non-critical to the core loop.*

==================================================
SECTION 9 — PERFORMANCE RESPONSIBILITIES
==================================================

| Widget | Render Frequency | Memoization | Suspense | Virtualization | Web Worker |
|---|---|---|---|---|---|
| **Focus Timer** | 1Hz (Every second) | Strict (`React.memo`) | No | No | No |
| **Roadmap DAG** | Low (On load) | Yes | Yes | Yes (Canvas Culling) | No |
| **Resource Grid** | Medium | No | Yes | Yes (Windowing) | No |
| **Studio Telemetry**| 10Hz (Internal) | N/A | N/A | N/A | Yes (Worker) |
| **AI Coach Chat** | High (Streaming) | Strict | No | Yes (Chat history)| No |

==================================================
SECTION 10 — ACCESSIBILITY RESPONSIBILITIES
==================================================

- **Keyboard ownership:** Command Palette claims highest priority (`Cmd+K`). Focus Timer responds to `Space` (Play/Pause) only when Studio is active.
- **Focus management:** Modals (Nudges) must trap focus. Route transitions must reset focus to the top-level H1 of the new Experience.
- **ARIA ownership:** Focus Timer uses `aria-live="polite"` to announce time remaining at logical intervals (e.g., 5 mins left). AI Coach interventions use `aria-live="assertive"`.
- **Motion reduction:** `prefers-reduced-motion` completely disables Roadmap DAG animations and uses instantaneous transitions for the Command Palette.
- **High contrast:** Semantic color tokens guarantee WCAG AAA compliance for text within the Studio Workspace.

==================================================
SECTION 11 — RESPONSIBILITY BOUNDARIES
==================================================

### Focus Timer (Widget)
- **Responsible For:** Maintaining deterministic time, pausing on interventions, dispatching `SESSION_COMPLETED`.
- **Must Never Do:** Mutate the backend Session state directly (must route through API client), read the Learning Plan.
- **Allowed Dependencies:** Event Bus, Date API.
- **Forbidden Dependencies:** React Router, Planning Engine API.

### Roadmap Graph (Widget)
- **Responsible For:** Visualizing the DAG, panning/zooming, emitting `NODE_SELECTED`.
- **Must Never Do:** Start a learning session.
- **Allowed Dependencies:** Canvas/D3 primitives.
- **Forbidden Dependencies:** Assessment logic, Focus Timer.

### Adaptive Nudge (Widget)
- **Responsible For:** Displaying real-time AI suggestions, trapping focus, pausing session on mount.
- **Must Never Do:** Fetch historical insights.
- **Allowed Dependencies:** Event Bus.
- **Forbidden Dependencies:** React Query.

==================================================
SECTION 12 — ARCHITECTURAL REVIEW
==================================================

**Coupling Risk:**
- Widgets might accidentally couple to specific Experiences (e.g., Focus Timer assuming it is only ever inside Studio).
- *Recommendation:* Widgets must be entirely Experience-agnostic. They receive their context entirely via props or isolated Providers, allowing the Focus Timer to be reused in the Mirror (for timed quizzes) without modification.

**Scalability Risk:**
- Heavy DOM nodes if the AI Coach chat history becomes long.
- *Recommendation:* Enforce list virtualization (e.g., `react-window`) on all dynamic unbounded lists (Chat, Resources, Milestones).

**Performance Risk:**
- The Focus Timer triggers re-renders every 1 second, potentially causing the entire Studio Workspace (and heavy Markdown reader) to re-render.
- *Recommendation:* Isolate the Timer state completely. Use uncontrolled components or strict memoization (`React.memo`) for sibling components to prevent cascading renders.

**Testability:**
- Because widgets communicate via a decoupled Event Bus, they can be tested in complete isolation.
- *Recommendation:* Mandate Cypress/Playwright component testing (not just E2E) where mock events are dispatched to the Event Bus to verify widget reactions without spinning up the router.
