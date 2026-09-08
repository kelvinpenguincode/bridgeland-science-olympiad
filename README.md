# Bridgeland Science Olympiad

A production-quality website and team-management platform for the **Bridgeland High School Science Olympiad** team (Cypress, TX). Built to run an entire competition season: public marketing pages, a private member dashboard, and a full administration panel for officers/coaches.

> **Demo data notice:** the seed data (`supabase/seed.sql`) contains entirely fictional names, emails, and results for development/demo purposes. Replace it before using this in production.

---

## 1. Project Overview

The site has three audiences, each with its own route group and access rules:

| Area | Routes | Who can access |
|---|---|---|
| **Public marketing site** | `/`, `/about`, `/team`, `/events`, `/events/[slug]`, `/meetings`, `/calendar`, `/competitions`, `/competitions/[slug]`, `/resources`, `/placement`, `/results`, `/contact` | Everyone (some resources are gated to signed-in members/officers) |
| **Member dashboard** | `/dashboard/*` | Any authenticated member |
| **Admin panel** | `/admin/*` | `officer`, `event_captain`, `admin`, `sponsor` (some actions are admin/sponsor-only) |

Key product features:

- Public event catalog for all 23 current Division C events, team calendar, meeting archive, competition listings, resource library, and placement-testing info.
- Member dashboard with assigned events, attendance, private placement results, and personal resources.
- Full admin CMS for announcements, calendar, meetings, events, resources, officers, members/roles, competitions + results, teams + an event-assignment matrix (with "unfilled event" / "overloaded student" / "unassigned student" flags), attendance session marking, and placement testing (manual entry, CSV import, automatic ranking, and a results-release workflow).
- Global `⌘K` / `Ctrl+K` search across events, resources, competitions, and announcements.
- Role-based authorization enforced **both** in the UI and at the database layer via Postgres Row Level Security — see [Security model](#6-database--security-model) below.

---

## 2. Technology Stack

- **Framework:** Next.js 16 (App Router, Server Components, Turbopack)
- **Language:** TypeScript (strict mode)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (Base UI primitives), Lucide React icons
- **Data/Auth:** Supabase (PostgreSQL, Auth, Row Level Security, Storage-ready schema)
- **Charts:** Recharts
- **Forms:** react-hook-form + Zod
- **Deployment:** Vercel-compatible out of the box

---

## 3. Installation

**Prerequisites:** Node.js 20+, npm, and a free [Supabase](https://supabase.com) project.

```bash
git clone <your-repo-url>
cd bridgeland-science-olympiad
npm install
cp .env.example .env.local
# then fill in .env.local — see Environment Variables below
```

---

## 4. Environment Variables

All variables live in `.env.local` (see `.env.example`). Get the first two from your Supabase project's **Settings → API** page.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL. Safe to expose to the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public API key. Safe to expose to the browser — RLS policies do the real enforcement. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Service-role key for `src/lib/supabase/admin.ts`, an elevated server-only client reserved for future privileged operations (e.g. bulk user provisioning via the Supabase Auth Admin API). Nothing shipped today strictly requires it, but keep it server-only and **never** prefix it with `NEXT_PUBLIC_`. |

Without real Supabase credentials the app still builds (placeholder values keep `next build` from failing), but every data-backed page will show its error/empty state until you connect a real project.

---

## 5. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Copy the Project URL and `anon` key into `.env.local`.
3. Run the SQL migrations (see below) to create the schema, functions, and RLS policies.
4. (Optional but recommended for a realistic demo) run the seed script.
5. Turn **off** email confirmation under **Authentication → Sign In / Providers → Email → Confirm email** so new members can sign in immediately after creating an account. If anyone already signed up while confirmation was on, confirm them in the SQL Editor with:

   ```sql
   update auth.users
   set email_confirmed_at = coalesce(email_confirmed_at, now())
   where email_confirmed_at is null;
   ```

### Running the migrations

The SQL lives in `supabase/migrations/` (schema, then functions, then RLS) and `supabase/seed.sql`. Apply them in that exact order.

**Option A — Supabase Dashboard (simplest, no CLI required):**

Open your project's **SQL Editor** and run each file's contents, in order:

1. `supabase/migrations/20260101000001_schema.sql`
2. `supabase/migrations/20260101000002_functions.sql`
3. `supabase/migrations/20260101000003_rls.sql`
4. `supabase/seed.sql` (optional — demo data)

**Option B — Supabase CLI:**

```bash
npm install -g supabase
supabase link --project-ref <your-project-ref>
supabase db push
# then run the seed manually (the CLI's db push does not run seed.sql by default):
psql "$(supabase status -o env | grep DB_URL)" -f supabase/seed.sql
```

> The seed script inserts announcements, meetings, competitions, resources, officers, and all 23 seeded Division C events, plus fictional demo members and placement results. It does **not** create real `auth.users` rows — sign up through the app itself to get real, authenticated accounts (see next section).

---

## 6. Database & Security Model

- **Tables:** `profiles`, `officers`, `scioly_events`, `event_members`, `event_assignments`, `teams`, `team_members`, `announcements`, `meetings`, `meeting_attendance`, `calendar_events`, `competitions`, `competition_teams`, `competition_schedule`, `competition_assignments`, `competition_results`, `resources`, `placement_tests`, `placement_results` — all with UUID primary keys, foreign keys, indexes, and `created_at`/`updated_at` timestamps where relevant.
- **Roles** (`app_role` enum): `sponsor` > `admin` > `officer` / `event_captain` > `member`. A Postgres trigger (`prevent_role_self_escalation`) blocks any non-admin from changing their own `role` or `is_active` flag, even through a direct API call.
- **Row Level Security is on for every table.** The Next.js server never trusts the client — every admin Server Action also re-checks the caller's role server-side (`src/lib/auth/session.ts`) before touching the database, so access control is enforced twice: once in the app, once in Postgres.
- **Placement scores and attendance are private by design.** `placement_results` and `meeting_attendance` policies only allow a member to read **their own** row (and only after a placement test's `results_released` flag is `true`); anonymous users get zero access; staff (`officer`+) can read everything. This is the same pattern used for both tables — see `supabase/migrations/20260101000003_rls.sql`.
- **Storage:** the schema includes a `storage_path` column on `resources` for future Supabase Storage integration, but the current build links out to external URLs (e.g. Google Drive, the official Science Olympiad site) rather than hosting files — this intentionally avoids re-hosting any copyrighted rules manuals.

---

## 7. Local Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Useful scripts:

```bash
npm run dev       # start the dev server (Turbopack)
npm run build     # production build
npm run start     # run the production build locally
npm run lint      # ESLint
npm run typecheck # strict TypeScript check
```

---

## 8. Creating the First Administrator

Every new signup is inserted into `profiles` with `role = 'member'` by a database trigger — there is no "first admin" signup flow by design, since that would be a security hole. To promote your own account:

1. Sign up normally at `/signup` and confirm your email.
2. In the Supabase Dashboard, open **SQL Editor** and run:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

3. Refresh the app — you'll see **Dashboard** and the `/admin` sidebar unlock automatically. From there you can promote other officers via **Admin → Members** (role changes there require `admin`/`sponsor`, enforced by the same trigger mentioned above).

---

## 9. Deployment to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), **New Project → Import** your repo.
3. Add the environment variables from `.env.example` under **Project Settings → Environment Variables** (Production **and** Preview).
4. Deploy. Vercel auto-detects Next.js — no build configuration changes needed.
5. In Supabase, add your production domain to **Authentication → URL Configuration → Redirect URLs** (e.g. `https://your-domain.com/auth/confirm`, `https://your-domain.com/auth/callback`) so email links and OAuth (if added later) work in production.

---

## 10. Future Development Suggestions

- **Supabase Storage buckets** for headshot/officer-photo uploads and resource file uploads (schema already has `officers.photo_url` and `resources.storage_path` ready for it).
- **Google OAuth login** — the auth architecture (`src/lib/supabase`, `/auth/callback`) was written to support adding a provider button with minimal changes.
- **Email notifications** (e.g. via Resend/SendGrid + Supabase Edge Functions) for new announcements, placement release, or attendance follow-ups.
- **`event_members` admin UI** — the public event-detail roster (captain/partners/members shown on `/events/[slug]`) is currently seeded and staff-writable at the database level, but doesn't yet have a dedicated admin form (the season-assignment matrix in **Admin → Teams**, backed by `event_assignments`, covers the internal planning use case).
- **CSV export** of results/attendance/placement for offline recordkeeping.
- **Automated tests** (component + RLS policy tests) as the codebase grows.

---

## 11. Code Structure

```
src/
  app/
    (marketing)/     # public pages — layout with Navbar + Footer
    (auth)/          # login, signup, password reset — centered card layout
    dashboard/       # member-only pages, guarded in layout.tsx
    admin/           # staff-only pages, guarded in layout.tsx, one folder per feature
    auth/            # Supabase email-confirmation / OAuth callback route handlers
    api/search/      # global search API route
  components/
    ui/              # shadcn/ui primitives
    shared/          # cross-cutting components (cards, badges, tables, empty/loading states…)
    layout/, auth/, admin/, dashboard/, calendar/, events/, home/, results/, resources/, contact/
  lib/
    supabase/        # browser/server/admin Supabase clients + env handling
    auth/            # session + permission helpers (server-side authorization)
    data/            # one module per domain area — all Supabase queries live here
    utils/           # date formatting, slugify, class-name helpers
  types/
    database.ts      # hand-authored types mirroring the Postgres schema
    domain.ts         # UI-facing labels/enums derived from the database types
supabase/
  migrations/        # schema → functions → RLS, run in that order
  seed.sql           # demo data
```
