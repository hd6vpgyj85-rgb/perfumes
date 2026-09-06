import { useEffect, useState } from "react";
import { CouponForm } from "../../../components/admin/CouponForm";
import { deleteCoupon, fetchCoupons } from "../../../lib/coupons";
import type { Coupon } from "../../../types/coupon";

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);

  const reload = async () => {
    setLoading(true);
    setCoupons(await fetchCoupons());
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (coupon: Coupon) => {
    if (!confirm(`¿Eliminar el cupón "${coupon.code}"?`)) return;
    await deleteCoupon(coupon.id);
    reload();
  };

  return (
    <div className="admin-panel">
      <div className="admin__toolbar">
        <h2>Cupones</h2>
        <button className="btn btn-primary" onClick={() => setEditing("new")}>
          + Nuevo cupón
        </button>
      </div>

      {loading ? (
        <p className="admin-hint">Cargando…</p>
      ) : coupons.length === 0 ? (
        <p className="admin-hint">Todavía no hay cupones cargados.</p>
      ) : (
        <div className="admin-table">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="admin-coupon">
              <div>
                <p className="admin-row__name">{coupon.code}</p>
                <p className="admin-row__meta">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% de descuento`
                    : `$${coupon.discountValue} de descuento`}
                </p>
              </div>

              <div className="admin-row__meta">
                {coupon.usesCount}
                {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""} usos
              </div>

              <div className="admin-row__visible">{coupon.active ? "Activo" : "Inactivo"}</div>

              <div className="admin-row__actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setEditing(coupon)}
                >
                  Editar
                </button>
                <button className="admin-row__delete" onClick={() => handleDelete(coupon)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <CouponForm
          coupon={editing === "new" ? null : editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
}
