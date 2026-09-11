-- AURUM — tarjeta de fidelidad por cliente.
-- Idempotente: seguro para volver a ejecutar.

-- ─────────────────────────────────────────────
-- Clientes
-- ─────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  token text unique not null default encode(gen_random_bytes(16), 'hex'),
  purchases_count integer not null default 0 check (purchases_count >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_token_idx on public.customers (token);

alter table public.customers enable row level security;

-- Sin política de lectura para "anon": la tarjeta pública nunca lee esta
-- tabla directamente (evita que alguien liste o filtre clientes). El único
-- acceso público es la función get_customer_by_token de abajo, que solo
-- devuelve los campos necesarios para UN cliente que ya tiene su token.
drop policy if exists "customers_admin_all" on public.customers;
create policy "customers_admin_all"
  on public.customers for all
  to authenticated
  using (true)
  with check (true);

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- Niveles de recompensa (reglas del programa, iguales para todos)
-- ─────────────────────────────────────────────
create table if not exists public.loyalty_tiers (
  id uuid primary key default gen_random_uuid(),
  purchases_required integer not null check (purchases_required > 0),
  reward_description text not null,
  discount_percent numeric(5, 2) check (discount_percent is null or discount_percent > 0),
  created_at timestamptz not null default now()
);

alter table public.loyalty_tiers enable row level security;

drop policy if exists "loyalty_tiers_public_read" on public.loyalty_tiers;
create policy "loyalty_tiers_public_read"
  on public.loyalty_tiers for select
  to anon, authenticated
  using (true);

drop policy if exists "loyalty_tiers_admin_write" on public.loyalty_tiers;
create policy "loyalty_tiers_admin_write"
  on public.loyalty_tiers for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────
-- Acceso público a la tarjeta: solo por token, solo campos no sensibles.
-- ─────────────────────────────────────────────
create or replace function public.get_customer_by_token(p_token text)
returns table (id uuid, name text, purchases_count integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select c.id, c.name, c.purchases_count
  from public.customers c
  where c.token = p_token;
end;
$$;

revoke all on function public.get_customer_by_token(text) from public;
grant execute on function public.get_customer_by_token(text) to anon, authenticated;

-- ─────────────────────────────────────────────
-- Niveles de ejemplo
-- ─────────────────────────────────────────────
insert into public.loyalty_tiers (purchases_required, reward_description, discount_percent)
select 3, '10% de descuento en tu próxima compra', 10
where not exists (
  select 1 from public.loyalty_tiers where purchases_required = 3
);

insert into public.loyalty_tiers (purchases_required, reward_description, discount_percent)
select 5, 'Un perfume de regalo a elección', null
where not exists (
  select 1 from public.loyalty_tiers where purchases_required = 5
);

insert into public.loyalty_tiers (purchases_required, reward_description, discount_percent)
select 10, '25% de descuento en tu próxima compra', 25
where not exists (
  select 1 from public.loyalty_tiers where purchases_required = 10
);
