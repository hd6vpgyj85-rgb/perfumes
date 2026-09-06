import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "../../hooks/useProduct";
import { useProductReviews } from "../../hooks/useProductReviews";
import { useStoreProducts } from "../../hooks/useStoreProducts";
import { useCart } from "../../context/CartContext";
import { categories } from "../../data/categories";
import { BottlePlaceholder } from "../../components/common/BottlePlaceholder";
import { StarIcon, HeartIcon, BagIcon } from "../../components/common/icons";
import { ProductCard } from "../../components/product/ProductCard";
import { NotFound } from "../NotFound";
import "./ProductDetail.css";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, notFound } = useProduct(slug);
  const { reviews } = useProductReviews(product?.id);
  const { products: allProducts } = useStoreProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  if (notFound) return <NotFound />;
  if (loading || !product) {
    return <div className="page-stub page-stub--dark" />;
  }

  const categoryInfo = categories.find((c) => c.id === product.category);
  const discount = product.previousPrice
    ? Math.round(100 - (product.price / product.previousPrice) * 100)
    : null;

  const images = [product.imageUrl, ...(product.gallery ?? [])].filter(
    (url): url is string => Boolean(url),
  );
  const mainImage = activeImage ?? images[0] ?? null;

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) addItem(product);
  };

  return (
    <div className="product-detail">
      <div className="container product-detail__breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to={`/#categorias`}>{categoryInfo?.title ?? "Perfumes"}</Link>
        <span>/</span>
        <span className="product-detail__breadcrumb-current">{product.name}</span>
      </div>

      <div className="container product-detail__layout">
        <div className="product-detail__gallery">
          <div className={`product-detail__main-image product-detail__main-image--${product.category}`}>
            {mainImage ? (
              <img src={mainImage} alt={`${product.brand} ${product.name}`} />
            ) : (
              <BottlePlaceholder variant={product.category} />
            )}
          </div>

          {images.length > 1 && (
            <div className="product-detail__thumbs">
              {images.map((url) => (
                <button
                  key={url}
                  className={`product-detail__thumb ${mainImage === url ? "is-active" : ""}`}
                  onClick={() => setActiveImage(url)}
                  aria-label="Ver esta imagen"
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          {categoryInfo && <p className="eyebrow eyebrow--light">{categoryInfo.eyebrow}</p>}
          <p className="product-detail__brand">{product.brand}</p>
          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                half={i === fullStars && hasHalfStar}
                style={{ opacity: i < fullStars || (i === fullStars && hasHalfStar) ? 1 : 0.25 }}
              />
            ))}
            <span>({product.reviewsCount})</span>
          </div>

          <div className="product-detail__prices">
            <span className="product-detail__price">{currency.format(product.price)}</span>
            {product.previousPrice && (
              <span className="product-detail__price-prev">
                {currency.format(product.previousPrice)}
              </span>
            )}
            {discount && <span className="product-detail__discount">-{discount}%</span>}
          </div>

          <p className="product-detail__meta">
            {product.concentration} · {product.size}
          </p>

          {product.description && <p className="product-detail__description">{product.description}</p>}

          {!product.inStock ? (
            <p className="product-detail__soldout">Agotado por el momento</p>
          ) : (
            <div className="product-detail__actions">
              <div className="product-detail__stepper">
                <button aria-label="Restar cantidad" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{quantity}</span>
                <button aria-label="Sumar cantidad" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </button>
              </div>

              <button className="btn btn-primary product-detail__add" onClick={handleAddToCart}>
                <BagIcon /> Agregar al Carrito
              </button>

              <button
                className={`product-detail__fav ${isFavorite ? "is-active" : ""}`}
                aria-label="Añadir a favoritos"
                aria-pressed={isFavorite}
                onClick={() => setIsFavorite((v) => !v)}
              >
                <HeartIcon filled={isFavorite} />
              </button>
            </div>
          )}

          {product.sku && <p className="product-detail__sku">SKU: {product.sku}</p>}
        </div>
      </div>

      <div className="container product-detail__reviews">
        <h2 className="section-title product-detail__reviews-title">Reseñas</h2>

        {reviews.length === 0 ? (
          <p className="product-detail__no-reviews">Todavía no hay reseñas para este perfume.</p>
        ) : (
          <div className="product-detail__reviews-grid">
            {reviews.map((review) => (
              <article key={review.id} className="testimonial-card">
                <div className="testimonial-card__rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} style={{ opacity: i < review.rating ? 1 : 0.25 }} />
                  ))}
                </div>
                <p className="testimonial-card__comment">"{review.comment}"</p>
                <p className="testimonial-card__author">{review.authorName}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="container product-detail__related">
          <h2 className="section-title product-detail__reviews-title">También Te Puede Interesar</h2>
          <div className="product-detail__related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
