-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Categories ───────────────────────────────────────
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  color       text not null default '#FF5500',
  count       integer not null default 0,
  created_at  timestamptz default now()
);

alter table public.categories enable row level security;

-- Allow public read, only authenticated can write
drop policy if exists "Anyone can view categories" on public.categories;
create policy "Anyone can view categories"
  on public.categories for select using (true);

drop policy if exists "Only authenticated can insert categories" on public.categories;
create policy "Only authenticated can insert categories"
  on public.categories for insert with check (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can update categories" on public.categories;
create policy "Only authenticated can update categories"
  on public.categories for update using (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can delete categories" on public.categories;
create policy "Only authenticated can delete categories"
  on public.categories for delete using (auth.role() = 'authenticated');

-- ── Products ─────────────────────────────────────────
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10,2) not null default 0,
  category    text not null,
  description text not null default '',
  image       text not null default '',
  rating      integer not null default 5,
  reviews     integer not null default 0,
  created_at  timestamptz default now()
);

alter table public.products enable row level security;

drop policy if exists "Anyone can view products" on public.products;
create policy "Anyone can view products"
  on public.products for select using (true);

drop policy if exists "Only authenticated can insert products" on public.products;
create policy "Only authenticated can insert products"
  on public.products for insert with check (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can update products" on public.products;
create policy "Only authenticated can update products"
  on public.products for update using (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can delete products" on public.products;
create policy "Only authenticated can delete products"
  on public.products for delete using (auth.role() = 'authenticated');

-- ── Orders ───────────────────────────────────────────
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique,
  customer_name   text not null,
  customer_phone  text not null default '',
  product_name    text not null,
  quantity        integer not null default 1,
  status          text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  amount          numeric(10,2) not null default 0,
  notes           text not null default '',
  created_at      timestamptz default now()
);

alter table public.orders enable row level security;

drop policy if exists "Anyone can view orders" on public.orders;
create policy "Anyone can view orders"
  on public.orders for select using (true);

drop policy if exists "Only authenticated can insert orders" on public.orders;
create policy "Only authenticated can insert orders"
  on public.orders for insert with check (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can update orders" on public.orders;
create policy "Only authenticated can update orders"
  on public.orders for update using (auth.role() = 'authenticated');

drop policy if exists "Only authenticated can delete orders" on public.orders;
create policy "Only authenticated can delete orders"
  on public.orders for delete using (auth.role() = 'authenticated');

-- ── Align existing orders table with app schema ──
alter table public.orders add column if not exists customer_phone text not null default '';
alter table public.orders add column if not exists notes text not null default '';
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders alter column status set default 'pending';
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- ── Storage bucket for product images ──────────────────
-- Run this in the Supabase SQL Editor to create the bucket:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
--
-- Then add this RLS policy to allow public reads:
-- create policy "Public can view product images"
--   on storage.objects for select using (bucket_id = 'product-images');
--
-- And this policy for authenticated uploads:
-- create policy "Authenticated can upload product images"
--   on storage.objects for insert with check (
--     bucket_id = 'product-images' and auth.role() = 'authenticated'
--   );
