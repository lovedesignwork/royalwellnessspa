-- Dedicated spa journal; existing booking and other brand tables are untouched.
create sequence if not exists public.spa_blog_publication_order;
create table public.spa_blog_posts (
 id uuid primary key default gen_random_uuid(), slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null, excerpt text not null default '', seo_title text not null default '', seo_description text not null default '', category text not null default 'Wellness',
 body text not null default '', related_slugs text[] not null default '{}', status text not null default 'draft' check(status in ('draft','published')),
 publication_order bigint
);
create table public.spa_blog_assets (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.spa_blog_posts(id) on delete cascade,
 src text not null unique, fingerprint text not null unique, alt text not null, caption text not null default '', generated boolean not null default false,
 width integer not null check(width between 1 and 1600), height integer not null check(height between 1 and 1600), position integer not null check(position between 0 and 4),
 unique(post_id,position)
);
alter table public.spa_blog_posts enable row level security;
alter table public.spa_blog_assets enable row level security;
create policy "Published spa articles" on public.spa_blog_posts for select to anon,authenticated using(status='published');
create policy "Spa editors" on public.spa_blog_posts for all to authenticated using(exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor'))) with check(exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor')));
create policy "Published spa images" on public.spa_blog_assets for select to anon,authenticated using(exists(select 1 from public.spa_blog_posts where id=post_id and status='published'));
create policy "Spa image editors" on public.spa_blog_assets for all to authenticated using(exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor'))) with check(exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor')));
revoke all on public.spa_blog_posts,public.spa_blog_assets from anon,authenticated,service_role;
grant select on public.spa_blog_posts,public.spa_blog_assets to anon;
grant select,insert,update,delete on public.spa_blog_posts,public.spa_blog_assets to authenticated,service_role;
grant usage on sequence public.spa_blog_publication_order to authenticated,service_role;
create or replace function public.validate_spa_publication() returns trigger language plpgsql security invoker set search_path='' as $$
declare image_count integer; words integer;
begin
 if new.status='published' then
  select count(*) into image_count from public.spa_blog_assets where post_id=new.id and length(trim(alt))>0;
  words:=array_length(regexp_split_to_array(trim(regexp_replace(new.body,'\{\{image:[0-9]+\}\}','', 'g')), '\s+'),1);
  if image_count not between 3 and 5 then raise exception 'Publishing requires 3–5 distinct images with alt text.'; end if;
  if words not between 800 and 1600 then raise exception 'Publishing requires 800–1,600 words.'; end if;
  if length(trim(new.seo_title))=0 or length(trim(new.seo_description))=0 then raise exception 'Add an SEO title and description before publishing.'; end if;
  if new.publication_order is null then new.publication_order:=nextval('public.spa_blog_publication_order'); end if;
 end if;
 return new;
end $$;
create trigger validate_spa_publication before insert or update on public.spa_blog_posts for each row execute function public.validate_spa_publication();
create index spa_blog_published_order on public.spa_blog_posts(status,publication_order desc);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('spa-blog','spa-blog',true,1048576,array['image/webp']) on conflict(id) do nothing;
create policy "Spa editorial image upload" on storage.objects for insert to authenticated with check(bucket_id='spa-blog' and exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor')));
