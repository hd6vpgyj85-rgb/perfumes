import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../../data/navigation";
import { useCart } from "../../context/CartContext";
import { SearchOverlay } from "./SearchOverlay";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "../common/icons";
import "./Header.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="container header__inner">
          <button
            className="header__menu-btn"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon />
          </button>

          <nav className="header__nav">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="header__nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          <Link to="/" className="header__logo">
            AURUM
          </Link>

          <div className="header__actions">
            <button
              className="header__icon-btn"
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <button className="header__icon-btn header__icon-btn--desktop" aria-label="Mi cuenta">
              <UserIcon />
            </button>
            <button className="header__icon-btn header__icon-btn--desktop" aria-label="Favoritos">
              <HeartIcon />
            </button>
            <button
              className="header__icon-btn header__cart-btn"
              aria-label="Carrito"
              onClick={openDrawer}
            >
              <BagIcon />
              {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__top">
          <span className="header__logo">AURUM</span>
          <button
            className="header__icon-btn"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="mobile-menu__nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu__link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mobile-menu__footer">
          <button className="header__icon-btn" aria-label="Mi cuenta">
            <UserIcon />
          </button>
          <button className="header__icon-btn" aria-label="Favoritos">
            <HeartIcon />
          </button>
          <button
            className="header__icon-btn"
            aria-label="Buscar"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <SearchIcon />
          </button>
          <button
            className="header__icon-btn"
            aria-label="Carrito"
            onClick={() => {
              setMenuOpen(false);
              openDrawer();
            }}
          >
            <BagIcon />
            {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
          </button>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
