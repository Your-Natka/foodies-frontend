
import { Link } from 'react-router-dom';
import css from './CategoryInfo.module.scss';

const CategoryInfo = ({
  title,
  description,
  backLink = '/#categories',
}) => {
  return (
    <section className={css.categoryInfo}>
      <Link to={backLink} className={css.backLink}>
        <svg className={css.backIcon} aria-hidden="true">
          <use href="/icons.svg#icon-arrow-back" />
        </svg>

        <span>BACK</span>
      </Link>

      <h2 className={css.title}>{title}</h2>

      <p className={css.description}>{description}</p>
    </section>
  );
};

export default CategoryInfo;
