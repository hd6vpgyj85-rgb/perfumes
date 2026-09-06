import { useState, type FormEvent } from "react";
import type { Coupon, DiscountType } from "../../types/coupon";
import { createCoupon, updateCoupon, type CouponInput } from "../../lib/coupons";

interface CouponFormProps {
  coupon: Coupon | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function CouponForm({ coupon, onSaved, onCancel }: CouponFormProps) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [discountType, setDiscountType] = useState<DiscountType>(
    coupon?.discountType ?? "percentage",
  );
  const [discountValue, setDiscountValue] = useState(String(coupon?.discountValue ?? ""));
  const [maxUses, setMaxUses] = useState(coupon?.maxUses != null ? String(coupon.maxUses) : "");
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
  const [active, setActive] = useState(coupon?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsedValue = Number(discountValue);
    if (!code.trim() || Number.isNaN(parsedValue) || parsedValue <= 0) {
      setError("Completá un código y un valor de descuento válido.");
      return;
    }

    const input: CouponInput = {
      code: code.trim(),
      discountType,
      discountValue: parsedValue,
      maxUses: maxUses ? Number(maxUses) : null,
      active,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    };

    setSubmitting(true);
    try {
      if (coupon) {
        await updateCoupon(coupon.id, input);
      } else {
        await createCoupon(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el cupón.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal">
      <form className="admin-modal__card" onSubmit={handleSubmit}>
        <h2 className="admin-modal__title">{coupon ? "Editar cupón" : "Nuevo cupón"}</h2>

        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Código</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="BIENVENIDO10"
              required
            />
          </label>

          <label className="admin-field">
            <span>Tipo de descuento</span>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountType)}
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo (USD)</option>
            </select>
          </label>

          <label className="admin-field">
            <span>Valor</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Usos máximos (vacío = ilimitado)</span>
            <input type="number" min="1" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} />
          </label>

          <label className="admin-field">
            <span>Vencimiento (opcional)</span>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </label>
        </div>

        <label className="admin-field admin-field--row">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <span>Cupón activo</span>
        </label>

        {error && <p className="admin-auth__error">{error}</p>}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
