# FRONTEND TECHNICAL ARCHITECTURE SPECIFICATION (FTAS)

=========================================================
SECTION 1 — PROJECT STRUCTURE
=========================================================

The frontend will use a strict, feature-driven directory structure under `src/`.

- **`app/`**: Root bootstrap files (`main.tsx`, `App.tsx`). Owner: Platform. Allowed: Everything.
- **`providers/`**: Global context providers. Owner: Platform. Forbidden: Feature-specific logic.
- **`routes/`**: Route definitions and configuration. Owner: Platform. 
- **`layouts/`**: Macro layouts (e.g., `AppLayout`, `StudioLayout`). Owner: Platform.
- **`experiences/`**: The core application modules (Mission Control, Studio, etc.). Owner: Feature Teams. Allowed: Widgets, Shared, Hooks. Forbidden: Other Experiences.
- **`widgets/`**: Reusable complex UI blocks (e.g., `FocusTimer`, `RoadmapGraph`). Owner: Feature Teams. Allowed: Shared, Hooks, API. Forbidden: Experiences.
- **`shared/`**: Common business logic and components used across multiple experiences.
- **`primitives/`**: Dumb, stateless UI components (e.g., `Button`, `Card`). Owner: Design System. Forbidden: Any business logic or API calls.
- **`hooks/`**: Global custom React hooks.
- **`services/`**: Infrastructure singletons (AuthService, TelemetryService).
- **`api/`**: Axios client, endpoint definitions, and Zod schemas.
- **`stores/`**: Global Zustand state stores.
- **`event-bus/`**: Typed PubSub implementation.
- **`websocket/`**: Singleton WS client and handlers.
- **`workers/`**: Web Worker scripts (e.g., background telemetry).
- **`types/`**: Global TypeScript definitions.
- **`utils/`**: Pure functions (formatters, parsers).
- **`assets/`**: Static images, icons.
- **`styles/`**: Global CSS, Tailwind config, Design Tokens.
- **`tests/`**: Global test setups, MSW handlers, Cypress/Playwright suites.

=========================================================
SECTION 2 — EXPERIENCE MODULE STRUCTURE
=========================================================

Every Experience (Authentication, Onboarding, Mission Control, Studio, Map, Mirror, Library, Engine Room) must follow this internal structure:

`src/experiences/[Name]/`
- `index.ts`: The **Public API**. Only exports the route entry component.
- `[Name]Experience.tsx`: The Route entry point.
- `components/`: Private components used only within this experience.
- `widgets/`: Widgets owned exclusively by this experience.
- `hooks/`: Local data hooks (React Query wrappers).
- `__tests__/`: Experience-level integration tests.

**Rules:**
- **Public API:** Other modules may only import from `index.ts`. Deep importing (e.g., `experiences/Studio/components/Timer`) is strictly forbidden.
- **Local State:** Managed via `useState` or local Context.
- **Mutations:** Wrapped in custom hooks (e.g., `useSubmitReflection`).

=========================================================
SECTION 3 — SHARED COMPONENT ARCHITECTURE
=========================================================

**Primitive Components:** Button, Input, Typography, Card, Badge, Tooltip, Modal, Drawer, Toast, Progress, Avatar, Tabs, Dropdown, Checkbox, Radio, Switch, Spinner, Skeleton, Divider, Surface, Workspace, GlassPanel.

- **Ownership:** Design Systems Team.
- **Props Philosophy:** Strict TypeScript interfaces. Use polymorphic `as` props for semantic HTML (e.g., `<Typography as="h1">`). 
- **Composition Rules:** Favor composition over configuration. Use `children` instead of passing massive configuration objects. (e.g., `<Card><CardHeader/><CardBody/></Card>`).
- **Accessibility Rules:** All primitives must wrap headless UI libraries (e.g., Radix UI or React Aria) to guarantee ARIA compliance and keyboard navigation.
- **Styling Rules:** Styled using utility classes composed with a variant authority tool (e.g., `cva`). No inline styles.
- **Inheritance:** Component inheritance is forbidden. Strict composition only.

=========================================================
SECTION 4 — API CLIENT ARCHITECTURE
=========================================================

- **Axios Instance:** A single, configured Axios instance (`apiClient`).
- **Authentication Interceptor:** Automatically injects the `Authorization: Bearer <token>` header into all requests.
- **Refresh Token Flow:** A response interceptor catches `401 Unauthorized`. It pauses all in-flight requests in a queue, attempts a silent token refresh, and upon success, replays the queued requests. If it fails, it purges auth state and redirects to `/login`.
- **Retry Policy:** Idempotent `GET` requests automatically retry up to 3 times with exponential backoff using `axios-retry`. `POST`/`PUT`/`DELETE` do not auto-retry.
- **Error Normalization:** Interceptor formats all backend errors into a standard `{ message, code, details }` structure.
- **Request Cancellation:** Bound to React Query's `AbortSignal` for automatic cancellation on unmount.
- **Timeout:** Global timeout set to 10 seconds.
- **Response Validation:** All API responses pass through Zod schemas for runtime type safety.
- **Mutation Ownership:** Wrapped entirely within React Query `useMutation` hooks.

