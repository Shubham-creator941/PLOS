# FRONTEND DESIGN SYSTEM SPECIFICATION (FDSS)

==================================================
SECTION 1 — DESIGN PHILOSOPHY
==================================================

- **Product personality:** Calm, focused, intelligent, and unobtrusive. It acts as an ambient tutor rather than a demanding taskmaster.
- **Emotional goals:** Induce a state of "Flow". The user should feel confident, guided, and free from anxiety or overwhelm.
- **Cognitive goals:** Minimize extraneous cognitive load (distractions, navigation hurdles) so 100% of the user's mental capacity is directed toward germane cognitive load (learning the actual material).
- **Visual identity:** Deep, structured, and slightly glassmorphic. It should feel like a premium, dark-mode-first Operating System.
- **Learning OS philosophy:** The interface must recede into the background during active focus (The Studio) and only step forward when guidance, intervention, or reflection is required.
- **Core Principles:** 
  1. Content over Chrome.
  2. Deterministic interactions (no unexpected pop-ups).
  3. Ambient Intelligence (AI is present but waits to be invoked or only nudges gently).

==================================================
SECTION 2 — DESIGN TOKENS
==================================================

Semantic tokens are defined by intent, not hardcoded values:

- **Primary:** The brand action color. Used exclusively for the primary CTA (e.g., "Start Session").
- **Secondary:** Neutral interactive elements (e.g., Ghost buttons, toggles).
- **Accent:** Used sparingly to draw the eye to AI insights or momentum streaks.
- **Success:** For completed milestones and correct assessments.
- **Warning:** For cognitive overload alerts or expiring sessions.
- **Danger:** Destructive actions (e.g., "Abort Session").
- **Information:** Neutral contextual hints.
- **Background:** The lowest z-level canvas. Deep, non-pure black in dark mode.
- **Surface:** The primary container color (Cards, Workspaces). Slightly elevated from background.
- **Glass Surface:** Translucent surfaces with background blur (AI Coach, Command Palette) to maintain context without blocking.
- **Border:** Subtle structural delineators. Never high-contrast.
- **Divider:** Used inside surfaces to separate lists or sections.
- **Overlay:** A dark, semi-transparent backdrop for Modals.
- **Focus:** High-visibility ring for keyboard navigation accessibility.
- **Disabled:** Muted opacity, non-interactive states.
- **Hover/Active/Selection:** Micro-interaction states indicating interactivity.
- **Text Primary:** High-contrast reading text.
- **Text Secondary:** Metadata, timestamps, less important body text.
- **Text Tertiary:** Placeholders, disabled text.
- **Icons:** Inherits Text Primary or Secondary depending on context.
- **Shadows:** Ambient glow for elevated surfaces, sharp drop-shadows for floating elements.
- **Blur/Opacity:** Strict scales for glassmorphic elements.

==================================================
SECTION 3 — TYPOGRAPHY SYSTEM
==================================================

- **Display:** Reserved for Mission Control greetings and major macro-states.
- **Heading:** Used for separating major Experiences and Workspace boundaries.
- **Title:** Used for Card headers and Widget titles.
- **Subtitle:** Contextual information below Titles.
- **Body:** The core reading font. Must prioritize legibility, large x-height, and clear character distinction (e.g., `Il1` must be distinct).
- **Caption:** Small metadata (e.g., "2 mins ago").
- **Code:** Monospaced font for technical learning materials and AI JSON outputs.
- **Line heights:** 
  - Body: 1.6 - 1.7 (Optimal for long-form reading in the Studio).
  - Headings: 1.1 - 1.2 (Tight and punchy).
- **Letter spacing:** Tighter for Display/Headings to group words; looser for uppercase Captions.
- **Font weights:** Regular (400) for Body, Medium (500) for interactive labels, SemiBold (600) for Titles. Bold (700) used sparingly.
- **Reading widths:** The Studio Workspace content must be strictly constrained to 65-75 characters per line to prevent eye fatigue.

==================================================
SECTION 4 — SPACING SYSTEM
==================================================

