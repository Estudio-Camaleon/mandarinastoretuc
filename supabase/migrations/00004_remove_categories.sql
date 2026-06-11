-- Remove Abstract and Street Art categories
-- Reassign their products to other categories

update public.products set category = 'retro' where category = 'street-art';
update public.products set category = 'retro' where category = 'abstract';

delete from public.categories where slug in ('street-art', 'abstract');