=========================================================
SECTION 5 — REACT QUERY ARCHITECTURE
=========================================================

- **QueryClient Configuration:** `refetchOnWindowFocus: true` (except for Studio), `retry: false` (handled by Axios), `staleTime: 5 * 60 * 1000` (5 minutes default).
- **Cache Policies:** Server state is never manipulated directly.
- **Mutation Policies:** All mutations must return the updated entity or explicitly trigger invalidation.
- **Invalidation Matrix:** Bound to specific mutation success callbacks (e.g., `onSuccess: () => queryClient.invalidateQueries(['dashboard'])`).
- **Optimistic Updates:** Used only for toggles (e.g., marking a notification read). Reverts cleanly via `onMutate` context snapshot rollback on error.
- **Infinite Queries:** Used exclusively for Library resources and History tables.
- **Suspense Integration:** `useSuspenseQuery` is preferred to utilize React Suspense boundaries instead of boolean `isLoading` checks.
- **Offline Persistence:** Configured with `@tanstack/react-query-persist-client` writing to IndexedDB for the Map and Library.

=========================================================
SECTION 6 — EVENT BUS IMPLEMENTATION
=========================================================

- **Implementation:** A lightweight typed PubSub emitter (e.g., `mitt`).
- **Publish/Subscribe API:** `eventBus.emit(EventName, Payload)`, `eventBus.on(EventName, Handler)`.
- **Event Ownership:** Strictly typed via a global `EventMap` interface mapping event names to expected payload shapes.
- **Namespaces:** Events are namespaced (e.g., `runtime:intervention`, `session:pause`).
- **Memory Cleanup:** All subscriptions must happen within a custom hook (`useEventBus`) that automatically calls `.off()` on component unmount.
- **Priority Events:** Handled synchronously in the exact order emitted.
- **Replay Policy:** The Event Bus is memoryless. Late subscribers do not receive past events.

=========================================================
SECTION 7 — WEBSOCKET ARCHITECTURE
=========================================================

- **Singleton Connection:** A single WS connection managed by `WebSocketManager`.
- **Connection Lifecycle:** Connects implicitly when a session starts. Disconnects on logout or session end.
- **Reconnect Policy:** Exponential backoff (1s, 2s, 4s, 8s...) up to 1 minute, then manual user intervention required.
- **Heartbeat:** Bi-directional Ping/Pong every 30 seconds to detect dead connections.
- **Authentication:** Token passed in the initial connection handshake payload.
- **Message Parsing:** Raw strings parsed to JSON and validated against Zod schemas.
- **Event Translation:** WS client NEVER updates UI directly. It parses messages and calls `eventBus.emit()`.
- **Offline Buffering:** Outgoing telemetry is queued in memory if disconnected, flushed automatically upon reconnection.

=========================================================
SECTION 8 — ROUTING ARCHITECTURE
=========================================================

- **Implementation:** React Router v6 (Data Router paradigm).
- **Nested Routes:** Used for Layout consistency (e.g., `/app` wrapper around all authenticated routes).
- **Protected Routes:** `AuthGuard` component checks token validity before rendering children.
- **Guest Routes:** `GuestGuard` redirects authenticated users away from `/login`.
- **Error Routes:** Specific catch-all routes and error element boundaries per route.
- **Suspense Boundaries:** Declared at the Experience route level to prevent entire app suspension.
- **Route Loaders:** Used to preload critical data (e.g., Profile) before rendering the route component.
- **Deep Links:** Support direct navigation to `/map/:nodeId` with deterministic fallback if `:nodeId` is invalid.

=========================================================
SECTION 9 — GLOBAL PROVIDERS
=========================================================

**Hierarchy & Ordering:**
```tsx
<ErrorBoundary>                 // Catches provider-level fatal crashes
  <QueryClientProvider>         // Caching layer needed by Auth
    <ThemeProvider>             // Unblocks UI rendering immediately
      <EventBusProvider>        // Needed for all async communication
        <AuthProvider>          // Needs API/QueryClient. Blocks restricted routes.
          <RouterProvider>      // Needs Auth to resolve Guards
            <NotificationProvider> // Mounts Toast host inside Router context
              <CommandPaletteProvider> // Needs Router to navigate
                {Experiences}
```

