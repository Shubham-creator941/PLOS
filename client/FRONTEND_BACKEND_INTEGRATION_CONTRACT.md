# FRONTEND–BACKEND INTEGRATION CONTRACT (FBIC)

==================================================
SECTION 1 — INTEGRATION PHILOSOPHY
==================================================

- **Source of Truth:** The Backend Engines are the absolute source of truth. The frontend is exclusively a localized projection of server state.
- **Ownership boundaries:** Frontend owns UI state (e.g., active tabs, theme). Backend owns domain state (e.g., plans, scores, timer duration logs).
- **Request lifecycle:** Component requests data -> React Query checks cache -> (If stale) API Client fetches -> Zod validates response -> Cache updates -> Component renders.
- **Response lifecycle:** All responses must match deterministic DTOs. Unrecognized fields are stripped. Malformed responses throw a standard validation error caught by boundaries.
- **Mutation lifecycle:** Component triggers mutation -> Optimistic update applied (if permitted) -> API Call -> On Success: Invalidate related Query keys -> On Error: Rollback context snapshot.
- **Event lifecycle:** WebSocket receives message -> Validates schema -> Dispatches to Event Bus -> Widgets react synchronously.
- **Error propagation:** Axios Interceptor catches HTTP errors -> Normalizes to `{ code, message, details }` -> React Query throws -> Error Boundary catches and renders localized fallback.
- **Synchronization principles:** The frontend favors "Stale-while-revalidate" for dashboards, but requires absolute consistency (No cache) for Assessments and Session data.

==================================================
SECTION 2 — EXPERIENCE ↔ ENGINE CONTRACT MATRIX
==================================================

### Mission Control
- **Primary Engine:** Dashboard Engine
- **Secondary Engine:** Learning Intelligence
- **Consumed APIs:** `GET /intelligence/mission/today`, `GET /dashboard/velocity`
- **Produced APIs:** `POST /session/start`
- **Consumed Events:** None
- **Produced Events:** `SESSION_START_REQUEST`
- **Refresh Strategy:** Stale-while-revalidate (5 mins), Refetch on window focus.
- **Caching Strategy:** IndexedDB persistent.
- **Offline Strategy:** Display cached dashboard; disable "Start Session" CTA.
- **Failure Strategy:** Localized error boundaries per widget.

### Studio
- **Primary Engine:** Learning Session Engine
- **Secondary Engine:** Adaptive Runtime, Resource Engine
- **Consumed APIs:** `GET /resource/:id`
- **Produced APIs:** `POST /session/pause`, `POST /session/end`
- **Consumed Events:** `RUNTIME_INTERVENTION`
- **Produced Events:** `TELEMETRY_TICK` (via WS)
- **Refresh Strategy:** Real-time (WebSocket).
- **Caching Strategy:** No caching for session state.
- **Offline Strategy:** Fallback to local timer. Queue telemetry in IndexedDB.
- **Failure Strategy:** If WS disconnects, enter degraded mode (AI Coach disabled, Timer continues).

### Map
- **Primary Engine:** Planning Engine
- **Secondary Engine:** Journey Engine
- **Consumed APIs:** `GET /plan/current`, `GET /journey/progress`
- **Produced APIs:** `POST /plan/regenerate` (rare)
- **Consumed Events:** None
- **Produced Events:** `NODE_SELECTED`
- **Refresh Strategy:** Background polling (every 1 hour).
- **Caching Strategy:** Heavy caching (IndexedDB).
- **Offline Strategy:** Fully operational read-only graph.
- **Failure Strategy:** Global error boundary with "Retry" action.

### Mirror
- **Primary Engine:** Assessment Engine
- **Secondary Engine:** Learner Engine
- **Consumed APIs:** `GET /assessment/prompt`
- **Produced APIs:** `POST /assessment/grade`
- **Consumed Events:** None
- **Produced Events:** `ASSESSMENT_COMPLETE`
- **Refresh Strategy:** Manual fetch on mount.
- **Caching Strategy:** None. Strict real-time read.
- **Offline Strategy:** Cache submitted payload in IndexedDB queue. Return user to dashboard.
- **Failure Strategy:** Inline form validation errors.

