# FRONTEND ARCHITECTURE BLUEPRINT

==================================================
SECTION 1 — CURRENT FRONTEND MODEL
==================================================
**Mental Model Identified:** Generic SaaS Dashboard / Task Manager

**Engineering Reasoning:**
The existing frontend implements a rigid, grid-based layout typical of enterprise CRMs, ERPs, or standard administrative panels. Its reliance on a static left sidebar, top navbar, and compartmentalized "cards" (e.g., Progress Rings, Activity Graphs, lists of "tasks") maps conceptually to project management tools like Jira or Asana. It treats learning as a series of administrative "to-dos" rather than an immersive, cognitive process. There is no structural representation of "intelligence" or "adaptivity"—only static data visualization widgets. 

==================================================
SECTION 2 — PRODUCT MENTAL MODEL
==================================================
**Target Mental Model:** Personal Learning Operating System (Learning OS) / Focus Studio

**Engineering Reasoning:**
When a learner opens this application, they should not feel like they are "checking off tasks at work." They should feel like they are stepping into an immersive, highly tuned cognitive environment—a **Focus Studio**. 

As an "Operating System," the frontend must act as the primary interface between human cognition and backend AI engines. It should fade into the background when deep focus is required and step forward proactively (via an AI Companion) when guidance, intervention, or reflection is needed. The architecture must prioritize flow states, ambient intelligence, and structural depth (workspaces) over flat lists and generic dashboards.

==================================================
SECTION 3 — INFORMATION ARCHITECTURE
==================================================
Instead of flat routing pages (e.g., `/dashboard`, `/tasks`), the IA is grouped into continuous, distinct **Experiences**:

1. **Onboarding & Identity**
   - *Responsibility:* Establishes the learner's baseline, ingests career goals, and calibrates the AI's understanding of the user.
2. **Mission Control**
   - *Responsibility:* The default entry state. A high-level, ambient overview of today's learning velocity, momentum, and the single most important recommended action.
3. **The Studio (Active Execution)**
   - *Responsibility:* A distraction-free, immersive mode for executing a learning session. Hides global navigation in favor of focus tools, adaptive interventions, and workspace materials.
4. **The Map (Journeys & Planning)**
   - *Responsibility:* The macro-view of the learner's trajectory. Visualizes skill trees, generated plans, and milestone progression.
5. **The Mirror (Reflection & Assessment)**
   - *Responsibility:* The metacognitive layer. Facilitates spaced repetition, teach-back assessments, and daily reflections to cement knowledge.
6. **The Library (Resources)**
   - *Responsibility:* Curation and organization of ingested learning materials, generated notes, and adaptive flashcards.
7. **The Engine Room (Settings)**
   - *Responsibility:* System preferences, integrations, and global controls.

==================================================
SECTION 4 — BACKEND ENGINE → FRONTEND EXPERIENCE MAPPING
==================================================
| Backend Engine | Purpose | Frontend Experience | Primary Widgets | Primary Interactions |
|---|---|---|---|---|
| **Authentication** | Access control | Global | Login Modal, Session Token | OAuth, Login, Logout |
| **Learner Engine** | Manages user profile & goals | Identity / The Engine Room | Goal Setup Wizard, Identity Card | Define goal, Set baseline |
| **Planning Engine** | Generates dynamic roadmaps | The Map | Roadmap Visualizer, Milestone Nodes | Regenerate plan, View syllabus |
| **Journey Engine** | Tracks state & progress | The Map | Progress Rings, Knowledge Tree | Mark milestone complete |
| **Learning Session Engine** | Orchestrates active study | The Studio | Focus Timer, Session Workspace | Start/Stop session, Enter focus |
| **Adaptive Runtime** | Real-time session adjustment | The Studio | Intervention Nudge, Difficulty Slider | Accept/Reject AI suggestion |
| **Assessment Engine** | Validates knowledge | The Mirror | Teach-back Input, Quiz Widget | Submit answer, Audio transcript |
| **Learning Intelligence** | Synthesizes insights & prompts | Mission Control | AI Coach Panel, Recommendation Feed | Chat with AI, Accept prompt |
| **Dashboard Engine** | Aggregates velocity & streaks | Mission Control | Learning Velocity Graph, Streak Card | View historical stats |
| **Notification Engine** | Asynchronous alerts | Global Navigation | Toast Notifications, Notification Center | Mark read, Act on alert |
| **Resource Engine** | Ingests and curates content | The Library | Content Grid, Source References | Upload PDF, Save link |
| **Audit Engine** | Logs systemic AI decisions | The Engine Room | AI Trace Log (Debug Mode) | View decision rationale |
| **Platform Engine** | System-wide config | Global | Theme Toggle, Connection Status | Change theme, check latency |

