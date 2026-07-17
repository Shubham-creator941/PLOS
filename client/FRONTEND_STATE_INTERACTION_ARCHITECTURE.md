# FRONTEND STATE & INTERACTION ARCHITECTURE (FSIA)

==================================================
SECTION 1 — APPLICATION STATE MODEL
==================================================

### 1. Server State
- **Owner:** Backend Engines (via React Query)
- **Lifetime:** Ephemeral cache, persists until invalidated or garbage collected.
- **Storage mechanism:** In-memory Cache (QueryClient).
- **Persistence:** LocalStorage via persister plugin (for offline capability).
- **Synchronization method:** Stale-while-revalidate background polling.
- **Invalidators:** Explicit API mutations or WebSocket invalidation events.
- **Disposal rules:** Auto-garbage collected after 5 minutes of inactivity.

### 2. Client State
- **Owner:** Global UI Store (e.g., Zustand/Redux)
- **Lifetime:** User Session.
- **Storage mechanism:** In-memory store.
- **Persistence:** None (ephemeral runtime state like active modal ID).
- **Synchronization method:** React state hooks.
- **Invalidators:** User interactions.
- **Disposal rules:** Wiped on hard refresh or logout.

### 3. URL State
- **Owner:** React Router
- **Lifetime:** Bound to the history stack.
- **Storage mechanism:** Browser History API / Window URL.
- **Persistence:** High (Bookmarkable, shareable).
- **Synchronization method:** Native browser routing.
- **Invalidators:** Navigation actions (`navigate()`).
- **Disposal rules:** Pushed out of history limit.

### 4. Navigation State
- **Owner:** Router State Machine
- **Lifetime:** Duration of the route transition.
- **Storage mechanism:** Location state object.
- **Persistence:** None (lost on hard refresh).
- **Synchronization method:** React Router `<Location>`.
- **Invalidators:** Next route transition.
- **Disposal rules:** Immediate upon mount.

### 5. Session State
- **Owner:** Session Engine Bridge
- **Lifetime:** Duration of the active focus session.
- **Storage mechanism:** In-memory object + IndexedDB backup.
- **Persistence:** High (requires offline survival).
- **Synchronization method:** Debounced IndexedDB writes.
- **Invalidators:** Session completion or explicit termination.
- **Disposal rules:** Wiped after successful `POST /session/end`.

### 6. Workspace State
- **Owner:** Studio Experience
- **Lifetime:** Bounded to the Studio route.
- **Storage mechanism:** Local component state.
- **Persistence:** None.
- **Synchronization method:** Props drilling or local context.
- **Invalidators:** Route unmount.
- **Disposal rules:** Destroyed immediately on unmount.

### 7. Widget State
- **Owner:** Individual Micro-Widgets
- **Lifetime:** Component mount lifecycle.
- **Storage mechanism:** `useState` / `useReducer`.
- **Persistence:** None.
- **Synchronization method:** React re-renders.
- **Invalidators:** User input.
- **Disposal rules:** Unmount.

### 8. Form State
- **Owner:** Form Controller (e.g., React Hook Form)
- **Lifetime:** Duration of form interaction.
- **Storage mechanism:** React Hook Form internal state.
- **Persistence:** Draft states to LocalStorage.
- **Synchronization method:** Controlled/Uncontrolled inputs.
- **Invalidators:** Successful submission.
- **Disposal rules:** Cleared on success or route change.

### 9. AI Runtime State
- **Owner:** WebSocket Client / Event Bus
- **Lifetime:** Tied to connection lifecycle.
- **Storage mechanism:** Transient memory buffers.
- **Persistence:** None.
- **Synchronization method:** WebSocket message handlers.
- **Invalidators:** Disconnect or explicit clear event.
- **Disposal rules:** Cleared on reconnection or session end.

### 10. Notification State
- **Owner:** Notification Store
- **Lifetime:** Ephemeral (until dismissed or expired).
- **Storage mechanism:** In-memory queue.
- **Persistence:** None.
- **Synchronization method:** PubSub Event Bus.
- **Invalidators:** Time-to-live (TTL) expiry or user dismissal.
- **Disposal rules:** Dequeued automatically.

### 11. Theme State
- **Owner:** Platform Store
- **Lifetime:** Permanent.
- **Storage mechanism:** LocalStorage + CSS Variables.
- **Persistence:** Infinite.
- **Synchronization method:** LocalStorage event listener (cross-tab sync).
- **Invalidators:** Explicit toggle.
- **Disposal rules:** Never.

