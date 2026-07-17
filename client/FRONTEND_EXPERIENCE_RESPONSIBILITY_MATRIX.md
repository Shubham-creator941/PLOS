# FRONTEND EXPERIENCE RESPONSIBILITY MATRIX (FERM)

==========================================================
SECTION 1 — EXPERIENCE INVENTORY
==========================================================

### 1. Authentication
- **Purpose:** Secure identity verification and access control.
- **Primary Goal:** Authenticate the user and establish a secure session token.
- **User Persona:** Unauthenticated Learner.
- **Entry Conditions:** Navigating to app without valid token.
- **Exit Conditions:** Successful token acquisition or account creation.
- **Success Criteria:** User is securely routed to Onboarding or Mission Control.

### 2. Onboarding
- **Purpose:** Baseline calibration of the learner's knowledge and goals.
- **Primary Goal:** Capture constraints, skill level, and primary learning objective to feed the Planning Engine.
- **User Persona:** New Learner.
- **Entry Conditions:** First login, no active Learning Plan.
- **Exit Conditions:** Plan generated successfully.
- **Success Criteria:** Planning Engine creates a deterministic roadmap and user is routed to Mission Control.

### 3. Mission Control
- **Purpose:** The ambient home state for the learner.
- **Primary Goal:** Provide a high-level view of momentum and route the user to their next immediate learning action.
- **User Persona:** Active Learner.
- **Entry Conditions:** Authenticated login with active plan.
- **Exit Conditions:** Launching the Studio or navigating to Map/Library.
- **Success Criteria:** User clicks "Start Session" within 10 seconds of opening the app.

### 4. Studio
- **Purpose:** Immersive, distraction-free execution environment.
- **Primary Goal:** Facilitate deep cognitive focus and adaptive learning.
- **User Persona:** Focused Learner.
- **Entry Conditions:** Triggered "Start Session" action.
- **Exit Conditions:** Session time expires or user manually aborts/completes.
- **Success Criteria:** User maintains focus without exiting the workspace until the cognitive block is complete.

### 5. Map
- **Purpose:** Macro-level visibility of the curriculum and long-term trajectory.
- **Primary Goal:** Orient the user within their overall learning journey.
- **User Persona:** Planning/Reflective Learner.
- **Entry Conditions:** User navigates to view roadmap.
- **Exit Conditions:** User selects a specific node to launch in Studio or exits via Navigation.
- **Success Criteria:** User clearly understands their current position and dependencies in the curriculum.

### 6. Mirror
- **Purpose:** Metacognition, knowledge retrieval, and active assessment.
- **Primary Goal:** Force the user to recall information to cement learning and feed the Assessment Engine.
- **User Persona:** Reflective Learner.
- **Entry Conditions:** Automatically triggered post-Session or Daily Routine.
- **Exit Conditions:** Assessment submitted and graded.
- **Success Criteria:** Adaptive Runtime updates user mastery parameters based on Mirror results.

### 7. Library
- **Purpose:** Curation of ingested resources, notes, and references.
- **Primary Goal:** Provide a structured repository of all consumed knowledge.
- **User Persona:** Searching/Reviewing Learner.
- **Entry Conditions:** User needs to look up past material or upload a new resource.
- **Exit Conditions:** User finds the material or finishes upload.
- **Success Criteria:** Instant retrieval of learning artifacts.

### 8. Engine Room
- **Purpose:** System configuration and transparency.
- **Primary Goal:** Manage settings, profiles, integrations, and view AI Audit logs.
- **User Persona:** Advanced Learner / Admin.
- **Entry Conditions:** User navigates to Settings.
- **Exit Conditions:** User saves preferences and returns to main UI.
- **Success Criteria:** Preferences deterministically update global state.

==========================================================
SECTION 2 — EXPERIENCE RESPONSIBILITY MATRIX
==========================================================

