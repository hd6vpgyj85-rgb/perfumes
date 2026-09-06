import type { PerfumeCategory } from "../../types/product";
import "./ProductFilters.css";

export type PriceRange = "all" | "under100" | "100to200" | "over200";

export interface ProductFiltersValue {
  category: PerfumeCategory | "all";
  brand: string;
  price: PriceRange;
}

interface ProductFiltersProps {
  value: ProductFiltersValue;
  onChange: (value: ProductFiltersValue) => void;
  brands: string[];
  resultCount: number;
}

const CATEGORY_OPTIONS: { value: PerfumeCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "arabe", label: "Árabes" },
  { value: "disenador", label: "Diseñador" },
  { value: "nicho", label: "Nicho" },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "all", label: "Todos los precios" },
  { value: "under100", label: "Hasta USD 100" },
  { value: "100to200", label: "USD 100 – 200" },
  { value: "over200", label: "Más de USD 200" },
];

export function ProductFilters({ value, onChange, brands, resultCount }: ProductFiltersProps) {
  return (
    <div className="product-filters">
      <div className="product-filters__pills">
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`product-filters__pill ${value.category === option.value ? "is-active" : ""}`}
            onClick={() => onChange({ ...value, category: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="product-filters__selects">
        <select
          value={value.brand}
          onChange={(e) => onChange({ ...value, brand: e.target.value })}
          aria-label="Filtrar por marca"
        >
          <option value="all">Todas las marcas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={value.price}
          onChange={(e) => onChange({ ...value, price: e.target.value as PriceRange })}
          aria-label="Filtrar por precio"
        >
          {PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="product-filters__count">
          {resultCount} {resultCount === 1 ? "producto" : "productos"}
        </span>
      </div>
    </div>
  );
}
