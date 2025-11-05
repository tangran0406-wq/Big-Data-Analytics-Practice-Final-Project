-- 基础表
create table if not exists public.courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  teacher     text,
  tags        text[],
  cover_url   text,
  url         text,
  created_at  timestamptz default now()
);

create table if not exists public.ebooks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  author      text,
  cover_url   text,
  file_url    text not null,
  created_at  timestamptz default now()
);

create table if not exists public.ppts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  course      text,
  cover_url   text,
  file_url    text not null,
  created_at  timestamptz default now()
);

-- RLS：读开放（可选），写通过服务端
alter table public.courses enable row level security;
alter table public.ebooks  enable row level security;
alter table public.ppts    enable row level security;

create policy "public read courses" on public.courses for select using (true);
create policy "public read ebooks"  on public.ebooks  for select using (true);
create policy "public read ppts"    on public.ppts    for select using (true);
