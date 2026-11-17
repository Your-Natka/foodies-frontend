import css from "./RecipeInfo.module.scss";

const RecipeInfo = ({ recipe, children, onAuthorClick }) => {
  const { title, description, thumb, category, time, owner } = recipe;

  const authorName = owner?.name || "Unknown author";

  return (
    <section className={css.recipeInfo}>
      <img className={css.image} src={thumb} alt={title} />

      <div className={css.content}>
        <div className={css.details}>
          <h3 className={css.title}>{title}</h3>

          <div className={css.meta}>
            <span className={css.metaItem}>{category}</span>
            <span className={css.metaItem}>{time} min</span>
          </div>

          <p className={css.description}>{description}</p>

          <button
            type="button"
            className={css.author}
            onClick={() => onAuthorClick?.(owner?.id)}
            disabled={!owner?.id}
          >
            {owner?.avatar ? (
              <img className={css.avatar} src={owner.avatar} alt={authorName} />
            ) : (
              <span className={css.avatarFallback}>
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}

            <span className={css.authorInfo}>
              <span className={css.authorLabel}>Created by:</span>
              <span className={css.authorName}>{authorName}</span>
            </span>
          </button>
        </div>

        <div className={css.additionalContent}>{children}</div>
      </div>
    </section>
  );
};

export default RecipeInfo;
