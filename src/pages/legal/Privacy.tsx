import { LegalPage } from "../../components/common/LegalPage";

export function Privacy() {
  return (
    <LegalPage
      title="Política de Privacidad"
      updated="septiembre de 2026"
      sections={[
        {
          heading: "1. Información que recopilamos",
          paragraphs: [
            "En AURUM recopilamos únicamente la información necesaria para atenderte: nombre, número de WhatsApp y, cuando aplica, dirección de envío. Esta información nos la compartes directamente al hacer un pedido o al escribirnos.",
          ],
        },
        {
          heading: "2. Uso de tu información",
          paragraphs: ["Usamos tus datos para:"],
          list: [
            "Procesar y confirmar tus pedidos",
            "Coordinar el envío de tus productos",
            "Brindarte atención y soporte cuando nos contactas",
            "Mejorar nuestro catálogo y la experiencia del sitio",
          ],
        },
        {
          heading: "3. Con quién compartimos tu información",
          paragraphs: [
            "No vendemos ni rentamos tu información personal a terceros. Solo la compartimos con proveedores de paquetería, y únicamente los datos necesarios para completar la entrega de tu pedido.",
          ],
        },
        {
          heading: "4. Cookies",
          paragraphs: [
            "Nuestro sitio utiliza cookies esenciales para el funcionamiento del carrito de compras. Puedes conocer más detalles en nuestra Política de Cookies.",
          ],
        },
        {
          heading: "5. Tus derechos",
          paragraphs: [
            "Puedes solicitar en cualquier momento el acceso, rectificación o eliminación de tu información personal escribiéndonos por WhatsApp. Atenderemos tu solicitud a la brevedad posible.",
          ],
        },
        {
          heading: "6. Contacto",
          paragraphs: [
            "Si tienes dudas sobre esta política de privacidad, escríbenos por WhatsApp desde nuestra página de Contacto.",
          ],
        },
      ]}
    />
  );
}