| Experience | Primary Backend Engine | Secondary Engines | Primary Responsibility | Requires Auth? | Requires Profile? | Requires Active Session? | Read Only? | Editable? | Offline Capable? | Criticality |
|---|---|---|---|---|---|---|---|---|---|---|
| **Authentication** | Authentication | Platform | Issue/Validate tokens | No | No | No | No | Yes | No | P0 |
| **Onboarding** | Learner Engine | Planning | Establish baseline & goals | Yes | No | No | No | Yes | No | P0 |
| **Mission Control** | Dashboard Engine | Learning Intelligence | Route user to next action | Yes | Yes | No | Yes | No | Yes (Cached) | P1 |
| **Studio** | Learning Session | Adaptive Runtime | Orchestrate active focus | Yes | Yes | Yes | No | Yes | Partial | P0 |
| **Map** | Planning Engine | Journey Engine | Visualize curriculum topology | Yes | Yes | No | Yes | Partial | Yes (Cached) | P1 |
| **Mirror** | Assessment Engine | Learner Engine | Execute knowledge retrieval | Yes | Yes | No | No | Yes | No | P1 |
| **Library** | Resource Engine | Platform | Manage knowledge artifacts | Yes | Yes | No | No | Yes | Yes (Cached) | P2 |
| **Engine Room**| Platform Engine | Audit Engine | Manage system & preferences | Yes | Yes | No | No | Yes | No | P3 |

==========================================================
SECTION 3 — WORKSPACE DECOMPOSITION
==========================================================

### Mission Control
- **Today's Mission:** The single most important CTA generated by the AI (e.g., "Start Node: Distributed Caching").
- **Learning Overview:** Mini-dashboard showing velocity (Github-style graph).
- **Recommendations:** Secondary actions if the user rejects the primary mission.
- **Momentum:** Streak counters and mastery aggregates.
- **Quick Actions:** FABs for logging an external resource or arbitrary reflection.

### Studio
- **Learning Workspace:** The primary content consumption area (Markdown reader, video player, or PDF viewer).
- **Focus Timer:** Deterministic countdown/countup clock managing the Pomodoro or flow state.
- **Notes:** Scratchpad bound to the current session block.
- **AI Coach:** Context-aware chat panel mapped to the active material.
- **Adaptive Suggestions:** Ephemeral nudges (e.g., "Cognitive load high. Take a 5-minute break?").

### Map
- **Roadmap:** Directed Acyclic Graph (DAG) visualizer of the curriculum.
- **Milestones:** List-based alternative view of macro-goals.
- **Skill Graph:** Radar chart showing competency across different domains.

### Mirror
- **Reflection:** Daily or post-session qualitative text/audio input.
- **Assessment:** Quantitative or structured teach-back interface (Flashcards, Quizzes).
- **Mastery:** Review of past graded submissions.

### Library
- **Resources:** Grid of uploaded PDFs, URLs, and external links.
- **Bookmarks:** High-yield highlights saved during Studio sessions.
- **Generated Notes:** Synthesized summaries produced by the AI after a session.

### Engine Room
- **Profile:** Basic identity management.
- **Preferences:** UI themes, notification thresholds, accessibility.
- **Admin/Audit:** Read-only view of the AI's deterministic decision logs (Why did the Adaptive Runtime trigger?).

==========================================================
SECTION 4 — WIDGET RESPONSIBILITY MATRIX
==========================================================

| Widget Name | Owner Backend Engine | Consumes APIs | Produces Actions | Refresh Strategy | Trigger | Loading State | Empty State | Failure State | Reusable? |
|---|---|---|---|---|---|---|---|---|---|
| **Today's Mission** | Learning Intelligence | `GET /intelligence/next-action` | `POST /session/start` | On Mount / Post-Session | Automatic | Skeleton | "Plan completed" | Error boundary with retry | No |
| **Focus Timer** | Learning Session | `GET /session/current` | `POST /session/pause` | WebSocket / Tick | Manual Start | Spinner | N/A | Local degradation | Yes |
| **AI Coach** | Adaptive Runtime | `WS /runtime/chat` | `POST /runtime/query` | Real-time | Manual | Typing indicator | "Ask a question" | Disconnected alert | Yes |
| **Roadmap Graph** | Planning Engine | `GET /plan/graph` | `POST /plan/regenerate` | Stale-while-revalidate | Automatic | Skeleton Tree | "Generate Plan" | Read-only cache fallback| No |
| **Teach-back** | Assessment Engine | `GET /assessment/prompt` | `POST /assessment/submit` | On Mount | Automatic | Skeleton | N/A | Retry Submission | No |
| **Mastery Meter** | Dashboard Engine | `GET /dashboard/stats` | None | Background Polling | Automatic | Shimmer block | 0% Default | Hidden | Yes |

