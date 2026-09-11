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

/**
 * Precio de venta sugerido para ganar `desiredPercent`% sobre el costo,
 * ya contando el envío (costo + envío + ganancia deseada sobre el costo).
 */
export function calculateSuggestedPrice(
  costPrice: number,
  shippingCost: number,
  desiredPercent: number,
): number {
  const desiredProfit = costPrice * (desiredPercent / 100);
  return costPrice + shippingCost + desiredProfit;
}
