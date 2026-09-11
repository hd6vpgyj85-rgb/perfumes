import { useEffect, useState } from "react";
import type { Customer, LoyaltyTier } from "../../types/customer";
import { fetchClaimsForCustomer, setClaimStatus, type AdminClaim } from "../../lib/loyaltyClaims";

interface CustomerClaimsModalProps {
  customer: Customer;
  tiers: LoyaltyTier[];
  onClose: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export function CustomerClaimsModal({ customer, tiers, onClose }: CustomerClaimsModalProps) {
  const [claims, setClaims] = useState<AdminClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTierId, setUpdatingTierId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unlockedTiers = tiers
    .filter((tier) => customer.purchasesCount >= tier.purchasesRequired)
    .sort((a, b) => a.purchasesRequired - b.purchasesRequired);

  useEffect(() => {
    let active = true;
    fetchClaimsForCustomer(customer.id).then((data) => {
      if (!active) return;
      setClaims(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [customer.id]);

  const handleToggle = async (tier: LoyaltyTier, currentClaim: AdminClaim | undefined) => {
    setError(null);
    setUpdatingTierId(tier.id);
    try {
      const updated = await setClaimStatus(customer.id, tier.id, !currentClaim?.claimed, tier.discountPercent);
      setClaims((prev) => [...prev.filter((c) => c.tierId !== tier.id), updated]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el reclamo.");
    } finally {
      setUpdatingTierId(null);
    }
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal__card admin-claims">
        <h2 className="admin-modal__title">Recompensas de {customer.name}</h2>

        {loading ? (
          <p className="admin-hint">Cargando…</p>
        ) : unlockedTiers.length === 0 ? (
          <p className="admin-hint">Todavía no desbloqueó ningún nivel.</p>
        ) : (
          <div className="admin-claims__list">
            {unlockedTiers.map((tier) => {
              const claim = claims.find((c) => c.tierId === tier.id);
              const isUpdating = updatingTierId === tier.id;

              return (
                <div key={tier.id} className={`admin-claim ${claim?.claimed ? "is-claimed" : ""}`}>
                  <div className="admin-claim__info">
                    <p className="admin-row__name">
                      {tier.purchasesRequired} compras — {tier.rewardDescription}
                    </p>
                    <p className="admin-row__meta">
                      {claim?.claimed
                        ? `Reclamado el ${dateFormatter.format(new Date(claim.claimedAt!))}`
                        : claim
                          ? `Solicitado el ${dateFormatter.format(new Date(claim.requestedAt))} · pendiente de confirmar`
                          : "No reclamado"}
                    </p>
                    {claim?.couponCode && (
                      <p className="admin-claim__coupon">
                        Cupón: <strong>{claim.couponCode}</strong>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className={claim?.claimed ? "admin-coupon__delete" : "admin-coupon__edit"}
                    onClick={() => handleToggle(tier, claim)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? "…" : claim?.claimed ? "Marcar no reclamado" : "Marcar reclamado"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {error && <p className="admin-auth__error">{error}</p>}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
