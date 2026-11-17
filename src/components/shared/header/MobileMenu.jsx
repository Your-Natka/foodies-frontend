import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import InstallAppButton from "../../pwa/InstallAppButton";
import { selectShoppingCount } from "../../../redux/slices/shoppingList/shoppingListSlice";
import "./MobileMenu.scss";

function MobileMenu({ isOpen, onClose }) {
  const shoppingCount = useSelector(selectShoppingCount);

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

          <NavLink
            to="/shopping-list"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            Shopping list{shoppingCount > 0 ? ` (${shoppingCount})` : ""}
          </NavLink>

          <InstallAppButton
            className="mobile-menu__install"
            onDone={onClose}
            tabIndex={isOpen ? 0 : -1}
          />
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