==========================================================
SECTION 5 — EXPERIENCE TRANSITIONS
==========================================================

**Authentication → Onboarding**
- *Trigger:* Successful login with a newly created account.
- *Condition:* User profile lacks baseline parameters.
- *Expected Outcome:* User is locked into Onboarding Wizard.

**Onboarding → Mission Control**
- *Trigger:* Submission of baseline data.
- *Condition:* Planning Engine successfully returns a 201 Created for the new roadmap.
- *Expected Outcome:* User lands on Mission Control.

**Mission Control → Studio**
- *Trigger:* User clicks "Start Mission".
- *Condition:* Valid network connection to establish Session WebSocket.
- *Expected Outcome:* Global navigation hides, Focus Timer initializes, Workspace loads.

**Studio → Mirror**
- *Trigger:* Focus Timer naturally expires OR user clicks "Complete".
- *Condition:* Session time > minimum threshold to warrant reflection.
- *Expected Outcome:* Studio teardown, User is presented with a Teach-back assessment.

**Mirror → Mission Control**
- *Trigger:* Assessment submitted.
- *Condition:* Assessment Engine acknowledges receipt.
- *Expected Outcome:* Returns to Mission Control; Today's Mission updates automatically.

**Map → Studio**
- *Trigger:* User selects a specific future node bypassing the immediate AI recommendation.
- *Condition:* Node prerequisites are met.
- *Expected Outcome:* Studio launches with the selected node's content.

==========================================================
SECTION 6 — BACKEND API RESPONSIBILITY
==========================================================

### Mission Control
- **Endpoints:** `GET /dashboard/overview`, `GET /intelligence/next-action`
- **Methods:** `GET`
- **Refresh Strategy:** Stale-while-revalidate.
- **Caching:** Cache for 5 minutes.
- **Why:** Dashboards are read-heavy. Deterministic stats don't change until a session is completed.

### Studio
- **Endpoints:** `POST /session/start`, `WS /runtime/stream`, `POST /session/end`
- **Methods:** `POST`, WebSocket.
- **Refresh Strategy:** Real-time via WebSocket.
- **Caching:** None. Memory only.
- **Why:** The Adaptive Runtime requires bi-directional real-time telemetry (time spent, scroll depth, interactions) to trigger deterministic interventions. Standard REST polling is too latent.

### Map
- **Endpoints:** `GET /plan/current`, `PATCH /plan/node/:id`
- **Methods:** `GET`, `PATCH`
- **Refresh Strategy:** Background Refresh.
- **Caching:** Heavy caching (IndexedDB).
- **Why:** The curriculum graph is large and mutates slowly (only upon node completion). Optimistic updates should be used when marking a node read.

### Mirror
- **Endpoints:** `GET /assessment/pending`, `POST /assessment/grade`
- **Methods:** `GET`, `POST`
- **Refresh Strategy:** Manual explicit fetch on transition.
- **Caching:** None.
- **Why:** Assessments must be deterministic and securely validated. Optimistic updates are forbidden for grading logic.

==========================================================
SECTION 7 — STATE OWNERSHIP
==========================================================

- **Server State (React Query / SWR):** 
  - Ownership: Backend Engines.
  - Examples: Roadmap DAG, Mastery Statistics, Profile Data, Resource Library.
  - Rule: Frontend must NEVER mutate this without an API mutation.
- **Client State (Zustand / Context):** 
  - Ownership: Global Frontend.
  - Examples: Theme (Dark/Light), Sidebar expanded/collapsed state, Active Modal IDs.
  - Rule: Must be entirely synchronous and independent of network.
- **Temporary UI State (React `useState`):** 
  - Ownership: Local Components.
  - Examples: Current typed text in the AI Coach chat input before sending, active tab index.
  - Rule: Destroyed on component unmount.
