import { supabase } from "./supabaseClient";
import type { Review, ReviewStatus } from "../types/review";

interface ReviewRow {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
  products: { name: string; brand: string } | { name: string; brand: string }[] | null;
}

function mapRowToReview(row: ReviewRow): Review {
  const product = Array.isArray(row.products) ? row.products[0] : row.products;

  return {
    id: row.id,
    productId: row.product_id,
    productName: product?.name ?? "—",
    productBrand: product?.brand ?? "",
    authorName: row.author_name,
    rating: row.rating,
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function fetchAdminReviews(): Promise<Review[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_id, author_name, rating, comment, status, created_at, products ( name, brand )")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar reseñas:", error.message);
    return [];
  }

  return (data as unknown as ReviewRow[]).map(mapRowToReview);
}

export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}
