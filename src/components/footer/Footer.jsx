import Container from "../common/Container/Container";
import Logo from "./Logo";
import NetworkLinks from "./NetworkLinks";
import Copyright from "./Copyright";
import InstallAppButton from "../pwa/InstallAppButton";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="footer__top">
          <Logo />
          <InstallAppButton className="footer__install" />
          <NetworkLinks />
        </div>

        <div className="footer__divider" />

        <Copyright />
      </Container>
    </footer>
  );
}

export default Footer;
