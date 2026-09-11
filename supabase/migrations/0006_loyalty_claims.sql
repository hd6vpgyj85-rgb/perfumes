-- AURUM — reclamos de recompensas de fidelidad.
-- Idempotente: seguro para volver a ejecutar.

create table if not exists public.loyalty_claims (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  tier_id uuid not null references public.loyalty_tiers(id) on delete cascade,
  requested_at timestamptz not null default now(),
  claimed boolean not null default false,
  claimed_at timestamptz,
  coupon_id uuid references public.coupons(id),
  unique (customer_id, tier_id)
);

create index if not exists loyalty_claims_customer_idx on public.loyalty_claims (customer_id);

alter table public.loyalty_claims enable row level security;

-- Solo el admin lee/escribe la tabla directamente (confirmar reclamos,
-- vincular el cupón generado). El cliente público nunca accede a la
-- tabla en sí: solo a través de las dos funciones security definer de
-- abajo, siempre acotadas a su propio token.
drop policy if exists "loyalty_claims_admin_all" on public.loyalty_claims;
create policy "loyalty_claims_admin_all"
  on public.loyalty_claims for all
  to authenticated
  using (true)
  with check (true);

-- El cliente solicita su recompensa: queda pendiente de confirmar por el admin.
create or replace function public.request_loyalty_claim(p_token text, p_tier_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
begin
  select id into v_customer_id from public.customers where token = p_token;
  if v_customer_id is null then
    return;
  end if;

  insert into public.loyalty_claims (customer_id, tier_id)
  values (v_customer_id, p_tier_id)
  on conflict (customer_id, tier_id) do nothing;
end;
$$;

revoke all on function public.request_loyalty_claim(text, uuid) from public;
grant execute on function public.request_loyalty_claim(text, uuid) to anon, authenticated;

-- El cliente ve el estado de sus propios reclamos, incluido el código del
-- cupón ya generado (si el admin ya lo confirmó y el nivel es de descuento).
create or replace function public.get_loyalty_claims_by_token(p_token text)
returns table (tier_id uuid, claimed boolean, claimed_at timestamptz, coupon_code text)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select lc.tier_id, lc.claimed, lc.claimed_at, co.code
  from public.loyalty_claims lc
  join public.customers c on c.id = lc.customer_id
  left join public.coupons co on co.id = lc.coupon_id
  where c.token = p_token;
end;
$$;

revoke all on function public.get_loyalty_claims_by_token(text) from public;
grant execute on function public.get_loyalty_claims_by_token(text) to anon, authenticated;
