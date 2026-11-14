
import { Link } from 'react-router-dom';
import css from './RecipeCard.module.scss';

const RecipeCard = ({
  recipe,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { id, title, description, thumb, owner } = recipe;

  const authorAvatar = owner?.avatar;
  const authorName = owner?.name || 'Unknown author';
  const authorId = owner?.id;
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <li className={css.card}>
      <Link to={`/recipe/${id}`} className={css.recipeLink}>
        <img
          className={css.image}
          src={thumb}
          alt={title}
          loading="lazy"
        />

        <div className={css.content}>
          <h3 className={css.title}>{title}</h3>
          <p className={css.description}>{description}</p>
        </div>
      </Link>

      <div className={css.cardFooter}>
        {authorId ? (
          <Link to={`/user/${authorId}`} className={css.author}>
            {authorAvatar ? (
              <img
                className={css.avatar}
                src={authorAvatar}
                alt={authorName}
              />
            ) : (
              <span className={css.avatarFallback}>
                {authorInitial}
              </span>
            )}

            <span className={css.authorName}>{authorName}</span>
          </Link>
        ) : (
          <div className={css.author}>
            {authorAvatar ? (
              <img
                className={css.avatar}
                src={authorAvatar}
                alt={authorName}
              />
            ) : (
              <span className={css.avatarFallback}>
                {authorInitial}
              </span>
            )}

            <span className={css.authorName}>{authorName}</span>
          </div>
        )}

        <div className={css.actions}>
          <button
            type="button"
            className={`${css.actionButton} ${css.favoriteButton} ${
              isFavorite ? css.isFavorite : ''
            }`}
            aria-label={
              isFavorite
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite?.(id)}
          >
            <svg className={css.icon} aria-hidden="true">
              <use href="/icons.svg#icon-heart" />
            </svg>
          </button>

          <Link
            className={`${css.actionButton} ${css.detailsLink}`}
            to={`/recipe/${id}`}
            aria-label={`View ${title} recipe`}
          >
            <svg className={css.icon} aria-hidden="true">
              <use href="/icons.svg#icon-arrow-up-right" />
            </svg>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default RecipeCard;
