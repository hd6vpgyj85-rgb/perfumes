import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuickView } from "../../context/QuickViewContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSwipe } from "../../hooks/useSwipe";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { BagIcon, ChevronRightIcon, CloseIcon, HeartIcon, StarIcon } from "../common/icons";
import type { Product } from "../../types/product";
import "./ProductQuickView.css";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductQuickView() {
  const { product, closeQuickView } = useQuickView();

  useBodyScrollLock(Boolean(product));

  if (!product) return null;

  return <QuickViewCard key={product.id} product={product} onClose={closeQuickView} />;
}

function QuickViewCard({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [product.imageUrl, ...(product.gallery ?? [])].filter(
    (url): url is string => Boolean(url),
  );
  const hasMultiple = images.length > 1;

  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);
  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  const discount = product.previousPrice
    ? Math.round(100 - (product.price / product.previousPrice) * 100)
    : null;

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;
  const favorite = isFavorite(product.id);

  return (
    <div className="quick-view" onClick={onClose}>
      <div className="quick-view__card" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view__close" aria-label="Cerrar" onClick={onClose}>
          <CloseIcon />
        </button>

        <div
          className={`quick-view__media quick-view__media--${product.category}`}
          {...swipeHandlers}
        >
          {discount && <span className="quick-view__discount">-{discount}%</span>}

          {images.length > 0 ? (
            <img src={images[activeIndex]} alt={`${product.brand} ${product.name}`} />
          ) : (
            <BottlePlaceholder variant={product.category} className="quick-view__bottle" />
          )}

          {!product.inStock && <span className="quick-view__soldout">Agotado</span>}

          {hasMultiple && (
            <>
              <button
                className="quick-view__nav quick-view__nav--prev"
                aria-label="Imagen anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronRightIcon />
              </button>
              <button
                className="quick-view__nav quick-view__nav--next"
                aria-label="Imagen siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <ChevronRightIcon />
              </button>
              <div className="quick-view__dots">
                {images.map((url, i) => (
                  <button
                    key={url}
                    className={`quick-view__dot ${i === activeIndex ? "is-active" : ""}`}
                    aria-label={`Ver imagen ${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="quick-view__body">
          <p className="quick-view__brand">{product.brand}</p>
          <h2 className="quick-view__name">{product.name}</h2>
          <p className="quick-view__concentration">
            {product.concentration} · {product.size}
          </p>

          <div className="quick-view__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className="quick-view__star"
                half={i === fullStars && hasHalfStar}
                style={{ opacity: i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.25 }}
              />
            ))}
            <span className="quick-view__reviews">({product.reviewsCount})</span>
          </div>

          <div className="quick-view__prices">
            <span className="quick-view__price">{currency.format(product.price)}</span>
            {product.previousPrice && (
              <span className="quick-view__price-prev">
                {currency.format(product.previousPrice)}
              </span>
            )}
          </div>

          {product.description && (
            <p className="quick-view__description">{product.description}</p>
          )}

          <div className="quick-view__actions">
            <button
              className="btn btn-primary quick-view__add"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product);
                onClose();
              }}
            >
              <BagIcon /> Agregar al Carrito
            </button>
            <button
              className={`quick-view__fav ${favorite ? "is-active" : ""}`}
              aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              aria-pressed={favorite}
              onClick={() => toggleFavorite(product)}
            >
              <HeartIcon filled={favorite} />
            </button>
          </div>

          <Link to={`/producto/${product.slug}`} className="quick-view__link" onClick={onClose}>
            Ver detalles completos
          </Link>
        </div>
      </div>
    </div>
  );
}
