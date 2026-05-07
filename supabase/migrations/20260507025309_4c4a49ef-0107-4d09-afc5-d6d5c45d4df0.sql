
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users see own roles"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id);

create policy "admins manage roles"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Settings
create table public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
alter table public.app_settings enable row level security;

create policy "admins read settings"
  on public.app_settings for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "admins upsert settings"
  on public.app_settings for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update settings"
  on public.app_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

insert into public.app_settings (key, value) values
  ('sms_discount_code', 'SMS10'),
  ('sms_monthly_message', 'Cell Sync Solutions: Your monthly holiday deal is here! Use code {CODE} for 10% off. Reply STOP to opt out.'),
  ('sms_welcome_message', 'Welcome to Cell Sync Solutions holiday deals! Use code {CODE} for 10% off. Reply STOP to opt out.');
