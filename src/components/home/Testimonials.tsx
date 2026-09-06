import { useApprovedReviews } from "../../hooks/useApprovedReviews";
import { StarIcon } from "../common/icons";
import { Reveal } from "../common/Reveal";
import "./Testimonials.css";

export function Testimonials() {
  const { reviews } = useApprovedReviews();

  if (reviews.length === 0) return null;

  return (
    <section className="testimonials section">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow eyebrow--light">Voces AURUM</p>
          <h2 className="section-title testimonials__title">Lo Que Dicen Nuestros Clientes</h2>
        </div>

        <div className="testimonials__grid">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 90}>
              <article className="testimonial-card">
                <div className="testimonial-card__rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} style={{ opacity: i < review.rating ? 1 : 0.25 }} />
                  ))}
                </div>
                <p className="testimonial-card__comment">"{review.comment}"</p>
                <p className="testimonial-card__author">
                  {review.authorName}
                  <span> · {review.productName}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
