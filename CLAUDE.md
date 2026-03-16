# CLAUDE.md — TariffVerify

## What is this project?
TariffVerify is a modern SaaS web app that helps SMB manufacturers and importers instantly visualize their tariff exposure. Users upload a Bill of Materials (BOM) as CSV, the system auto-classifies HS codes using AI, calculates tariff costs by country, and lets users model "what-if" scenarios (e.g., "What if I move this component from China to Vietnam?").

## Golden rules (never violate these)

### 1. Build like a human, not a robot
- Write code the way a senior developer at Vercel or Linear would write it
- Every UI interaction should feel intentional and polished — no janky transitions, no layout shifts, no orphaned states
- Use real copy, not "Lorem ipsum" — every heading, description, empty state, and error message should feel like a human wrote it for a real product
- Microcopy matters: button labels should be action-oriented ("Upload your BOM", not "Submit"), error messages should be helpful ("We couldn't read column 3 — is it the supplier country?", not "Parse error")
- Add loading skeletons, not spinners. Skeleton screens feel faster and more modern
- Every action should have feedback: success toasts, error alerts, progress indicators
- Empty states should be delightful and guide the user to take action, not just say "No data"
- Transitions between states should be smooth — use framer-motion for mount/unmount, Tailwind transitions for hover/focus
- Think about the unhappy path: what happens when the CSV is malformed? When the API is slow? When Stripe fails? Handle every edge case gracefully.

