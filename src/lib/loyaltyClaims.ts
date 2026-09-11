import { supabase } from "./supabaseClient";

interface ClaimRow {
  id: string;
  tier_id: string;
  requested_at: string;
  claimed: boolean;
  claimed_at: string | null;
  coupon_id: string | null;
  coupon: { code: string } | null;
}

export interface AdminClaim {
  id: string;
  tierId: string;
  requestedAt: string;
  claimed: boolean;
  claimedAt?: string;
  couponCode?: string;
}

function mapAdminClaim(row: ClaimRow): AdminClaim {
  return {
    id: row.id,
    tierId: row.tier_id,
    requestedAt: row.requested_at,
    claimed: row.claimed,
    claimedAt: row.claimed_at ?? undefined,
    couponCode: row.coupon?.code ?? undefined,
  };
}

/** Panel admin: reclamos existentes (pendientes o confirmados) de un cliente. */
export async function fetchClaimsForCustomer(customerId: string): Promise<AdminClaim[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("loyalty_claims")
    .select("*, coupon:coupons(code)")
    .eq("customer_id", customerId);

  if (error) {
    console.error("Error al cargar reclamos:", error.message);
    return [];
  }

  return (data as ClaimRow[]).map(mapAdminClaim);
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I, para evitar confusiones

function generateCouponCode(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `PREMIO-${suffix}`;
}

async function createLoyaltyCoupon(discountPercent: number): Promise<string> {
  if (!supabase) throw new Error("Supabase no está configurado.");

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("coupons")
      .insert({
        code: generateCouponCode(),
        discount_type: "percentage",
        discount_value: discountPercent,
        max_uses: 1,
        active: true,
      })
      .select("id")
      .single();

    if (!error) return (data as { id: string }).id;
    if (error.code !== "23505") throw error; // no es choque de código único: error real
  }

  throw new Error("No se pudo generar un cupón único, probá de nuevo.");
}

/**
 * Confirma o revierte el reclamo de una recompensa. Al confirmar un nivel
 * con % de descuento, genera (una sola vez) un cupón de un solo uso con ese
 * porcentaje y lo deja vinculado al reclamo para futuras consultas.
 */
export async function setClaimStatus(
  customerId: string,
  tierId: string,
  claimed: boolean,
  discountPercent?: number,
): Promise<AdminClaim> {
  if (!supabase) throw new Error("Supabase no está configurado.");

  const { data: existing } = await supabase
    .from("loyalty_claims")
    .select("*, coupon:coupons(code)")
    .eq("customer_id", customerId)
    .eq("tier_id", tierId)
    .maybeSingle();

  const existingRow = existing as (ClaimRow & { coupon_id: string | null }) | null;
  let couponId = existingRow?.coupon_id ?? null;

  if (claimed && discountPercent && !couponId) {
    couponId = await createLoyaltyCoupon(discountPercent);
  }

  const payload = {
    customer_id: customerId,
    tier_id: tierId,
    claimed,
    claimed_at: claimed ? new Date().toISOString() : null,
    coupon_id: couponId,
  };

  const { data, error } = existingRow
    ? await supabase
        .from("loyalty_claims")
        .update(payload)
        .eq("id", existingRow.id)
        .select("*, coupon:coupons(code)")
        .single()
    : await supabase
        .from("loyalty_claims")
        .insert(payload)
        .select("*, coupon:coupons(code)")
        .single();

  if (error) throw error;
  return mapAdminClaim(data as ClaimRow);
}

export interface PublicClaim {
  tierId: string;
  claimed: boolean;
  claimedAt?: string;
  couponCode?: string;
}

interface PublicClaimRow {
  tier_id: string;
  claimed: boolean;
  claimed_at: string | null;
  coupon_code: string | null;
}

/** Tarjeta pública: pide la recompensa de un nivel (queda pendiente de confirmar). */
export async function requestLoyaltyClaim(token: string, tierId: string): Promise<void> {
  if (!supabase || !token.trim()) return;
  const { error } = await supabase.rpc("request_loyalty_claim", { p_token: token.trim(), p_tier_id: tierId });
  if (error) throw error;
}

/** Tarjeta pública: estado de los reclamos del cliente (pendiente/confirmado/cupón). */
export async function fetchLoyaltyClaimsByToken(token: string): Promise<PublicClaim[]> {
  if (!supabase || !token.trim()) return [];

  const { data, error } = await supabase.rpc("get_loyalty_claims_by_token", { p_token: token.trim() });
  if (error || !data) return [];

  return (data as PublicClaimRow[]).map((row) => ({
    tierId: row.tier_id,
    claimed: row.claimed,
    claimedAt: row.claimed_at ?? undefined,
    couponCode: row.coupon_code ?? undefined,
  }));
}
