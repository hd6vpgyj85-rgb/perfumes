-- AURUM — costo y envío por producto, para calcular ganancia en el panel admin.
-- Seguro para volver a ejecutar (idempotente).

alter table public.products
  add column if not exists cost_price numeric(10, 2) check (cost_price is null or cost_price >= 0),
  add column if not exists shipping_cost numeric(10, 2) check (shipping_cost is null or shipping_cost >= 0);

-- Estas columnas nunca se exponen a "anon": la tienda pública (fetchStoreProducts,
-- fetchProductBySlug) no las selecciona en su query. Las políticas de RLS ya
-- existentes son suficientes porque son a nivel de fila, no de columna, así que
-- la protección real está en qué columnas pide el cliente en cada consulta.
