import { categories } from "../../data/categories";
import { ChevronRightIcon } from "../common/icons";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { Reveal } from "../common/Reveal";
import "./Categories.css";

export function Categories() {
  return (
    <section id="categorias" className="categories section">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow">Tres Mundos, Una Firma</p>
          <h2 className="section-title">Explora por Categoría</h2>
          <p className="section-sub">
            Cada categoría tiene su propio carácter, pero todas comparten la
            misma exigencia de calidad y presencia.
          </p>
        </div>

        <div className="categories__grid">
          {categories.map((category, index) => (
            <Reveal key={category.id} delay={index * 100}>
              <a
                href={category.href}
                className={`category-card category-card--${category.variant}`}
              >
                <BottlePlaceholder variant={category.id} className="category-card__bottle" />
                <div className="category-card__content">
                  <p className="category-card__eyebrow">{category.eyebrow}</p>
                  <h3 className="category-card__title">{category.title}</h3>
                  <p className="category-card__desc">{category.description}</p>
                  <span className="category-card__cta">
                    {category.cta}
                    <ChevronRightIcon />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
