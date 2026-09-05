# AURUM — Perfumería Premium

Tienda online de perfumería de lujo (árabes, diseñador y nicho). Primera parte del proyecto: header, hero, beneficios, productos destacados, categorías, CTA final y footer, con datos mock y arquitectura preparada para Supabase, WhatsApp y Resend.

## Stack

- React + TypeScript + Vite
- React Router (rutas preparadas para páginas futuras)
- CSS moderno (sin frameworks), mobile-first

## Desarrollo

```bash
npm install
npm run dev
```

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
    common/     iconos, BottlePlaceholder, Reveal, PageStub
  pages/        Home, Contact, legal/, admin/, NotFound
  data/         mocks (productos, categorías, beneficios, navegación)
  context/      CartContext
  types/        tipos de dominio (Product, etc.)
  styles/       tokens de diseño, reset, estilos globales
```

## Pendiente (próximas partes)

Supabase (Auth, Postgres, Storage), panel `/admin`, carrito funcional, checkout con WhatsApp, correos con Resend, buscador, filtros, wishlist, Perfume Finder y páginas legales con contenido real.
