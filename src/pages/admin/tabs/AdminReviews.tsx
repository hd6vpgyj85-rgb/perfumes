import { useEffect, useState } from "react";
import { deleteReview, fetchAdminReviews, updateReviewStatus } from "../../../lib/reviews";
import type { Review, ReviewStatus } from "../../../types/review";
import { StarIcon } from "../../../components/common/icons";

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

export function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    setReviews(await fetchAdminReviews());
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleStatus = async (review: Review, status: ReviewStatus) => {
    await updateReviewStatus(review.id, status);
    reload();
  };

  const handleDelete = async (review: Review) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await deleteReview(review.id);
    reload();
  };

  return (
    <div className="admin-panel">
      <div className="admin__toolbar">
        <h2>Reseñas</h2>
      </div>

      {loading ? (
        <p className="admin-hint">Cargando…</p>
      ) : reviews.length === 0 ? (
        <p className="admin-hint">Todavía no hay reseñas.</p>
      ) : (
        <div className="admin-table">
          {reviews.map((review) => (
            <div key={review.id} className="admin-review">
              <div className="admin-review__head">
                <div>
                  <p className="admin-row__name">{review.authorName}</p>
                  <p className="admin-row__meta">
                    {review.productBrand} · {review.productName}
                  </p>
                </div>
                <span className={`admin-review__status admin-review__status--${review.status}`}>
                  {STATUS_LABEL[review.status]}
                </span>
              </div>

              <div className="admin-review__rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="product-card__star"
                    style={{ opacity: i < review.rating ? 1 : 0.25 }}
                  />
                ))}
              </div>

              <p className="admin-review__comment">{review.comment}</p>

              <div className="admin-row__actions">
                {review.status !== "approved" && (
                  <button className="btn btn-primary" onClick={() => handleStatus(review, "approved")}>
                    Aprobar
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    className="btn btn-outline"
                    onClick={() => handleStatus(review, "rejected")}
                  >
                    Rechazar
                  </button>
                )}
                <button className="admin-row__delete" onClick={() => handleDelete(review)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
