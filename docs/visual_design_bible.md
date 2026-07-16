# PLOS Visual Design Bible

## 1. Product Personality
PLOS (Personal Learning Operating System) is not a course catalog, an ERP, or a generic student dashboard. It is a highly intelligent, specialized operating system for the human mind. 
Its personality is:
- **Calm**: It does not scream for attention. It reduces cognitive load, allowing the user's mind to focus entirely on the subject matter.
- **Intelligent**: It anticipates needs through subtle cues. The UI feels like an invisible assistant that organizes chaos into clarity.
- **Premium**: It respects the user's ambition. Every pixel is intentional, echoing the craftsmanship found in tools like Linear, Cursor, and Notion.
- **Focused**: It eliminates the noise of the internet. When you are in a learning session, the system fades into the background.

## 2. Design Principles (10)
1. **Content Over Chrome**: The learning material is the hero. UI elements (navbars, sidebars, borders) exist only to frame and support the content, never to compete with it.
2. **Subtlety is Strength**: Avoid heavy borders, pure blacks, pure whites, and excessive drop shadows. Rely on micro-contrasts, subtle background shifts, and delicate elevation.
3. **Intentional Friction**: Friction is only introduced to foster deep reflection (e.g., closing a learning session). Navigational friction must be zero.
4. **Fluidity Creates Trust**: Interactions must feel organic. Use hardware-accelerated, bezier-curved micro-animations to confirm user actions without delaying them.
5. **Information Density with Breathability**: Pack data intelligently without overwhelming the eye. Achieve this through rigorous grid alignment, negative space, and typographic scale rather than drawing boxes around everything.
6. **Dark Mode is Not Inverted Light Mode**: Dark mode must be designed from the ground up as a low-light, high-focus environment using deep slates and OLED-friendly backgrounds, not harsh contrasts.
7. **Semantic Meaning**: Color must have a purpose. Red means danger. Green means success. Primary color indicates the path forward. Do not use color purely for decoration.
8. **Consistent Rhythm**: Spacing is mathematical. A strict 4pt/8pt grid ensures the eye can scan effortlessly.
9. **Accessibility as a Foundation**: High contrast ratios for text, logical tab orders, and focus states are not afterthoughts; they are the baseline of a premium tool.
10. **The "Zen" Default**: If a feature or visual element does not actively help the user learn or orient themselves, it must be removed.

## 3. Visual Hierarchy Philosophy
Users should know exactly what to look at within 100 milliseconds. 
We establish hierarchy not by making things bigger and bolder, but by strategically dimming secondary information.
- **Primary**: The main action or key data point (Primary color, high contrast text).
- **Secondary**: Supporting context (Muted text, subtle borders, secondary surfaces).
- **Tertiary**: Metadata, timestamps, minor actions (Caption text, hidden-until-hover states).

## 4. Typography Philosophy
Typography is the voice of the operating system. We reject generic, childish, or overly decorative fonts.
- **Font Stack**: `Inter` (or `system-ui`) for maximum legibility and a modern, technical aesthetic.
- **Weight Restraint**: Avoid heavy bolding. Use 500 (Medium) and 600 (Semibold) for hierarchy. 700 (Bold) is reserved only for major page titles.
- **Line Height**: Generous line heights (1.5 - 1.7 for body text) to make long-form reading comfortable.
- **Tracking**: Slightly tight tracking on display headings to feel precise and engineered; slightly loose tracking on microscopic labels for legibility.

## 5. Color Philosophy
We do not use color to make the app "pop." We use color to convey state and structure.
- **Primitives vs. Semantics**: No component ever uses `text-gray-500`. It uses `text-muted`. 
- **The Primary Accent**: A sophisticated, muted accent (e.g., a deep indigo or slate-blue) that guides the eye without screaming.
- **Desaturated Palettes**: Backgrounds and surfaces are desaturated to reduce eye strain over long learning sessions.

## 6. Dark Mode Philosophy (The "Deep Focus" Mode)
Dark mode is the primary environment for deep work (like Cursor or Linear). 
- **No Pure Black (`#000000`)**: Pure black causes harsh smearing on OLEDs and eye strain. We use deep slates (e.g., `#0A0A0A` to `#121212`).
- **Surface Layering**: Elevation in dark mode is achieved through lightening the background color slightly, not through heavy drop shadows (which disappear against dark backgrounds).
- **Subdued Text**: Primary text is not pure white (`#FFFFFF`), but an off-white (`#F3F4F6`) to prevent halation (the blooming effect of bright text on dark screens).

