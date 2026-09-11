import { useEffect, useState } from "react";
import { fetchAdminProducts, updateProductPrice } from "../../../lib/products";
import { calculateProfit, calculateSuggestedPrice } from "../../../lib/profit";
import type { Product } from "../../../types/product";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

interface FinanceRowProps {
  product: Product;
  cost: number;
  shipping: number;
  hasCost: boolean;
  profit: number;
  marginPercent: number | null;
  onPriceApplied: (id: string, price: number) => void;
}

function FinanceRow({
  product,
  cost,
  shipping,
  hasCost,
  profit,
  marginPercent,
  onPriceApplied,
}: FinanceRowProps) {
  const [percent, setPercent] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const isLoss = hasCost && profit <= 0;
  const parsedPercent = Number(percent);
  const showSuggestion = hasCost && percent !== "" && !Number.isNaN(parsedPercent);
  const suggestedPrice = showSuggestion
    ? Math.round(calculateSuggestedPrice(cost, shipping, parsedPercent) * 100) / 100
    : null;

  const handleApply = async () => {
    if (suggestedPrice == null) return;
    setApplying(true);
    try {
      await updateProductPrice(product.id, suggestedPrice);
      onPriceApplied(product.id, suggestedPrice);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo actualizar el precio.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className={`admin-finance-row ${isLoss ? "is-loss" : ""}`}>
      <div className="admin-finance-row__top">
        <div className="admin-finance-row__info">
          <p className="admin-row__name">{product.name}</p>
          <p className="admin-row__meta">
            {product.brand} · {product.stock ?? 0} en stock
          </p>
          {isLoss && <p className="admin-finance-row__flag">Estás perdiendo dinero con este precio</p>}
        </div>

        <div className="admin-finance-row__numbers">
          <div className="admin-finance-row__cell">
            <span className="admin-finance-row__label">Costo</span>
            <span>{hasCost ? currency.format(cost) : "—"}</span>
          </div>
          <div className="admin-finance-row__cell">
            <span className="admin-finance-row__label">Envío</span>
            <span>{shipping ? currency.format(shipping) : "—"}</span>
          </div>
          <div className="admin-finance-row__cell">
            <span className="admin-finance-row__label">Venta</span>
            <span>{currency.format(product.price)}</span>
          </div>
          <div className="admin-finance-row__cell">
            <span className="admin-finance-row__label">Ganancia</span>
            <span className={isLoss ? "is-loss" : ""}>{hasCost ? currency.format(profit) : "—"}</span>
          </div>
          <div className="admin-finance-row__cell">
            <span className="admin-finance-row__label">% s/costo</span>
            <span className={isLoss ? "is-loss" : ""}>
              {marginPercent != null ? `${marginPercent.toFixed(0)}%` : "—"}
            </span>
          </div>
        </div>
      </div>

      {hasCost && (
        <div className="admin-finance-row__suggest">
          <label className="admin-finance-row__suggest-field">
            <span>% de ganancia deseado</span>
            <input
              type="number"
              min="0"
              step="1"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              placeholder="ej. 40"
            />
          </label>

          {suggestedPrice != null && (
            <>
              <span className="admin-finance-row__suggest-price">
                Precio sugerido (con envío incluido): <strong>{currency.format(suggestedPrice)}</strong>
              </span>
              <button
                type="button"
                className="admin-finance-row__suggest-apply"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Aplicando…" : applied ? "Precio actualizado ✓" : "Usar este precio"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminFinance() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handlePriceApplied = (id: string, price: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, price } : p)));
  };

  const rows = products.map((product) => {
    const cost = product.costPrice ?? 0;
    const shipping = product.shippingCost ?? 0;
    const stock = product.stock ?? 0;
    const hasCost = product.costPrice != null;
    const { profit, marginPercent } = calculateProfit(product.price, cost, shipping);
    return { product, cost, shipping, stock, hasCost, profit, marginPercent };
  });

  const totalInventoryCost = rows.reduce((sum, r) => sum + r.cost * r.stock, 0);
  const totalPotentialRevenue = rows.reduce((sum, r) => sum + r.product.price * r.stock, 0);
  const totalPotentialProfit = rows.reduce(
    (sum, r) => sum + (r.hasCost ? r.profit * r.stock : 0),
    0,
  );
  const lossCount = rows.filter((r) => r.hasCost && r.profit <= 0).length;
  const missingCostCount = rows.filter((r) => !r.hasCost).length;

  return (
    <div className="admin-panel">
      <div className="admin__toolbar">
        <h2>Finanzas</h2>
      </div>

      {loading ? (
        <p className="admin-hint">Cargando…</p>
      ) : products.length === 0 ? (
        <p className="admin-hint">Todavía no hay productos cargados.</p>
      ) : (
        <>
          <div className="admin-finance__summary">
            <div className="admin-finance__stat">
              <span className="admin-finance__stat-label">Inventario (costo)</span>
              <span className="admin-finance__stat-value">{currency.format(totalInventoryCost)}</span>
            </div>
            <div className="admin-finance__stat">
              <span className="admin-finance__stat-label">Ingreso potencial</span>
              <span className="admin-finance__stat-value">{currency.format(totalPotentialRevenue)}</span>
            </div>
            <div className="admin-finance__stat admin-finance__stat--accent">
              <span className="admin-finance__stat-label">Ganancia potencial</span>
              <span className="admin-finance__stat-value">{currency.format(totalPotentialProfit)}</span>
            </div>
            <div
              className={`admin-finance__stat ${lossCount > 0 ? "admin-finance__stat--warning" : ""}`}
            >
              <span className="admin-finance__stat-label">Productos en pérdida</span>
              <span className="admin-finance__stat-value">{lossCount}</span>
            </div>
          </div>

          {missingCostCount > 0 && (
            <p className="admin-hint">
              {missingCostCount} producto{missingCostCount === 1 ? "" : "s"} sin costo cargado —
              no se puede calcular su ganancia. Editalo desde la pestaña Productos.
            </p>
          )}

          <div className="admin-table">
            {rows.map((row) => (
              <FinanceRow key={row.product.id} {...row} onPriceApplied={handlePriceApplied} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
