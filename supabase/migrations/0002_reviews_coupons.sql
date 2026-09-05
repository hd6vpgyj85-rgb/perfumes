-- AURUM — reseñas de productos y cupones de descuento.
-- Idempotente: seguro para volver a ejecutar.

-- ─────────────────────────────────────────────
-- Reseñas
-- ─────────────────────────────────────────────
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);
create index if not exists reviews_status_idx on public.reviews (status);

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read_approved" on public.reviews;
create policy "reviews_public_read_approved"
  on public.reviews for select
  to anon
  using (status = 'approved');

drop policy if exists "reviews_public_insert" on public.reviews;
create policy "reviews_public_insert"
  on public.reviews for insert
  to anon
  with check (status = 'pending');

drop policy if exists "reviews_admin_read_all" on public.reviews;
create policy "reviews_admin_read_all"
  on public.reviews for select
  to authenticated
  using (true);

drop policy if exists "reviews_admin_update" on public.reviews;
create policy "reviews_admin_update"
  on public.reviews for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete"
  on public.reviews for delete
  to authenticated
  using (true);

-- ─────────────────────────────────────────────
-- Cupones de descuento
-- ─────────────────────────────────────────────
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  max_uses integer check (max_uses is null or max_uses > 0),
  uses_count integer not null default 0 check (uses_count >= 0),
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

drop policy if exists "coupons_admin_all" on public.coupons;
create policy "coupons_admin_all"
  on public.coupons for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────
-- Datos de ejemplo
-- ─────────────────────────────────────────────
insert into public.reviews (product_id, author_name, rating, comment, status)
select p.id, v.author_name, v.rating, v.comment, v.status
from (values
  ('oud-al-sultan', 'Sofía R.', 5, 'Huele increíble y dura todo el día. Llegó súper bien empacado.', 'approved'),
  ('oud-al-sultan', 'Marcos T.', 4, 'Muy bueno, un poco fuerte al principio pero se asienta lindo.', 'pending'),
  ('santal-rare', 'Valentina G.', 5, 'El mejor perfume de nicho que probé. Vale cada peso.', 'approved'),
  ('ambre-noir', 'Diego L.', 2, 'No es lo que esperaba, el frasco llegó con un golpe.', 'pending')
) as v(slug, author_name, rating, comment, status)
join public.products p on p.slug = v.slug
where not exists (
  select 1 from public.reviews r
  where r.product_id = p.id and r.author_name = v.author_name
);

insert into public.coupons (code, discount_type, discount_value, max_uses, active)
select 'BIENVENIDO10', 'percentage', 10, 100, true
where not exists (select 1 from public.coupons where code = 'BIENVENIDO10');
