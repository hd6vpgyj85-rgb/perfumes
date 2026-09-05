import { BottlePlaceholder } from "../common/BottlePlaceholder";
import "./Hero.css";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__visual">
        <BottlePlaceholder variant="hero" className="hero__bottle" />
      </div>

      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__content">
        <p className="eyebrow eyebrow--light">Colección 2026</p>
        <h1 className="hero__title">
          El Arte de la
          <br />
          Fragancia
        </h1>
        <p className="hero__subtitle">
          Perfumes árabes, de diseñador y de nicho, reunidos en una selección
          curada para quienes entienden el perfume como una firma personal.
        </p>
        <div className="hero__actions">
          <a href="#destacados" className="btn btn-primary">
            Descubrir Colección
          </a>
          <a href="#categorias" className="btn btn-outline">
            Ver Categorías
          </a>
        </div>
      </div>
    </section>
  );
}
