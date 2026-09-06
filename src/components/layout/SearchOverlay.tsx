import { useEffect, useMemo, useRef, useState } from "react";
import { useStoreProducts } from "../../hooks/useStoreProducts";
import { useCart } from "../../context/CartContext";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { BagIcon, CloseIcon, SearchIcon } from "../common/icons";
import "./SearchOverlay.css";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { products } = useStoreProducts();
  const { addItem } = useCart();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(id);
    }
    setQuery("");
  }, [isOpen]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return [];
    return products.filter(
      (product) => normalize(product.name).includes(q) || normalize(product.brand).includes(q),
    );
  }, [products, query]);

  return (
    <div className={`search-overlay ${isOpen ? "is-open" : ""}`}>
      <div className="container search-overlay__head">
        <div className="search-overlay__field">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o marca…"
            aria-label="Buscar perfumes"
          />
        </div>
        <button className="header__icon-btn" aria-label="Cerrar búsqueda" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="container search-overlay__results">
        {query.trim() === "" ? (
          <p className="search-overlay__hint">Escribí el nombre de un perfume o una marca.</p>
        ) : results.length === 0 ? (
          <p className="search-overlay__hint">No encontramos resultados para "{query}".</p>
        ) : (
          results.map((product) => (
            <div key={product.id} className="search-result">
              <div className="search-result__media">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt="" />
                ) : (
                  <BottlePlaceholder variant={product.category} />
                )}
              </div>
              <div className="search-result__info">
                <p className="search-result__brand">{product.brand}</p>
                <p className="search-result__name">{product.name}</p>
                <p className="search-result__price">{currency.format(product.price)}</p>
              </div>
              <button
                className="search-result__add"
                aria-label={`Agregar ${product.name} al carrito`}
                onClick={() => {
                  addItem(product);
                  onClose();
                }}
              >
                <BagIcon />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
