import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import Container from "../common/Container/Container";
import MobileMenu from "../shared/header/MobileMenu";
import { selectShoppingCount } from "../../redux/slices/shoppingList/shoppingListSlice";

import "./Header.scss";

function Header({
  theme = "dark",
  isAuthenticated = false,
  userName = "User",
  avatarUrl = "",
  authMode = "signin",
  onSignIn,
  onSignUp,
  onLogout,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [heroRadiusProgress, setHeroRadiusProgress] = useState(0);


  const userMenuRef = useRef(null);
  const headerSurfaceRef = useRef(null);

  const location = useLocation();
  const shoppingCount = useSelector(selectShoppingCount);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  // Закриваємо меню при переході на іншу сторінку
  useEffect(() => {
    if (location.pathname !== "/") {
      setHeroRadiusProgress(0);
      return;
    }

    const hero = document.querySelector(".hero");
    const surface = headerSurfaceRef.current;

    if (!hero || !surface) return;

    const handleScroll = () => {
      const heroRect = hero.getBoundingClientRect();
      const surfaceRect = surface.getBoundingClientRect();

      const progress = heroRect.top <= surfaceRect.bottom - heroRect.height / 2 ? 1 : 0;

      setHeroRadiusProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleAuth = (mode) => {
    closeMenu();

    if (mode === "signin") {
      onSignIn?.();
    } else {
      onSignUp?.();
    }
  };

  return (
    <>
      <header
        className={`header header--${theme} ${isMenuOpen ? "header--menu-open" : ""}`}

      >
        <Container variant="hero">
          <div
            className="header__surface"
            ref={headerSurfaceRef}
            style={{ "--hero-radius": `${heroRadiusProgress * 30}px` }}
          >
            <div className="header__container">
              <Link
                to="/"
                className="header__logo"
                aria-label="Foodies home"
                onClick={closeMenu}
              >
                foodies
              </Link>

              <nav className="header__navigation" aria-label="Main navigation">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/recipe/add"
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Add recipe
                </NavLink>
                <NavLink
                  to="/shopping-list"
                  className={({ isActive }) =>
                    `header__nav-link ${isActive ? "active" : ""}`
                  }
                >
                  Shopping list{shoppingCount > 0 ? ` (${shoppingCount})` : ""}
                </NavLink>
              </nav>

              {!isAuthenticated ? (
                <div className="header__auth" aria-label="Authentication">
                  <button
                    type="button"
                    className={`header__auth-button ${
                      authMode === "signin" ? "is-active" : ""
                    }`}
                    onClick={() => handleAuth("signin")}
                  >
                    Sign in
                  </button>

                  <button
                    type="button"
                    className={`header__auth-button ${
                      authMode === "signup" ? "is-active" : ""
                    }`}
                    onClick={() => handleAuth("signup")}
                  >
                    Sign up
                  </button>
                </div>
              ) : (
                <div className="header__user" ref={userMenuRef}>
                  <button
                    type="button"
                    className="header__user-button"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    aria-expanded={isUserMenuOpen}
                    aria-label="Open user menu"
                  >
                    <img
                      src={avatarUrl || "/images/chef-food.png"}
                      alt=""
                      className="header__avatar"
                    />

                    <span className="header__user-name">{userName}</span>

                    <span
                      className={`header__user-arrow ${
                        isUserMenuOpen ? "is-open" : ""
                      }`}
                    >
                      <svg width="18" height="18" aria-hidden="true">
                        <use href="/images/sprite.svg#icon-chevron-down18x18" />
                      </svg>
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="header__user-dropdown">
                      <Link
                        to="/user"
                        className="header__dropdown-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span>Profile</span>
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="/images/sprite.svg#icon-arrow-up-right18x18" />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        className="header__dropdown-link"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout?.();
                        }}
                      >
                        <span>Log out</span>
                        <svg width="18" height="18" aria-hidden="true">
                          <use href="/images/sprite.svg#icon-arrow-up-right18x18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {isAuthenticated && (
                <button
                  type="button"
                  className="header__burger"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsMenuOpen((prev) => !prev);
                  }}
                  aria-label="Open mobile menu"
                  aria-expanded={isMenuOpen}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <use href="/images/sprite.svg#icon-menu" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </Container>
      </header>

      {isAuthenticated && (
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
      )}
    </>
  );
}

export default Header;
