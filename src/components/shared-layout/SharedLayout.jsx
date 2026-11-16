import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import SignInModal from "../auth/sign-in-modal/SignInModal";
import SignUpModal from "../auth/sign-up-modal/SignUpModal";
import LogoutModal from "../auth/logout-modal/LogoutModal";

import {
  selectUser,
  selectIsAuthenticated,
  selectIsSessionChecked,
} from "../../redux/slices/auth/authSlice";

function SharedLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSessionChecked = useSelector(selectIsSessionChecked);

  const [activeModal, setActiveModal] = useState(null);
  const [pendingRedirect, setPendingRedirect] = useState(null);

  const darkPages = ["/", "/categories/desserts"];
  const theme = darkPages.includes(pathname) ? "dark" : "light";

  useEffect(() => {
    const redirectFrom = location.state?.from;

    if (
      isSessionChecked &&
      !isAuthenticated &&
      pathname === "/" &&
      redirectFrom
    ) {
      setPendingRedirect(redirectFrom);
      setActiveModal("signin");

      navigate(
        {
          pathname,
          search: location.search,
          hash: location.hash,
        },
        { replace: true, state: null },
      );
    }
  }, [
    isSessionChecked,
    isAuthenticated,
    pathname,
    location.state,
    location.search,
    location.hash,
    navigate,
  ]);

  const closeModal = () => {
    setActiveModal(null);
    setPendingRedirect(null);
  };

  // Спільна логіка після успішного входу або реєстрації.
  const handleAuthSuccess = () => {
    setActiveModal(null);

    if (pendingRedirect) {
      navigate(
        {
          pathname: pendingRedirect.pathname,
          search: pendingRedirect.search || "",
          hash: pendingRedirect.hash || "",
        },
        { replace: true },
      );
    }

    setPendingRedirect(null);
  };

  const openSignIn = () => setActiveModal("signin");
  const openSignUp = () => setActiveModal("signup");

  const switchToSignUp = () => setActiveModal("signup");
  const switchToSignIn = () => setActiveModal("signin");

  const handleLogout = () => {
    setActiveModal("logout");
  };

  return (
    <div className="app-layout">
      <Header
        theme={theme}
        isAuthenticated={isAuthenticated}
        userName={user?.name || "User"}
        avatarUrl={user?.avatar || ""}
        authMode={activeModal === "signup" ? "signup" : "signin"}
        onSignIn={openSignIn}
        onSignUp={openSignUp}
        onLogout={handleLogout}
      />

      <Outlet context={{ onLogout: handleLogout }} />

      <Footer theme={theme} />

      <SignInModal
        isOpen={activeModal === "signin"}
        onClose={closeModal}
        onSuccess={handleAuthSuccess}
        onSwitchToSignUp={switchToSignUp}
      />

      <SignUpModal
        isOpen={activeModal === "signup"}
        onClose={closeModal}
        onSuccess={handleAuthSuccess}
        onSwitchToSignIn={switchToSignIn}
      />

      <LogoutModal isOpen={activeModal === "logout"} onClose={closeModal} />
    </div>
  );
}

export default SharedLayout;