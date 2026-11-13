# UniCareer Community — Design System Specification

## 1. Visual Direction & Identity

UniCareer Community embodies a **high-trust, academic-meets-modern-tech aesthetic**:
- Professional, credible, and focused on readability, rapid scanning, and trust.
- Clean typography and structured card layouts inspired by modern professional networking platforms.
- Eliminates generic AI dashboard patterns (no random neon accents, no mismatched corner radii, no dead buttons).
- Deep University Navy paired with subtle Slate neutrals, high-contrast text, and semantic status accents.

---

## 2. Design Tokens & Color Palettes

### 2.1 Color Tokens (OKLCH Format in `app/globals.css`)

| Token | Light Theme Value | Dark Theme Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--primary` | `oklch(0.38 0.14 255)` (Deep Navy/Blue `#1E3A8A`) | `oklch(0.62 0.19 255)` (Electric Blue `#3B82F6`) | Primary brand identity, primary CTA buttons, active tabs |
| `--primary-foreground` | `oklch(0.99 0 0)` (White) | `oklch(0.12 0.02 260)` (Dark Slate) | Text and icons on primary backgrounds |
| `--secondary` | `oklch(0.95 0.015 250)` (Soft Slate) | `oklch(0.24 0.03 260)` | Secondary buttons, subtle pills, tags |
| `--background` | `oklch(0.985 0.005 250)` (Off-white `#F8FAFC`) | `oklch(0.14 0.02 260)` (Midnight Void `#0A0F1D`) | Page background |
| `--card` | `oklch(1 0 0)` (Pure White `#FFFFFF`) | `oklch(0.18 0.025 260)` (Dark Slate `#131B2E`) | Card surfaces, dropdown menus, modals |
| `--border` | `oklch(0.90 0.01 250)` (`#E2E8F0`) | `oklch(0.26 0.025 260)` (`#1E293B`) | Structural dividers, card borders, inputs |
| `--muted` | `oklch(0.95 0.01 250)` | `oklch(0.22 0.025 260)` | Inactive containers, skeleton backgrounds |
| `--muted-foreground` | `oklch(0.48 0.02 250)` (`#64748B`) | `oklch(0.65 0.02 250)` (`#94A3B8`) | Secondary metadata, dates, helper text |
| `--destructive` | `oklch(0.55 0.22 25)` (Crimson) | `oklch(0.65 0.20 25)` | Error banners, destructive confirmation actions |
| `--success` | Emerald `#059669` | Emerald `#10B981` | Verified member check, offer extended badge |
| `--warning` | Amber `#D97706` | Amber `#F59E0B` | Pending verification, community-shared badge, review |
| `--info` | Sky Blue `#0284C7` | Sky Blue `#38BDF8` | Official employer badge, submitted status |

