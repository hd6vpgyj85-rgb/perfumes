import { useStoreProducts } from "../../hooks/useStoreProducts";
import { ProductCard } from "../product/ProductCard";
import { Reveal } from "../common/Reveal";
import "./FeaturedProducts.css";

export function FeaturedProducts() {
  const { products } = useStoreProducts();

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

        <div className="featured__grid">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={(index % 3) * 90}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
