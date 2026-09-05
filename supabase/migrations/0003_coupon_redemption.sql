-- AURUM — funciones para validar y canjear cupones desde el checkout.
-- Los clientes (anon) no tienen acceso directo a la tabla "coupons"
-- (para no poder listar códigos), así que exponemos dos funciones
-- security definer bien acotadas: una de solo lectura para mostrar
-- el descuento al aplicar el código, y otra que además incrementa
-- el contador de usos al confirmar el pedido.

create or replace function public.validate_coupon(p_code text)
returns table (discount_type text, discount_value numeric)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select c.discount_type, c.discount_value
  from public.coupons c
  where upper(c.code) = upper(p_code)
    and c.active = true
    and (c.expires_at is null or c.expires_at > now())
    and (c.max_uses is null or c.uses_count < c.max_uses);
end;
$$;

revoke all on function public.validate_coupon(text) from public;
grant execute on function public.validate_coupon(text) to anon, authenticated;

create or replace function public.redeem_coupon(p_code text)
returns table (discount_type text, discount_value numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select c.id into v_id
  from public.coupons c
  where upper(c.code) = upper(p_code)
    and c.active = true
    and (c.expires_at is null or c.expires_at > now())
    and (c.max_uses is null or c.uses_count < c.max_uses)
  for update;

  if v_id is null then
    return;
  end if;

  update public.coupons set uses_count = uses_count + 1 where id = v_id;

  return query
  select c.discount_type, c.discount_value
  from public.coupons c
  where c.id = v_id;
end;
$$;

revoke all on function public.redeem_coupon(text) from public;
grant execute on function public.redeem_coupon(text) to anon, authenticated;
