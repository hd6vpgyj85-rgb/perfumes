import { useState, type FormEvent } from "react";
import type { Customer } from "../../types/customer";
import { createCustomer, updateCustomer, type CustomerInput } from "../../lib/customers";

interface CustomerFormProps {
  customer: Customer | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSaved, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [notes, setNotes] = useState(customer?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Completá el nombre del cliente.");
      return;
    }

    const input: CustomerInput = {
      name: name.trim(),
      phone: phone.trim() || null,
      notes: notes.trim() || null,
    };

    setSubmitting(true);
    try {
      if (customer) {
        await updateCustomer(customer.id, input);
      } else {
        await createCustomer(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el cliente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-modal">
      <form className="admin-modal__card" onSubmit={handleSubmit}>
        <h2 className="admin-modal__title">{customer ? "Editar cliente" : "Nuevo cliente"}</h2>

        <label className="admin-field">
          <span>Nombre</span>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="admin-field">
          <span>WhatsApp (opcional)</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="52656..." />
        </label>

        <label className="admin-field">
          <span>Notas (opcional)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>

        {error && <p className="admin-auth__error">{error}</p>}

        <div className="admin-modal__actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
