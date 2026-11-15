import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Container from "../common/Container/Container";
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
  const location = useLocation();

  useEffect(() => {
    setIsUserMenuOpen(false);
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
    <header className={`header header--${theme}`}>
      <Container variant="hero">
        <div className="header__surface">
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
              <div className="header__user">
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
                        <use href="/images/sprite.svg#icon-avatar-arrow-up-right18x18" />
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
                className={`header__burger ${isMenuOpen ? "is-open" : ""}`}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <span />
                <span />
              </button>
            )}
          </div>

          <div className={`header__mobile-menu ${isMenuOpen ? "is-open" : ""}`}>
            <nav
              className="header__mobile-navigation"
              aria-label="Mobile navigation"
            >
              <NavLink to="/" end onClick={closeMenu}>
                Home
              </NavLink>

              <NavLink to="/recipe/add" onClick={closeMenu}>
                Add recipe
              </NavLink>

              {!isAuthenticated ? (
                <>
                  <button type="button" onClick={() => handleAuth("signin")}>
                    Sign in
                  </button>

                  <button type="button" onClick={() => handleAuth("signup")}>
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  <Link to="/user" onClick={closeMenu}>
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onLogout?.();
                    }}
                  >
                    Log out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
