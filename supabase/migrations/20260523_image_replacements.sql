-- Create image_replacements table to store permanent image overrides
create table if not exists public.image_replacements (
  id uuid default gen_random_uuid() primary key,
  original_src text not null unique,
  replacement_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references auth.users(id)
);

-- Enable RLS
alter table public.image_replacements enable row level security;

-- Allow anyone to read image replacements
create policy "Anyone can read image replacements" on public.image_replacements
  for select using (true);

-- Allow admins to insert/update replacements
create policy "Admins can insert replacements" on public.image_replacements
  for insert
  with check (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

create policy "Admins can update replacements" on public.image_replacements
  for update
  using (
    exists (
      select 1 from public.admin_users
      where user_id = auth.uid()
    )
  );

-- Create storage bucket for replacement images
insert into storage.buckets (id, name, public) values ('image-replacements', 'image-replacements', true)
  on conflict (id) do nothing;

-- Allow anyone to read images from bucket
create policy "Public read access on image-replacements" on storage.objects
  for select using (bucket_id = 'image-replacements');

-- Allow authenticated users to upload
create policy "Authenticated users can upload to image-replacements" on storage.objects
  for insert with check (
    bucket_id = 'image-replacements' and
    auth.role() = 'authenticated'
  );
