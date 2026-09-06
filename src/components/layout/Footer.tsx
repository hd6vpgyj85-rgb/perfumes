import { Link } from "react-router-dom";
import { InstagramIcon, TiktokIcon, WhatsappIcon } from "../common/icons";
import { buildWhatsAppUrl } from "../../lib/whatsapp";
import "./Footer.css";

const FOOTER_WHATSAPP_URL = buildWhatsAppUrl("¡Hola! Tengo una pregunta sobre AURUM.");

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <span className="footer__logo">AURUM</span>
          <p className="footer__tagline">
            Perfumería premium: fragancias árabes, de diseñador y de nicho,
            reunidas bajo una misma firma de lujo.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" className="footer__social-link">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="TikTok" className="footer__social-link">
              <TiktokIcon />
            </a>
            <a
              href={FOOTER_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="footer__social-link"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>

        <nav className="footer__col">
          <h4 className="footer__col-title">Tienda</h4>
          <a href="#categorias">Perfumes Árabes</a>
          <a href="#categorias">Diseñador</a>
          <a href="#categorias">Nicho</a>
          <a href="#destacados">Novedades</a>
        </nav>

        <nav className="footer__col">
          <h4 className="footer__col-title">Ayuda</h4>
          <Link to="/contact">Contacto</Link>
          <a href="#">Preguntas Frecuentes</a>
        </nav>

        <nav className="footer__col">
          <h4 className="footer__col-title">Legal</h4>
          <Link to="/privacy">Privacidad</Link>
          <Link to="/cookies">Cookies</Link>
          <Link to="/terms">Términos</Link>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} AURUM. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