### 2.2 Border Radii & Elevation
- Inputs & Buttons: `rounded-lg` (8px / `0.5rem`)
- Cards & Dialogs: `rounded-xl` (12px / `0.75rem`)
- Modals & Overlays: `rounded-2xl` (16px / `1rem`)
- Badges & Pills: `rounded-full` / `rounded-4xl`
- Shadows:
  - Base Card: `shadow-xs border border-border/80`
  - Interactive Hover: `hover:shadow-md hover:border-primary/40 transition-all duration-150`
  - Focus Ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`

---

## 3. Typography Hierarchy

- **Primary Font**: `Inter` via `next/font/google` (`--font-sans`).
- **Scale**:
  - `Display / Hero`: `text-4xl` to `text-6xl`, `font-extrabold`, `tracking-tight`
  - `Page Title`: `text-2xl` to `text-3xl`, `font-bold`, `tracking-tight`
  - `Section / Card Title`: `text-base` to `text-lg`, `font-semibold`
  - `Body Text`: `text-sm`, `font-normal`, `leading-relaxed`
  - `Helper / Labels`: `text-xs`, `font-medium`
  - `Metadata / Badges`: `text-[10px]` to `text-[11px]`, `font-semibold`

---

## 4. Theme Engine & Accessibility

- **Theme Persistence**: Managed via `next-themes` stored in `localStorage` with `system` default.
- **Client Hydration Sync**: Uses React 19 `useSyncExternalStore` in `ThemeToggle` to eliminate cascading hydration re-renders and compiler warnings.
- **Contrast**: Both light and dark palettes strictly fulfill **WCAG 2.1 AA** contrast ratios (minimum 4.5:1 for body text, 3:1 for large text).
- **Reduced Motion**: All animations support `motion-reduce:transition-none` and `motion-reduce:animate-none`.

---

## 5. Component Inventory

### 5.1 Reusable UI Primitives (`components/ui/`)
- `Button`: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`; sizes `xs`, `sm`, `default`, `lg`, `icon-sm`, `icon-xs`.
- `Input`: Standard, icon-integrated, invalid/error state with `aria-invalid`.
- `Textarea`: Standard and expandable inputs.
- `Select`: Dropdown select with accessible keyboard navigation.
- `Checkbox`: Accessible checkbox with label linking.
- `RadioGroup`: Multi-option radio selection.
- `Tabs`: Segmented tab switcher (`TabsList`, `TabsTrigger`, `TabsContent`).
- `Badge`: `default`, `secondary`, `outline`, `destructive`, `success`, `warning`, `info`.
- `Avatar`: Avatar image with fallback initials.
- `Card`: Structured card container (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`).
- `Dialog`: Accessible modal container with backdrop and focus trap.
- `Tooltip`: Tooltip popup with customizable side and delay.
- `Table`: Semantic tabular grid with styled headers, cells, and zebra rows.
- `Pagination`: Accessible page navigation controls.
- `Breadcrumb`: Structured navigational path trail.
- `Skeleton`: Pulsing placeholder geometry preventing CLS.
- `Sonner / Toaster`: Rich toast alert system (`toast.success`, `toast.error`, `toast.info`).

### 5.2 Feedback & State Micro-UIs (`components/feedback/`)
- `EmptyState`: Centered icon, title, description, and recovery CTA.
- `ErrorBanner`: High-visibility inline banner with retry action.
- `ConfirmDialog`: Destructive confirmation modal for permanent actions.

### 5.3 Opportunity Domain Components (`components/opportunities/`)
- `JobCard`: Full job listing presentation with employer badge, salary, location, skills, bookmark toggle, and deadline indicator.
- `CompanyCard`: Employer partner card with active jobs count and industry metadata.
- `EmployerBadge`: Displays `COMMUNITY_SHARED` community lead badge indicating peer-shared listings.
- `VerifiedBadge`: Displays verification state (`VERIFIED`, `PENDING`, `REJECTED`, `SUSPENDED`).
- `MatchScoreIndicator`: Student qualification overlap badge (e.g. 92% Match).
- `DeadlineIndicator`: Urgent deadline indicator (<3 days highlighted with pulsing dot).
- `ApplicationStatusBadge`: Color-coded pipeline state (`SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEWING`, `OFFERED`, `REJECTED`, `WITHDRAWN`).
- `ApplicantSummaryCard`: Candidate card with application tracking status badge.

### 5.4 Community Domain Components (`components/community/`)
- `CreatePostBox`: Interactive post submission trigger with post type selection and attached opportunity support.
- `FeedPostCard`: Discussion card supporting embedded job card pills and reaction bars.
- `ReactionButtons`: Interactive Like button with real-time toggle counter and optimistic updates.
- `MemberProfileCard`: Member directory card with mentorship indicator and connection button.
- `ConnectionButton`: Multi-state button (`Connect` → `Pending` → `Connected`).
- `ReferralCard`: Structured student elevator pitch targeting alumni at specific firms.
- `CommentThread`: Nested comment discussion thread with reply composition.

---

## 6. Design System Integration

The design system tokens and component primitives are directly integrated across the application:
- Theme configuration in `app/globals.css` with OKLCH color spaces.
- Real-time Light/Dark/System theme switching via `next-themes`.
- Accessible shadcn/ui primitives in `components/ui/`.
- Fully responsive across mobile, tablet, and desktop viewports.

---

## 7. Layout & Navigation Architecture (Stage 3)

### 7.1 Shell Layouts
- `app/(public)/layout.tsx`: Public marketing landing page with minimalist `AppNavbar` and `AppFooter`.
- `app/(auth)/layout.tsx`: Centered, distraction-free authentication card layout with university branding.
- `app/(dashboard)/layout.tsx`: Main authenticated application layout powered by `AuthenticatedShell`.

### 7.2 Core Navigation Components (`components/navigation/`)
- `AppSidebar`: Sticky desktop sidebar with primary navigation, student tools badge, settings, and role-gated admin command entry.
- `AppHeader`: Top sticky header featuring global search input (⌘K), verified network status indicator, notification drawer, theme toggle, and user profile menu.
- `MobileNav`: Thumb-accessible bottom navigation bar for mobile viewports paired with an off-canvas drawer navigation menu.
- `UserMenu`: Profile dropdown menu showing member verification status badge, direct navigation links, and session controls.
- `NotificationsPopover`: Live notification indicator badge and dropdown feed preview.

### 7.3 Page Templates (`components/templates/`)
- `DashboardTemplate`: 2-column feed layout with page header, metrics row, main content stream, and contextual right sidebar.
- `ListingTemplate`: Data listing layout with title header, primary actions, search and multi-select filter bars, active filter tags, and pagination controls.
- `DetailsTemplate`: 2-column resource view with breadcrumbs, prominent resource header, main body, and sticky metadata/action sidebar.
- `FormTemplate`: Card-encapsulated form layout with configurable max-width, breadcrumb navigation, and footer action bar.
- `ProfileTemplate`: Member profile view with avatar banner, role verification badges, navigation tabs, and credential sidebar.
- `AdminTemplate`: Moderation and governance workspace with staff badges, queue counters, tabbed moderation workflows, and audit trail tables.
