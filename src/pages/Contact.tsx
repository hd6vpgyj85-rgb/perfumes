import { useState, type FormEvent } from "react";
import { WhatsappIcon } from "../components/common/icons";
import { buildContactWhatsAppMessage, buildWhatsAppUrl } from "../lib/whatsapp";
import "./Contact.css";

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl("¡Hola! Tengo una pregunta sobre AURUM.");
const DISPLAY_NUMBER = "+52 656 859 6503";

export function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const url = buildWhatsAppUrl(buildContactWhatsAppMessage(name.trim(), message.trim()));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="contact-page">
      <div className="container contact-page__inner">
        <p className="eyebrow">Contacto</p>
        <h1 className="contact-page__title">Hablemos</h1>
        <p className="contact-page__intro">
          ¿Dudas sobre un perfume, tu pedido o quieres asesoría personalizada?
          Escríbenos por WhatsApp y te respondemos directo.
        </p>

        <a
          href={DIRECT_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <span className="contact-card__icon">
            <WhatsappIcon />
          </span>
          <span>
            <span className="contact-card__label">Escríbenos por WhatsApp</span>
            <span className="contact-card__value">{DISPLAY_NUMBER}</span>
          </span>
        </a>

        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="contact-form__title">O envíanos un mensaje</p>

          <label className="contact-form__field">
            <span>Nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </label>

          <label className="contact-form__field">
            <span>Mensaje</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntanos en qué te ayudamos"
              rows={4}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary">
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
