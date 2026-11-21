import { useNavigate } from "react-router-dom";
import "./RecipeListItem.scss";

function RecipeListItem({
  recipe,
  onOpen,
  onRemove,
  removeLabel = "Remove recipe",
  showRemoveButton = false,
  isRemoving = false,
}) {
  const navigate = useNavigate();

  const {
    id,
    title = "Untitled recipe",
    description = "",
    thumb,
    image,
  } = recipe;

  const imageSrc = thumb || image;

  const handleOpen = () => {
    if (onOpen) {
      onOpen(recipe);
    } else if (id) {
      navigate(`/recipe/${id}`);
    }
  };

  return (
    <li className="recipe-list-item">
      <div className="recipe-list-item__image">
        {imageSrc && (
          <button
            type="button"
            onClick={handleOpen}
            disabled={!onOpen && !id}
            aria-label={`Open ${title}`}
            className="recipe-list-item__image-button"
          >
            <img src={imageSrc} alt={title} loading="lazy" />
          </button>
        )}
      </div>

      <div className="recipe-list-item__content">
        <h3 className="recipe-list-item__title">{title}</h3>

        {description && (
          <p className="recipe-list-item__description">{description}</p>
        )}
      </div>

      <div className="recipe-list-item__actions">
        <button
          type="button"
          className="recipe-list-item__button"
          onClick={handleOpen}
          disabled={!onOpen && !id}
          aria-label={`Open ${title}`}
        >
          <svg width="16" height="16" aria-hidden="true">
            <use href="/images/sprite.svg#icon-arrow-up-right18x18" />
          </svg>
        </button>

        {showRemoveButton && (
          <button
            type="button"
            className="recipe-list-item__button recipe-list-item__button--remove"
            onClick={() => onRemove?.(recipe)}
            disabled={isRemoving || !onRemove}
            aria-label={`${removeLabel}: ${title}`}
            aria-busy={isRemoving}
          >
            <svg width="16" height="16" aria-hidden="true">
              <use href="/images/sprite.svg#icon-trash16x16-food" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}

export default RecipeListItem;
