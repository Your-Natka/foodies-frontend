import { Outlet, useLocation } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";

function SharedLayout() {
  const { pathname } = useLocation();

  const isHomePage = pathname === "/";

  const darkPages = ["/", "/categories/desserts"];
  const theme = darkPages.includes(pathname) ? "dark" : "light";

  return (
    <>
      {!isHomePage && <Header theme={theme} />}

      <Outlet />

      <Footer theme={theme} />
    </>
  );
}

export default SharedLayout;
