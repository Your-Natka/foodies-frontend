import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="footer__logo" aria-label="Foodies home">
      foodies
    </Link>
  );
}

export default Logo;
