-- AURUM — esquema inicial: categorías, productos y storage de imágenes.
-- Seguro para volver a ejecutar (idempotente): podés correr todo el
-- script de nuevo si se cortó a mitad de camino.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Categorías
-- ─────────────────────────────────────────────
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

-- ─────────────────────────────────────────────
-- Productos
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  brand text not null,
  name text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  concentration text not null,
  size text not null,
  price numeric(10, 2) not null check (price >= 0),
  previous_price numeric(10, 2) check (previous_price is null or previous_price >= 0),
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews_count integer not null default 0 check (reviews_count >= 0),
  badge text,
  sku text unique,
  stock integer not null default 0 check (stock >= 0),
  level text check (level in ('principiante', 'intermedio', 'avanzado')),
  description text,
  image_url text,
  gallery text[] not null default '{}',
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_visible_idx on public.products (visible);

alter table public.products enable row level security;

drop policy if exists "products_public_read_visible" on public.products;
create policy "products_public_read_visible"
  on public.products for select
  to anon
  using (visible = true);

drop policy if exists "products_admin_read_all" on public.products;
create policy "products_admin_read_all"
  on public.products for select
  to authenticated
  using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "products_admin_update" on public.products;
create policy "products_admin_update"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "products_admin_delete" on public.products;
create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────
-- Storage: imágenes de producto (bucket público de lectura)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_admin_update" on storage.objects;
create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "product_images_admin_delete" on storage.objects;
create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ─────────────────────────────────────────────
-- Datos de ejemplo (los mismos mock que ya usaba la tienda)
-- ─────────────────────────────────────────────
insert into public.categories (slug, name) values
  ('arabe', 'Perfumes Árabes'),
  ('disenador', 'Perfumes de Diseñador'),
  ('nicho', 'Perfumes de Nicho')
on conflict (slug) do nothing;

insert into public.products
  (slug, brand, name, category_id, concentration, size, price, previous_price, rating, reviews_count, badge, sku, stock, visible)
select v.slug, v.brand, v.name, c.id, v.concentration, v.size, v.price, v.previous_price, v.rating, v.reviews_count, v.badge, v.sku, v.stock, true
from (values
  ('oud-al-sultan', 'Bayt Al Oud', 'Oud Al Sultan', 'arabe', 'Eau de Parfum', '100 ml', 89.00, 119.00, 4.8, 214, 'Bestseller', 'AUR-ARB-001', 25),
  ('ambre-noir', 'Maison Lefèvre', 'Ambre Noir', 'disenador', 'Eau de Parfum', '90 ml', 145.00, null, 4.6, 98, 'Nuevo', 'AUR-DIS-001', 18),
  ('santal-rare', 'Atelier Nomade', 'Santal Rare', 'nicho', 'Extrait de Parfum', '75 ml', 210.00, null, 4.9, 41, 'Edición Limitada', 'AUR-NIC-001', 9),
  ('musc-el-fakhr', 'Dar Al Musk', 'Musc El Fakhr', 'arabe', 'Eau de Parfum', '100 ml', 76.00, 95.00, 4.7, 163, null, 'AUR-ARB-002', 32),
  ('ivoire-22', 'Maison Lefèvre', 'Ivoire N°22', 'disenador', 'Eau de Toilette', '100 ml', 98.00, 130.00, 4.5, 187, null, 'AUR-DIS-002', 21),
  ('encre-de-cuir', 'Atelier Nomade', 'Encre de Cuir', 'nicho', 'Extrait de Parfum', '50 ml', 175.00, null, 4.8, 29, null, 'AUR-NIC-003', 0)
) as v(slug, brand, name, category_slug, concentration, size, price, previous_price, rating, reviews_count, badge, sku, stock)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;