==================================================
SECTION 5 — NAVIGATION ARCHITECTURE
==================================================
To reinforce the Learning OS philosophy, navigation breaks away from the generic sidebar:

- **Command Palette (Primary Navigation):** Invoked via `Cmd+K`. The central nervous system for power users. Actions like "Start Focus Session," "Ask AI Tutor," or "Jump to Milestone" are executed here, reducing reliance on mouse travel.
- **Ambient Sidebar (Collapsed by default):** Minimalist icons representing the core experiences (Mission Control, The Map, The Library). Expands only on hover to maintain focus.
- **Top Navigation (Breadcrumbs & Context):** Replaces the static top-nav with deep contextual breadcrumbs (e.g., `AWS Architect -> Week 2 -> Load Balancing`).
- **Floating AI Companion:** A persistent, unobtrusive floating action button (FAB) or dock widget that allows instant invocation of the Learning Intelligence engine regardless of the current screen.

==================================================
SECTION 6 — SCREEN RESPONSIBILITY MATRIX
==================================================

### 1. Mission Control (Home)
- **Owner Engine:** Dashboard Engine, Learning Intelligence
- **Primary Responsibility:** Orient the learner upon login and push them into the next best action.
- **Displayed Widgets:** Today's Mission (CTA), AI Coach Insight, Momentum/Streak.
- **Entry Points:** Login.
- **Exit Points:** Launching a Session (goes to The Studio), or viewing The Map.

### 2. The Studio (Session Mode)
- **Owner Engine:** Learning Session Engine, Adaptive Runtime
- **Primary Responsibility:** Immersive focus and content digestion.
- **Displayed Widgets:** Focus Timer, Workspace/Reader, Adaptive Interventions, Quick Capture (Notes).
- **Entry Points:** Clicking "Start Session" from Mission Control.
- **Exit Points:** Completing session -> Routes to The Mirror (Reflection).

### 3. The Mirror (Assessment & Reflection)
- **Owner Engine:** Assessment Engine, Learner Engine
- **Primary Responsibility:** Metacognition, teach-backs, and knowledge verification.
- **Displayed Widgets:** Teach-back Textarea/Audio, Quiz Form, Cognitive Load Survey.
- **Entry Points:** End of a Learning Session, Daily Reminder.
- **Exit Points:** Submission -> Returns to Mission Control.

### 4. The Map (Planning)
- **Owner Engine:** Planning Engine, Journey Engine
- **Primary Responsibility:** Macro-level visibility of the learning path.
- **Displayed Widgets:** Graph/Tree visualization of curriculum, Node details.
- **Entry Points:** Sidebar navigation.
- **Exit Points:** Clicking a node -> Previewing Session details.

==================================================
SECTION 7 — WIDGET ARCHITECTURE
==================================================
Widgets are self-contained, data-driven micro-frontends bound to specific backend engines.

- **Today's Mission:**
  - *Engine:* Learning Intelligence
  - *Purpose:* Single large CTA for the next recommended learning chunk.
  - *Interactive:* Yes (Click to launch Studio).
- **AI Coach Panel:**
  - *Engine:* Learning Intelligence
  - *Purpose:* Conversational interface for unblocking concepts or asking questions.
  - *Interactive:* Yes (Chat interface).
- **Adaptive Intervention Nudge:**
  - *Engine:* Adaptive Runtime
  - *Purpose:* Pops up during a session if cognitive load is detected as too high (e.g., "Take a 5 min break?").
  - *Interactive:* Yes (Accept/Dismiss).
- **Knowledge Graph Visualizer:**
  - *Engine:* Planning Engine
  - *Purpose:* Renders the syllabus as a dependency tree (nodes and edges).
  - *Interactive:* Yes (Pan, zoom, click nodes).
- **Focus Timer:**
  - *Engine:* Learning Session Engine
  - *Purpose:* Tracks Pomodoro or flow state intervals.
  - *Interactive:* Yes (Play, Pause, Extend).
- **Mastery / Momentum Meter:**
  - *Engine:* Dashboard Engine
  - *Purpose:* Visualizes streaks and completion percentage.
  - *Interactive:* No (Read-only data visualization).

==================================================
SECTION 8 — USER JOURNEYS
==================================================
1. **The Genesis Journey (First Login):**
   Auth -> Onboarding Wizard (Learner Engine) -> Goal Ingestion -> Planning Engine computes syllabus -> User lands on **The Map** showing their newly generated path.
