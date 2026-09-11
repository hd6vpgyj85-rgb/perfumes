import { supabase } from "./supabaseClient";
import type { Customer, LoyaltyCardCustomer, LoyaltyTier } from "../types/customer";

interface CustomerRow {
  id: string;
  name: string;
  phone: string | null;
  token: string;
  purchases_count: number;
  notes: string | null;
  created_at: string;
}

function mapRowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? undefined,
    token: row.token,
    purchasesCount: row.purchases_count,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}

/** Panel admin: lista completa de clientes. */
export async function fetchCustomers(): Promise<Customer[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar clientes:", error.message);
    return [];
  }

  return (data as CustomerRow[]).map(mapRowToCustomer);
}

export interface CustomerInput {
  name: string;
  phone: string | null;
  notes: string | null;
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { data, error } = await supabase
    .from("customers")
    .insert({ name: input.name, phone: input.phone, notes: input.notes })
    .select("*")
    .single();
  if (error) throw error;
  return mapRowToCustomer(data as CustomerRow);
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { data, error } = await supabase
    .from("customers")
    .update({ name: input.name, phone: input.phone, notes: input.notes })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapRowToCustomer(data as CustomerRow);
}

export async function deleteCustomer(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}

/** Suma (o resta) compras al contador del cliente. */
export async function adjustCustomerPurchases(id: string, currentCount: number, delta: number): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const nextCount = Math.max(0, currentCount + delta);
  const { error } = await supabase
    .from("customers")
    .update({ purchases_count: nextCount })
    .eq("id", id);
  if (error) throw error;
}

interface LoyaltyTierRow {
  id: string;
  purchases_required: number;
  reward_description: string;
  discount_percent: number | null;
}

function mapRowToTier(row: LoyaltyTierRow): LoyaltyTier {
  return {
    id: row.id,
    purchasesRequired: row.purchases_required,
    rewardDescription: row.reward_description,
    discountPercent: row.discount_percent != null ? Number(row.discount_percent) : undefined,
  };
}

/** Niveles de recompensa: son públicos (los ve la tarjeta de fidelidad). */
export async function fetchLoyaltyTiers(): Promise<LoyaltyTier[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("loyalty_tiers")
    .select("*")
    .order("purchases_required", { ascending: true });

  if (error) {
    console.error("Error al cargar niveles de recompensa:", error.message);
    return [];
  }

  return (data as LoyaltyTierRow[]).map(mapRowToTier);
}

export interface LoyaltyTierInput {
  purchasesRequired: number;
  rewardDescription: string;
  discountPercent: number | null;
}

export async function createLoyaltyTier(input: LoyaltyTierInput): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("loyalty_tiers").insert({
    purchases_required: input.purchasesRequired,
    reward_description: input.rewardDescription,
    discount_percent: input.discountPercent,
  });
  if (error) throw error;
}

export async function deleteLoyaltyTier(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no está configurado.");
  const { error } = await supabase.from("loyalty_tiers").delete().eq("id", id);
  if (error) throw error;
}

interface CustomerCardRow {
  id: string;
  name: string;
  purchases_count: number;
}

/** Tarjeta pública: busca un cliente por su token, sin exponer la tabla completa. */
export async function fetchCustomerByToken(token: string): Promise<LoyaltyCardCustomer | null> {
  if (!supabase || !token.trim()) return null;

  const { data, error } = await supabase.rpc("get_customer_by_token", { p_token: token.trim() });
  if (error || !data || (data as CustomerCardRow[]).length === 0) return null;

  const row = (data as CustomerCardRow[])[0];
  return { id: row.id, name: row.name, purchasesCount: row.purchases_count };
}
