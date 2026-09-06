import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { fetchApprovedReviews } from "../lib/reviews";
import { reviews as mockReviews } from "../data/reviews";
import type { Review } from "../types/review";

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Review[]>(isSupabaseConfigured ? [] : mockReviews);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    fetchApprovedReviews().then((data) => {
      if (cancelled) return;
      setReviews(data.length > 0 ? data : mockReviews);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { reviews, loading };
}
