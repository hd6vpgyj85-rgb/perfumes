import { Reveal } from "../common/Reveal";
import "./CTA.css";

export function CTA() {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <Reveal>
          <span className="cta__line" aria-hidden="true" />
          <p className="eyebrow eyebrow--light">Encuentra tu Firma</p>
          <h2 className="cta__title">
            Encuentra la Fragancia que
            <br /> te Define
          </h2>
          <p className="cta__subtitle">
            Descubre una selección de perfumes árabes, de diseñador y de
            nicho, elegidos para durar en la memoria de quien te rodea.
          </p>
          <a href="#destacados" className="btn btn-primary">
            Descubrir Ahora
          </a>
          <span className="cta__line" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}
