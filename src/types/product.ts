export type PerfumeCategory = "arabe" | "disenador" | "nicho";

export type ProductLevel = "principiante" | "intermedio" | "avanzado";

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: PerfumeCategory;
  concentration: string;
  size: string;
  price: number;
  previousPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  inStock: boolean;
  stock?: number;
  sku?: string;
  level?: ProductLevel;
  description?: string;
  imageUrl?: string;
  gallery?: string[];
  visible?: boolean;
}
