import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="page-stub">
      <p className="eyebrow">Error 404</p>
      <h1>Esta página no existe</h1>
      <p>El enlace que buscas no está disponible o fue movido.</p>
      <Link to="/" className="btn btn-outline">
        Volver al inicio
      </Link>
    </div>
  );
}
