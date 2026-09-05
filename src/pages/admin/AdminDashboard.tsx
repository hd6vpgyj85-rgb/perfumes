import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AdminProducts } from "./tabs/AdminProducts";
import { AdminReviews } from "./tabs/AdminReviews";
import { AdminCoupons } from "./tabs/AdminCoupons";
import "./admin.css";

type Tab = "productos" | "resenas" | "cupones";

const TABS: { id: Tab; label: string }[] = [
  { id: "productos", label: "Productos" },
  { id: "resenas", label: "Reseñas" },
  { id: "cupones", label: "Cupones" },
];

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("productos");

  return (
    <div className="admin">
      <header className="admin__header">
        <div>
          <p className="eyebrow">Panel Administrativo</p>
          <h1 className="admin__title">AURUM</h1>
        </div>
        <button className="btn btn-outline btn-outline--dark" onClick={signOut}>
          Cerrar sesión
        </button>
      </header>

      <nav className="admin-tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`admin-tabbar__tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "productos" && <AdminProducts />}
      {tab === "resenas" && <AdminReviews />}
      {tab === "cupones" && <AdminCoupons />}
    </div>
  );
}
