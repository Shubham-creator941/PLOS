# FRONTEND ARCHITECTURE AUDIT

------------------------------------------------------------
SECTION 1 — COMPLETE FILE TREE
------------------------------------------------------------
```
src/
  App.tsx
  main.tsx
  assets/
    hero.png
    react.svg
    vite.svg
  components/
    ActivityGraph.tsx
    Avatar.tsx
    Badge.tsx
    Button.tsx
    Card.tsx
    Checkbox.tsx
    EmptyState.tsx
    HabitCard.tsx
    Input.tsx
    JourneyTimeline.tsx
    Loader.tsx
    MilestoneCard.tsx
    Modal.tsx
    PageHeader.tsx
    ProgressBar.tsx
    ProgressRing.tsx
    RadioGroup.tsx
    ReasonCard.tsx
    Select.tsx
    Sidebar.tsx
    StatCard.tsx
    StreakCard.tsx
    TaskCard.tsx
    Textarea.tsx
    TopNavbar.tsx
  contexts/
    ThemeContext.tsx
  hooks/
  layout/
    AuthLayout.tsx
    DashboardLayout.tsx
  mocks/
    dashboard.ts
    learningJourney.ts
    session.ts
  pages/
    Dashboard.tsx
    Error.tsx
    GoalSetup.tsx
    Journey.tsx
    Landing.tsx
    LearningPlan.tsx
    Loading.tsx
    Login.tsx
    NotFound.tsx
    Reflection.tsx
    Settings.tsx
    TaskDetails.tsx
  router/
    index.tsx
  services/
    api.ts
  styles/
    design-tokens.css
    elevation.css
    index.css
    layout.css
    motion.css
    spacing.css
    theme.css
    typography.css
  types/
    index.ts
```

------------------------------------------------------------
SECTION 2 — PAGE INVENTORY
------------------------------------------------------------

### Dashboard
- **file path:** `src/pages/Dashboard.tsx`
- **approximate LOC:** ~165
- **imports:** React, `dashboardData`, lucide-react icons, `Card`, `CardContent`, `Button`, `ProgressRing`, `ActivityGraph`
- **exported component:** `Dashboard`
- **child components used:** `Card`, `CardContent`, `Button`, `ProgressRing`, `ActivityGraph`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/dashboard`, `/tasks`
- **state used:** None
- **API calls:** None
- **mock data:** `dashboardData`
- **forms:** None
- **charts:** `ActivityGraph`, `ProgressRing`
- **modals:** None
- **navigation:** None directly
- **TODO comments:** None
- **FIXME comments:** None

### Error
- **file path:** `src/pages/Error.tsx`
- **approximate LOC:** ~17
- **imports:** React, `EmptyState`, `AlertOctagon`
- **exported component:** `ErrorPage`
- **child components used:** `EmptyState`
- **layout used:** None
- **route:** `*` (errorElement)
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** `window.location.reload()`
- **TODO comments:** None
- **FIXME comments:** None

### GoalSetup
- **file path:** `src/pages/GoalSetup.tsx`
- **approximate LOC:** ~208
- **imports:** React, `useState`, `useNavigate`, `useForm`, `Controller`, `zodResolver`, `z`, lucide-react icons, `PageHeader`, `Button`, `Input`, `Textarea`, `Select`, `RadioGroup`, `Card`, `CardContent`
- **exported component:** `GoalSetup`
- **child components used:** `PageHeader`, `Button`, `Input`, `Textarea`, `Select`, `RadioGroup`, `Card`, `CardContent`, `StepOne`, `StepTwo`, `StepThree`, `StepFour`, `StepFive`, `StepSix`, `FinalReview`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/goals`
- **state used:** `useState`, `useForm`
- **API calls:** None
- **mock data:** None
- **forms:** Yes (React Hook Form + Zod)
- **charts:** None
- **modals:** None
- **navigation:** `useNavigate`
- **TODO comments:** "In a real app, make API call here"
- **FIXME comments:** None