### 12. Cache State
- **Owner:** Service Worker / Workbox
- **Lifetime:** Determined by Cache-Control headers.
- **Storage mechanism:** Browser Cache API.
- **Persistence:** Disk.
- **Synchronization method:** Background sync.
- **Invalidators:** New service worker activation.
- **Disposal rules:** LRU (Least Recently Used) eviction.

### 13. Offline State
- **Owner:** Network Monitor
- **Lifetime:** Duration of disconnect.
- **Storage mechanism:** IndexedDB mutation queue.
- **Persistence:** Disk.
- **Synchronization method:** Online event listener.
- **Invalidators:** Successful queue playback.
- **Disposal rules:** Cleared after sync.

==================================================
SECTION 2 — STATE OWNERSHIP MATRIX
==================================================

| State | Owner | Read By | Write By | Persistence | Source of Truth |
|---|---|---|---|---|---|
| **Auth Token** | Auth Engine | API Client | Auth Engine | LocalStorage | Backend |
| **User Profile** | Learner Engine | Global UI | Settings Form | IndexedDB Cache | Backend |
| **Syllabus DAG** | Planning Engine | The Map | AI (Backend) | IndexedDB Cache | Backend |
| **Current Timer** | Session Manager | The Studio | Timer Ticks | IndexedDB | Client |
| **Route Params** | React Router | Widgets | Navigation Actions| URL | URL |
| **Active Theme** | Platform Store | CSS Engine | User Toggle | LocalStorage | LocalStorage |
| **AI Interventions**| Event Bus | Adaptive Widgets| WebSocket Client| Memory | Event Bus |

==================================================
SECTION 3 — EVENT ARCHITECTURE
==================================================

| Event | Producer | Consumers | Payload | Priority | Sync/Async | Retry Behavior |
|---|---|---|---|---|---|---|
| `LOGIN_SUCCESS` | Auth Form | Router, WS Client | `{ token, userId }` | High | Async | Max 3 retries |
| `PLAN_GENERATED` | Onboarding | Mission Control, Map| `{ planId, nodeCount }`| High | Async | None |
| `SESSION_STARTED` | Mission Control | Studio, Timer, WS | `{ nodeId, timestamp }`| Critical | Sync | N/A |
| `SESSION_PAUSED` | Studio Timer | Adaptive Runtime | `{ timestamp }` | Medium | Sync | Flush to DB |
| `SESSION_COMPLETED`| Studio Timer | Assessment Engine | `{ nodeId, duration }`| Critical | Async | Queue offline |
| `NODE_SELECTED` | The Map | Studio | `{ nodeId }` | Medium | Sync | N/A |
| `ASSESSMENT_SUBMITTED`| The Mirror | Learner, Planning | `{ score, confidence }`| High | Async | Queue offline |
| `AI_INTERVENTION` | WS Client | Event Bus (Nudges) | `{ type, message, id }`| Medium | Sync | Drop if stale |
| `NOTIFICATION_RECEIVED`| WS Client | Toast Manager | `{ title, level }` | Low | Sync | Drop if stale |
| `THEME_CHANGED` | Engine Room | DOM `:root` | `{ theme: 'dark' }` | Low | Sync | N/A |

==================================================
SECTION 4 — EVENT BUS DESIGN
==================================================

- **Server State → React Query:** Strictly used for data fetching, caching, and mutation states. *Why: Built-in deduping, background fetching, and cache management.*
- **URL State → React Router:** For all view/layout transitions. *Why: Browser history compatibility and deep linking.*
- **Global UI State → React Context / Zustand:** Minimal use for true global UI states (e.g., Theme, Sidebar toggle). *Why: Avoids props drilling without the complexity of Redux.*
- **Cross-Widget Communication → Custom Event Bus (PubSub):** Used for highly decoupled sibling widgets that must react to instantaneous events (e.g., `AI_INTERVENTION` triggering a nudge in the Studio). *Why: React Context causes too many re-renders for high-frequency events. PubSub is O(1) and bypasses the render tree.*
- **Real-Time Data → WebSocket:** The WS Client runs as a background singleton. **NO component communicates directly with the WebSocket.** The WS Client parses incoming messages and publishes them to the Event Bus, or calls React Query's `invalidateQueries`. *Why: Enforces a strict unidirectional data flow and allows WS connections to drop and reconnect transparently without unmounting React components.*

