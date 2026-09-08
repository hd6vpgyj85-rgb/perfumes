import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";
import { ProductQuickView } from "../product/ProductQuickView";

export function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ProductQuickView />
    </>
  );
}
