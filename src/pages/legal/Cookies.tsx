import { LegalPage } from "../../components/common/LegalPage";

export function Cookies() {
  return (
    <LegalPage
      title="Política de Cookies"
      updated="septiembre de 2026"
      sections={[
        {
          heading: "1. ¿Qué son las cookies?",
          paragraphs: [
            "Las cookies son pequeños archivos que se guardan en tu navegador y permiten que un sitio web recuerde información sobre tu visita.",
          ],
        },
        {
          heading: "2. Cookies que usamos",
          paragraphs: [
            "En AURUM usamos cookies esenciales, necesarias para que el sitio funcione correctamente:",
          ],
          list: [
            "Carrito de compras: recuerda los productos que agregaste mientras navegas",
            "Preferencias de sesión: mantienen tu experiencia de compra consistente",
          ],
        },
        {
          heading: "3. Cómo controlar las cookies",
          paragraphs: [
            "Puedes eliminar o bloquear las cookies desde la configuración de tu navegador. Ten en cuenta que si desactivas las cookies esenciales, el carrito de compras podría dejar de funcionar correctamente.",
          ],
        },
        {
          heading: "4. Cambios a esta política",
          paragraphs: [
            "Podemos actualizar esta política de cookies ocasionalmente. Cualquier cambio se publicará en esta misma página.",
          ],
        },
      ]}
    />
  );
}