## 7. Light Mode Philosophy (The "Crisp Morning" Mode)
Light mode should feel like a clean sheet of high-quality paper.
- **No Pure White Everywhere**: The base background is a subtle off-white (`#FAFAFA` or `slate-50`), allowing pure white (`#FFFFFF`) to be used exclusively for elevated surfaces (cards, modals).
- **Soft Shadows**: Elevation is achieved through extremely soft, highly diffused drop shadows rather than harsh borders.

## 8. Card Philosophy
Cards are the atomic building blocks of the dashboard.
- **No Boxes Within Boxes**: We reject the "ERP Dashboard" look of endless nested rectangles.
- **The "Glass" Feel**: Cards use ultra-subtle borders (`1px` solid, very low opacity) and large, organic border radii (`16px` to `24px`).
- **Interactive States**: When a card is actionable, it elevates on hover (`-translate-y-[2px]`) with a soft shadow and a barely perceptible border color shift. No aggressive glows or jumps.

## 9. Form Philosophy
Forms are conversations, not interrogations.
- **Invisible Bounds**: Inputs should feel integrated into the surface. We favor subtle background fills on inputs with microscopic borders that only illuminate on focus.
- **Focus States**: A clear, beautifully animated focus ring (e.g., a 2px offset ring in the primary color) to guarantee accessibility while feeling premium.
- **Micro-copy**: Helper text is essential, elegantly placed, and never shouting.

## 10. Dashboard Philosophy
The Dashboard is Mission Control. 
- **Answering the "Now"**: It should instantly answer: "What am I doing today?" and "Am I on track?"
- **Modular but Cohesive**: Widgets must align perfectly on a grid, creating a sense of organized calm.
- **Data Visualization**: Charts and graphs should be minimalist. Remove grid lines, axes labels where obvious, and rely on sweeping curves and gradients to show trends.

## 11. Learning Experience Philosophy
The learning view is sacred.
- **Distraction-Free**: When the user enters a learning session, sidebars collapse, navigation fades, and the content takes center stage.
- **The "Zen" Mode**: The UI wraps around the content tightly, providing only what is necessary (timers, reflection inputs, completion triggers).

## 12. Motion Philosophy
Motion explains context. It is never decorative.
- **Spatial Awareness**: Modals slide up slightly to indicate they are a layer above. Sidebars slide in from the edge to indicate their origin.
- **Performance**: All animations must be CSS-driven, targeting `transform` and `opacity` to guarantee 60fps.
- **Easing**: We use precise bezier curves. Animations start fast (snappy) and ease out gently to feel organic, never linear or robotic.

## 13. Accessibility Philosophy
Accessibility is a proxy for quality.
- **Contrast**: All text must pass WCAG AA standards.
- **Hit Areas**: Buttons and interactive elements must have generous hit areas (minimum 44x44px for touch targets), even if the visual icon is smaller.
- **Keyboard Navigation**: Everything must be navigable via Tab and Enter/Space, with beautiful focus states.

## 14. Spacing Philosophy
Spacing defines the rhythm.
- **The 8-Point Grid**: All spacing, padding, and margins are multiples of 4 or 8. This guarantees vertical and horizontal rhythm.
- **Whitespace is a Feature**: We use whitespace to group logical elements instead of drawing lines between them. 

## 15. Component Philosophy
Components are dumb, strict, and composable.
- **No Inline Styles**: Absolutely zero inline styles or hardcoded Tailwind values in page logic. Everything relies on the Design System tokens.
- **Props Dictate State, Tokens Dictate Looks**: A component receives `variant="primary"`, and the CSS tokens handle exactly what "primary" means in light, dark, hover, and active states.

## 16. Anti-Patterns (Things We Will NEVER Do)
- ❌ **Pure Black/White Backgrounds**: No `#000000` or `#FFFFFF` as the root page background.
- ❌ **Hard, High-Contrast Borders**: No `#CCCCCC` borders. Borders must be nearly invisible until focused.
- ❌ **Nested Scrolling**: No scrollbars inside scrollbars inside scrollbars.
- ❌ **Decorative Icons**: If an icon doesn't aid navigation or understanding, it is removed.
- ❌ **System Defaults**: No default browser focus rings or scrollbars.
- ❌ **Neumorphism/Heavy Skeuomorphism**: No aggressive bevels, embossing, or 3D effects. Flat, clean, and layered.

