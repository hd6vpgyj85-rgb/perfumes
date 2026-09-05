import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import { isSupabaseConfigured } from "../../lib/supabaseClient";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="page-stub">
        <p className="eyebrow">Panel Administrativo</p>
        <h1>Supabase no está configurado</h1>
        <p>
          Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar el
          panel de administración.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-stub">
        <p>Cargando…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
