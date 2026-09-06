import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { fetchProductBySlug } from "../lib/products";
import { products as mockProducts } from "../data/products";
import type { Product } from "../types/product";

function findMock(slug: string): Product | null {
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(
    !isSupabaseConfigured && slug ? findMock(slug) : null,
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    if (!isSupabaseConfigured) {
      const mock = findMock(slug);
      setProduct(mock);
      setNotFound(!mock);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchProductBySlug(slug).then((data) => {
      if (cancelled) return;
      const resolved = data ?? findMock(slug);
      setProduct(resolved);
      setNotFound(!resolved);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, notFound };
}
