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
create policy "Anyone can view categories"
  on public.categories for select using (true);

create policy "Only authenticated can insert categories"
  on public.categories for insert with check (auth.role() = 'authenticated');

create policy "Only authenticated can update categories"
  on public.categories for update using (auth.role() = 'authenticated');

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

create policy "Anyone can view products"
  on public.products for select using (true);

create policy "Only authenticated can insert products"
  on public.products for insert with check (auth.role() = 'authenticated');

create policy "Only authenticated can update products"
  on public.products for update using (auth.role() = 'authenticated');

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

create policy "Anyone can view orders"
  on public.orders for select using (true);

create policy "Only authenticated can insert orders"
  on public.orders for insert with check (auth.role() = 'authenticated');

create policy "Only authenticated can update orders"
  on public.orders for update using (auth.role() = 'authenticated');

create policy "Only authenticated can delete orders"
  on public.orders for delete using (auth.role() = 'authenticated');

-- ── Seed data ────────────────────────────────────────

insert into public.categories (name, slug, color, count) values
  ('Street Art', 'street-art', '#FF5500', 3),
  ('Anime',      'anime',      '#a855f7', 2),
  ('Nature',     'nature',     '#22c55e', 2),
  ('Animals',    'animals',    '#3b82f6', 2),
  ('Abstract',   'abstract',   '#eab308', 2),
  ('Retro',      'retro',      '#ec4899', 2);

insert into public.products (name, price, category, description, image, rating, reviews) values
  ('Neon Wolf',       4.99, 'animals',    'A bold neon wolf design with electric blue highlights. Perfect for helmets, laptops, and water bottles. Weatherproof and UV-resistant.',     'https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=400&h=400&fit=crop&auto=format', 5, 47),
  ('Street Tag Vol.2',3.99, 'street-art', 'Raw street tag aesthetic in classic black and white. Inspired by NYC subway art. Die-cut vinyl, ultra-durable.',                           'https://images.unsplash.com/photo-1600440699677-c6f39725adf6?w=400&h=400&fit=crop&auto=format', 5, 83),
  ('Anime Eyes',      4.99, 'anime',      'Hypnotic anime-inspired eyes sticker. Holographic finish, glossy surface. Sticks on anything and lasts.',                                  'https://images.unsplash.com/photo-1758295099602-18bcd8c024b7?w=400&h=400&fit=crop&auto=format', 5, 62),
  ('Wild Cactus',     3.49, 'nature',     'Desert vibes. A clean minimal cactus illustration with matte finish. Great for journals and notebooks.',                                   'https://images.unsplash.com/photo-1775496230770-d379e89b9e7e?w=400&h=400&fit=crop&auto=format', 4, 28),
  ('Graffiti Skull',  5.49, 'street-art', 'Classic graffiti-style skull with drip effect. High contrast black and orange. Holographic outline.',                                        'https://images.unsplash.com/photo-1763888647755-5754915925ff?w=400&h=400&fit=crop&auto=format', 5, 101),
  ('Bear Club',       3.99, 'animals',    'A street-style teddy bear with attitude. Matte finish, die-cut, waterproof. Part of the Bear Club series.',                                 'https://images.unsplash.com/photo-1774918700856-d0a09c2af44e?w=400&h=400&fit=crop&auto=format', 5, 55),
  ('Retro Vibes',     4.49, 'retro',      '80s-inspired retro design with sunset gradient and palm trees. Glossy finish with rounded corners.',                                         'https://images.unsplash.com/photo-1764567386744-090d5ff67d66?w=400&h=400&fit=crop&auto=format', 4, 34),
  ('Cosmic Drip',     5.99, 'abstract',   'Cosmic abstract drip design with galaxy colors. Holographic foil finish. Statement piece for any surface.',                                 'https://images.unsplash.com/photo-1775665422545-42848b8536b9?w=400&h=400&fit=crop&auto=format', 5, 72);

insert into public.orders (order_number, customer_name, customer_phone, product_name, quantity, status, amount, notes) values
  ('#1042', 'Kai Martinez', '5491123456701', 'Neon Wolf Sticker',     2, 'shipped',   9.98,  'Confirmed via WhatsApp. Delivery address shared in chat.'),
  ('#1041', 'Sofia R.',     '5491123456702', 'Abstract Pack x5',      1, 'pending',  14.95,  ''),
  ('#1040', 'Jordan L.',    '5491123456703', 'Street Tag Vol.2',      3, 'delivered', 11.97, 'Left at reception.'),
  ('#1039', 'Mia Torres',   '5491123456704', 'Anime Eyes',            1, 'delivered',  4.99,  ''),
  ('#1038', 'Alex K.',      '5491123456705', 'Bear Club Sticker',     2, 'delivered',  7.98,  ''),
  ('#1037', 'James W.',     '5491123456706', 'Retro Vibes Pack',      1, 'confirmed', 12.99, 'Waiting for payment confirmation.');

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
