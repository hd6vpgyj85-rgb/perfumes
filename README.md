# AURUM — Perfumería Premium

Tienda online de perfumería de lujo (árabes, diseñador y nicho). Header, hero, beneficios, productos destacados, categorías, CTA final y footer — con productos reales en Supabase (o mocks si Supabase no está configurado) y un panel `/admin` para gestionarlos.

## Stack

- React + TypeScript + Vite
- React Router (rutas preparadas para páginas futuras)
- Supabase (Postgres + Auth + Storage)
- CSS moderno (sin frameworks), mobile-first

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con tu URL y anon key de Supabase
npm run dev
```

Sin `.env.local`, la tienda funciona igual mostrando datos de ejemplo, y `/admin` avisa que falta configurar Supabase.

## Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En **SQL Editor**, ejecutá el contenido de `supabase/migrations/0001_init.sql` (crea las tablas, políticas RLS, el bucket de imágenes y carga los productos de ejemplo).
3. En **Authentication → Users**, creá el usuario administrador (email + contraseña) que va a iniciar sesión en `/admin/login`.
4. En **Project Settings → API**, copiá la **Project URL** y la **anon public key** a tu `.env.local` (local) y como variables de entorno del proyecto en Cloudflare (producción).

## Build

```bash
npm run build
```

## Estructura

```
src/
  components/
    layout/     Header, Footer, Layout
    home/       Hero, Benefits, FeaturedProducts, Categories, CTA
    product/    ProductCard
    admin/      RequireAuth, ProductForm
    common/     iconos, BottlePlaceholder, Reveal, PageStub
  pages/        Home, Contact, legal/, admin/ (login + dashboard), NotFound
  lib/          supabaseClient, products (repositorio), slugify
  data/         mocks de fallback (productos, categorías, beneficios, navegación)
  context/      CartContext, AuthContext
  hooks/        useStoreProducts, useInView
  types/        tipos de dominio (Product, etc.)
  styles/       tokens de diseño, reset, estilos globales
supabase/
  migrations/   esquema SQL (tablas, RLS, storage, seed)
```

## Pendiente (próximas partes)

Carrito funcional (drawer), checkout con WhatsApp, correos con Resend, buscador, filtros, wishlist, Perfume Finder y páginas legales con contenido real.
