
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

create table public.sms_subscribers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  subscribed_at timestamptz not null default now(),
  last_sent_at timestamptz,
  opted_out boolean not null default false,
  source text,
  created_at timestamptz not null default now()
);

alter table public.sms_subscribers enable row level security;

-- Public can subscribe (insert only); reads/updates restricted to service role
create policy "anyone can subscribe"
  on public.sms_subscribers for insert
  to anon, authenticated
  with check (true);

create index sms_subscribers_due_idx on public.sms_subscribers (last_sent_at, subscribed_at) where opted_out = false;
