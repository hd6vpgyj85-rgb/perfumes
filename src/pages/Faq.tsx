import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../components/common/icons";
import "./Faq.css";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "¿Los perfumes son originales?",
    answer:
      "Sí. Todos nuestros perfumes son 100% originales, sellados de fábrica y con garantía de autenticidad.",
  },
  {
    question: "¿Cómo hago un pedido?",
    answer:
      "Agrega los productos que quieras al carrito y presiona 'Finalizar pedido por WhatsApp'. Te atenderemos directo por chat para confirmar disponibilidad, envío y pago.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "El método de pago se acuerda directamente por WhatsApp al confirmar tu pedido (transferencia, tarjeta o efectivo, según tu ubicación).",
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Los tiempos varían según tu ubicación. Al confirmar tu pedido por WhatsApp te daremos un estimado exacto.",
  },
  {
    question: "¿Puedo cambiar o devolver un producto?",
    answer:
      "Por higiene y seguridad, solo aceptamos cambios o devoluciones si el producto llega dañado o es distinto al solicitado. Escríbenos dentro de las 48 horas posteriores a la entrega.",
  },
  {
    question: "¿Tienen cupones de descuento?",
    answer:
      "Sí, cuando tengas un código de descuento puedes aplicarlo directamente en el carrito antes de finalizar tu pedido.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="faq-page">
      <div className="container faq-page__inner">
        <p className="eyebrow">Ayuda</p>
        <h1 className="faq-page__title">Preguntas Frecuentes</h1>
        <p className="faq-page__intro">
          ¿No encuentras lo que buscas?{" "}
          <Link to="/contact">Escríbenos por WhatsApp</Link>.
        </p>

        <div className="faq-list">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__question"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronRightIcon className="faq-item__chevron" />
                </button>
                {isOpen && <p className="faq-item__answer">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
