import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { AppliedCoupon } from "../types/coupon";
import { validateCoupon } from "../lib/coupons";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
  couponError: string | null;
  isDrawerOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function calculateDiscount(subtotal: number, coupon: AppliedCoupon | null): number {
  if (!coupon) return 0;
  const raw =
    coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  return Math.min(raw, subtotal);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addItem = (product: Product) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    );
  };

  const clear = () => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code: string) => {
    setCouponError(null);
    const result = await validateCoupon(code);
    if (!result) {
      setCoupon(null);
      setCouponError("Cupón inválido, vencido o sin usos disponibles.");
      return;
    }
    setCoupon({ code: code.trim().toUpperCase(), ...result });
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [items],
  );

  const discount = useMemo(() => calculateDiscount(subtotal, coupon), [subtotal, coupon]);
  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        coupon,
        couponError,
        isDrawerOpen,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        applyCoupon,
        removeCoupon,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}
