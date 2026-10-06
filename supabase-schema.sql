create extension if not exists "uuid-ossp";

-- PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text, phone text, company text, address text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- CARTS
create table if not exists carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references auth.users(id) on delete cascade,
  items jsonb not null default '[]',
  updated_at timestamptz default now()
);

-- ORDERS
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  reference text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null, customer_email text not null, customer_phone text not null,
  items jsonb not null default '[]',
  subtotal integer not null, delivery_fee integer not null default 0, total integer not null,
  status text not null default 'pending' check (status in ('pending','confirmed','printing','ready','dispatched','delivered','cancelled')),
  payment_method text not null default 'mpesa' check (payment_method in ('mpesa','card','whatsapp')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  delivery_method text not null default 'nairobi' check (delivery_method in ('pickup','nairobi','nationwide')),
  delivery_address text, tracking_code text, notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- QUOTES
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null, customer_email text not null, customer_phone text not null,
  company text, product_name text not null, quantity text not null, description text not null,
  timeline text, design_file_name text,
  status text not null default 'pending' check (status in ('pending','quoted','accepted','declined')),
  quoted_amount integer, admin_notes text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

-- Triggers
create or replace function update_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create or replace trigger profiles_updated_at before update on profiles for each row execute function update_updated_at();
create or replace trigger carts_updated_at    before update on carts    for each row execute function update_updated_at();
create or replace trigger orders_updated_at   before update on orders   for each row execute function update_updated_at();
create or replace trigger quotes_updated_at   before update on quotes   for each row execute function update_updated_at();

-- Indexes
create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_reference_idx on orders(reference);
create index if not exists orders_status_idx on orders(status);
create index if not exists quotes_user_id_idx on quotes(user_id);
create index if not exists carts_user_id_idx on carts(user_id);

-- RLS
alter table profiles enable row level security;
alter table carts    enable row level security;
alter table orders   enable row level security;
alter table quotes   enable row level security;
create policy "Users own profile select" on profiles for select using (auth.uid() = id);
create policy "Users own profile update" on profiles for update using (auth.uid() = id);
create policy "Users own cart"           on carts    for all   using (auth.uid() = user_id);
create policy "Users own orders"         on orders   for select using (auth.uid() = user_id);
create policy "Service full orders"      on orders   for all   using (true) with check (true);
create policy "Service full quotes"      on quotes   for all   using (true) with check (true);

-- Views
create or replace view order_stats as
select count(*) as total_orders,
  count(*) filter (where status='pending') as pending,
  count(*) filter (where status='confirmed') as confirmed,
  count(*) filter (where status='printing') as printing,
  count(*) filter (where status='ready') as ready,
  count(*) filter (where status='delivered') as delivered,
  sum(total) filter (where payment_status='paid') as total_revenue,
  sum(total) filter (where payment_status='paid' and created_at >= date_trunc('month',now())) as revenue_this_month
from orders;

create or replace view quote_stats as
select count(*) as total_quotes,
  count(*) filter (where status='pending') as pending,
  count(*) filter (where status='quoted') as quoted,
  count(*) filter (where status='accepted') as accepted
from quotes;

-- ═══════════════════════════════════════════════════════════════════════════
-- PRODUCT STATUS (admin-managed overrides for the static product catalogue)
-- ═══════════════════════════════════════════════════════════════════════════
create table if not exists product_status (
  product_id   text primary key,        -- matches src/data/index.ts product.id
  stock_status text not null default 'in_stock'
               check (stock_status in ('in_stock', 'low_stock', 'out_of_stock')),
  override_price integer,               -- KES override (optional)
  is_hidden    boolean not null default false,
  admin_note   text,
  updated_at   timestamptz default now()
);
create or replace trigger product_status_updated_at
  before update on product_status for each row execute function update_updated_at();
alter table product_status enable row level security;
create policy "Public can read product status" on product_status for select using (true);
create policy "Service can manage product status" on product_status for all using (true) with check (true);
create index if not exists product_status_stock_idx on product_status(stock_status);
