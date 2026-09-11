import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCustomerByToken, fetchLoyaltyTiers } from "../lib/customers";
import { fetchLoyaltyClaimsByToken, requestLoyaltyClaim, type PublicClaim } from "../lib/loyaltyClaims";
import { buildWhatsAppUrl } from "../lib/whatsapp";
import type { LoyaltyCardCustomer, LoyaltyTier } from "../types/customer";
import "./LoyaltyCard.css";

const dateFormatter = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export function LoyaltyCard() {
  const { token } = useParams<{ token: string }>();
  const [customer, setCustomer] = useState<LoyaltyCardCustomer | null>(null);
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [claims, setClaims] = useState<PublicClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingTierId, setRequestingTierId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      const [customerData, tiersData, claimsData] = await Promise.all([
        fetchCustomerByToken(token),
        fetchLoyaltyTiers(),
        fetchLoyaltyClaimsByToken(token),
      ]);
      if (!active) return;
      setCustomer(customerData);
      setTiers(tiersData);
      setClaims(claimsData);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [token]);

  const handleClaim = async (tier: LoyaltyTier) => {
    if (!token || !customer) return;
    setRequestingTierId(tier.id);
    try {
      await requestLoyaltyClaim(token, tier.id);
      const claimsData = await fetchLoyaltyClaimsByToken(token);
      setClaims(claimsData);
    } catch (err) {
      console.error("No se pudo registrar el reclamo:", err);
    }

    const message = `¡Hola! Soy ${customer.name}, ya llegué a ${tier.purchasesRequired} compras en mi tarjeta de fidelidad AURUM y quiero reclamar mi recompensa: ${tier.rewardDescription}. ¿Me confirman?`;
    window.open(buildWhatsAppUrl(message), "_blank", "noreferrer");
    setRequestingTierId(null);
  };

  if (loading) {
    return (
      <div className="loyalty-page">
        <div className="container">
          <p className="admin-hint">Cargando tu tarjeta…</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="loyalty-page">
        <div className="container loyalty-page__notfound">
          <p className="eyebrow">Tarjeta no encontrada</p>
          <h1>Este link no es válido</h1>
          <p>Verificá el enlace o pedile a la tienda que te comparta el link correcto.</p>
          <Link to="/" className="btn btn-outline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const sortedTiers = [...tiers].sort((a, b) => a.purchasesRequired - b.purchasesRequired);
  const nextTier = sortedTiers.find((tier) => tier.purchasesRequired > customer.purchasesCount) ?? null;
  const progressPercent = nextTier
    ? Math.min(100, Math.round((customer.purchasesCount / nextTier.purchasesRequired) * 100))
    : 100;

  const whatsappMessage = nextTier
    ? `¡Hola! Soy ${customer.name}, tengo ${customer.purchasesCount} compras en mi tarjeta de fidelidad AURUM.`
    : `¡Hola! Soy ${customer.name}, ya llegué a ${customer.purchasesCount} compras en mi tarjeta de fidelidad AURUM. ¿Cómo canjeo mi recompensa?`;

  return (
    <div className="loyalty-page">
      <div className="container">
        <p className="eyebrow">Tarjeta de fidelidad</p>
        <h1 className="loyalty-page__title">AURUM</h1>

        <div className="loyalty-card">
          <p className="loyalty-card__name">{customer.name}</p>
          <p className="loyalty-card__count">
            {customer.purchasesCount} compra{customer.purchasesCount === 1 ? "" : "s"}
          </p>

          {nextTier ? (
            <div className="loyalty-card__progress">
              <div className="loyalty-card__bar">
                <div className="loyalty-card__bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="loyalty-card__progress-label">
                Te faltan {nextTier.purchasesRequired - customer.purchasesCount} compra
                {nextTier.purchasesRequired - customer.purchasesCount === 1 ? "" : "s"} para "
                {nextTier.rewardDescription}"
              </p>
            </div>
          ) : sortedTiers.length > 0 ? (
            <p className="loyalty-card__complete">¡Ya alcanzaste todos los niveles disponibles!</p>
          ) : null}
        </div>

        {sortedTiers.length > 0 && (
          <div className="loyalty-tiers">
            <h2 className="loyalty-tiers__title">Niveles de recompensa</h2>
            <div className="loyalty-tiers__list">
              {sortedTiers.map((tier) => {
                const achieved = customer.purchasesCount >= tier.purchasesRequired;
                const claim = claims.find((c) => c.tierId === tier.id);
                const isRequesting = requestingTierId === tier.id;

                return (
                  <div key={tier.id} className={`loyalty-tier ${achieved ? "is-achieved" : ""}`}>
                    <div className="loyalty-tier__badge">{achieved ? "✓" : tier.purchasesRequired}</div>
                    <div className="loyalty-tier__info">
                      <p className="loyalty-tier__label">{tier.purchasesRequired} compras</p>
                      <p className="loyalty-tier__desc">
                        {tier.rewardDescription}
                        {tier.discountPercent ? ` (${tier.discountPercent}%)` : ""}
                      </p>

                      {achieved && (
                        <div className="loyalty-tier__claim">
                          {claim?.claimed ? (
                            <>
                              <p className="loyalty-tier__claim-status is-done">
                                Reclamado{claim.claimedAt ? ` el ${dateFormatter.format(new Date(claim.claimedAt))}` : ""}
                              </p>
                              {claim.couponCode && (
                                <p className="loyalty-tier__coupon">
                                  Tu cupón: <strong>{claim.couponCode}</strong>
                                </p>
                              )}
                            </>
                          ) : claim ? (
                            <p className="loyalty-tier__claim-status is-pending">
                              Reclamo enviado, esperando confirmación
                            </p>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline loyalty-tier__claim-btn"
                              onClick={() => handleClaim(tier)}
                              disabled={isRequesting}
                            >
                              {isRequesting ? "Enviando…" : "Reclamar recompensa"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <a
          className="btn btn-primary loyalty-page__cta"
          href={buildWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
