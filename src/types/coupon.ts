export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number | null;
  usesCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}
