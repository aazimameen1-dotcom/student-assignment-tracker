---
name: Scholarly Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-padding-desktop: 32px
  container-padding-mobile: 16px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is rooted in the "Academic Modernist" style—a blend of **Corporate Modern** reliability and **Minimalist** clarity. It aims to evoke a sense of focused intelligence, organization, and prestige. The target audience is high-achieving students and researchers who require a tool that feels as serious and disciplined as their studies.

The visual narrative moves away from skeuomorphic textures toward a clean, editorial aesthetic. It utilizes generous whitespace to reduce cognitive load and a structured grid to convey order. Interaction patterns are subtle and deliberate, favoring high-quality typography and precise linework over heavy shadows or decorative elements.

## Colors

This design system utilizes a sophisticated, high-contrast palette designed for long-form legibility and clear information architecture.

*   **Primary (Ink):** A deep navy (#0F172A) used for headings, primary navigation, and high-emphasis text. It provides the "scholarly" weight.
*   **Secondary (Academic Blue):** A refined vibrant blue (#3B82F6) used for primary actions, focus states, and active progress indicators.
*   **Success/Tertiary (Growth):** A soft emerald (#10B981) for completed tasks and positive trends.
*   **Semantic Accents:** 
    *   *Warning/Urgent:* Amber (#F59E0B) for deadlines within 24 hours.
    *   *Critical:* Crimson (#EF4444) for overdue items.
*   **Neutral (Slate):** A scale of cool greys ranging from Slate-50 (#F8FAFC) for backgrounds to Slate-500 (#64748B) for secondary metadata.

The background is strictly Slate-50 to provide a crisp, paper-like canvas for the content.

## Typography

The typography strategy focuses on a hierarchy that mirrors scientific journals and modern SaaS.

1.  **Headlines (Hanken Grotesk):** Chosen for its sharp, contemporary geometric terminals. It provides a professional, "published" look for titles.
2.  **Body (Inter):** The workhorse for the system. It is highly legible in data-heavy tables and long-form task descriptions.
3.  **Labels & Metadata (JetBrains Mono):** Used sparingly for "Scholarly Works" IDs, timestamps, and status labels to introduce a technical, precise feel that distinguishes data from prose.

Text should follow a strict hierarchy: use primary navy for titles, Slate-700 for body text, and Slate-500 for secondary labels.

## Layout & Spacing

This design system employs a **Fixed Grid** on desktop (1280px max-width) and a **Fluid Grid** for mobile. 

*   **Grid Model:** A 12-column grid with 24px gutters. 
*   **Dashboards:** Use a "Sidebar + Content" structure. The sidebar is fixed at 280px.
*   **Spacing Rhythm:** All spacing is based on a 4px baseline. Components should use 16px (md) or 24px (lg) internal padding to maintain the "premium" airy feel requested.
*   **Tables:** The 'Pending Scholarly Works' table should utilize a "Comfortable" density, with row heights no less than 56px to ensure each task feels distinct and important.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than shadows.

1.  **Base Layer:** Slate-50 background.
2.  **Surface Layer:** Pure white (#FFFFFF) containers for dashboard widgets and tables.
3.  **Bordering:** Instead of shadows, use 1px solid borders in Slate-200. This creates a "blueprint" or "manuscript" feel that is cleaner than the previous grey-brown version.
4.  **Subtle Depth:** A very soft, 20% opacity blur (Y: 2px, B: 4px) may be used *only* for floating menus or modals to separate them from the work surface.

## Shapes

The shape language is disciplined. We use **Soft** (4px) roundedness for most UI elements (buttons, inputs, cards) to maintain a professional, architectural rigor. Avoid large "bubbly" radii.

*   **Cards/Widgets:** 8px (rounded-lg) to subtly frame content.
*   **Buttons & Inputs:** 4px to remain sharp and intentional.
*   **Progress Bars:** 2px roundedness to feel like precision instruments.

## Components

*   **Progress Charts:** Use thin strokes (2px) for line charts. Use a "Donut" style for overall progress with the percentage centered in `display-lg` typography.
*   **Pending Scholarly Works Table:** 
    *   Remove alternating row colors; use a thin 1px bottom border (Slate-100) instead.
    *   Status indicators should be "Pills" with low-saturation backgrounds and high-saturation text (e.g., Soft Blue bg with Deep Blue text).
*   **Buttons:** 
    *   *Primary:* Solid Ink (#0F172A) with white text.
    *   *Secondary:* White with 1px Slate-300 border.
*   **Input Fields:** Ghost-style with a Slate-200 bottom border that becomes Blue-500 on focus, emphasizing a "writing on a line" metaphor.
*   **Sidebar:** Use a dark theme for the sidebar (Ink #0F172A) to create a strong vertical anchor, while the main content area remains light and airy.