=========================================================
SECTION 10 — STATE MANAGEMENT IMPLEMENTATION
=========================================================

- **React Query:** Exclusive owner of all asynchronous server state.
- **Zustand Stores:** Minimal footprint. Used ONLY for global client UI state (e.g., `useSidebarStore`, `useThemeStore`).
- **Context Providers:** Used for compound component state (e.g., Tabs, Command Palette).
- **React Hook Form:** Exclusive owner of form state. No controlled `useState` inputs for complex forms.
- **Component State:** `useState` for ephemeral UI state (e.g., accordion open/close).
- **IndexedDB Ownership:** Accessed exclusively via abstraction layers (e.g., PersistQueryClient) and never directly by components.
- **Rules:** If data exists in the backend, it MUST live in React Query. Duplicating React Query data into Zustand is a punishable architectural offense.

=========================================================
SECTION 11 — PERFORMANCE ARCHITECTURE
=========================================================

- **Memoization Policy:** `React.memo` applied only to pure, heavy-rendering Widgets (e.g., `FocusTimer`, `RoadmapDAG`). Not applied globally to prevent memory overhead.
- **Virtualization:** `@tanstack/react-virtual` required for any list exceeding 50 items (e.g., Library Grid, Chat History).
- **Code Splitting:** `React.lazy` boundary at the Route/Experience level.
- **Web Workers:** High-frequency mouse/scroll telemetry processing is offloaded to a Web Worker to keep the main thread at 60fps.
- **Markdown Optimization:** Markdown parsing is memoized and lazy-loaded. Syntax highlighting uses lightweight prismic libraries.

=========================================================
SECTION 12 — ACCESSIBILITY IMPLEMENTATION
=========================================================

- **Focus Management:** Modals use `FocusTrap`. Route changes manually reset focus to the main `<h1 tabindex="-1">`.
- **Keyboard Shortcuts:** Implemented globally via `tinykeys` bound inside a custom hook, attached to the Document.
- **ARIA Ownership:** Headless UI handles complex ARIA roles. Dynamic widgets use `aria-live` for announcements.
- **Screen Reader Support:** Hidden `<span class="sr-only">` used heavily for icon-only buttons.
- **Reduced Motion:** Tailwind variant `motion-reduce:` applied to all non-essential animations.

=========================================================
SECTION 13 — TESTING ARCHITECTURE
=========================================================

- **Unit:** Vitest for pure functions (utils, parsers).
- **Component:** React Testing Library for primitive components.
- **Integration:** RTL rendering Experiences with Mock Service Worker (MSW) simulating the backend engines.
- **E2E:** Playwright for critical paths (Login -> Mission Control -> Studio -> Mirror).
- **Event Bus Mocking:** Custom mock emitters used in tests to simulate AI WS interventions deterministically.
- **Folder Structure:** `__tests__` directories co-located with the code they test.

=========================================================
SECTION 14 — ERROR HANDLING
=========================================================

- **Error Boundaries:** Defined at the App level (fatal) and the Widget level (partial failure).
- **Widget Failures:** A crashed widget displays a subtle local fallback (e.g., "Failed to load AI Coach") without breaking the surrounding Studio.
- **Network Failures:** Intercepted globally to show standard Toasts, except for forms which display inline validation errors.
- **Offline Mode:** Seamless fallback to cached data with a non-intrusive banner.
- **Logging/Telemetry:** Production errors caught by Error Boundaries are serialized and sent to `/api/telemetry/errors`.

=========================================================
SECTION 15 — BUILD & DEPLOYMENT
=========================================================

- **Vite Configuration:** Standard optimized React SWC template.
- **Chunking Strategy:** Vendor dependencies chunked separately from application code. Heavy modules (D3, Markdown) placed in isolated chunks.
- **Environment Variables:** Strictly typed via `import.meta.env` and validated at build time.
- **Feature Flags:** A global `config.json` fetched at bootstrap to enable/disable specific modules dynamically.
- **Bundle Analysis:** `rollup-plugin-visualizer` runs on CI to prevent accidental heavy dependency imports.

=========================================================
SECTION 16 — ENGINEERING REVIEW
=========================================================

**Coupling:** Extremely low. The Event Bus and React Query patterns isolate the UI from the network and from sibling components.
**Scalability:** High. Adding a 14th backend engine requires only a new React Query hook and a Widget to mount in an Experience.
**Performance:** Strictly protected via Workers for telemetry and Suspense/Lazy loading for macro-experiences.
**Developer Experience:** Excellent. Complete type safety (Zod + TS), hot module reloading (Vite), and deterministic testing (MSW).
**Technical Debt Prevention:** The strict directory rules and forbidden imports (enforced by ESLint) prevent architecture decay.
