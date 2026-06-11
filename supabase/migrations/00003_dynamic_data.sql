-- Add icon column to categories
alter table public.categories add column if not exists icon text not null default '◆';
alter table public.categories add column if not exists image text not null default '';

-- Add spec columns to products
alter table public.products add column if not exists material text not null default 'Vinilo premium';
alter table public.products add column if not exists finish text not null default 'Mate / Brillante';
alter table public.products add column if not exists size text not null default '5–10 cm';
alter table public.products add column if not exists waterproof boolean not null default true;

-- Update seed categories with icons
update public.categories set icon = '⚡'  where slug = 'anime';
update public.categories set icon = '🌿' where slug = 'nature';
update public.categories set icon = '🐺' where slug = 'animals';
update public.categories set icon = '📼' where slug = 'retro';

-- Update seed products with spec overrides
update public.products set material = 'Vinilo holográfico', finish = 'Holográfico' where name = 'Anime Eyes';
update public.products set material = 'Vinilo premium', finish = 'Mate', size = '6 cm' where name = 'Wild Cactus';
update public.products set finish = 'Brillante', size = '8 cm' where name = 'Retro Vibes';
update public.products set material = 'Vinilo metálico', finish = 'Metalizado' where name = 'Cosmic Drip';
