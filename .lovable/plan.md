## Premium Data Science Portfolio + Admin CMS

A futuristic dark, glassmorphic portfolio for Hashir Mehmood Qureshi with a complete admin dashboard so all content is editable without touching code.

### Stack
- TanStack Start (React + Vite) — the project's framework
- Tailwind v4 + Framer Motion + lucide-react icons
- Lovable Cloud (Supabase under the hood) for DB, auth, storage
- Single-admin auth: only your account can access `/admin`

### Design language
- Deep near-black background (`oklch(0.14 0.02 265)`) with electric cyan + violet accents, subtle aurora/grid backdrop
- Glassmorphism cards (blurred surfaces, hairline borders), gradient ring around profile photo
- Space Grotesk (display) + Inter (body), tabular numerals for stats
- Framer Motion: section fade/slide-in, animated counters, hover lift on cards, floating data-particle background on hero
- All colors via semantic tokens in `src/styles.css` — no hardcoded hex in components

### Public routes
- `/` Hero (photo, name, titles, tagline, Resume/Projects/Contact CTAs, animated chart/particles)
- `/` continues with About + animated stats, Skills (search + category filter), Featured Projects, Services, Experience timeline, Contact form preview
- `/projects` full grid with search/filter/sort by category, tech, date
- `/dashboards` Power BI iframe showcase with tabs + fullscreen
- `/certifications` gallery with lightbox + download
- `/contact` full contact page (form + socials)
- `/auth` sign-in (admin only)
- `/_authenticated/admin/*` admin dashboard

### Admin dashboard (`/admin`)
Sidebar nav: Profile, Projects, Skills, Certifications, Dashboards, Services, Experience, Messages.
Each manager: list view + add/edit modal + delete confirm + image/file upload to Storage. Changes appear instantly on the public site (TanStack Query invalidation).

### Database schema (Lovable Cloud)
Tables, all with RLS:
- `profile` (singleton row): name, title, tagline, bio, avatar_url, resume_url, socials JSONB
- `projects`: title, description, tech[], github_url, demo_url, category, image_url, date, featured, sort_order
- `skills`: name, category, level (1-5), icon, sort_order
- `certifications`: name, organization, issue_date, image_url, cert_url
- `dashboards`: name, description, embed_url, thumbnail_url, sort_order
- `services`: title, description, icon, sort_order
- `experience`: company, position, start_date, end_date, description, sort_order
- `messages`: name, email, subject, body, created_at, read
- `user_roles` + `has_role()` security-definer fn for the single admin

Storage buckets: `avatars` (public), `resumes` (public), `projects` (public), `certifications` (public), `dashboards` (public).

RLS pattern:
- Public SELECT (anon + authenticated) on content tables
- INSERT/UPDATE/DELETE restricted to `has_role(auth.uid(),'admin')`
- `messages`: anon INSERT only; admin SELECT/UPDATE/DELETE
- `user_roles`: read by authenticated, write by service_role only

### Data access
- Public pages: server publishable-key client in `*.functions.ts` reading from public SELECT policies
- Admin: browser Supabase client (RLS enforces admin)
- Contact form: anon insert via browser client with Zod validation

### Auth flow
- `/auth` email + password sign-in only (no public signup UI)
- After Cloud is enabled, you create your account at `/auth`, then I'll grant admin via a one-time SQL insert into `user_roles`
- `_authenticated/route.tsx` (managed) gates `/admin/*`; an extra `has_role` check redirects non-admins home

### Build order (single pass)
1. Enable Lovable Cloud
2. Migration: enum, tables, GRANTs, RLS policies, `has_role`, storage buckets, seed profile row
3. Design tokens in `src/styles.css`, fonts via `<link>` in `__root.tsx`
4. Shared layout: nav, footer, animated background, glass card primitives
5. Public routes + sections, wired to server fns with TanStack Query
6. Admin shell + 8 manager pages with upload widgets
7. Contact form + messages inbox
8. SEO meta per route, responsive QA, polish

### What you'll do once
- Sign up at `/auth` with your email — I'll then run a single SQL to grant you admin
- Upload your photo, resume, and seed your first projects from the admin UI

### Notes / trade-offs
- No Resend email on contact form (per your choice) — messages live in admin inbox
- Power BI embeds use public "Publish to web" URLs (required for iframe)
- Vercel deploy isn't needed — Lovable's Publish handles hosting; GitHub sync is available in project settings