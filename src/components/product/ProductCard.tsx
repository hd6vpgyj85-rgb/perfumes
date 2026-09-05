import { useState } from "react";
import type { Product } from "../../types/product";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { BagIcon, HeartIcon, StarIcon } from "../common/icons";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
}

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  const discount = product.previousPrice
    ? Math.round(100 - (product.price / product.previousPrice) * 100)
    : null;

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;

  return (
    <article className="product-card">
      <div className={`product-card__media product-card__media--${product.category}`}>
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {discount && <span className="product-card__discount">-{discount}%</span>}

        <button
          className={`product-card__fav ${isFavorite ? "is-active" : ""}`}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((prev) => !prev)}
        >
          <HeartIcon filled={isFavorite} />
        </button>

        <BottlePlaceholder variant={product.category} className="product-card__bottle" />

        {!product.inStock && <span className="product-card__soldout">Agotado</span>}
      </div>

      <div className="product-card__body">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__concentration">
          {product.concentration} · {product.size}
        </p>

        <div className="product-card__rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className="product-card__star"
              half={i === fullStars && hasHalfStar}
              style={{ opacity: i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.25 }}
            />
          ))}
          <span className="product-card__reviews">({product.reviewsCount})</span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__prices">
            <span className="product-card__price">{currency.format(product.price)}</span>
            {product.previousPrice && (
              <span className="product-card__price-prev">
                {currency.format(product.previousPrice)}
              </span>
            )}
          </div>

          <button
            className="product-card__add"
            aria-label="Agregar al carrito"
            disabled={!product.inStock}
            onClick={() => addItem(product)}
          >
            <BagIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