2. **The Daily Loop (Today's Learning):**
   Login -> Mission Control (Dashboard) -> AI Coach recommends "Start Module 3" -> Click -> Enters **The Studio** (Focus Mode).
3. **The Session Lifecycle:**
   Inside The Studio -> Timer starts -> Adaptive Runtime monitors -> Content consumed -> Timer ends -> Auto-routes to **The Mirror** for a Teach-back assessment -> Returns to Mission Control.
4. **The Friction Journey (Unblocking):**
   Inside The Studio -> User struggles -> Opens AI Coach Panel -> Queries concept -> AI generates a micro-assessment to verify understanding -> User continues.

==================================================
SECTION 9 — PAGE PRIORITY
==================================================
**Priority 1: The Studio & Mission Control**
- *Why:* This is where 90% of the user's active time is spent. The Studio must be flawless, highly performant, and deeply integrated with the Adaptive Runtime to deliver on the promise of an AI Learning OS.

**Priority 2: The Map & The Mirror**
- *Why:* The Map provides long-term motivation and trust in the AI's planning. The Mirror enforces the pedagogical value (spaced repetition, metacognition).

**Priority 3: The Library & Engine Room**
- *Why:* Supporting features. Users can survive with minimal settings and basic resource lists in early production phases.

==================================================
SECTION 10 — GAP ANALYSIS
==================================================
**Current vs. Desired Frontend:**
- **Structural Gaps:** Current frontend uses static routing (`/dashboard`, `/journey`). Desired frontend requires stateful, immersive modes (The Studio) that strip away global navigation.
- **UX Gaps:** The current UI requires heavy point-and-click traversal. Desired UX requires a Command Palette and proactive AI surfacing.
- **Component Gaps:** Current UI relies purely on static generic Cards and generic Buttons. Desired requires highly specialized data-viz (Knowledge Graphs, interactive Timers, Chat interfaces).
- **Backend Integration Gaps:** Current UI is entirely mocked via hardcoded JSON. It lacks the complex state management (React Query / Context / WebSockets) needed to sync with 13 deterministic engines in real-time.

==================================================
SECTION 11 — REBUILD STRATEGY
==================================================
- **KEEP:** `src/assets/` (Icons/Logos), `src/styles/design-tokens.css` (Can be retained as a baseline but values must be updated for a premium OS aesthetic).
- **REFACTOR:** `src/styles/theme.css`, `src/styles/index.css`. The CSS infrastructure (Tailwind setup) is sound, but the semantic tokens need remapping to support immersive dark/focus modes.
- **REWRITE:** `src/components/*`. Existing generic cards are insufficient. The widget architecture requires building specialized, reactive components bounded to API hooks.
- **DELETE:** `src/pages/Dashboard.tsx`, `src/pages/Journey.tsx`, `src/pages/TaskDetails.tsx`, `src/pages/GoalSetup.tsx`, `src/mocks/*`. These files enforce the outdated SaaS paradigm and tightly couple mocked data to views. They must be destroyed to make way for the Experience-based routing (Mission Control, The Studio, etc.).

==================================================
SECTION 12 — IMPLEMENTATION ROADMAP
==================================================
**Phase 1: Foundation & Identity (Weeks 1-2)**
- *Scope:* Setup API client architecture (React Query / Axios), wire up Authentication Engine, build the Command Palette, and implement the Onboarding/Identity experience (Learner Engine).
- *Dependencies:* Backend Auth and Learner Engine endpoints must be live.
- *Risks:* Low. Standard web infrastructure.

**Phase 2: The Map & Mission Control (Weeks 3-4)**
- *Scope:* Implement Planning and Journey Engine integrations. Build the Knowledge Graph visualizer for The Map. Build Mission Control (Dashboard Engine) with basic AI Insight surfacing.
- *Dependencies:* Planning Engine generating valid syllabi graphs.
- *Complexity:* Medium (Graph visualization requires specialized libraries like React Flow or D3).

**Phase 3: The Studio & Adaptive Runtime (Weeks 5-7)**
- *Scope:* The core loop. Build the immersive Studio layout. Integrate Learning Session Engine (timers, state) and WebSockets/Polling for the Adaptive Runtime (real-time nudges). Build the AI Coach Panel.
- *Dependencies:* Real-time communication protocols from the backend.
- *Complexity:* High (State management during active sessions, managing focus transitions).

**Phase 4: The Mirror & Polish (Weeks 8-9)**
- *Scope:* Build Assessment forms (Teach-backs, quizzes) for The Mirror. Implement Notification Engine (toasts). Final layout polish, animations, and transitions.
- *Dependencies:* Assessment Engine grading endpoints.
- *Complexity:* Medium.
