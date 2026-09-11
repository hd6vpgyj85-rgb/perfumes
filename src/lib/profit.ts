export interface ProfitBreakdown {
  profit: number;
  marginPercent: number | null;
}

/** Ganancia neta y % de ganancia sobre el costo (markup), no sobre el precio de venta. */
export function calculateProfit(
  price: number,
  costPrice: number,
  shippingCost: number,
): ProfitBreakdown {
  const profit = price - costPrice - shippingCost;
  const marginPercent = costPrice > 0 ? (profit / costPrice) * 100 : null;
  return { profit, marginPercent };
}
