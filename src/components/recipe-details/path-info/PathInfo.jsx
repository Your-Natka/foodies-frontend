import { Link } from 'react-router-dom';
import css from './PathInfo.module.scss';

const PathInfo = ({ title }) => {
  return (
    <nav className={css.breadcrumbs} aria-label="Breadcrumb">
      <Link to="/" className={css.link}>
        HOME
      </Link>

      <span className={css.separator}>/</span>

      <span className={css.current}>{title}</span>
    </nav>
  );
};

export default PathInfo;