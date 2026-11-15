import css from "./CategoryInfo.module.scss";

const CategoryInfo = ({ title, description, onBack }) => {
  return (
    <section className={css.categoryInfo}>
      <button
        type="button"
        onClick={onBack}
        className={css.backLink}
        aria-label="Back to categories"
      >
        <svg className={css.backIcon} viewBox="0 0 32 32" aria-hidden="true">
          <use href="/icons.svg#icon-arrow-back" />
        </svg>

        <span>BACK</span>
      </button>

      <h2 className={css.title}>{title}</h2>

      {description && <p className={css.description}>{description}</p>}
    </section>
  );
};

export default CategoryInfo;