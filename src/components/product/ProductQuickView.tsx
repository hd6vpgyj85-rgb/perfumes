import { Link } from "react-router-dom";
import { useQuickView } from "../../context/QuickViewContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { BagIcon, CloseIcon, HeartIcon, StarIcon } from "../common/icons";
import "./ProductQuickView.css";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductQuickView() {
  const { product, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();

  if (!product) return null;

  const discount = product.previousPrice
    ? Math.round(100 - (product.price / product.previousPrice) * 100)
    : null;

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;
  const favorite = isFavorite(product.id);

  return (
    <div className="quick-view" onClick={closeQuickView}>
      <div className="quick-view__card" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view__close" aria-label="Cerrar" onClick={closeQuickView}>
          <CloseIcon />
        </button>

        <div className={`quick-view__media quick-view__media--${product.category}`}>
          {discount && <span className="quick-view__discount">-{discount}%</span>}
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={`${product.brand} ${product.name}`} />
          ) : (
            <BottlePlaceholder variant={product.category} className="quick-view__bottle" />
          )}
          {!product.inStock && <span className="quick-view__soldout">Agotado</span>}
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

          <div className="quick-view__actions">
            <button
              className="btn btn-primary quick-view__add"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product);
                closeQuickView();
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

          <Link to={`/producto/${product.slug}`} className="quick-view__link" onClick={closeQuickView}>
            Ver detalles completos
          </Link>
        </div>
      </div>
    </div>
  );
}