### 2. Design like Vercel — clean, minimal, premium
- **Design inspiration:** Vercel, Linear, Raycast, Resend — ultra-clean interfaces with lots of whitespace, subtle borders, and precise typography
- **Color system:** Use a neutral base (gray-50 through gray-950) with ONE accent color (emerald/teal — #10B981 for primary actions). Avoid rainbow UIs. Use color sparingly and with purpose. Red for errors/danger, amber for warnings, emerald for success/primary.
- **Dark mode from day one:** Every component MUST work in both light and dark mode. Use CSS variables or Tailwind's `dark:` prefix. Never hardcode colors like `bg-white` without `dark:bg-gray-950`. Test both modes always.
- **Typography:** Use Geist font family (Sans for UI, Mono for code/numbers). System-ui as fallback. Font sizes: text-sm (14px) for body, text-xs (12px) for labels/captions, text-lg/text-xl for headings. Never go below 12px.
- **Spacing:** Consistent padding and margins using Tailwind's spacing scale. Cards get `p-6`, sections get `py-12` or `py-16` on marketing pages, page containers get `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Borders:** Use `border border-gray-200 dark:border-gray-800` — subtle, not heavy. Prefer `divide-y` for lists over individual item borders.
- **Shadows:** Use sparingly. `shadow-sm` for elevated cards, `shadow-lg` for modals and dropdowns only. Never use `shadow-2xl`. In dark mode, shadows are invisible — use borders instead.
- **Border radius:** `rounded-lg` (8px) for cards and inputs, `rounded-xl` (12px) for larger containers and modals, `rounded-full` for avatars and status badges.
- **Animations:** Use `transition-all duration-150` for hover states. Use `framer-motion` for page transitions, list stagger animations, and mount effects. Keep all animations under 300ms. No bouncing, no spring overshoot, no playful wobble. This is a serious B2B tool.
- **Icons:** Use `lucide-react` exclusively. Size 16px for inline, 20px for buttons, 24px for feature cards. Stroke width 1.5 always.
- **Hover states:** Cards get `hover:border-gray-300 dark:hover:border-gray-700` or subtle `hover:bg-gray-50 dark:hover:bg-gray-900`. Buttons get slight darkening of background. Never use color-change hovers that feel cheap.
- **Focus states:** Use `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2` for accessibility. Never remove default focus outlines without replacing them.

### 3. Mobile-first, always responsive — THIS IS NON-NEGOTIABLE
- **EVERY single page, component, modal, table, and chart MUST be fully responsive.** If it breaks on mobile, it's a bug. Period.
- **Design mobile-first:** Start with the mobile layout, then enhance with `sm:`, `md:`, `lg:` breakpoints using Tailwind
- **Breakpoints:**
  - Mobile: default (< 640px) — single column, stacked layouts, full-width everything
  - Tablet: `sm:` (640px+) — two-column grids where it helps
  - Desktop: `md:` (768px+) — sidebar navigation appears, multi-column dashboards
  - Wide: `lg:` (1024px+) — full dashboard layout, wider content areas, more breathing room
- **Navigation:**
  - Mobile (< md): Bottom tab bar with 4-5 icons (Dashboard, Upload, Reports, Scenarios, Settings). Sticky at bottom. Active tab highlighted with accent color.
  - Desktop (md+): Left sidebar with icon + label nav items. Collapsible to icon-only. Logo at top, user menu at bottom.
  - NEVER hide critical navigation behind a hamburger menu. Use bottom tabs on mobile.
- **Tables:** On mobile (< sm), convert data tables into stacked card layouts where each row becomes a card showing key fields. On tablet+, show the regular table. Use horizontal scroll with a fade indicator ONLY as a last resort.
- **Charts:** ALL Recharts components MUST be wrapped in `<ResponsiveContainer width="100%" height={...}>`. On mobile, simplify: fewer axis labels, hide legend below chart, reduce data point labels. Use `aspect-[16/9]` or `aspect-[4/3]` containers.
- **Touch targets:** Every button, link, and interactive element must be minimum 44x44px on mobile per Apple HIG. Add padding to small icons to increase tap area.
- **Forms:** Full-width inputs on mobile. On desktop, inputs can be inline or in 2-column grids. Labels always above inputs (not beside) on mobile.
- **Modals:** On mobile (< sm), modals become bottom sheets that slide up from the bottom, taking 80-90% of screen height. On desktop, centered with backdrop blur. Use framer-motion for the slide animation.
- **Text:** Long text should wrap naturally. Never allow horizontal overflow of text. Use `truncate` or `line-clamp-2` for text that might be too long.
- **Test at 375px width** (iPhone SE) as your minimum. Then 390px (iPhone 14), 768px (iPad), 1024px (laptop), 1440px (desktop). If it breaks at any of these, fix it before moving on.

## Commands
- `npm run dev` — Start dev server on localhost:3000
- `npm run build` — Production build (always test before deploying)
- `npm run lint` — ESLint check
- `npx supabase db push` — Push database migrations to Supabase
- `npx supabase gen types typescript --local > src/lib/database.types.ts` — Regenerate TypeScript types from DB schema
- `npx supabase migration new <name>` — Create a new migration file

## Tech stack
- **Framework:** Next.js 15 (App Router, TypeScript strict mode, server components by default)
- **Styling:** Tailwind CSS 4 with custom design tokens in globals.css
- **UI components:** Build custom — no shadcn, no component library. Keep it lightweight and exactly matching our design system. Every component hand-crafted.
- **Database + Auth:** Supabase (PostgreSQL, Row Level Security, Auth with PKCE flow)
- **Charts:** Recharts (always wrapped in ResponsiveContainer)
- **CSV parsing:** PapaParse (client-side, streaming mode for large files)
- **AI:** Anthropic Claude API via `@anthropic-ai/sdk` (for HS code classification from product descriptions)
- **Payments:** Stripe (Checkout Sessions for subscriptions, Customer Portal for management, webhooks for lifecycle)
- **Hosting:** Vercel (connected to GitHub repo, auto-deploys on push to main)
- **Email:** Resend with React Email templates
- **Animations:** framer-motion (page transitions, list stagger, mount/unmount)
- **Icons:** lucide-react (consistent 1.5 stroke width)
- **Date handling:** date-fns (never moment.js)
- **State:** React Server Components + URL search params (nuqs) + React Context for local UI state. No Redux, no Zustand, no external state libraries.
- **Class merging:** clsx + tailwind-merge via a `cn()` utility in `lib/utils.ts`

## Project structure
```
src/
├── app/
│   ├── (marketing)/          # Public pages
│   │   ├── page.tsx          # Landing page
│   │   ├── pricing/page.tsx  # Pricing page
│   │   └── layout.tsx        # Marketing layout (navbar + footer)
│   ├── (auth)/               # Auth pages
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx        # Centered card layout
│   ├── (dashboard)/          # Protected app
│   │   ├── layout.tsx        # Dashboard shell (sidebar desktop + bottom nav mobile)
│   │   ├── dashboard/page.tsx
│   │   ├── upload/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── reports/[id]/page.tsx
│   │   ├── scenarios/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── classify/route.ts
│   │   ├── analyze/route.ts
│   │   ├── webhooks/stripe/route.ts
│   │   └── export/pdf/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                   # Design system primitives
│   ├── charts/               # Recharts wrappers
│   ├── upload/               # BOM upload flow
│   ├── dashboard/            # Dashboard components
│   ├── layout/               # Sidebar, mobile-nav, navbar, footer
│   └── marketing/            # Landing page sections
├── lib/
│   ├── supabase/             # Client, server, middleware
│   ├── stripe/               # Client, checkout, portal
│   ├── tariffs/              # Rates DB, lookup, scenarios
│   ├── classify.ts           # Claude API HS classification
│   ├── csv-parser.ts         # PapaParse wrapper
│   ├── utils.ts              # cn(), formatCurrency, formatPercent
│   └── constants.ts          # Plan limits, feature flags
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
└── supabase/
    ├── migrations/
    └── seed.sql
```

## Database schema (Supabase PostgreSQL)

```sql
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  company_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table bom_uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  filename text not null,
  total_items integer default 0,
  total_spend numeric(15,2) default 0,
  total_tariff_exposure numeric(15,2) default 0,
  effective_tariff_rate numeric(5,2) default 0,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  created_at timestamptz default now()
);

create table bom_items (
  id uuid default gen_random_uuid() primary key,
  upload_id uuid references bom_uploads(id) on delete cascade not null,
  item_name text not null,
  description text,
  supplier_country text not null,
  country_code text,
  annual_spend numeric(15,2) not null,
  quantity numeric(12,2),
  unit_cost numeric(12,4),
  hs_code text,
  hs_confidence numeric(3,2),
  tariff_rate numeric(5,2),
  tariff_cost numeric(15,2),
  risk_level text default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz default now()
);

create table scenarios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  upload_id uuid references bom_uploads(id) on delete cascade not null,
  name text not null,
  changes jsonb not null,
  total_savings numeric(15,2),
  created_at timestamptz default now()
);

-- RLS enabled on all tables. Users can only access their own data.
```

## Conventions
- TypeScript strict mode — never use `any`, define proper types
- Server components by default. Only `"use client"` when truly needed
- `async/await` everywhere, never `.then()` chains
- Named exports (except page.tsx default exports required by Next.js)
- File naming: kebab-case (`upload-progress.tsx`), component naming: PascalCase (`UploadProgress`)
- Components under 150 lines — extract when bigger
- Use `cn()` utility for conditional Tailwind classes
- All API routes have try/catch with proper HTTP status codes
- User-friendly error messages always, technical details only in console
- `next/image` for all images
- `Suspense` + skeleton fallbacks for async server components

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO=
STRIPE_PRICE_ENTERPRISE=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=https://tariffverify.com
```

## Plan limits (enforce in middleware + UI)
- **Free:** 1 upload, 50 items max, basic exposure view, no scenarios, no PDF
- **Pro ($99/mo):** Unlimited uploads + items, scenarios, PDF export, tariff alerts
- **Enterprise ($299/mo):** Pro + API access, multi-user, SSO, priority support

## Build priority order
1. Landing page with email waitlist
2. Auth (signup/login) with Supabase
3. Dashboard shell (responsive sidebar + mobile bottom nav)
4. BOM upload flow (dropzone → column mapper → preview → confirm)
5. Tariff rate engine + exposure calculation
6. Dashboard with charts and summary cards
7. AI-powered HS code classification (Claude API)
8. Scenario modeling (what-if)
9. Stripe billing
10. PDF export
11. Email notifications (Resend)
12. Settings page