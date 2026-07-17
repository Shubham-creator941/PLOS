# REFACTORING SUMMARY

## Folders Renamed / Initialized
- `src/components/` -> Splintered into `src/primitives/` and `src/widgets/`
- `src/pages/` -> Restructured and renamed into `src/experiences/` and `src/routes/`
- `src/layout/` -> Renamed to `src/layouts/`
- `src/contexts/` -> Renamed to `src/providers/`
- `src/router/` -> Renamed to `src/routes/`
- `src/constants/` -> Moved to `src/shared/constants/`
- `src/mocks/` -> Moved to `src/tests/mocks/`
- Missing FTAS directories (e.g. `workers/`, `websocket/`, `stores/`) initialized with `.gitkeep`

## Files Moved

**Core Bootstrapping**
- `src/main.tsx` -> `src/app/main.tsx`
- `src/App.tsx` -> `src/app/App.tsx`
- *Modified `index.html` to target `src/app/main.tsx`*

**Providers & Routes**
- `src/contexts/ThemeContext.tsx` -> `src/providers/ThemeContext.tsx`
- `src/router/index.tsx` -> `src/routes/index.tsx`
- `src/pages/Error.tsx` -> `src/routes/Error.tsx`
- `src/pages/NotFound.tsx` -> `src/routes/NotFound.tsx`
- `src/pages/Loading.tsx` -> `src/routes/Loading.tsx`

**Layouts**
- `src/layout/AuthLayout.tsx` -> `src/layouts/AuthLayout.tsx`
- `src/layout/DashboardLayout.tsx` -> `src/layouts/DashboardLayout.tsx`
- `src/components/Sidebar.tsx` -> `src/layouts/Sidebar.tsx`
- `src/components/TopNavbar.tsx` -> `src/layouts/TopNavbar.tsx`

**Experiences**
- `src/pages/Login.tsx` -> `src/experiences/Authentication/LoginExperience.tsx`
- `src/pages/Landing.tsx` -> `src/experiences/Landing/LandingExperience.tsx`
- `src/pages/Dashboard.tsx` -> `src/experiences/MissionControl/MissionControlExperience.tsx`
- `src/pages/GoalSetup.tsx` -> `src/experiences/Onboarding/OnboardingExperience.tsx`
- `src/pages/TaskDetails.tsx` -> `src/experiences/Studio/StudioExperience.tsx`
- `src/pages/Journey.tsx` -> `src/experiences/Map/MapExperience.tsx`
- `src/pages/LearningPlan.tsx` -> `src/experiences/Map/LearningPlan.tsx`
- `src/pages/Reflection.tsx` -> `src/experiences/Mirror/MirrorExperience.tsx`
- `src/pages/Settings.tsx` -> `src/experiences/EngineRoom/EngineRoomExperience.tsx`

**Primitives**
- `src/components/Button.tsx` -> `src/primitives/Button.tsx`
- `src/components/Card.tsx` -> `src/primitives/Card.tsx`
- `src/components/Input.tsx` -> `src/primitives/Input.tsx`
- `src/components/Badge.tsx` -> `src/primitives/Badge.tsx`
- `src/components/Avatar.tsx` -> `src/primitives/Avatar.tsx`
- `src/components/Checkbox.tsx` -> `src/primitives/Checkbox.tsx`
- `src/components/Select.tsx` -> `src/primitives/Select.tsx`
- `src/components/Textarea.tsx` -> `src/primitives/Textarea.tsx`
- `src/components/RadioGroup.tsx` -> `src/primitives/RadioGroup.tsx`
- `src/components/ProgressBar.tsx` -> `src/primitives/ProgressBar.tsx`
- `src/components/ProgressRing.tsx` -> `src/primitives/ProgressRing.tsx`
- `src/components/Loader.tsx` -> `src/primitives/Loader.tsx`
- `src/components/Modal.tsx` -> `src/primitives/Modal.tsx`
- `src/components/EmptyState.tsx` -> `src/primitives/EmptyState.tsx`

**Widgets**
- `src/components/ActivityGraph.tsx` -> `src/widgets/ActivityGraph.tsx`
- `src/components/HabitCard.tsx` -> `src/widgets/HabitCard.tsx`
- `src/components/MilestoneCard.tsx` -> `src/widgets/MilestoneCard.tsx`
- `src/components/StatCard.tsx` -> `src/widgets/StatCard.tsx`
- `src/components/TaskCard.tsx` -> `src/widgets/TaskCard.tsx`
- `src/components/StreakCard.tsx` -> `src/widgets/StreakCard.tsx`
- `src/components/ReasonCard.tsx` -> `src/widgets/ReasonCard.tsx`
- `src/components/PageHeader.tsx` -> `src/widgets/PageHeader.tsx`
- `src/components/JourneyTimeline.tsx` -> `src/widgets/JourneyTimeline.tsx`

**Others**
- `src/constants/index.ts` -> `src/shared/constants/index.ts`
- All relative import definitions modified appropriately.
- Old unused folders deleted.

## Duplicates Removed
- (None detected in this scope, as existing components were directly mapped 1:1 without code loss or logical collisions.)