## 17. Before vs. After Comparison
| Element | Before (Student Dashboard) | After (Premium AI OS) |
|---|---|---|
| **Backgrounds** | Pure Black / Harsh White | Deep Slates / Soft Off-Whites |
| **Borders** | Thick, visible grey lines | Hairline, low-opacity dividers |
| **Shadows** | None, or harsh CSS defaults | Soft, diffused, multi-layered elevation |
| **Typography** | Generic, mixed weights | Strictly constrained Inter, semantic hierarchy |
| **Hover States** | Instant color flip | Fluid `-translate-y`, soft shadow expansion |
| **Density** | Cramped, borders everywhere | High information density via whitespace grouping |

## 18. EXACT List of Reusable Components to be Redesigned
1. **Avatar.tsx**: Refine sizing, typography for initials, border rings.
2. **Badge.tsx**: Switch to soft background tints with high-contrast semantic text, perfectly rounded.
3. **Button.tsx**: Overhaul variants (Primary, Secondary, Ghost, Danger), standardize heights, add organic click animations.
4. **Card.tsx** (Base): Implement new surface tokens, subtle borders, and `rounded-2xl` radii.
5. **Checkbox.tsx**: Custom SVG checkmarks, precise focus rings, semantic color transitions.
6. **EmptyState.tsx**: Refined typography, muted iconography, perfectly centered alignment.
7. **HabitCard.tsx**: Implement interactive hover elevation, soft semantic success states.
8. **Input.tsx** & **Textarea.tsx**: Remove heavy borders, add subtle surface fills, precise focus rings, integrated labels.
9. **JourneyTimeline.tsx**: Refine connector lines (subtler), milestone markers, active vs inactive states.
10. **Loader.tsx**: Replace generic spinners with a calm, premium pulsing or sweeping animation.
11. **MilestoneCard.tsx**: Interactive hover states, refined typography hierarchy.
12. **Modal.tsx**: Dramatic layered shadows, soft backdrop blur, smooth slide-up entry motion.
13. **PageHeader.tsx**: Standardize spacing, title typography, and action button alignment.
14. **ProgressBar.tsx**: Smoother track backgrounds, dynamic easing on progress updates, rounded caps.
15. **RadioGroup.tsx**: Custom selection rings, smooth inner-circle scaling animations.
16. **ReasonCard.tsx**: Distinct visual treatment for quotes/reasons, maybe a soft semantic left-border.
17. **Select.tsx**: Custom dropdown styling, hover states for options, smooth chevron rotation.
18. **Sidebar.tsx**: Active state highlighting, subtle right border, consistent icon weight and spacing.
19. **StatCard.tsx**: High-contrast display numbers, muted labels, positive/negative semantic trend indicators.
20. **StreakCard.tsx**: specialized styling (potentially subtle gradients) that still respects the dark/light mode surface logic.
21. **TaskCard.tsx**: Interactive hover lift, clear status badging, clean layout.
22. **TopNavbar.tsx**: Backdrop blur (glassmorphism), subtle bottom border, clean icon alignment.

---

## Execution Roadmap

**Phase 1: Design System Architecture (Foundation)**
- Audit and refine existing CSS architecture (`design-tokens.css`, `theme.css`).
- Lock in absolute primitives and semantic mappings for light/dark modes.
- *Status: Completed in previous sprints, but will be strictly enforced moving forward.*

**Phase 2: Core Primitives Refactor**
- Redesign the lowest-level components: `Button.tsx`, `Badge.tsx`, `Input.tsx`, `Textarea.tsx`, `Checkbox.tsx`, `RadioGroup.tsx`, `Select.tsx`.
- Ensure perfect focus states, hover transitions, and keyboard accessibility.

**Phase 3: Surface & Layout Refactor**
- Redesign the container components: `Card.tsx`, `Modal.tsx`, `Sidebar.tsx`, `TopNavbar.tsx`, `PageHeader.tsx`, `EmptyState.tsx`, `Loader.tsx`.
- Implement new shadow, border radius, and surface layering philosophies.

**Phase 4: Complex Interactive Cards Refactor**
- Redesign the specialized data components: `TaskCard.tsx`, `StatCard.tsx`, `HabitCard.tsx`, `StreakCard.tsx`, `MilestoneCard.tsx`, `ReasonCard.tsx`, `JourneyTimeline.tsx`, `ProgressBar.tsx`.
- Apply micro-interactions and rigorous data hierarchy.

**Phase 5: Page-Level Polish (Validation)**
- Verify that the Dashboard, Learning Journey, and Session pages inherit the new components seamlessly.
- Perform an end-to-end audit for visual consistency, contrast, and layout shifts.
