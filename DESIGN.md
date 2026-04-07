# Design Brief: Fourthspace

## Tone & Differentiation
Modern productivity with vibrant accents. Premium, energetic workspace application — clear and focused without corporate coldness. Each of the 7 categories (Notes, Projects, Chat, Calendar, Payroll, Escrow, Wallet) gets a unique accent color visible in sidebar badges and section headers.

## Color Palette

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| Primary | Main actions, navigation | `0.45 0.24 264` (indigo-blue) | `0.68 0.22 264` |
| Secondary | Warm accent, energy | `0.62 0.22 48` (coral-orange) | `0.65 0.21 48` |
| Accent | Highlights, active states | `0.58 0.19 172` (teal) | `0.72 0.18 172` |
| Success | Positive actions | `0.55 0.22 142` (emerald) | `0.62 0.2 142` |
| Warning | Caution states | `0.68 0.18 88` (amber) | `0.74 0.16 88` |
| Destructive | Delete, danger | `0.58 0.25 22` (red-coral) | `0.65 0.22 22` |
| Neutral Background | Page base | `0.98 0 0` (near-white) | `0.14 0 0` (near-black) |
| Neutral Foreground | Text | `0.12 0 0` (dark text) | `0.94 0 0` (light text) |

## Typography
- **Display**: Space Grotesk — geometric, modern, strong presence for headers
- **Body**: Figtree — clear, screen-optimized, highly legible
- **Mono**: Geist Mono — balanced, technical for code and inputs

## Structural Zones
- **Header**: `bg-card border-b-border` with primary logo/title, user menu
- **Sidebar**: `bg-sidebar` with category navigation, each with distinct badge color
- **Main Content**: `bg-background` with card-based layout, `bg-card` surfaces with `border-border`
- **Footer**: `bg-muted/30 border-t-border` with spacing and secondary info
- **Workspace Overview Widget**: Elevated card on dashboard with stats, charts, real-time data

## Elevation & Depth
Subtle shadows with layered backgrounds: card base, elevated states, hover states. Use border + shadow for card distinction (no pure flat design).

## Component Patterns
- **Buttons**: Primary (indigo, full), Secondary (coral, outline), Destructive (red, outline)
- **Forms**: Light border with focus ring in primary color; dark mode uses darker input background
- **Cards**: `bg-card border-border` with shadow on light, muted border on dark
- **Badges**: Category colors on sidebar, status indicators in content

## Motion
Smooth transitions (`transition-smooth`) on all interactive elements. No bouncy or overstated animations — focus on clarity.

## Responsive
Mobile-first design with `sm:`, `md:`, `lg:` breakpoints. Sidebar collapsible on mobile, full on desktop. Content stacks vertically on mobile, grid on desktop.

## Dark Mode
Intentional color tuning: higher lightness on text, adjusted chroma for readability. Border and background contrast maintained across modes.
