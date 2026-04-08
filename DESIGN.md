# Design Brief: Fourthspace

## Tone & Differentiation
Modern productivity with vibrant accents. Premium, energetic workspace application — clear and focused without corporate coldness. Linear-inspired with high contrast, tight typography, micro-interactions, muted accents. Mobile-first responsive across all devices (320px+, 768px+, 1024px+). Dashboard features hero gradient card, metrics grid, financial summary, activity feed. All templates pre-filled with meaningful, instructional content at creation time.

## Color Palette

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| Primary | Main actions, navigation | `0.45 0.24 264` (indigo-blue) | `0.68 0.22 264` |
| Secondary | Warm accent, energy | `0.62 0.22 48` (coral-orange) | `0.65 0.21 48` |
| Accent | Highlights, active states | `0.58 0.19 172` (teal) | `0.72 0.18 172` |
| Success/Active | On-track goals | `0.55 0.22 142` (emerald) | `0.62 0.2 142` |
| Warning/At-Risk | Goals at risk | `0.68 0.18 88` (amber) | `0.74 0.16 88` |
| Destructive/Behind | Goals behind | `0.58 0.25 22` (red-coral) | `0.65 0.22 22` |
| Neutral Background | Page base | `0.98 0 0` (near-white) light / `0.08 0 0` (near-black) dark |
| Neutral Foreground | Text | `0.12 0 0` (dark text) light / `0.98 0 0` (light text) dark |

## Typography
- **Display**: Space Grotesk — geometric, modern, strong presence for headers and titles
- **Body**: Figtree — clear, screen-optimized, highly legible for descriptions and content
- **Mono**: Geist Mono — balanced, technical for code and inputs

## Structural Zones
- **Mobile Sidebar**: Drawer overlay (fixed inset) on mobile, fixed sidebar on md+ with smooth transitions
- **Dashboard Hero**: Gradient card (primary color) with workspace name, member count, status badge — full width on all breakpoints
- **Metrics Grid**: 1 col mobile, 2 cols tablet, 3-4 cols desktop — stat cards with hover elevation
- **Financial Summary**: Wallet balance, escrow status, payroll info — card-based layout
- **Quick Actions**: Pill-shaped buttons (44px+ touch targets) with icons
- **Activity Feed**: Timeline of recent workspace activity with timestamps
- **Detail Views**: Modals/overlays for expanded content with clean card styling

## Responsive Breakpoints
- **Mobile (320px+)**: Single column layouts, drawer sidebar, full-width cards, stacked quick actions
- **Tablet (768px)**: Two-column grid, fixed sidebar appears, horizontal quick action row
- **Desktop (1024px+)**: Multi-column grids, full workspace visibility, expanded detail panels

## Touch & Interaction
- Minimum tap target: 44x44px on all interactive elements
- Smooth transitions on hover/active states (150ms cubic-bezier)
- Card interactive hover: shadow elevation + border color shift
- No jarring animations — professional, intentional motion only

## Status Color Coding
- **Active** (on-track): chart-4 (emerald-green) background 10%, emerald text
- **At Risk**: chart-5 (amber) background 10%, amber text
- **Behind**: destructive (red-coral) background 10%, red text
- **Completed**: muted neutral background, muted text (deemphasized)

## Component Patterns
- **Hero Card**: Gradient background, display font, workspace context, status badge
- **Stat Cards**: Icon + metric + label, hover elevation, sm: and md: padding adjustments
- **Quick Action Buttons**: Pill-shaped (rounded-full), semantic colors, 44px minimum height
- **Status Badges**: Semantic color-coded pills on cards (Active/At Risk/Behind/Completed)
- **Activity Timeline**: Minimal text, emphasis on timestamp + action type + actor
- **Progress Bars**: Full-width bars, color-coded by status, smooth animation on change

## Motion & Transitions
All interactive elements use `transition-smooth` (150ms). Hover states elevate cards. Page entrance animations fade-in-up. Progress bars animate value changes smoothly. Focus states use 2px ring with primary color.

## Dark Mode
Intentional color tuning: near-black backgrounds (0.08 0 0), higher foreground lightness (0.98 0 0), adjusted chroma for readability. Status colors maintain visibility. Sidebar uses subtle purple tint for depth. Light/dark toggle available on all pages.

## Template System
- **Notes**: 16+ templates (Meeting Notes, Weekly Review, Project Brief, Standup, etc.) with pre-filled sections, prompts, and example content — accessible at creation time
- **Projects**: 12+ templates (Agile Sprint, Bug Tracker, Product Launch, Roadmap, etc.) with pre-populated task lists, subtasks, milestones, and dependencies — accessible at creation time
- All templates contain meaningful, instructional content (not blank outlines) — real tasks, descriptions, and workflow guidance

## Quality Bar
Benchmark against Linear, Notion, Asana. Responsive across all device sizes. Touch-friendly on mobile. High-contrast dark mode. Fast interactions with smooth micro-animations. Clean information hierarchy with breathing room.
