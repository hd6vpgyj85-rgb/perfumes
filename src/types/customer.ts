export interface Customer {
  id: string;
  name: string;
  phone?: string;
  token: string;
  purchasesCount: number;
  notes?: string;
  createdAt: string;
}

export interface LoyaltyTier {
  id: string;
  purchasesRequired: number;
  rewardDescription: string;
  discountPercent?: number;
}

export interface LoyaltyCardCustomer {
  id: string;
  name: string;
  purchasesCount: number;
}