### Journey
- **file path:** `src/pages/Journey.tsx`
- **approximate LOC:** ~284
- **imports:** React, `useState`, lucide-react icons, `Card`, `CardContent`, `Button`, `ProgressRing`, `learningJourneyData`
- **exported component:** `Journey`
- **child components used:** `Card`, `CardContent`, `Button`, `ProgressRing`, `RoadmapOverview`, `HabitTracker`, `WeekCard`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/journey`
- **state used:** `useState`
- **API calls:** None
- **mock data:** `learningJourneyData`
- **forms:** None
- **charts:** `ProgressRing`
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

### Landing
- **file path:** `src/pages/Landing.tsx`
- **approximate LOC:** ~23
- **imports:** React, `Button`, `Link`
- **exported component:** `Landing`
- **child components used:** `Button`
- **layout used:** None
- **route:** `/`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** `Link`
- **TODO comments:** None
- **FIXME comments:** None

### LearningPlan
- **file path:** `src/pages/LearningPlan.tsx`
- **approximate LOC:** ~16
- **imports:** React, `PageHeader`, `MilestoneCard`
- **exported component:** `LearningPlan`
- **child components used:** `PageHeader`, `MilestoneCard`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/plan`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

### Loading
- **file path:** `src/pages/Loading.tsx`
- **approximate LOC:** ~10
- **imports:** React, `Loader`
- **exported component:** `Loading`
- **child components used:** `Loader`
- **layout used:** None
- **route:** None
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

### Login
- **file path:** `src/pages/Login.tsx`
- **approximate LOC:** ~32
- **imports:** React, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Button`, `Link`, `useNavigate`
- **exported component:** `Login`
- **child components used:** `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Input`, `Button`
- **layout used:** `AuthLayout` (via router)
- **route:** `/login`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** Yes (Native HTML form)
- **charts:** None
- **modals:** None
- **navigation:** `useNavigate`, `Link`
- **TODO comments:** None
- **FIXME comments:** None

### NotFound
- **file path:** `src/pages/NotFound.tsx`
- **approximate LOC:** ~19
- **imports:** React, `EmptyState`, `FileWarning`
- **exported component:** `NotFound`
- **child components used:** `EmptyState`
- **layout used:** None
- **route:** `*`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** `window.location.href`
- **TODO comments:** None
- **FIXME comments:** None

### Reflection
- **file path:** `src/pages/Reflection.tsx`
- **approximate LOC:** ~21
- **imports:** React, `PageHeader`, `Textarea`, `Button`, `Card`, `CardContent`
- **exported component:** `Reflection`
- **child components used:** `PageHeader`, `Textarea`, `Button`, `Card`, `CardContent`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/reflection`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

