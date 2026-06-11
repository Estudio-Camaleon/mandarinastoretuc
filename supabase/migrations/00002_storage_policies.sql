-- Run this in the Supabase SQL Editor

-- 1. Create the bucket (if not already created manually)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Allow public read access to any file
create policy "Public can view product images"
on storage.objects for select
to public
using (bucket_id = 'product-images');

-- 3. Allow authenticated users (admin) to upload files
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- 4. Allow authenticated users to update files
create policy "Authenticated users can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

-- 5. Allow authenticated users to delete files
create policy "Authenticated users can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');
