import type { Review } from "../types/review";

export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    productName: "Oud Al Sultan",
    productBrand: "Bayt Al Oud",
    authorName: "Sofía R.",
    rating: 5,
    comment: "Huele increíble y dura todo el día. Llegó súper bien empacado.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
  {
    id: "r2",
    productId: "p3",
    productName: "Santal Rare",
    productBrand: "Atelier Nomade",
    authorName: "Valentina G.",
    rating: 5,
    comment: "El mejor perfume de nicho que probé. Vale cada peso.",
    status: "approved",
    createdAt: new Date().toISOString(),
  },
];