### Settings
- **file path:** `src/pages/Settings.tsx`
- **approximate LOC:** ~29
- **imports:** React, `PageHeader`, `Card`, `CardContent`, `Button`
- **exported component:** `Settings`
- **child components used:** `PageHeader`, `Card`, `CardContent`, `Button`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/settings`
- **state used:** None
- **API calls:** None
- **mock data:** None
- **forms:** None
- **charts:** None
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

### TaskDetails
- **file path:** `src/pages/TaskDetails.tsx`
- **approximate LOC:** ~290
- **imports:** React, `useState`, `useEffect`, lucide-react icons, `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge`, `Button`, `Checkbox`, `sessionData`
- **exported component:** `TaskDetails`
- **child components used:** `Card`, `CardContent`, `CardHeader`, `CardTitle`, `Badge`, `Button`, `Checkbox`, `FocusTimer`, `Workspace`, `TeachBack`
- **layout used:** `DashboardLayout` (via router)
- **route:** `/tasks/:id`
- **state used:** `useState`, `useEffect`
- **API calls:** None
- **mock data:** `sessionData`
- **forms:** Native inputs and textareas
- **charts:** None
- **modals:** None
- **navigation:** None
- **TODO comments:** None
- **FIXME comments:** None

------------------------------------------------------------
SECTION 3 — COMPONENT INVENTORY
------------------------------------------------------------

| Component Name | Location | Props Interface | Internal State | Children | Parent Components | Reusable? | Approx LOC | Styling method | Animation | External libraries |
|---|---|---|---|---|---|---|---|---|---|---|
| ActivityGraph | `src/components/ActivityGraph.tsx` | None | None | None | `Dashboard` | Yes | 31 | Tailwind | Tailwind transitions | None |
| Avatar | `src/components/Avatar.tsx` | `AvatarProps` | None | `<img>` or text | `TopNavbar` | Yes | 31 | Tailwind | None | None |
| Badge | `src/components/Badge.tsx` | `BadgeProps` | None | `{children}` | `TaskCard`, `TaskDetails`, `TeachBack` | Yes | 25 | Tailwind | Tailwind transitions | None |
| Button | `src/components/Button.tsx` | `ButtonProps` | None | `{children}`, `Loader2` | `EmptyState`, `Landing`, `Login`, `Reflection`, `Settings`, `TaskDetails`, `FocusTimer`, `GoalSetup`, `Dashboard`, `Journey` | Yes | 40 | Tailwind | Tailwind spin, transitions | `lucide-react` |
| Card / CardHeader / CardTitle / CardContent / CardFooter | `src/components/Card.tsx` | `React.HTMLAttributes<HTMLDivElement>` | None | `{children}` | `HabitCard`, `MilestoneCard`, `ReasonCard`, `StatCard`, `StreakCard`, `TaskCard`, `Dashboard`, `GoalSetup`, `Journey`, `Login`, `Reflection`, `Settings`, `TaskDetails` | Yes | 41 | Tailwind | None | None |
| Checkbox | `src/components/Checkbox.tsx` | `CheckboxProps` | None | `<input type="checkbox">` | `TaskDetails` | Yes | 38 | Tailwind | Tailwind focus-within | `lucide-react` |
| EmptyState | `src/components/EmptyState.tsx` | `EmptyStateProps` | None | `Button` | `Error`, `NotFound` | Yes | 30 | Tailwind | None | `lucide-react` |
| HabitCard | `src/components/HabitCard.tsx` | `HabitCardProps` | None | `Card`, `CardContent` | None directly used | Yes | 34 | Tailwind | Tailwind hover effects | `lucide-react` |
| Input | `src/components/Input.tsx` | `InputProps` | None | `<input>` | `Login`, `GoalSetup` | Yes | 37 | Tailwind | Tailwind focus | None |
| JourneyTimeline | `src/components/JourneyTimeline.tsx` | `JourneyTimelineProps` | None | None | None directly used | Yes | 39 | Tailwind | None | None |
| Loader | `src/components/Loader.tsx` | `LoaderProps` | None | `Loader2` | `Loading` | Yes | 32 | Tailwind | Tailwind animate-spin | `lucide-react` |
| MilestoneCard | `src/components/MilestoneCard.tsx` | `MilestoneCardProps` | None | `Card`, `CardContent`, `ProgressBar` | `LearningPlan` | Yes | 23 | Tailwind | Tailwind hover effects | None |
| Modal | `src/components/Modal.tsx` | `ModalProps` | None | `{children}` | None directly used | Yes | 33 | Tailwind | None | `lucide-react` |
| PageHeader | `src/components/PageHeader.tsx` | `PageHeaderProps` | None | `{action}` | `GoalSetup`, `LearningPlan`, `Reflection`, `Settings` | Yes | 26 | Tailwind | None | None |
| ProgressBar | `src/components/ProgressBar.tsx` | `ProgressBarProps` | None | None | `MilestoneCard` | Yes | 29 | Tailwind | Tailwind transition-all | None |
| ProgressRing | `src/components/ProgressRing.tsx` | `{value, size, strokeWidth, label}` | None | `<svg>` | `Dashboard`, `HabitTracker`, `Journey` | Yes | 42 | Tailwind | Tailwind transition-all | None |
| RadioGroup | `src/components/RadioGroup.tsx` | `RadioGroupProps` | None | `<input type="radio">` | `GoalSetup` | Yes | 64 | Tailwind | Tailwind focus-within | None |
| ReasonCard | `src/components/ReasonCard.tsx` | `ReasonCardProps` | None | `Card`, `CardContent` | None directly used | Yes | 20 | Tailwind | Tailwind hover effects | None |
| Select | `src/components/Select.tsx` | `SelectProps` | None | `<select>`, `<option>` | `GoalSetup` | Yes | 42 | Tailwind | Tailwind focus | None |
| Sidebar | `src/components/Sidebar.tsx` | None | None | `NavLink` | `DashboardLayout` | Yes | 71 | Tailwind | Tailwind hover/group | `lucide-react`, `react-router-dom` |
| StatCard | `src/components/StatCard.tsx` | `StatCardProps` | None | `Card`, `CardContent` | None directly used | Yes | 46 | Tailwind | Tailwind hover effects | None |
| StreakCard | `src/components/StreakCard.tsx` | `StreakCardProps` | None | `Card`, `CardContent` | None directly used | Yes | 31 | Tailwind | Tailwind hover effects | `lucide-react` |
| TaskCard | `src/components/TaskCard.tsx` | `TaskCardProps` | None | `Card`, `CardContent`, `Badge` | None directly used | Yes | 39 | Tailwind | Tailwind hover effects | None |
| Textarea | `src/components/Textarea.tsx` | `TextareaProps` | None | `<textarea>` | `GoalSetup`, `Reflection` | Yes | 37 | Tailwind | Tailwind focus | None |
| TopNavbar | `src/components/TopNavbar.tsx` | `TopNavbarProps` | None | `Avatar` | `DashboardLayout` | Yes | 38 | Tailwind | None | `lucide-react` |

------------------------------------------------------------
SECTION 4 — COMPONENT DEPENDENCY GRAPH
------------------------------------------------------------
```
DashboardLayout
├── Sidebar
│      └── NavLink (react-router-dom)
└── TopNavbar
       └── Avatar

