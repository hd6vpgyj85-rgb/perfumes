import { useEffect, useState } from "react";
import { toDataURL } from "qrcode";
import type { Customer } from "../../types/customer";

interface CustomerQrModalProps {
  customer: Customer;
  onClose: () => void;
}

function loyaltyCardUrl(token: string): string {
  return `${window.location.origin}/fidelidad/${token}`;
}

export function CustomerQrModal({ customer, onClose }: CustomerQrModalProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const link = loyaltyCardUrl(customer.token);

  useEffect(() => {
    let active = true;
    toDataURL(link, { width: 320, margin: 1, color: { dark: "#150f1a", light: "#f8f5fa" } })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setError("No se pudo generar el código QR.");
      });
    return () => {
      active = false;
    };
  }, [link]);

  return (
    <div className="admin-modal">
      <div className="admin-modal__card admin-qr">
        <h2 className="admin-modal__title">Código QR de {customer.name}</h2>
        <p className="admin-hint">Escaneá este código para abrir directo su tarjeta de fidelidad.</p>

        <div className="admin-qr__preview">
          {error ? (
            <p className="admin-auth__error">{error}</p>
          ) : dataUrl ? (
            <img src={dataUrl} alt={`Código QR de la tarjeta de fidelidad de ${customer.name}`} />
          ) : (
            <p className="admin-hint">Generando…</p>
          )}
        </div>

        <p className="admin-qr__link">{link}</p>

        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cerrar
          </button>
          {dataUrl && (
            <a className="btn btn-primary" href={dataUrl} download={`qr-fidelidad-${customer.name}.png`}>
              Descargar QR
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
