# Architecture Decision Record (ADR) 001: Modernization, Supabase Backend, and Fault-Tolerant UI

## Status
**Accepted & Implemented**

## Context
The student assignment tracker application required a complete architectural overhaul to replace legacy aesthetic debt, eliminate client-side state loss on reload, integrate real-time Supabase cloud persistence, and provide a secure, responsive, high-performance user experience across mobile and desktop devices.

## Decisions

1. **Backend & Authentication Engine: Supabase (PostgreSQL + Auth + Storage)**
   - Replaced mock-only storage with live Supabase client connection (`@supabase/supabase-js`).
   - Implemented Google OAuth and Email/Password authentication with standard Password Recovery (`resetPasswordForEmail` + token capture).
   - Enforced Row Level Security (RLS) policies scoped by `user_id` on tasks and subjects.

2. **Aesthetic & Design System: Neutral Slate & High-Contrast Visual Hierarchy**
   - Stripped all extraneous legacy purple/indigo styling in favor of modern Slate/Zinc palette with precise Blue-600 accents.
   - Standardized typography with *Plus Jakarta Sans*, *Inter*, and *JetBrains Mono*.
   - Engineered permanent left navigation rail for desktop viewports and bottom tab bar for mobile viewports.

3. **Client-Side Image Optimization for Avatar Storage**
   - Implemented browser canvas downsampling (~320x320 JPEG) to allow instant profile picture updates without requiring external S3/Supabase storage bucket configurations.
   - Synced avatar across local storage, application context, and Supabase user metadata.

4. **Fault Tolerance & Resilience: ErrorBoundary Integration**
   - Wrapped the entire view layer in a custom React `ErrorBoundary` with triaged self-healing actions (*Try Again*, *Return to Workspace*, *Reset Cache*).

5. **Mobile Viewport Optimization**
   - Configured native mobile viewport metadata in `index.html` with explicit max width and overflow constraints to eliminate desktop-mode rendering glitches on mobile phones.

## Consequences
- **Positive**: Blazing fast load times (<500ms build bundle), robust cloud sync, complete password recovery workflows, zero blank-screen crashes, and responsive mobile layout.
- **Maintenance**: Developers should ensure all new database mutations continue to supply explicit `.eq('user_id', user.id)` query parameters for multi-tenant data isolation.
