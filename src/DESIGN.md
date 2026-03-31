# Design System Strategy: The High-Performance Arena

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Stadium."**

In a high-stakes sales environment, the UI should not feel like a static spreadsheet; it should feel like a high-performance command center. We move away from the "generic SaaS" look by abandoning rigid boxes and flat grey borders. Instead, we use **Tonal Depth** and **Vibrant Luminosity** to drive the eye toward competitive action.

The experience is defined by:
* **Intentional Asymmetry:** Important data widgets might break the grid with larger corner radii (`xl`) or subtle glows to signify "active" status.
* **Kinetic Energy:** The use of the vibrant lime green (`primary`) acts as a laser-focused indicator of growth and success against the deep obsidian of the `background`.
* **Editorial Scaling:** We use high-contrast typography sizes—pairing massive, aggressive display numbers with tiny, precise labels—to create a sense of professional urgency.

## 2. Colors
Our palette is engineered for high-contrast dark mode legibility, using the lime green as a functional "ignition" color.

* **Primary (`#b8fd4b`):** The "Closer" green. Reserved for success states, primary actions, and positive trend lines. It should feel like it's glowing against the dark surface.
* **Secondary (`#2db7f2`):** A cool sky blue for information, secondary data sets, and non-conversion interactions.
* **Tertiary (`#ff86c3`):** High-energy pink for alerts, competitive "hot" leads, or urgent reminders.
* **Neutrals:** A range of deep navy-graphites (from `surface` to `surface-container-highest`) to build depth without introducing "grey-wash."

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined through:
1. **Background Shifts:** Place a `surface-container-low` card on a `surface` background.
2. **Tonal Transitions:** Use a soft transition from `surface-container` to `surface-container-high` to define a sidebar or header.

### The "Glass & Gradient" Rule
To elevate the "Arena" feel, floating elements (modals, dropdowns) should use **Glassmorphism**. Apply `surface-container` at 80% opacity with a 20px backdrop blur. For main CTAs, use a subtle gradient from `primary` (`#b8fd4b`) to `primary-container` (`#83c300`) to give the button a tactile, "lit-from-within" quality.

## 3. Typography
We pair the technical precision of **Inter** with the aggressive, modern stance of **Space Grotesk**.

* **Display & Headlines (Space Grotesk):** Used for big numbers, "The Leaderboard," and high-level section titles. This font’s geometric quirks feel data-driven and energetic.
* **Body & Titles (Inter):** Used for CRM data, names, and descriptions. Inter provides the clinical legibility required for managing complex sales pipelines.
* **The Power Hierarchy:** Use `display-lg` for key metrics (e.g., total revenue). Surround it with `label-sm` in `on-surface-variant` for metadata. The massive scale difference creates an "Editorial" look that feels premium and intentional.

## 4. Elevation & Depth
Depth in this system is a result of light physics, not structural lines.

* **The Layering Principle:**
* **Level 0 (Base):** `surface` (#060e20).
* **Level 1 (Sections/Groups):** `surface-container-low`.
* **Level 2 (Cards/Widgets):** `surface-container`.
* **Level 3 (Popovers/Active States):** `surface-container-highest`.
* **Ambient Shadows:** Floating elements use a wide-spread shadow (blur: 32px, Y: 16px) with 6% opacity of `surface-container-lowest`. This mimics a soft glow rather than a harsh drop shadow.
* **The "Ghost Border" Fallback:** If a border is required for accessibility in data tables, use `outline-variant` at **15% opacity**. It should be barely felt, not seen.

## 5. Components

### Buttons
* **Primary:** Gradient fill (`primary` to `primary-container`), `on-primary` text (Semi-bold), `DEFAULT` (0.5rem) roundedness.
* **Secondary:** Ghost style. No background, `primary` text, and a 1px "Ghost Border" (15% opacity).
* **States:** On hover, primary buttons should gain a soft outer glow (`box-shadow`) using the `primary` color at 20% opacity.

### Input Fields
* **Style:** `surface-container-highest` background. No border.
* **Interaction:** On focus, the bottom edge gains a 2px `primary` line. This maintains the "sleek" look while providing clear interaction feedback.

### Cards & Lists
* **The Divider-Free Rule:** Use the **Spacing Scale** (e.g., `spacing-4` or `spacing-6`) to separate list items. Never use horizontal lines.
* **Data Visualization:** Use "Glowing Accents." Chart lines in `primary` or `secondary` should have a subtle 2px blur "glow" beneath them to make the data pop against the dark background.

### High-Performance Scoreboard (Custom Component)
A custom component for the "Sales Arena" that uses `display-md` typography for the primary metric, a `primary` or `error` mini-sparkline for trend, and a `surface-container-highest` background to pull it forward in the hierarchy.

## 6. Do's and Don'ts

### Do
* **Do** use `primary` sparingly. It is a "high-alert" and "high-reward" color. If everything is green, nothing is important.
* **Do** lean into the `rounded-md` and `rounded-lg` scales for a sleek, ergonomic feel.
* **Do** use `on-surface-variant` for labels to keep the visual noise low.

### Don’t
* **Don’t** use pure black (#000000) for backgrounds; it kills the depth. Use the `surface` navy-graphite.
* **Don’t** use high-contrast borders. If you can see the border from a distance, it’s too thick/bright.
* **Don’t** use standard "Material" blue for links. Use the `secondary` or `primary` tokens to keep the brand’s unique signature.
* **Don’t** use font sizes below `text-sm` (14px) for any visible UI text — labels, placeholders, helper text included. Classes like `text-xs` (12px), `text-[11px]`, `text-[10px]` are forbidden for readable content. The minimum legible size in this dark theme is `text-sm`.