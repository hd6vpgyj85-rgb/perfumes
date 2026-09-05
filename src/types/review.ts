export type ReviewStatus = "pending" | "approved" | "rejected";

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  authorName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}
