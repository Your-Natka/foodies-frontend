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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7 17L17 7M8 7h9v9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M8 6V4h8v2M5 6l1 14h12l1-14M10 10v7M14 10v7" />
            </svg>
          </button>
        )}
      </div>
    </li>
  );
}

export default RecipeListItem;
