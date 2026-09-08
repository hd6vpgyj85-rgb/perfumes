import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/product";

interface QuickViewContextValue {
  product: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);

  return (
    <QuickViewContext.Provider
      value={{
        product,
        openQuickView: (p) => setProduct(p),
        closeQuickView: () => setProduct(null),
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error("useQuickView debe usarse dentro de un QuickViewProvider");
  }
  return context;
}
