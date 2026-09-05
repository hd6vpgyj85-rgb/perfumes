import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { fetchStoreProducts } from "../lib/products";
import { products as mockProducts } from "../data/products";
import type { Product } from "../types/product";

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>(isSupabaseConfigured ? [] : mockProducts);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let cancelled = false;

    fetchStoreProducts().then((data) => {
      if (cancelled) return;
      setProducts(data.length > 0 ? data : mockProducts);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
