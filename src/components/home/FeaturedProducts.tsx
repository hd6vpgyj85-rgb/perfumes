import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStoreProducts } from "../../hooks/useStoreProducts";
import { ProductCard } from "../product/ProductCard";
import { ProductFilters, type ProductFiltersValue } from "../product/ProductFilters";
import { Reveal } from "../common/Reveal";
import type { PerfumeCategory } from "../../types/product";
import "./FeaturedProducts.css";

const VALID_CATEGORIES: PerfumeCategory[] = ["arabe", "disenador", "nicho"];

function readCategoryParam(value: string | null): PerfumeCategory | "all" {
  return VALID_CATEGORIES.includes(value as PerfumeCategory) ? (value as PerfumeCategory) : "all";
}

export function FeaturedProducts() {
  const { products } = useStoreProducts();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductFiltersValue>({
    category: readCategoryParam(searchParams.get("categoria")),
    brand: "all",
    price: "all",
  });

  useEffect(() => {
    const category = readCategoryParam(searchParams.get("categoria"));
    setFilters((current) => (current.category === category ? current : { ...current, category }));
  }, [searchParams]);

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.category !== "all" && product.category !== filters.category) return false;
      if (filters.brand !== "all" && product.brand !== filters.brand) return false;
      if (filters.price === "under100" && product.price >= 100) return false;
      if (filters.price === "100to200" && (product.price < 100 || product.price > 200)) return false;
      if (filters.price === "over200" && product.price <= 200) return false;
      return true;
    });
  }, [products, filters]);

  return (
    <section id="destacados" className="featured section">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Selección</p>
          <h2 className="section-title">Piezas Destacadas</h2>
          <p className="section-sub">
            Una curaduría entre lo árabe, lo clásico y lo artístico, elegida
            por su carácter, calidad y presencia.
          </p>
        </div>

        <ProductFilters
          value={filters}
          onChange={setFilters}
          brands={brands}
          resultCount={filteredProducts.length}
        />

        {filteredProducts.length === 0 ? (
          <p className="featured__empty">No encontramos perfumes con esos filtros.</p>
        ) : (
          <div className="featured__grid">
            {filteredProducts.map((product, index) => (
              <Reveal key={product.id} delay={(index % 3) * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
