import { Link, NavLink } from "react-router-dom";
import "./MobileMenu.scss";

function MobileMenu({ isOpen, onClose }) {
  return (
    <div
      className={`mobile-menu ${isOpen ? "is-open" : ""}`}
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile navigation"
    >
      <div className="mobile-menu__header">
        <Link
          to="/"
          className="mobile-menu__logo"
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
        >
          foodies
        </Link>

        <button
          type="button"
          className="mobile-menu__close"
          onClick={onClose}
          aria-label="Close menu"
          tabIndex={isOpen ? 0 : -1}
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <use href="/images/sprite.svg#icon-close24x24" />
          </svg>
        </button>
      </div>

      <div className="mobile-menu__content">
        <nav className="mobile-menu__navigation">
          <NavLink to="/" end onClick={onClose} tabIndex={isOpen ? 0 : -1}>
            Home
          </NavLink>

          <NavLink
            to="/recipe/add"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            Add recipe
          </NavLink>
        </nav>

        <div className="mobile-menu__images" aria-hidden="true">
          <img
            className="mobile-menu__image mobile-menu__image--small"
            src="/images/hero/hero-small-desktop@1.png"
            alt=""
          />

          <img
            className="mobile-menu__image mobile-menu__image--big"
            src="/images/hero/hero-big-desktop@1.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;