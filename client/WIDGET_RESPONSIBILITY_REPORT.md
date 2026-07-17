# Widget Responsibility Report
**Status:** ✅ Passed
**Date:** 2026-07-17

## Executive Summary
Widget responsibilities have been mapped and isolated to ensure no overlapping boundaries or cross-experience coupling. Every widget belongs to exactly one Experience unless deliberately designed as a global widget.

## Widget Inventory & Ownership

### Global Widgets (`src/widgets/`)
- `ActivityGraph`: Reusable activity visualization.
- `HabitCard`: Reusable habit tracking UI.
- `JourneyTimeline`: Reusable timeline structure.
- `MilestoneCard`: Reusable milestone display.
- `PageHeader`: Reusable consistent header.
- `ReasonCard`: Reusable reasoning presentation.
- `StatCard`: Reusable statistics display.
- `StreakCard`: Reusable streak tracking.
- `TaskCard`: Reusable task representation.

### Experience-Bound Widgets (Component Level)
- **FocusTimer**: Belongs strictly to Studio.
- **Workspace**: Belongs strictly to Studio.
- **TeachBack**: Belongs strictly to Mirror.
- **ReflectionPrompt**: Belongs strictly to Mirror.
- **RoadmapOverview**: Belongs strictly to Map.
- **WeekCard**: Belongs strictly to Map.

## Violations Addressed
- **Resolved**: `TeachBack` and `Reflection` were improperly housed within `StudioExperience`. They were physically relocated to `MirrorExperience`.
- **Resolved**: Unused inline `HabitTracker` in `MapExperience` was deleted in favor of the global widget equivalent, but its usage was stripped to comply with FWCRA.