App
└── RouterProvider
    ├── AuthLayout
    │      └── Login
    │             ├── Card (CardHeader, CardTitle, CardContent)
    │             ├── Input
    │             └── Button
    ├── Landing
    │      └── Button
    ├── Dashboard
    │      ├── Card (CardContent)
    │      ├── Button
    │      ├── ActivityGraph
    │      └── ProgressRing
    ├── GoalSetup
    │      ├── PageHeader
    │      ├── Input
    │      ├── Select
    │      ├── Textarea
    │      ├── RadioGroup
    │      ├── Card (CardContent)
    │      └── Button
    ├── Journey
    │      ├── ProgressRing
    │      ├── RoadmapOverview
    │      ├── HabitTracker
    │      │      ├── Card (CardContent)
    │      │      └── ProgressRing
    │      └── WeekCard
    │             └── Card
    ├── LearningPlan
    │      ├── PageHeader
    │      └── MilestoneCard
    │             ├── Card (CardContent)
    │             └── ProgressBar
    ├── Reflection
    │      ├── PageHeader
    │      ├── Card (CardContent)
    │      ├── Textarea
    │      └── Button
    ├── Settings
    │      ├── PageHeader
    │      ├── Card (CardContent)
    │      └── Button
    ├── TaskDetails
    │      ├── Badge
    │      ├── FocusTimer
    │      │      ├── Card (CardContent)
    │      │      └── Button
    │      ├── Workspace
    │      │      └── Card (CardHeader, CardTitle, CardContent)
    │      ├── Card (CardContent)
    │      ├── TeachBack
    │      │      ├── Card (CardHeader, CardTitle, CardContent)
    │      │      └── Badge
    │      ├── Checkbox
    │      └── Button
    ├── Error
    │      └── EmptyState
    │             └── Button
    └── NotFound
           └── EmptyState
                  └── Button
