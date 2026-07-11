# Campus Connect

**Live canteen menus for Amrita Vishwa Vidyapeetham, Ettimadai (Coimbatore).**

Students, faculty and visitors can see exactly what every campus canteen is
serving — and what it costs — in real time, before walking over. Canteen staff
update their own menus from a simple dashboard, and changes appear on the public
site instantly.

> **By design, the menu is text-only** — food name, price and availability (plus
> a veg / non-veg tag). There are **no food images** anywhere, and staff cannot
> upload any.

---

## ✨ Highlights

- **Public site** — landing page with a live card per canteen (open/closed, last
  updated, available item count) and a categorised, searchable menu page with
  sold-out / coming-soon states.
- **Staff dashboard** — one login per canteen. Add / edit / delete categories and
  items, change prices, and flip availability with a single click. Every change
  is live immediately.
- **Super admin console** — manage all canteens, staff accounts and see
  platform-wide statistics and an activity log.
- **Runs with zero backend** — ships with a fully-functional in-browser demo mode
  so you can `npm run dev` and use everything right away. Add Supabase env vars to
  switch the whole app to a real Postgres + Auth + Realtime backend.
- Premium, warm, light-only UI (Apple / Linear / Stripe inspired), fully
  responsive, accessible and SEO-optimised.

## 🧱 Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Radix UI primitives ·
Framer Motion · React Query · React Hook Form + Zod · Supabase (Postgres, Auth,
Realtime) · Lucide icons · Sonner toasts. Vercel-ready.

---

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # optional — leave blank for demo mode
npm run dev
```

Open <http://localhost:3000>.

### Demo mode (default — no backend)

With no Supabase env vars set, the app uses an in-browser backend that persists
to `localStorage` and syncs across tabs. Sign in at `/login` with any demo
account (one click auto-fills them):

| Role               | Email                | Password    |
| ------------------ | -------------------- | ----------- |
| Super Admin        | `admin@amrita.edu`   | `campus123` |
| Central Canteen    | `central@amrita.edu` | `campus123` |
| Adithya Food Court | `adithya@amrita.edu` | `campus123` |
| Nila Night Canteen | `nila@amrita.edu`    | `campus123` |

> Tip: open the public menu in one tab and the staff dashboard in another — edits
> in one appear live in the other.

---

## 🗄️ Production mode (Supabase)

### 1. Create a project & run the migrations

Create a project at [supabase.com](https://supabase.com), then run the SQL in
order from the Supabase SQL editor (or `supabase db push`):

1. `supabase/migrations/0001_init.sql` — tables, enums, RLS policies, triggers,
   realtime.
2. `supabase/migrations/0002_seed.sql` — the three demo canteens with menus.

### 2. Configure env vars

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Restart `npm run dev`. The app now reads and writes to Supabase, and the demo
banner disappears automatically.

### 3. Staff provisioning

`staff_users.id` is a 1:1 mirror of `auth.users.id`, so each staff member is a
real Supabase Auth user. To create one:

1. **Auth → Users → Add user** in the Supabase dashboard (set email + password).
2. Insert the matching profile row:

   ```sql
   insert into public.staff_users (id, email, name, role, canteen_id)
   values (
     '<auth-user-uuid>',
     'central@amrita.edu',
     'Central Canteen Staff',
     'staff',                                    -- or 'admin'
     '10000000-0000-0000-0000-000000000001'      -- null for admins
   );
   ```

Row-Level Security then guarantees each staff account can only edit its own
canteen, while admins can manage everything. (For a self-serve admin “Add staff”
flow, wire an Edge Function using the service-role key to call
`auth.admin.createUser` + insert the profile.)

### Regenerating types

```bash
supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
```

---

## 📁 Project structure

```
src/
├── app/
│   ├── (site)/                # public: landing + /canteen/[slug] menu
│   ├── (app)/                 # authenticated: /dashboard, /admin (guarded shell)
│   ├── login/                 # staff sign in
│   ├── icon / opengraph-image # branded, generated at the edge
│   └── sitemap · robots · manifest
├── components/
│   ├── ui/                    # Button, Card, Dialog, Select, Tabs, … (Radix based)
│   ├── brand/                 # logo / emblem (swap for the official crest here)
│   ├── layout/                # site + app headers, footer, guards
│   ├── menu/                  # public menu view + indicators
│   ├── dashboard/             # staff menu manager + forms
│   └── admin/                 # super-admin console + forms
└── lib/
    ├── data/                  # repository seam: demo + Supabase implementations
    ├── hooks/                 # React Query queries & mutations
    ├── supabase/              # clients, config, generated DB types
    ├── types.ts · schemas.ts · seed.ts · site.ts · motion.ts · utils.ts
supabase/migrations/           # SQL schema, RLS & seed
```

The whole data layer sits behind one `Repository` interface
(`src/lib/data/repository.ts`), so the UI is identical in demo and production.

---

## 🎨 Branding

The logo is an original SVG emblem in
[`src/components/brand/logo.tsx`](src/components/brand/logo.tsx). Drop the
official Amrita crest in there to rebrand — nothing else needs to change. Colours
and typography are defined as design tokens in
[`src/app/globals.css`](src/app/globals.css) (`@theme`).

## 📦 Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack) |
| `npm run build` | Production build                 |
| `npm run start` | Serve the production build       |
| `npm run lint`  | Run ESLint                       |

## ☁️ Deploy

Push to GitHub and import into [Vercel](https://vercel.com). Add the same env
vars in the Vercel project settings. No env vars → it deploys in demo mode.
