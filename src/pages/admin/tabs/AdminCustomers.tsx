import { useEffect, useState, type FormEvent } from "react";
import { CustomerForm } from "../../../components/admin/CustomerForm";
import { CustomerClaimsModal } from "../../../components/admin/CustomerClaimsModal";
import {
  adjustCustomerPurchases,
  createLoyaltyTier,
  deleteCustomer,
  deleteLoyaltyTier,
  fetchCustomers,
  fetchLoyaltyTiers,
} from "../../../lib/customers";
import type { Customer, LoyaltyTier } from "../../../types/customer";

function loyaltyCardUrl(token: string): string {
  return `${window.location.origin}/fidelidad/${token}`;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Customer | "new" | null>(null);
  const [claimsFor, setClaimsFor] = useState<Customer | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [tierPurchases, setTierPurchases] = useState("");
  const [tierReward, setTierReward] = useState("");
  const [tierDiscount, setTierDiscount] = useState("");
  const [tierError, setTierError] = useState<string | null>(null);
  const [savingTier, setSavingTier] = useState(false);

  const reload = async () => {
    setLoading(true);
    const [customersData, tiersData] = await Promise.all([fetchCustomers(), fetchLoyaltyTiers()]);
    setCustomers(customersData);
    setTiers(tiersData);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (customer: Customer) => {
    if (!confirm(`¿Eliminar a "${customer.name}"? Esta acción no se puede deshacer.`)) return;
    await deleteCustomer(customer.id);
    reload();
  };

  const handleAdjust = async (customer: Customer, delta: number) => {
    const nextCount = Math.max(0, customer.purchasesCount + delta);
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, purchasesCount: nextCount } : c)),
    );
    try {
      await adjustCustomerPurchases(customer.id, customer.purchasesCount, delta);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo actualizar el contador.");
      reload();
    }
  };

  const handleCopyLink = async (customer: Customer) => {
    try {
      await navigator.clipboard.writeText(loyaltyCardUrl(customer.token));
      setCopiedId(customer.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      prompt("Copiá el link manualmente:", loyaltyCardUrl(customer.token));
    }
  };

  const handleAddTier = async (event: FormEvent) => {
    event.preventDefault();
    setTierError(null);

    const purchasesRequired = Number(tierPurchases);
    if (!purchasesRequired || purchasesRequired <= 0 || !tierReward.trim()) {
      setTierError("Completá compras requeridas y la recompensa.");
      return;
    }

    setSavingTier(true);
    try {
      await createLoyaltyTier({
        purchasesRequired,
        rewardDescription: tierReward.trim(),
        discountPercent: tierDiscount ? Number(tierDiscount) : null,
      });
      setTierPurchases("");
      setTierReward("");
      setTierDiscount("");
      reload();
    } catch (err) {
      setTierError(err instanceof Error ? err.message : "No se pudo guardar el nivel.");
    } finally {
      setSavingTier(false);
    }
  };

  const handleDeleteTier = async (tier: LoyaltyTier) => {
    if (!confirm(`¿Eliminar el nivel de ${tier.purchasesRequired} compras?`)) return;
    await deleteLoyaltyTier(tier.id);
    reload();
  };

  return (
    <div className="admin-panel">
      <div className="admin__toolbar">
        <h2>Clientes</h2>
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          + Nuevo cliente
        </button>
      </div>

      {loading ? (
        <p className="admin-hint">Cargando…</p>
      ) : customers.length === 0 ? (
        <p className="admin-hint">Todavía no hay clientes cargados.</p>
      ) : (
        <div className="admin-table">
          {customers.map((customer) => (
            <div key={customer.id} className="admin-customer">
              <div className="admin-customer__info">
                <p className="admin-row__name">{customer.name}</p>
                <p className="admin-row__meta">
                  {customer.phone || "Sin WhatsApp cargado"}
                  {" · "}
                  {customer.purchasesCount} compra{customer.purchasesCount === 1 ? "" : "s"}
                </p>
              </div>

              <div className="admin-customer__stepper">
                <button
                  type="button"
                  aria-label="Restar compra"
                  onClick={() => handleAdjust(customer, -1)}
                >
                  −
                </button>
                <span>{customer.purchasesCount}</span>
                <button
                  type="button"
                  aria-label="Sumar compra"
                  onClick={() => handleAdjust(customer, 1)}
                >
                  +
                </button>
              </div>

              <div className="admin-customer__actions">
                <button
                  type="button"
                  className="admin-coupon__edit"
                  onClick={() => handleCopyLink(customer)}
                >
                  {copiedId === customer.id ? "Copiado ✓" : "Copiar link"}
                </button>
                <button
                  type="button"
                  className="admin-coupon__edit"
                  onClick={() => setClaimsFor(customer)}
                >
                  Recompensas
                </button>
                <button
                  type="button"
                  className="admin-coupon__edit"
                  onClick={() => setEditing(customer)}
                >
                  Editar
                </button>
                <button className="admin-coupon__delete" onClick={() => handleDelete(customer)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-loyalty-tiers">
        <h3 className="admin-loyalty-tiers__title">Niveles de recompensa</h3>
        <p className="admin-hint">
          Se aplican a todos los clientes por igual, según cuántas compras acumulen.
        </p>

        {tiers.length > 0 && (
          <div className="admin-table">
            {tiers.map((tier) => (
              <div key={tier.id} className="admin-tier">
                <div className="admin-tier__info">
                  <p className="admin-row__name">{tier.purchasesRequired} compras</p>
                  <p className="admin-row__meta">
                    {tier.rewardDescription}
                    {tier.discountPercent ? ` (${tier.discountPercent}%)` : ""}
                  </p>
                </div>
                <button className="admin-coupon__delete" onClick={() => handleDeleteTier(tier)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <form className="admin-tier-form" onSubmit={handleAddTier}>
          <label className="admin-field">
            <span>Compras requeridas</span>
            <input
              type="number"
              min="1"
              value={tierPurchases}
              onChange={(e) => setTierPurchases(e.target.value)}
              placeholder="ej. 5"
            />
          </label>
          <label className="admin-field">
            <span>Recompensa</span>
            <input
              value={tierReward}
              onChange={(e) => setTierReward(e.target.value)}
              placeholder="ej. Perfume de regalo"
            />
          </label>
          <label className="admin-field">
            <span>% de descuento (opcional)</span>
            <input
              type="number"
              min="0"
              max="100"
              value={tierDiscount}
              onChange={(e) => setTierDiscount(e.target.value)}
            />
          </label>
          {tierError && <p className="admin-auth__error">{tierError}</p>}
          <button type="submit" className="btn btn-primary" disabled={savingTier}>
            {savingTier ? "Guardando…" : "+ Agregar nivel"}
          </button>
        </form>
      </div>

      {editing && (
        <CustomerForm
          customer={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      {claimsFor && (
        <CustomerClaimsModal customer={claimsFor} tiers={tiers} onClose={() => setClaimsFor(null)} />
      )}
    </div>
  );
}