- **Persistent Local Storage:** 
  - Ownership: Auth / Platform.
  - Examples: JWT Tokens, Offline curriculum cache.
- **Memory Only:** 
  - Ownership: Security / Session.
  - Examples: Live telemetry data being buffered before WebSocket transmission.

==========================================================
SECTION 8 — FAILURE STRATEGY
==========================================================

### Mission Control
- **Loading:** Skeleton screens matching the exact widget dimensions.
- **API Failure:** Show stale cached data with a subtle "Offline" indicator.
- **Retry Policy:** Exponential backoff.

### Studio
- **Loading:** Full-screen blocking spinner while establishing WebSocket.
- **API Failure (Disconnect):** Enter "Local Degradation Mode". Timer continues, but AI Coach disables. Cache notes locally.
- **Fallback Strategy:** Sync local session logs to `/session/sync` upon reconnection.

### Mirror
- **Loading:** Inline spinners on submit buttons.
- **Validation Failure:** Clear inline field errors mapped strictly to backend 400 responses.
- **Offline Mode:** Cache the assessment payload in IndexedDB and queue for background sync. Do NOT block the user from returning to Mission Control.

### Map
- **Loading:** Shimmer effect over the DAG visualizer.
- **API Failure:** Load last known graph from LocalStorage. Disable graph mutations.

==========================================================
SECTION 9 — RESPONSIBILITY BOUNDARIES
==========================================================

### Mission Control
- **Responsible:**
  - ✔ Aggregating high-level metrics.
  - ✔ Routing the user to the Studio.
- **MUST NEVER:**
  - ✖ Allow deep editing of the learning plan.
  - ✖ Render active learning content or resources directly.

### Studio
- **Responsible:**
  - ✔ Telemetry tracking (Focus time).
  - ✔ Presenting isolated learning materials.
  - ✔ Bi-directional chat with Adaptive Runtime.
- **MUST NEVER:**
  - ✖ Allow navigation away without explicit warning (loss of focus).
  - ✖ Display global stats or leaderboards (distractions).

### Map
- **Responsible:**
  - ✔ Rendering the dependency tree.
  - ✔ Allowing structural modifications to the plan (if unlocked).
- **MUST NEVER:**
  - ✖ Track active session time.
  - ✖ Grade user knowledge.

### Mirror
- **Responsible:**
  - ✔ Capturing user input for teach-backs.
  - ✔ Displaying graded feedback from the Assessment Engine.
- **MUST NEVER:**
  - ✖ Skip validation or grading logic client-side.
  - ✖ Be bypassed if marked as mandatory by the Adaptive Runtime.

==========================================================
SECTION 10 — ENGINEERING REVIEW
==========================================================

**Coupling Problems:**
- *Risk:* The Studio Experience is highly coupled to the Adaptive Runtime via WebSockets.
- *Recommendation:* Implement a strict Event Bus interface in the frontend. The WebSocket client should dispatch generic events (`ON_INTERVENTION`, `ON_FOCUS_LOST`) rather than the UI components listening directly to the socket.

**Responsibility Leaks:**
- *Risk:* Dashboard fetching Assessment data directly.
- *Recommendation:* Strict separation of concerns via the Backend-for-Frontend (BFF) or API Gateway. The frontend Mission Control should only call the Dashboard Engine, which aggregates data internally.

**State Duplication:**
- *Risk:* Storing the "Current Node" in both the Map state and the Studio state.
- *Recommendation:* Rely purely on URL routing (`/studio/:nodeId`) as the source of truth for active entities to prevent diverging states.

**Scalability Risks:**
- *Risk:* The Map DAG visualizer becoming too heavy for the DOM if a syllabus has 500+ nodes.
- *Recommendation:* Implement canvas-based rendering (e.g., WebGL/Canvas API) for the Map instead of pure DOM/SVG nodes, and implement viewport culling.

**Offline Limitations:**
- *Risk:* The Studio loses connection, causing the session to drop.
- *Recommendation:* The Session Engine must support asynchronous reconciliation. The frontend must be trusted to keep a localized timer and telemetry buffer (using IndexedDB) that replays to the server upon reconnection, guaranteeing no lost focus time.