==================================================
SECTION 5 — NAVIGATION STATE MACHINE
==================================================

**State Machine Nodes:** `UNAUTHENTICATED`, `ONBOARDING`, `MISSION_CONTROL`, `STUDIO`, `MIRROR`.

- **Allowed Transitions:**
  - `UNAUTHENTICATED` → `ONBOARDING` (If no plan exists)
  - `UNAUTHENTICATED` → `MISSION_CONTROL` (If plan exists)
  - `ONBOARDING` → `MISSION_CONTROL` (Post-plan generation)
  - `MISSION_CONTROL` ↔ `MAP` / `LIBRARY` / `SETTINGS`
  - `MISSION_CONTROL` → `STUDIO` (Starts focus)
  - `STUDIO` → `MIRROR` (Completes focus)
  - `MIRROR` → `MISSION_CONTROL` (Completes reflection)

- **Forbidden Transitions:**
  - `STUDIO` → `MISSION_CONTROL` (Without explicit warning/abort dialog).
  - `MIRROR` → `STUDIO` (Must route through Mission Control to get next step).

- **Conditional Transitions:**
  - If a user closes the tab in `STUDIO` and reopens, state machine resumes at `STUDIO` (Session resume).

- **Failure & Recovery Transitions:**
  - Token Expiry anywhere → `UNAUTHENTICATED`.
  - Fetch Failure on `MISSION_CONTROL` → Stay on `MISSION_CONTROL`, show offline state.

==================================================
SECTION 6 — EXPERIENCE COMMUNICATION
==================================================
Experiences **never** mutate each other's state directly. Communication happens via structural boundaries:

1. **Mission Control → Studio:** Passes context strictly via URL params (`/studio/node-123`).
2. **Studio → Mirror:** Studio triggers `SESSION_COMPLETED` API call, which succeeds. Studio then navigates to `/mirror/session-456`.
3. **Mirror → Mission Control:** Mirror submits assessment to API. On success, it calls `queryClient.invalidateQueries(['dashboard'])` and navigates to `/mission`. Mission Control independently fetches the newly updated state.
4. **Library → Map:** Map does not know Library exists. Library uploads a resource, which the backend Planning Engine integrates. Map UI naturally updates on next background poll.

==================================================
SECTION 7 — URL ARCHITECTURE
==================================================

**Core Routes (Shareable / Deep Links):**
- `/` - Public Landing
- `/login` - Authentication
- `/map` - The full curriculum graph (Shareable if public profile enabled)
- `/map/node/:nodeId` - Deep link to a specific skill node description
- `/library` - Resource repository

**Contextual Routes (Non-Shareable / Ephemeral):**
- `/mission` - Mission Control (Relative to current logged-in user state)
- `/studio/:nodeId` - Active session. (If a user pastes this link but has no active session ticket for `nodeId`, redirect to `/mission`).
- `/mirror/:sessionId` - Reflection form for a specific completed session. (Redirect to `/mission` if already completed).
- `/settings` - Engine Room preferences.

**Search Params:**
- `?filter=completed` (Library)
- `?mode=review` (Studio - indicates a non-graded refresher session)

==================================================
SECTION 8 — SERVER STATE ARCHITECTURE
==================================================

- **React Query Ownership:** Only the API client (Axios/Fetch instance) interacts with React Query.
- **Cache Keys:** Strongly typed array keys: `['dashboard', 'metrics']`, `['plan', 'dag', { userId }]`, `['session', 'current']`.
- **Refetch Policies:**
  - Dashboard: Stale after 1 minute.
  - Map DAG: Stale after 1 hour.
  - Library: Stale after 5 minutes.
- **Invalidation Rules:** Any mutation to a domain (e.g., `POST /library/resource`) invalidates the entire domain key (`['library']`).
- **Optimistic Updates:** Applied ONLY to non-critical interactions (e.g., pinning a resource in the Library, or marking a notification as read). **Never** used for Assessment grading or Session completion.
- **Background Refresh:** Focus-based (`refetchOnWindowFocus`) enabled for Mission Control to ensure data is fresh when returning to the tab.
- **Polling:** Disabled globally. Real-time updates handled via WebSocket.

==================================================
SECTION 9 — AI RUNTIME FLOW
==================================================

