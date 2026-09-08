import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { WishlistProvider } from "./context/WishlistContext.tsx";
import { QuickViewProvider } from "./context/QuickViewContext.tsx";
import { ScrollToTop } from "./components/layout/ScrollToTop.tsx";
import "./styles/reset.css";
import "./styles/tokens.css";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <QuickViewProvider>
              <ScrollToTop />
              <App />
            </QuickViewProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
