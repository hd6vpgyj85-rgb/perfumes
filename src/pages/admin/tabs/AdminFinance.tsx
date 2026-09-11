import { useEffect, useState } from "react";
import { fetchAdminProducts } from "../../../lib/products";
import { calculateProfit } from "../../../lib/profit";
import type { Product } from "../../../types/product";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function AdminFinance() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

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
            {rows.map(({ product, cost, shipping, hasCost, profit, marginPercent }) => {
              const isLoss = hasCost && profit <= 0;
              return (
                <div key={product.id} className={`admin-finance-row ${isLoss ? "is-loss" : ""}`}>
                  <div className="admin-finance-row__info">
                    <p className="admin-row__name">{product.name}</p>
                    <p className="admin-row__meta">
                      {product.brand} · {product.stock ?? 0} en stock
                    </p>
                    {isLoss && (
                      <p className="admin-finance-row__flag">Estás perdiendo dinero con este precio</p>
                    )}
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
                      <span className={isLoss ? "is-loss" : ""}>
                        {hasCost ? currency.format(profit) : "—"}
                      </span>
                    </div>
                    <div className="admin-finance-row__cell">
                      <span className="admin-finance-row__label">% s/costo</span>
                      <span className={isLoss ? "is-loss" : ""}>
                        {marginPercent != null ? `${marginPercent.toFixed(0)}%` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