- **Spacing scale:** A strict geometric scale (e.g., Base-4 or Base-8) ensuring rhythm and predictability across all padding and margins.
- **Grid:** 12-column fluid grid for macro-layouts (Mission Control).
- **Columns:** Standardized gutters to separate independent Widgets.
- **Container widths:** 
  - Studio Workspace: Constrained (Max ~800px).
  - Mission Control: Expanded (Max ~1200px or fluid).
- **Section spacing:** Large gaps between unrelated domains.
- **Widget spacing:** Medium gaps between sibling cards.
- **Card padding:** Generous internal padding so data never feels claustrophobic.
- **Button spacing:** Predictable internal padding ensuring comfortable click areas.
- **Responsive spacing:** Spacing scales down proportionally on mobile devices to preserve screen real estate.

==================================================
SECTION 5 — SURFACE SYSTEM
==================================================

- **Canvas:** The root background. Holds no data directly.
- **Workspace:** The primary focal area (e.g., the Markdown reader). Elevated slightly above the Canvas.
- **Glass Panel:** The AI Coach or Adaptive Nudges. Floats above the Workspace with a blur effect to indicate transient importance.
- **Floating Widget:** The Focus Timer. Persists regardless of scrolling.
- **Sidebar:** Ambient navigation. Flush with the Canvas but separated by a subtle border.
- **Overlay / Modal:** Full interruptions (e.g., "Session Complete" summary).
- **Sheet / Drawer:** Slides in from the edge for secondary tasks (e.g., filtering the Library) without losing context.
- **Tooltip / Context Menu:** Micro-surfaces for transient information or secondary actions.

==================================================
SECTION 6 — ELEVATION MODEL
==================================================

- **z-index ownership (Lowest to Highest):**
  1. Base Canvas
  2. Content Surfaces (Widgets, Cards)
  3. Floating Action Buttons (FABs) / Floating Widgets (Timer)
  4. Drawers / Sidebars (Expanded)
  5. Global Overlays (Backdrops)
  6. Modals / Command Palette
  7. Toast Notifications / Context Menus
- **Shadow model:** 
  - Low elevation (Cards): Soft, ambient shadow to differentiate from background.
  - High elevation (Command Palette): Deep, sharp drop-shadow mimicking physical distance.
- **Blur model:** Used exclusively on Z-levels 4 and above (Drawers, Modals) to obscure but not hide the underlying context.

==================================================
SECTION 7 — COMPONENT VISUAL LANGUAGE
==================================================

- **Buttons:** Solid for primary, ghost/translucent for secondary. Clear hover/active depression states.
- **Inputs:** Clean, borderless resting states with strong bottom borders or full rings on focus.
- **Dropdowns:** Crisp borders, sharp shadows, clear selected states.
- **Cards:** The primary widget container. No heavy shadows, just subtle borders and a distinct surface color.
- **Widgets:** Self-contained cards that may have internal scroll areas if data exceeds bounds.
- **Tables:** Minimalist. No vertical dividers, generous horizontal padding.
- **Charts:** Clean lines, no heavy gradients. Monochromatic or dual-tone relying on Primary and Accent tokens.
- **Tabs:** Underlined active states, muted inactive states.
- **Navigation:** Icons with text tooltips. Active states highlighted with a subtle background pill.
- **Progress:** Thin, elegant progress bars or rings. Never chunky.
- **Timeline:** Connecting vertical lines with distinct milestone nodes.
- **Knowledge Graph:** Smooth bezier curves connecting nodes. Active nodes glow, inactive nodes recede into the background opacity.
- **Chat:** User bubbles distinct from AI responses. AI responses render iteratively with a typing indicator.
- **Command Palette:** Centered, large typography, instant visual filtering.
- **Timer:** Monospaced, highly legible, non-distracting numerals.

==================================================
SECTION 8 — MOTION SYSTEM
==================================================

- **Motion philosophy:** Motion exists to guide the eye and explain spatial relationships, never for decoration.
- **Animation durations:**
  - Fast (150ms): Hover states, toggles.
  - Normal (300ms): Modals, Drawers, Page transitions.
  - Slow (500ms): Complex layout shifts (e.g., Graph reorganization).
