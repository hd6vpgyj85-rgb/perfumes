import type { CartItem } from "../context/CartContext";
import type { AppliedCoupon } from "../types/coupon";

export const WHATSAPP_NUMBER = "526568596503";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
}

export function buildWhatsAppMessage({ items, subtotal, discount, total, coupon }: OrderSummary): string {
  const lines = ["¡Hola! Quiero hacer este pedido en AURUM:", ""];

  for (const item of items) {
    const lineTotal = item.product.price * item.quantity;
    lines.push(
      `${item.quantity}x ${item.product.name} (${item.product.brand}) — ${currency.format(
        item.product.price,
      )} c/u = ${currency.format(lineTotal)}`,
    );
  }

  lines.push("", `Subtotal: ${currency.format(subtotal)}`);

  if (coupon && discount > 0) {
    const label =
      coupon.discountType === "percentage" ? `-${coupon.discountValue}%` : `-${currency.format(coupon.discountValue)}`;
    lines.push(`Cupón ${coupon.code} (${label}): -${currency.format(discount)}`);
  }

  lines.push(`Total: ${currency.format(total)}`, "", "¿Me confirman disponibilidad y método de envío?");

  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildContactWhatsAppMessage(name: string, message: string): string {
  return [`¡Hola! Soy ${name}.`, "", message].join("\n");
}
