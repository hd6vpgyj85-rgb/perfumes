import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { ProductCard } from "../components/product/ProductCard";
import "./Wishlist.css";

export function Wishlist() {
  const { items } = useWishlist();

  return (
    <div className="wishlist-page">
      <div className="container">
        <p className="eyebrow">Tu selección</p>
        <h1 className="wishlist-page__title">Favoritos</h1>

        {items.length === 0 ? (
          <div className="wishlist-page__empty">
            <p>Todavía no agregaste perfumes a tus favoritos.</p>
            <Link to="/" className="btn btn-primary">
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="wishlist-page__grid">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