```

------------------------------------------------------------
SECTION 5 — DESIGN SYSTEM INVENTORY
------------------------------------------------------------
- **Avatar:** `src/components/Avatar.tsx` (Props: `src`, `alt`, `initials`, `size`)
- **Badge:** `src/components/Badge.tsx` (Props: `variant`)
- **Button:** `src/components/Button.tsx` (Props: `variant`, `size`, `isLoading`)
- **Card:** `src/components/Card.tsx` (Exports `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`)
- **Checkbox:** `src/components/Checkbox.tsx` (Props: `label`, `description`)
- **EmptyState:** `src/components/EmptyState.tsx` (Props: `title`, `description`, `actionLabel`, `onAction`, `icon`)
- **Input:** `src/components/Input.tsx` (Props: `label`, `error`, `helperText`)
- **Loader:** `src/components/Loader.tsx` (Props: `size`, `fullScreen`)
- **Modal:** `src/components/Modal.tsx` (Props: `isOpen`, `onClose`, `title`)
- **PageHeader:** `src/components/PageHeader.tsx` (Props: `title`, `description`, `action`)
- **ProgressBar:** `src/components/ProgressBar.tsx` (Props: `value`, `max`, `showLabel`)
- **ProgressRing:** `src/components/ProgressRing.tsx` (Props: `value`, `size`, `strokeWidth`, `label`)
- **RadioGroup:** `src/components/RadioGroup.tsx` (Props: `options`, `error`)
- **Select:** `src/components/Select.tsx` (Props: `label`, `error`, `options`)
- **Sidebar:** `src/components/Sidebar.tsx`
- **Textarea:** `src/components/Textarea.tsx` (Props: `label`, `error`, `helperText`)
- **TopNavbar:** `src/components/TopNavbar.tsx` (Props: `onMenuClick`)

*Domain-Specific Composites:*
- `ActivityGraph`, `HabitCard`, `JourneyTimeline`, `MilestoneCard`, `ReasonCard`, `StatCard`, `StreakCard`, `TaskCard`

------------------------------------------------------------
SECTION 6 — STYLE INVENTORY
------------------------------------------------------------
- **Tailwind classes:** Used extensively inline across all components.
- **CSS Modules:** None.
- **Global CSS:** `src/styles/index.css` acts as the entry point importing other stylesheets.
- **Theme variables:** Defined in `src/styles/theme.css` via `:root` and `[data-theme="dark"]`. Includes `color-bg-primary`, `color-surface`, `color-border`, `color-text-primary`, `color-primary`.
- **CSS Variables:** Heavy usage of CSS variables mapping raw primitive tokens (`--primitive-blue-500`) to semantic tokens (`--color-primary`) mapped into Tailwind via `@theme` directive (Tailwind v4 syntax).
- **Custom utilities:** `typography.css` exposes `.text-display`, `.text-h1`, `.text-body`, etc.
- **Spacing scale:** `src/styles/spacing.css` defines `--spacing-4` through `--spacing-64`.
- **Border radius values:** `src/styles/elevation.css` defines `--radius-xs` to `--radius-full`.
- **Shadow values:** `src/styles/elevation.css` defines `--shadow-none` through `--shadow-xl`.
- **Typography scale:** `src/styles/typography.css` defines `--text-h1-size`, `--text-body-size`, etc.
- **Color tokens:** Defined in `src/styles/design-tokens.css` with slate, blue, green, orange, red palettes.
- **Animation/Transition utilities:** `src/styles/motion.css` defines durations (`fast`, `normal`, `slow`) and easings (`standard`, `emphasized`, `decelerate`, `accelerate`).
- **Duplication:** Hover effects (`hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover`) are heavily duplicated across card components.

------------------------------------------------------------
SECTION 7 — DESIGN TOKEN INVENTORY
------------------------------------------------------------
**Colors:**
- Slate (Neutral): `--primitive-slate-50` to `--primitive-slate-950`
- Blue (Primary): `--primitive-blue-50` to `--primitive-blue-950`
- Green (Accent): `--primitive-green-50` to `--primitive-green-950`
- Orange (Warning): `--primitive-orange-50` to `--primitive-orange-950`
- Red (Danger): `--primitive-red-50` to `--primitive-red-950`
*Defined in:* `src/styles/design-tokens.css`

**Semantic Colors:**
- `--color-bg-primary`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-primary`, `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
*Defined in:* `src/styles/theme.css`

**Spacing Tokens:**
- `--primitive-space-4` (0.25rem) to `--primitive-space-64` (4rem)
*Defined in:* `src/styles/design-tokens.css`, mapped in `src/styles/spacing.css`

**Radius Tokens:**
- `--primitive-radius-xs` to `--primitive-radius-full`
*Defined in:* `src/styles/design-tokens.css`, mapped in `src/styles/elevation.css`

**Shadow Tokens:**
- `--shadow-sm` to `--shadow-xl` using `--shadow-color`
*Defined in:* `src/styles/elevation.css`

**Font Size Tokens:**
- `--primitive-text-xs` (0.75rem) to `--primitive-text-5xl` (3rem)
*Defined in:* `src/styles/design-tokens.css`, mapped in `src/styles/typography.css`

**Font Weight Tokens:**
- `--primitive-weight-normal` (400) to `--primitive-weight-bold` (700)
*Defined in:* `src/styles/design-tokens.css`

**Z-Index Tokens:**
- `--primitive-z-base` (0) to `--primitive-z-tooltip` (400)
*Defined in:* `src/styles/design-tokens.css`, mapped in `src/styles/layout.css`

**Transition & Animation Tokens:**
- `--primitive-duration-fast` (150ms), `normal` (300ms), `slow` (500ms)
- Easings: `standard`, `emphasized`, `decelerate`, `accelerate`
*Defined in:* `src/styles/design-tokens.css`, mapped in `src/styles/motion.css`

------------------------------------------------------------
SECTION 8 — ROUTER ANALYSIS
------------------------------------------------------------
*Configuration in `src/router/index.tsx`*
- **`/`**: `Landing` (No Layout)
- **`/login`**: `Login` (Inside `AuthLayout`)
- **`/dashboard`**: `Dashboard` (Inside `DashboardLayout`, ProtectedRoute)
- **`/goals`**: `GoalSetup` (Inside `DashboardLayout`, ProtectedRoute)
- **`/journey`**: `Journey` (Inside `DashboardLayout`, ProtectedRoute)
- **`/plan`**: `LearningPlan` (Inside `DashboardLayout`, ProtectedRoute)
- **`/tasks`**: `Dashboard` (Inside `DashboardLayout`, ProtectedRoute)
- **`/tasks/:id`**: `TaskDetails` (Inside `DashboardLayout`, ProtectedRoute, Dynamic Param: `id`)
- **`/reflection`**: `Reflection` (Inside `DashboardLayout`, ProtectedRoute)
- **`/settings`**: `Settings` (Inside `DashboardLayout`, ProtectedRoute)
- **`*`**: `NotFound`
- **Error Element:** `ErrorPage`
- **Protected?:** Yes, via `ProtectedRoute` wrapper (currently uses hardcoded `isAuthenticated = true`).
- **Lazy Loaded?:** No.
- **Redirects:** `Navigate to="/login" replace` for unauthenticated routes.

------------------------------------------------------------
SECTION 9 — STATE MANAGEMENT
------------------------------------------------------------
- **React Contexts:** `ThemeContext` (`src/contexts/ThemeContext.tsx`)
- **useState:** Used extensively (`GoalSetup`, `Journey`, `TaskDetails`, `FocusTimer`, `Workspace`, `TeachBack`)
- **useReducer:** None.
- **Custom Hooks:** `useTheme`
- **Global State:** Only Theme.
- **Local Storage:** Used in `ThemeContext` (`localStorage.getItem('plos-theme')`)
- **Session Storage:** None.
- **Cookies:** None.

------------------------------------------------------------
SECTION 10 — MOCK DATA INVENTORY
------------------------------------------------------------
- **`src/mocks/dashboard.ts`**
  - Exports: `dashboardData`
  - Used by: `Dashboard.tsx`
  - Replacement endpoint: `/api/dashboard`
- **`src/mocks/learningJourney.ts`**
  - Exports: `learningJourneyData`
  - Used by: `Journey.tsx`
  - Replacement endpoint: `/api/journey`
- **`src/mocks/session.ts`**
  - Exports: `sessionData`
  - Used by: `TaskDetails.tsx`
  - Replacement endpoint: `/api/sessions/:id`

------------------------------------------------------------
SECTION 11 — API INVENTORY
------------------------------------------------------------
- **File:** `src/services/api.ts`
- **Axios instances:** One (`api`)
- **Interceptors:** None.
- **Base URL:** `import.meta.env.VITE_API_URL` fallback to `http://localhost:3000/api`
- **Headers:** `'Content-Type': 'application/json'`
- **Timeout:** None configured.
- **Error handling:** None.
- **Endpoints / Methods:** None defined.
- **Unused services:** `api.ts` is not imported anywhere.

