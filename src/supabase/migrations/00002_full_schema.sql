-- ============================================================
-- TariffVerify — Full Database Schema
-- Paste this entire block into the Supabase SQL Editor and run.
-- ============================================================

-- -----------------------------------------------------------
-- 1. PROFILES (may already exist from migration 00001)
-- -----------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  company_name text,
  plan text default 'free' check (plan in ('free', 'pro', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can read own profile'
  ) then
    create policy "Users can read own profile"
      on public.profiles for select
      using (auth.uid() = id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on public.profiles for update
      using (auth.uid() = id);
  end if;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'company_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();


-- -----------------------------------------------------------
-- 2. BOM_UPLOADS
-- -----------------------------------------------------------
create table if not exists public.bom_uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  filename text not null,
  total_items integer default 0,
  total_spend numeric(15,2) default 0,
  total_tariff_exposure numeric(15,2) default 0,
  effective_tariff_rate numeric(5,2) default 0,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  created_at timestamptz default now()
);

alter table public.bom_uploads enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_uploads' and policyname = 'Users can read own uploads'
  ) then
    create policy "Users can read own uploads"
      on public.bom_uploads for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_uploads' and policyname = 'Users can insert own uploads'
  ) then
    create policy "Users can insert own uploads"
      on public.bom_uploads for insert
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_uploads' and policyname = 'Users can update own uploads'
  ) then
    create policy "Users can update own uploads"
      on public.bom_uploads for update
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_uploads' and policyname = 'Users can delete own uploads'
  ) then
    create policy "Users can delete own uploads"
      on public.bom_uploads for delete
      using (auth.uid() = user_id);
  end if;
end $$;


-- -----------------------------------------------------------
-- 3. BOM_ITEMS
-- -----------------------------------------------------------
create table if not exists public.bom_items (
  id uuid default gen_random_uuid() primary key,
  upload_id uuid references public.bom_uploads(id) on delete cascade not null,
  item_name text not null,
  description text,
  supplier_country text not null,
  country_code text,
  annual_spend numeric(15,2) not null,
  quantity numeric(12,2),
  unit_cost numeric(12,4),
  hs_code text,
  hs_confidence numeric(3,2),
  tariff_rate numeric(5,2),
  tariff_cost numeric(15,2),
  risk_level text default 'low' check (risk_level in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz default now()
);

alter table public.bom_items enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_items' and policyname = 'Users can read own items'
  ) then
    create policy "Users can read own items"
      on public.bom_items for select
      using (
        exists (
          select 1 from public.bom_uploads
          where bom_uploads.id = bom_items.upload_id
            and bom_uploads.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_items' and policyname = 'Users can insert own items'
  ) then
    create policy "Users can insert own items"
      on public.bom_items for insert
      with check (
        exists (
          select 1 from public.bom_uploads
          where bom_uploads.id = bom_items.upload_id
            and bom_uploads.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_items' and policyname = 'Users can update own items'
  ) then
    create policy "Users can update own items"
      on public.bom_items for update
      using (
        exists (
          select 1 from public.bom_uploads
          where bom_uploads.id = bom_items.upload_id
            and bom_uploads.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'bom_items' and policyname = 'Users can delete own items'
  ) then
    create policy "Users can delete own items"
      on public.bom_items for delete
      using (
        exists (
          select 1 from public.bom_uploads
          where bom_uploads.id = bom_items.upload_id
            and bom_uploads.user_id = auth.uid()
        )
      );
  end if;
end $$;


-- -----------------------------------------------------------
-- 4. SCENARIOS
-- -----------------------------------------------------------
create table if not exists public.scenarios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  upload_id uuid references public.bom_uploads(id) on delete cascade not null,
  name text not null,
  changes jsonb not null,
  total_savings numeric(15,2),
  created_at timestamptz default now()
);

alter table public.scenarios enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'scenarios' and policyname = 'Users can read own scenarios'
  ) then
    create policy "Users can read own scenarios"
      on public.scenarios for select
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'scenarios' and policyname = 'Users can insert own scenarios'
  ) then
    create policy "Users can insert own scenarios"
      on public.scenarios for insert
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'scenarios' and policyname = 'Users can update own scenarios'
  ) then
    create policy "Users can update own scenarios"
      on public.scenarios for update
      using (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'scenarios' and policyname = 'Users can delete own scenarios'
  ) then
    create policy "Users can delete own scenarios"
      on public.scenarios for delete
      using (auth.uid() = user_id);
  end if;
end $$;


-- -----------------------------------------------------------
-- 5. INDEXES for performance
-- -----------------------------------------------------------
create index if not exists idx_bom_uploads_user_id on public.bom_uploads(user_id);
create index if not exists idx_bom_items_upload_id on public.bom_items(upload_id);
create index if not exists idx_scenarios_user_id on public.scenarios(user_id);
create index if not exists idx_scenarios_upload_id on public.scenarios(upload_id);
