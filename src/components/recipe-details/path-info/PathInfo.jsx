import { Link } from "react-router-dom";
import css from "./PathInfo.module.scss";

const PathInfo = ({ title, category }) => {
  return (
    <nav className={css.breadcrumbs}>
      <Link to="/" className={css.link}>
        HOME
      </Link>

      <span className={css.separator}>/</span>

      {category && (
        <>
          <Link
            to="/"
            state={{ selectedCategory: category }}
            className={css.link}
          >
            {category}
          </Link>

          <span className={css.separator}>/</span>
        </>
      )}

      <span className={css.current}>{title}</span>
    </nav>
  );
};

export default PathInfo;
