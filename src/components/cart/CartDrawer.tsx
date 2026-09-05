import { useEffect, useState, type FormEvent } from "react";
import { useCart } from "../../context/CartContext";
import { redeemCoupon } from "../../lib/coupons";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "../../lib/whatsapp";
import { BottlePlaceholder } from "../common/BottlePlaceholder";
import { CloseIcon } from "../common/icons";
import "./CartDrawer.css";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function CartDrawer() {
  const {
    items,
    subtotal,
    discount,
    total,
    coupon,
    couponError,
    isDrawerOpen,
    removeItem,
    updateQuantity,
    clear,
    applyCoupon,
    removeCoupon,
    closeDrawer,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleApplyCoupon = async (event: FormEvent) => {
    event.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode);
    setApplying(false);
  };

  const handleCheckout = async () => {
    setSending(true);

    let confirmedCoupon = coupon;
    if (coupon) {
      const redeemed = await redeemCoupon(coupon.code);
      if (redeemed) {
        confirmedCoupon = { ...coupon, ...redeemed };
      }
    }

    const message = buildWhatsAppMessage({
      items,
      subtotal,
      discount,
      total,
      coupon: confirmedCoupon,
    });

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSending(false);
    clear();
    closeDrawer();
  };

  return (
    <>
      <div
        className={`cart-drawer__overlay ${isDrawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside className={`cart-drawer ${isDrawerOpen ? "is-open" : ""}`}>
        <div className="cart-drawer__head">
          <h2 className="cart-drawer__title">Tu Carrito</h2>
          <button className="header__icon-btn" aria-label="Cerrar carrito" onClick={closeDrawer}>
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Todavía no agregaste ningún perfume.</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item__media">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt="" />
                    ) : (
                      <BottlePlaceholder variant={item.product.category} />
                    )}
                  </div>

                  <div className="cart-item__info">
                    <p className="cart-item__brand">{item.product.brand}</p>
                    <p className="cart-item__name">{item.product.name}</p>
                    <p className="cart-item__price">{currency.format(item.product.price)}</p>

                    <div className="cart-item__row">
                      <div className="cart-item__stepper">
                        <button
                          aria-label="Restar cantidad"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          aria-label="Sumar cantidad"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.product.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              {coupon ? (
                <div className="cart-coupon cart-coupon--applied">
                  <span>
                    Cupón <strong>{coupon.code}</strong> aplicado
                  </span>
                  <button onClick={removeCoupon}>Quitar</button>
                </div>
              ) : (
                <form className="cart-coupon" onSubmit={handleApplyCoupon}>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Código de descuento"
                  />
                  <button type="submit" disabled={applying}>
                    {applying ? "…" : "Aplicar"}
                  </button>
                </form>
              )}
              {couponError && <p className="cart-coupon__error">{couponError}</p>}

              <div className="cart-drawer__totals">
                <div className="cart-drawer__totals-row">
                  <span>Subtotal</span>
                  <span>{currency.format(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-drawer__totals-row cart-drawer__totals-row--discount">
                    <span>Descuento</span>
                    <span>-{currency.format(discount)}</span>
                  </div>
                )}
                <div className="cart-drawer__totals-row cart-drawer__totals-row--total">
                  <span>Total</span>
                  <span>{currency.format(total)}</span>
                </div>
              </div>

              <button className="btn btn-primary cart-drawer__checkout" onClick={handleCheckout} disabled={sending}>
                {sending ? "Abriendo WhatsApp…" : "Finalizar pedido por WhatsApp"}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
