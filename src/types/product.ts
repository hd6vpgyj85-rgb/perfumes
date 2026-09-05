export type PerfumeCategory = "arabe" | "disenador" | "nicho";

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
}