------------------------------------------------------------
SECTION 12 — FORM INVENTORY
------------------------------------------------------------
**Goal Setup Form (`src/pages/GoalSetup.tsx`)**
- Uses `react-hook-form` and `zod`.
- Validation Schema: `goalSetupSchema` enforcing min lengths, custom logic for future dates, and number bounds.
- Inputs: `Input`, `Textarea`, `Select`, `RadioGroup`.
- Submit Handler: `onSubmit` logs to console and redirects to `/dashboard`.
- Backend Mapping: Missing API endpoint.

**Login Form (`src/pages/Login.tsx`)**
- Native HTML form via `onSubmit`.
- Inputs: `Input` (Email, Password).
- Submit Handler: `handleSubmit` calls `e.preventDefault()` and redirects to `/dashboard`.
- Validation: Native HTML5 `required`.
- Backend Mapping: Missing API endpoint.

------------------------------------------------------------
SECTION 13 — PERFORMANCE INVENTORY
------------------------------------------------------------
- **Lazy loading:** Not used.
- **Memo/useMemo/useCallback:** Not used.
- **React.memo:** Not used.
- **Suspense:** Not used.
- **Code splitting:** Not used dynamically.
- **Dynamic import:** Not used.
- **Large components:** `TaskDetails` (~290 LOC), `Journey` (~284 LOC), `GoalSetup` (~208 LOC).
- **Duplicate rendering:** `ActivityGraph` triggers multiple array creations internally without memoization.

