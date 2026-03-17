-- Tariff rate changes log
create table if not exists public.tariff_rate_changes (
  id uuid default gen_random_uuid() primary key,
  country text not null,
  country_code text,
  old_rate numeric(5,2) not null,
  new_rate numeric(5,2) not null,
  change_date timestamptz default now(),
  source text,
  description text,
  created_at timestamptz default now()
);

alter table public.tariff_rate_changes enable row level security;

-- All authenticated users can read rate changes
create policy "Authenticated users can read rate changes"
  on public.tariff_rate_changes for select
  using (auth.role() = 'authenticated');

-- Add email_alerts_enabled to profiles
alter table public.profiles add column if not exists email_alerts_enabled boolean default true;

-- Recommendations cache
create table if not exists public.recommendations (
  id uuid default gen_random_uuid() primary key,
  upload_id uuid references public.bom_uploads(id) on delete cascade not null,
  item_id uuid references public.bom_items(id) on delete cascade,
  item_name text not null,
  current_country text not null,
  current_rate numeric(5,2) not null,
  current_cost numeric(15,2) not null,
  alternatives jsonb not null,
  total_potential_savings numeric(15,2) default 0,
  created_at timestamptz default now()
);

alter table public.recommendations enable row level security;

create policy "Users can read own recommendations"
  on public.recommendations for select
  using (
    exists (
      select 1 from public.bom_uploads
      where bom_uploads.id = recommendations.upload_id
        and bom_uploads.user_id = auth.uid()
    )
  );

create policy "Users can insert own recommendations"
  on public.recommendations for insert
  with check (
    exists (
      select 1 from public.bom_uploads
      where bom_uploads.id = recommendations.upload_id
        and bom_uploads.user_id = auth.uid()
    )
  );
