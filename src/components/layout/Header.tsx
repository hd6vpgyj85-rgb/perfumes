import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../../data/navigation";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
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
  const { itemCount: favoritesCount } = useWishlist();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useBodyScrollLock(menuOpen || searchOpen);

  return (
    <>
      <header className={`header ${scrolled || !isHome ? "header--scrolled" : ""}`}>
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
              <Link key={link.label} to={link.href} className="header__nav-link">
                {link.label}
              </Link>
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
            <Link
              to="/favoritos"
              className="header__icon-btn header__icon-btn--desktop header__cart-btn"
              aria-label="Favoritos"
            >
              <HeartIcon />
              {favoritesCount > 0 && <span className="header__cart-count">{favoritesCount}</span>}
            </Link>
            <button
              className="header__icon-btn header__cart-btn"
              aria-label="Carrito"
              onClick={openDrawer}
            >
              <BagIcon />
              {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
            </button>
            <Link
              to="/admin"
              className="header__icon-btn header__icon-btn--desktop"
              aria-label="Panel Administrativo"
            >
              <UserIcon />
            </Link>
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
            <Link
              key={link.label}
              to={link.href}
              className="mobile-menu__link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu__footer">
          <Link
            to="/favoritos"
            className="header__icon-btn header__cart-btn"
            aria-label="Favoritos"
            onClick={() => setMenuOpen(false)}
          >
            <HeartIcon />
            {favoritesCount > 0 && <span className="header__cart-count">{favoritesCount}</span>}
          </Link>
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
          <Link
            to="/admin"
            className="header__icon-btn"
            aria-label="Panel Administrativo"
            onClick={() => setMenuOpen(false)}
          >
            <UserIcon />
          </Link>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
