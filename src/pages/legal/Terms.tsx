import { LegalPage } from "../../components/common/LegalPage";

export function Terms() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      updated="septiembre de 2026"
      sections={[
        {
          heading: "1. Aceptación de los términos",
          paragraphs: [
            "Al usar el sitio web de AURUM y realizar un pedido, aceptas los términos y condiciones descritos a continuación.",
          ],
        },
        {
          heading: "2. Productos y precios",
          paragraphs: [
            "Todos los precios se muestran en dólares estadounidenses (USD) y pueden cambiar sin previo aviso. La disponibilidad de los productos está sujeta a existencias.",
          ],
        },
        {
          heading: "3. Pedidos y pago",
          paragraphs: [
            "Los pedidos se confirman a través de WhatsApp, donde te indicaremos disponibilidad, método de envío y forma de pago. El pedido se considera confirmado una vez acordado el pago.",
          ],
        },
        {
          heading: "4. Envíos",
          paragraphs: [
            "Los tiempos y costos de envío se acuerdan directamente por WhatsApp según tu ubicación. Te mantendremos informado del estado de tu pedido hasta que lo recibas.",
          ],
        },
        {
          heading: "5. Cambios y devoluciones",
          paragraphs: [
            "Por higiene y seguridad, solo aceptamos cambios o devoluciones si el producto llega dañado o es distinto al solicitado. Repórtalo por WhatsApp dentro de las 48 horas posteriores a la entrega.",
          ],
        },
        {
          heading: "6. Propiedad intelectual",
          paragraphs: [
            "El contenido de este sitio, incluyendo textos, imágenes y logotipo, es propiedad de AURUM y no puede reproducirse sin autorización.",
          ],
        },
        {
          heading: "7. Modificaciones",
          paragraphs: [
            "Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor desde su publicación en esta página.",
          ],
        },
        {
          heading: "8. Contacto",
          paragraphs: ["Para cualquier duda sobre estos términos, escríbenos por WhatsApp desde nuestra página de Contacto."],
        },
      ]}
    />
  );
}