------------------------------------------------------------
SECTION 14 — ACCESSIBILITY INVENTORY
------------------------------------------------------------
- **ARIA:** Not explicitly defined.
- **Labels:** Explicitly associated using `htmlFor` and unique IDs in `Input`, `Checkbox`, `RadioGroup`, `Textarea`, `Select`.
- **Keyboard navigation:** Handled via Tailwind focus styles (`focus:outline-none focus:ring-2 focus:ring-primary/50`). Buttons and Links are navigable.
- **Focus handling:** `focus-within:ring-2` on `Checkbox` and `RadioGroup` container blocks.
- **Semantic HTML:** Used (`<header>`, `<main>`, `<aside>`, `<nav>`, `<time>`).
- **Contrast helpers:** N/A.

------------------------------------------------------------
SECTION 15 — FRONTEND ↔ BACKEND MAPPING
------------------------------------------------------------
| Module | Status |
|---|---|
| Authentication | Missing API (Mock behavior in UI) |
| Learner | Missing API (`GoalSetup`) |
| Journey | Uses Mock (`learningJourneyData`) |
| Planning | Missing API (`LearningPlan`) |
| Learning Session | Uses Mock (`sessionData`) |
| Adaptive Runtime | Missing UI |
| Assessment | Missing UI |
| Learning Intelligence | Uses Mock (`dashboardData.intelligence`) |
| Dashboard | Uses Mock (`dashboardData`) |
| Notification | Missing API |
| Audit | Unused backend |
| Resource | Unused backend |
| Platform | Unused backend |

