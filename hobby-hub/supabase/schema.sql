-- Run this in the Supabase SQL editor to enable optional features.

alter table posts add column if not exists author_id text;
alter table posts add column if not exists repost_of uuid references posts(id) on delete set null;
alter table posts add column if not exists video_url text;
alter table posts add column if not exists flag text check (flag in ('Question', 'Opinion') or flag is null);

alter table comments add column if not exists author_id text;

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do update set public = true;

create policy "Public read post images"
on storage.objects for select
using (bucket_id = 'post-images');

create policy "Anyone can upload post images"
on storage.objects for insert
with check (bucket_id = 'post-images');
