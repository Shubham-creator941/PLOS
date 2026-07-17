# Theme Runtime Report

- Single source of truth moved strictly to Zustand (`useThemeStore`).
- Detects OS preference changes via `matchMedia`.
- No flash on page load, stored in localStorage.
- Uses strictly semantic design tokens in CSS variables.