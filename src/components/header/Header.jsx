import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
                to="/add"
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
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="header__avatar" />
                  ) : (
                    <span className="header__avatar-placeholder">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  )}

                  <span className="header__user-name">{userName}</span>
                  <span className="header__user-arrow">
                    {isUserMenuOpen ? "⌃" : "⌄"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="header__user-dropdown">
                    <Link
                      to="/user"
                      className="header__dropdown-link"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>

                    <button
                      type="button"
                      className="header__dropdown-link"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout?.();
                      }}
                    >
                      Log out
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

              <NavLink to="/add" onClick={closeMenu}>
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