- **Easing:**
  - Enter: Decelerated (starts fast, slows down to rest).
  - Exit: Accelerated (starts slow, speeds up to leave).
- **Page transitions:** Cross-fades or subtle slides to maintain spatial awareness between Experiences.
- **Widget transitions:** Smooth height interpolation when content changes.
- **Loading animations:** Shimmering skeletons rather than spinning circles for content blocks.
- **AI interaction animations:** Pulsing glow when processing, smooth typing text reveal.
- **Reduced motion strategy:** Obey `prefers-reduced-motion` OS settings. Replace slides and zooms with instant snaps or simple opacity cross-fades.

==================================================
SECTION 9 — ICONOGRAPHY
==================================================

- **Icon size scale:** 16px (Inline/Metadata), 20px (Buttons), 24px (Navigation), 32px+ (Empty states).
- **Stroke widths:** Strictly consistent (e.g., 1.5px on 24px grid) to maintain uniform visual weight.
- **Semantic icon usage:** 
  - Outlined: Default resting state.
  - Filled: Active or selected state.
- **Illustration rules:** Abstract, geometric, or isometric. No cartoonish characters. Must align with the sophisticated "Learning OS" personality.

==================================================
SECTION 10 — RESPONSIVE SYSTEM
==================================================

- **Desktop (1024px+):** The optimal Studio experience. Sidebar is expanded or dockable. Widgets can be placed side-by-side.
- **Tablet (768px - 1023px):** Sidebar collapses to icons. Workspace consumes maximum width.
- **Mobile (< 768px):** 
  - Sidebar disappears entirely, replaced by a Bottom Navigation bar.
  - Studio goes full screen. The Focus Timer anchors to the top or bottom edge.
  - Widgets stack vertically.
- **Adaptive layouts:** Grid systems automatically reflow from 3 columns to 1 column based on viewport breakpoints.
- **Widget rearrangement:** The Command Palette takes over the entire screen on mobile. The AI Coach converts from a side panel to a full-screen bottom sheet.

==================================================
SECTION 11 — ACCESSIBILITY SYSTEM
==================================================

- **Contrast:** Strict adherence to WCAG AA (4.5:1 for normal text, 3:1 for large text). Verified through the semantic token palette.
- **Focus rings:** All interactive elements must have a visible focus ring (e.g., 2px solid with a 2px offset) when navigated via keyboard. 
- **Keyboard navigation:** Logical tab flow (Top-left to Bottom-right). Complex widgets (like the Map) must support arrow-key traversal.
- **ARIA consistency:** All custom components (Timers, Graphs) must have appropriate `aria-roles`, `aria-labels`, and `aria-live` regions for dynamic updates.
- **Touch targets:** Minimum 44x44px hit areas on mobile, regardless of visual icon size.
- **Screen readers:** Hidden text utilized for icons without visible labels. AI Coach interventions announced politely.
- **High contrast mode:** The design system must support a Windows High Contrast Mode mapping, dropping glassmorphism in favor of solid colors and thick borders.

==================================================
SECTION 12 — DESIGN SYSTEM REVIEW
==================================================

**Consistency:** 
By restricting components to semantic tokens rather than raw colors/spacing, visual drift is mathematically prevented across the application.

**Scalability:** 
The modular nature of the Surface and Elevation systems allows new Widgets to be introduced without risking z-index wars or layout breakage.

**Accessibility:** 
Built natively into the token layer. By decoupling logical focus management from visual styles, the application guarantees keyboard navigability without compromising the modern aesthetic.

**Performance:** 
Motion relies entirely on transform and opacity (GPU-accelerated). Glassmorphism (backdrop-filter) is used selectively on small surfaces to prevent rendering pipeline bottlenecks.

**Engineering Feasibility:** 
The specification maps perfectly to modern CSS variable implementations (e.g., Tailwind v4 or CSS Modules). The discrete component definitions allow for independent Storybook-driven development.

**Long-term Maintainability:** 
The abstraction of semantic tokens ensures that executing a complete re-theme (e.g., adding a "High Contrast Light Mode") requires changing only the root variable definitions, zeroing out component-level refactoring.
