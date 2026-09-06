import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { fetchProductReviews } from "../lib/reviews";
import { reviews as mockReviews } from "../data/reviews";
import type { Review } from "../types/review";

export function useProductReviews(productId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!productId) return;

    if (!isSupabaseConfigured) {
      setReviews(mockReviews.filter((r) => r.productId === productId));
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchProductReviews(productId).then((data) => {
      if (cancelled) return;
      setReviews(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { reviews, loading };
}
