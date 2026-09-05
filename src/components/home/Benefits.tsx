import { benefits, type BenefitIcon } from "../../data/benefits";
import { Reveal } from "../common/Reveal";
import "./Benefits.css";

const iconGlyph: Record<BenefitIcon, string> = {
  seal: "◈",
  shipping: "⟡",
  concierge: "✦",
  curation: "❖",
};

export function Benefits() {
  return (
    <section className="benefits section">
      <div className="container benefits__grid">
        {benefits.map((benefit, index) => (
          <Reveal key={benefit.title} delay={index * 80}>
            <article className="benefit-card">
              <span className="benefit-card__icon">{iconGlyph[benefit.icon]}</span>
              <h3 className="benefit-card__title">{benefit.title}</h3>
              <p className="benefit-card__desc">{benefit.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