==================================================
SECTION 3 — WIDGET ↔ ENGINE CONTRACTS
==================================================

- **Focus Timer (Studio):**
  - *Owner:* Learning Session Engine.
  - *Consumed endpoint:* `GET /session/active`
  - *Produced mutation:* `POST /session/tick` (fallback to WS).
  - *Realtime:* Yes.
  - *Cache ownership:* None.
  - *Optimistic update:* Yes (Ticks locally, syncs periodically).
  - *Offline:* Continues ticking locally.

- **Adaptive Nudge (Studio):**
  - *Owner:* Adaptive Runtime.
  - *Consumed endpoint:* None (WS only).
  - *Produced mutation:* `POST /runtime/nudge/response`
  - *Realtime:* Yes.
  - *Offline:* Disabled.

- **Today's Mission (Mission Control):**
  - *Owner:* Learning Intelligence.
  - *Consumed endpoint:* `GET /intelligence/next-action`
  - *Produced mutation:* None.
  - *Realtime:* No.
  - *Offline:* Displays cached CTA.

==================================================
SECTION 4 — ENDPOINT RESPONSIBILITY MATRIX
==================================================

| Endpoint | Owner Engine | Method | Auth Req | Idempotent | Caching | Retry | Timeout |
|---|---|---|---|---|---|---|---|
| `/auth/login` | Authentication | POST | No | No | None | None | 10s |
| `/intelligence/next`| Learning Intelligence| GET | Yes | Yes | 5m | 3x | 10s |
| `/plan/current` | Planning | GET | Yes | Yes | 1h | 3x | 15s |
| `/session/start` | Learning Session | POST | Yes | No | None | None | 10s |
| `/session/end` | Learning Session | POST | Yes | Yes | None | Queue | 10s |
| `/assessment/grade` | Assessment | POST | Yes | No | None | Queue | 30s |

==================================================
SECTION 5 — DATA OWNERSHIP MATRIX
==================================================

| Entity | Owner | Read By | Mutated By | Cache Owner | Persistence | Conflict Resolution |
|---|---|---|---|---|---|---|
| **User Profile** | Learner Engine | Global UI | Engine Room | React Query | IndexedDB | Last Write Wins |
| **Syllabus DAG** | Planning Engine | Map | AI Planner | React Query | IndexedDB | Server Overwrites |
| **Active Session**| Session Engine | Studio | Studio Timer | None | Memory | Client Time Sync |
| **Assessment** | Assessment Engine | Mirror | Mirror Form | None | Queue | Reject Stale |

==================================================
SECTION 6 — QUERY CONTRACTS
==================================================

- **Key:** `['mission', 'next-action']`
  - *Owner:* Learning Intelligence Engine
  - *Invalidation:* On `SESSION_END` or `ASSESSMENT_SUBMITTED`.
  - *Refresh:* `refetchOnWindowFocus: true`.
  - *Suspense:* True.
  - *Persistence:* Yes.
  - *Retry:* 3x exponential.

- **Key:** `['plan', 'dag', { userId }]`
  - *Owner:* Planning Engine
  - *Invalidation:* On `PLAN_REGENERATED` or node completion.
  - *Refresh:* `refetchOnMount: false` (Relies on staleTime).
  - *Suspense:* True.
  - *Persistence:* Yes.

==================================================
SECTION 7 — MUTATION CONTRACTS
==================================================