------------------------------------------------------------
SECTION 16 — UNUSED CODE
------------------------------------------------------------
- **Unused components:** `HabitCard.tsx`, `JourneyTimeline.tsx`, `Modal.tsx`, `ReasonCard.tsx`, `StatCard.tsx`, `StreakCard.tsx`, `TaskCard.tsx`
- **Unused pages:** None directly, but `/tasks` explicitly points to `Dashboard.tsx`.
- **Unused CSS:** N/A (Tailwind purges unused CSS automatically).
- **Unused types:** `src/types/index.ts` (BaseEntity, Pagination, ApiResponse).
- **Unused utilities:** None.
- **Unused constants:** None.
- **Unused services:** `src/services/api.ts`
- **Unused imports:** None detected.

------------------------------------------------------------
SECTION 17 — DUPLICATION REPORT
------------------------------------------------------------
- **Repeated components:** None explicitly duplicated.
- **Repeated layouts:** `Card` -> `CardContent` structure is heavily repeated across multiple domain specific cards.
- **Repeated styles:** The transition classes `hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover` are duplicated across `HabitCard`, `MilestoneCard`, `ReasonCard`, `StatCard`, `StreakCard`, `TaskCard`.
- **Repeated utility functions:** None.
- **Repeated form logic:** None.
- **Repeated typography/spacing:** Controlled tightly by Design Tokens and Tailwind variables.

------------------------------------------------------------
SECTION 18 — ENGINEERING METRICS
------------------------------------------------------------
- **Total Pages:** 12
- **Total Components:** 25
- **Total Contexts:** 1
- **Total Hooks:** 0 (Only exports `useTheme` from Context)
- **Total Forms:** 2
- **Total API files:** 1
- **Total CSS files:** 8
- **Total TS files:** 5
- **Largest Components:** `TaskDetails` (290 LOC), `Journey` (284 LOC), `GoalSetup` (208 LOC).
- **Largest Pages:** `TaskDetails`
- **Average Component Size:** ~35 LOC
- **Largest Dependency Chains:** `TaskDetails` -> `FocusTimer`, `Workspace`, `TeachBack` -> `Card`, `Badge`, `Checkbox`, `Button`.

------------------------------------------------------------
SECTION 19 — ARCHITECTURAL OBSERVATIONS
------------------------------------------------------------
- Frontend is implemented purely using React with Vite.
- Tailwind CSS v4 is used, extracting CSS variables from custom style modules (`design-tokens.css`, `theme.css`) into Tailwind's `@theme` directive.
- Seven components in the `src/components` directory are currently unused (`HabitCard`, `JourneyTimeline`, `Modal`, `ReasonCard`, `StatCard`, `StreakCard`, `TaskCard`).
- The application contains no active backend integrations; `services/api.ts` is unused.
- Entire application state relies on statically defined mock data (`src/mocks`).
- The `ProtectedRoute` implements a placeholder boolean bypass (`const isAuthenticated = true`).
- `TaskDetails.tsx`, `Journey.tsx`, and `GoalSetup.tsx` act as monolithic views defining multiple sub-components within the same file.
- `src/types/index.ts` declares core entity interfaces that are currently unused by the UI.
- `ThemeContext` reads directly from `localStorage` on initial state assignment.
- Forms are inconsistently managed (Zod+RHF in `GoalSetup`, uncontrolled native HTML in `Login`).
- Duplication in interactive hover classes exists across 6 distinct Card components.
