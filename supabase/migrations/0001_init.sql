-- ============================================================================
--  Campus Connect — schema, security & realtime
--  Amrita Vishwa Vidyapeetham, Ettimadai
-- ============================================================================

-- ---------------------------------------------------------------- enums -----
create type public.availability   as enum ('available', 'sold_out', 'coming_soon');
create type public.dietary_tag    as enum ('veg', 'non_veg', 'egg');
create type public.staff_role     as enum ('staff', 'admin');
create type public.canteen_accent as enum ('maroon', 'gold', 'green');

-- --------------------------------------------------------------- tables -----
create table public.canteens (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name       text not null,
  tagline    text not null default '',
  location   text not null default '',
  opens_at   text not null default '08:00',
  closes_at  text not null default '21:00',
  is_open    boolean not null default true,
  accent     public.canteen_accent not null default 'maroon',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  name       text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.food_items (
  id           uuid primary key default gen_random_uuid(),
  canteen_id   uuid not null references public.canteens(id) on delete cascade,
  category_id  uuid not null references public.categories(id) on delete cascade,
  name         text not null,
  description  text,
  price        numeric(8,2) not null default 0 check (price >= 0),
  availability public.availability not null default 'available',
  dietary      public.dietary_tag not null default 'veg',
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- staff_users.id mirrors auth.users.id (1:1 profile row)
create table public.staff_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  name       text not null,
  role       public.staff_role not null default 'staff',
  canteen_id uuid references public.canteens(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references public.staff_users(id) on delete set null,
  actor_name  text not null,
  canteen_id  uuid references public.canteens(id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_name text not null,
  detail      text,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------- indexes -----
create index idx_categories_canteen  on public.categories(canteen_id, sort_order);
create index idx_food_canteen         on public.food_items(canteen_id, sort_order);
create index idx_food_category        on public.food_items(category_id, sort_order);
create index idx_activity_canteen     on public.activity_logs(canteen_id, created_at desc);

-- --------------------------------------------------- updated_at trigger -----
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_canteens_touch  before update on public.canteens
  for each row execute function public.touch_updated_at();
create trigger trg_categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();
create trigger trg_food_touch       before update on public.food_items
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------- authorization helpers ----
-- SECURITY DEFINER avoids RLS recursion when policies read staff_users.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.staff_users where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_staff_canteen()
returns uuid language sql stable security definer set search_path = public as $$
  select canteen_id from public.staff_users where id = auth.uid();
$$;

create or replace function public.can_manage_canteen(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.staff_users
    where id = auth.uid() and (role = 'admin' or canteen_id = target)
  );
$$;

-- ------------------------------------------------------------------ RLS ------
alter table public.canteens      enable row level security;
alter table public.categories    enable row level security;
alter table public.food_items    enable row level security;
alter table public.staff_users   enable row level security;
alter table public.activity_logs enable row level security;

-- Canteens: world-readable; only owning staff / admins may write.
create policy "canteens read"   on public.canteens for select using (true);
create policy "canteens insert" on public.canteens for insert with check (public.is_admin());
create policy "canteens update" on public.canteens for update
  using (public.can_manage_canteen(id)) with check (public.can_manage_canteen(id));
create policy "canteens delete" on public.canteens for delete using (public.is_admin());

-- Categories: world-readable; owning staff / admins may write.
create policy "categories read"   on public.categories for select using (true);
create policy "categories insert" on public.categories for insert
  with check (public.can_manage_canteen(canteen_id));
create policy "categories update" on public.categories for update
  using (public.can_manage_canteen(canteen_id))
  with check (public.can_manage_canteen(canteen_id));
create policy "categories delete" on public.categories for delete
  using (public.can_manage_canteen(canteen_id));

-- Food items: world-readable; owning staff / admins may write.
create policy "food read"   on public.food_items for select using (true);
create policy "food insert" on public.food_items for insert
  with check (public.can_manage_canteen(canteen_id));
create policy "food update" on public.food_items for update
  using (public.can_manage_canteen(canteen_id))
  with check (public.can_manage_canteen(canteen_id));
create policy "food delete" on public.food_items for delete
  using (public.can_manage_canteen(canteen_id));

-- Staff: a user sees their own profile; admins see & manage everyone.
create policy "staff read own or admin" on public.staff_users for select
  using (id = auth.uid() or public.is_admin());
create policy "staff insert admin" on public.staff_users for insert
  with check (public.is_admin());
create policy "staff update admin" on public.staff_users for update
  using (public.is_admin()) with check (public.is_admin());
create policy "staff delete admin" on public.staff_users for delete
  using (public.is_admin());

-- Activity: admins read all; staff read their canteen. Any staff may log.
create policy "activity read" on public.activity_logs for select
  using (public.is_admin() or canteen_id = public.current_staff_canteen());
create policy "activity insert" on public.activity_logs for insert
  with check (auth.uid() is not null);

-- ------------------------------------------------------------- realtime ------
alter publication supabase_realtime add table public.canteens;
alter publication supabase_realtime add table public.categories;
alter publication supabase_realtime add table public.food_items;