1. **Mission Recommendation:** React Query fetches `GET /intelligence/next-action`. User clicks "Start".
2. **Start Session:** Frontend calls `POST /session/start`. Router navigates to `/studio/:nodeId`.
3. **Telemetry (Continuous):** Studio mounts, establishing a WebSocket connection. Studio emits high-frequency telemetry events (`scroll_depth`, `focus_blur`, `time_spent`) to the WS.
4. **Adaptive Runtime (Evaluation):** Backend engine processes telemetry. Identifies cognitive stall.
5. **Intervention:** Backend pushes WS message: `{"type": "INTERVENTION", "action": "SUGGEST_BREAK"}`.
6. **Frontend Event Bus:** WS Client parses message, fires `AI_INTERVENTION` on Event Bus.
7. **Widget Reaction:** Adaptive Nudge Widget (listening to Event Bus) slides into view.
8. **User Action:** User clicks "Accept Break". Widget emits `POST /session/pause`.
9. **Reflection (End):** Session resumes, completes, routes to Mirror. Reflection submitted.
10. **Dashboard Refresh:** Submit mutation invalidates `['dashboard']`, UI updates.

==================================================
SECTION 10 — FAILURE FLOW
==================================================

- **Offline Detection:** `window.addEventListener('offline')`. UI displays global subtle amber banner.
- **API Timeout (504/408):** React Query catches. Retry `x3` with exponential backoff (1s, 2s, 4s). Display error boundary if critical (e.g., Mirror submission).
- **WebSocket Disconnect:** 
  - *Recovery:* Ping-pong heartbeat fails. WS Client attempts silent reconnect infinitely with backoff. 
  - *UX:* AI Coach disables (greyed out). Timer continues locally.
- **Token Expiry (401):** 
  - *Detection:* Axios interceptor catches 401. 
  - *Recovery:* Attempt silent refresh (if refresh tokens exist). If fails, purge state, route to `/login?redirect=...`.
- **Partial Failures:** Handled via React Error Boundaries wrapping individual Widgets. If the AI Coach crashes, the Focus Timer and Content Reader remain operational.
- **Cache Corruption / Stale Data:** Hard version mismatch detected via API header -> Wipe IndexedDB cache -> `window.location.reload()`.

==================================================
SECTION 11 — CONCURRENCY MODEL
==================================================

- **Multiple API requests:** React Query naturally deduplicates identical inflight `GET` requests.
- **Parallel widgets:** Wrapped in independent React `<Suspense>` boundaries to prevent a slow widget from blocking the entire experience.
- **Navigation during loading:** Router transitions are not blocked by API fetches. Render Skeleton immediately, fetch data on mount.
- **Rapid clicking / Double submissions:** All mutation hooks (`useMutation`) explicitly disable their bound `<button>` components via the `isPending` state.
- **Multiple browser tabs:** Broadcast Channel API broadcasts `SESSION_STARTED` to other tabs. If Tab B is on Mission Control and Tab A starts a session, Tab B displays a banner: "Session active in another tab".
- **Race conditions:** Handled via backend idempotency keys on critical `POST` mutations (e.g., Session Complete).

==================================================
SECTION 12 — FRONTEND ARCHITECTURE REVIEW
==================================================

**Identified Risks & Recommendations:**

1. **State Duplication Risk:**
   - *Risk:* Passing React Query data into a Zustand store for manipulation.
   - *Recommendation:* **Forbidden**. React Query is the exclusive owner of Server State. Any derived state must be computed on the fly (memoized) or handled by the backend.

2. **Circular Dependencies:**
   - *Risk:* Studio depends on Mirror for grading logic, Mirror depends on Studio for session data.
   - *Recommendation:* Both must depend strictly on the Router URL parameters and Backend APIs. No cross-importing of domain logic.

3. **Hidden Coupling:**
   - *Risk:* Widgets directly listening to WebSocket streams.
   - *Recommendation:* The Event Bus acts as a strict abstraction layer. Widgets subscribe to semantic events (`AI_INTERVENTION`), ignorant of whether the source was a WebSocket, Server-Sent Event, or Local Mock.

4. **Performance Bottlenecks:**
   - *Risk:* High-frequency telemetry (mouse movements, scroll) blocking the main thread.
   - *Recommendation:* Telemetry must be handled via a Web Worker, throttling emission to the WebSocket to 1Hz, freeing the main thread for UI rendering.

5. **Testability:**
   - *Risk:* Hard to test UI states dependent on real-time WS interventions.
   - *Recommendation:* The Event Bus architecture allows deterministic E2E testing. Test scripts can manually inject `AI_INTERVENTION` events into the bus to trigger and assert UI states without needing a live backend connection.
