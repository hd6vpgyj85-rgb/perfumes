import { supabase } from "./supabaseClient";
import type { Coupon, DiscountType } from "../types/coupon";

interface CouponRow {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  max_uses: number | null;
  uses_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

function mapRowToCoupon(row: CouponRow): Coupon {
  return {
    id: row.id,
    code: row.code,
    discountType: row.discount_type,
    discountValue: Number(row.discount_value),
    maxUses: row.max_uses,
    usesCount: row.uses_count,
    active: row.active,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export async function fetchCoupons(): Promise<Coupon[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar cupones:", error.message);
    return [];
  }

  return (data as CouponRow[]).map(mapRowToCoupon);
}

export interface CouponInput {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUses: number | null;
  active: boolean;
  expiresAt: string | null;
}

function toRow(input: CouponInput) {
  return {
    code: input.code.trim().toUpperCase(),
    discount_type: input.discountType,
    discount_value: input.discountValue,
    max_uses: input.maxUses,
    active: input.active,
    expires_at: input.expiresAt,
  };
}

export async function createCoupon(input: CouponInput): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("coupons").insert(toRow(input));
  if (error) throw error;
}

export async function updateCoupon(id: string, input: CouponInput): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("coupons").update(toRow(input)).eq("id", id);
  if (error) throw error;
}

export async function deleteCoupon(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw error;
}

export interface CouponDiscount {
  discountType: DiscountType;
  discountValue: number;
}

interface RedemptionRow {
  discount_type: DiscountType;
  discount_value: number;
}

/** Valida un código (sin consumir uso) para mostrar el descuento en el carrito. */
export async function validateCoupon(code: string): Promise<CouponDiscount | null> {
  if (!supabase || !code.trim()) return null;

  const { data, error } = await supabase.rpc("validate_coupon", { p_code: code.trim() });
  if (error || !data || (data as RedemptionRow[]).length === 0) return null;

  const row = (data as RedemptionRow[])[0];
  return { discountType: row.discount_type, discountValue: Number(row.discount_value) };
}

/** Canjea un código al confirmar el pedido: valida de nuevo y suma un uso. */
export async function redeemCoupon(code: string): Promise<CouponDiscount | null> {
  if (!supabase || !code.trim()) return null;

  const { data, error } = await supabase.rpc("redeem_coupon", { p_code: code.trim() });
  if (error || !data || (data as RedemptionRow[]).length === 0) return null;

  const row = (data as RedemptionRow[])[0];
  return { discountType: row.discount_type, discountValue: Number(row.discount_value) };
}
