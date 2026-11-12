import { useState } from "react";
import { useSelector } from "react-redux";

import { useLocation, Outlet } from "react-router-dom";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import SignInModal from "../auth/sign-in-modal/SignInModal";
import SignUpModal from "../auth/sign-up-modal/SignUpModal";
import LogoutModal from "../auth/logout-modal/LogoutModal";

import {
  selectUser,
  selectIsAuthenticated,
} from "../../redux/slices/auth/authSlice";

function SharedLayout() {
  const { pathname } = useLocation();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [activeModal, setActiveModal] = useState(null);

  const darkPages = ["/", "/categories/desserts"];
  const theme = darkPages.includes(pathname) ? "dark" : "light";

  const closeModal = () => setActiveModal(null);

  const openSignIn = () => setActiveModal("signin");
  const openSignUp = () => setActiveModal("signup");

  const switchToSignUp = () => setActiveModal("signup");
  const switchToSignIn = () => setActiveModal("signin");

  const handleLogout = () => {
    setActiveModal("logout");
  };

  return (
    <>
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

      <Outlet />

      <Footer theme={theme} />

      <SignInModal
        isOpen={activeModal === "signin"}
        onClose={closeModal}
        onSwitchToSignUp={switchToSignUp}
      />

      <SignUpModal
        isOpen={activeModal === "signup"}
        onClose={closeModal}
        onSwitchToSignIn={switchToSignIn}
      />

      <LogoutModal isOpen={activeModal === "logout"} onClose={closeModal} />
    </>
  );
}

export default SharedLayout;
