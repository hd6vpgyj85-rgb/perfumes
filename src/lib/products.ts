import { supabase } from "./supabaseClient";
import type { PerfumeCategory, Product, ProductLevel } from "../types/product";

interface ProductRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  concentration: string;
  size: string;
  price: number;
  previous_price: number | null;
  rating: number;
  reviews_count: number;
  badge: string | null;
  sku: string | null;
  stock: number;
  level: ProductLevel | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  visible: boolean;
  categories: { slug: PerfumeCategory } | { slug: PerfumeCategory }[] | null;
}

export interface CategoryRow {
  id: string;
  slug: PerfumeCategory;
  name: string;
}

const PRODUCT_SELECT =
  "id, slug, brand, name, concentration, size, price, previous_price, rating, reviews_count, badge, sku, stock, level, description, image_url, gallery, visible, categories ( slug )";

function mapRowToProduct(row: ProductRow): Product {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;

  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    name: row.name,
    category: category?.slug ?? "arabe",
    concentration: row.concentration,
    size: row.size,
    price: Number(row.price),
    previousPrice: row.previous_price != null ? Number(row.previous_price) : undefined,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    badge: row.badge ?? undefined,
    inStock: row.stock > 0,
    stock: row.stock,
    sku: row.sku ?? undefined,
    level: row.level ?? undefined,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    gallery: row.gallery ?? [],
    visible: row.visible,
  };
}

/** Productos visibles para la tienda pública. */
export async function fetchStoreProducts(): Promise<Product[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("visible", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar productos:", error.message);
    return [];
  }

  return (data as unknown as ProductRow[]).map(mapRowToProduct);
}

/** Todos los productos (incluye ocultos) para el panel admin. */
export async function fetchAdminProducts(): Promise<Product[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar productos:", error.message);
    return [];
  }

  return (data as unknown as ProductRow[]).map(mapRowToProduct);
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  if (!supabase) return [];

  const { data, error } = await supabase.from("categories").select("id, slug, name");

  if (error) {
    console.error("Error al cargar categorías:", error.message);
    return [];
  }

  return data as CategoryRow[];
}

export interface ProductInput {
  slug: string;
  brand: string;
  name: string;
  categoryId: string;
  concentration: string;
  size: string;
  price: number;
  previousPrice: number | null;
  badge: string | null;
  sku: string | null;
  stock: number;
  level: ProductLevel | null;
  description: string | null;
  imageUrl: string | null;
  gallery: string[];
  visible: boolean;
}

function toRow(input: ProductInput) {
  return {
    slug: input.slug,
    brand: input.brand,
    name: input.name,
    category_id: input.categoryId,
    concentration: input.concentration,
    size: input.size,
    price: input.price,
    previous_price: input.previousPrice,
    badge: input.badge,
    sku: input.sku,
    stock: input.stock,
    level: input.level,
    description: input.description,
    image_url: input.imageUrl,
    gallery: input.gallery,
    visible: input.visible,
  };
}

export async function createProduct(input: ProductInput): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("products").insert(toRow(input));
  if (error) throw error;
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("products").update(toRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

const IMAGE_BUCKET = "product-images";

export async function uploadProductImage(file: File, slug: string): Promise<string> {
  if (!supabase) throw new Error("Supabase no está configurado.");

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${slug}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