- **Mutation:** `useSubmitAssessment`
  - *Owner:* Assessment Engine
  - *Input DTO:* `{ sessionId, responses: [{ questionId, answer }] }`
  - *Output DTO:* `{ score, nextNodeId, passed }`
  - *Optimistic policy:* None. Requires server grading.
  - *Rollback policy:* N/A.
  - *Invalidations:* `['mission']`, `['plan']`, `['dashboard']`.
  - *Event emissions:* `ASSESSMENT_GRADED`.
  - *Navigation effects:* Navigates to `/mission` on success.

==================================================
SECTION 8 — REALTIME CONTRACT
==================================================

- **WebSocket channels:** `wss://api.plos.dev/v1/stream`
- **Subscriptions:** Authenticated users auto-subscribe to `room:user_{id}`.
- **Events:** `TELEMETRY_TICK` (Client -> Server), `AI_INTERVENTION` (Server -> Client).
- **Payload schemas:** `{ type: string, payload: Record<string, any>, timestamp: number }`.
- **Acknowledgements:** Server responds with `{ type: 'ACK', eventId }` for critical client ticks.
- **Reconnect behavior:** Exponential backoff. Resubscribes to active rooms automatically.
- **Heartbeat:** Client sends `{ type: 'PING' }` every 30s. Server sends `PONG`.
- **Ordering guarantees:** Messages processed in order of the embedded `timestamp`, not arrival time.

==================================================
SECTION 9 — ERROR CONTRACT
==================================================

- **Backend error format:**
  ```json
  {
    "error": {
      "code": "VALIDATION_FAILED",
      "message": "Invalid payload parameters",
      "details": { "field": "Must be > 0" }
    }
  }
  ```
- **Frontend normalization:** Axios interceptor maps this to a standard `AppError` class.
- **Validation errors (400):** Passed directly to React Hook Form `setError`.
- **Authorization errors (401/403):** 401 triggers token refresh. If failed, purges state and redirects to `/login`.
- **Conflict errors (409):** Displays Toast: "State is out of sync. Please refresh."
- **Network/Offline errors:** Caught by global boundary.

==================================================
SECTION 10 — OFFLINE CONTRACT
==================================================

- **Cached entities:** Dashboard metrics, Planning DAG, User Profile, Library summaries.
- **Mutation queue:** Critical POSTs (`/session/end`, `/assessment/submit`) failing due to network are serialized into IndexedDB (`offline-mutations` store).
- **Conflict handling:** Client passes `lastSyncTimestamp`. If server detects a conflict, the mutation is rejected, and the client is forced to hard-refresh.
- **Replay order:** FIFO (First In, First Out). The queue pauses if any replay fails with a non-5xx error.
- **Session recovery:** If a session drops offline, the client buffers telemetry and `SESSION_END`. Upon reconnect, it POSTs the bulk payload.

==================================================
SECTION 11 — SECURITY CONTRACT
==================================================

- **JWT ownership:** Handled securely by the Axios API client. Stored in memory (preferable) or LocalStorage.
- **Refresh token:** HTTP-only secure cookie, never accessible to JavaScript.
- **CSRF:** Backend enforces standard CSRF token checks for non-GET requests if session cookies are used.
- **CORS:** Backend whitelists the frontend production and local dev domains.
- **Rate limiting:** 429 Too Many Requests responses trigger a frontend backoff (disabling buttons, pausing polls).
- **PII masking:** The frontend strips any sensitive PII from telemetry events before transmitting over WebSockets.

==================================================
SECTION 12 — ENGINEERING REVIEW
==================================================

**Coupling:** Extremely loose. The frontend relies purely on predefined Zod schemas representing backend DTOs. Changes to backend database structures have zero impact on the frontend as long as the DTO contract holds.
**Consistency:** High. The strict rule mapping specific mutation successes to Query Invalidation prevents UI staleness.
**Extensibility:** New engines can be integrated by adding a new Query Key and DTO schema without altering the core Axios/Query setup.
**Failure tolerance:** Robust. The combination of IndexedDB persistence for GETs and an offline mutation queue for critical POSTs ensures the user never loses session data during transient network drops.
