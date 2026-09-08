import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/product";

const STORAGE_KEY = "aurum_wishlist";

interface WishlistContextValue {
  items: Product[];
  itemCount: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function loadStoredWishlist(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => loadStoredWishlist());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage no disponible; los favoritos solo viven en esta sesión
    }
  }, [items]);

  const isFavorite = (productId: string) => items.some((item) => item.id === productId);

  const toggleFavorite = (product: Product) => {
    setItems((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product],
    );
  };

  const removeFavorite = (productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{ items, itemCount: items.length, isFavorite, toggleFavorite, removeFavorite }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist debe usarse dentro de un WishlistProvider");
  }
  return context;
}
