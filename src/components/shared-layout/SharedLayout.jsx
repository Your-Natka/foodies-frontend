import { useLocation, Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";

function SharedLayout() {
  const { pathname } = useLocation();

  const darkPages = ["/", "/categories/desserts"];
  const theme = darkPages.includes(pathname) ? "dark" : "light";

  return (
    <>
      <Header theme={theme} />

      <Outlet />

      <Footer theme={theme} />
    </>
  );
}

export default SharedLayout;
