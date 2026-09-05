import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import "./admin.css";

export function AdminLogin() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="page-stub">
        <p className="eyebrow">Panel Administrativo</p>
        <h1>Supabase no está configurado</h1>
        <p>
          Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar el
          inicio de sesión.
        </p>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError("Credenciales incorrectas o cuenta inexistente.");
      setSubmitting(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="admin-auth">
      <form className="admin-auth__card" onSubmit={handleSubmit}>
        <p className="eyebrow">Panel Administrativo</p>
        <h1 className="admin-auth__title">AURUM</h1>

        <label className="admin-field">
          <span>Correo</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Contraseña</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="admin-auth__error">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
