import "./RecipeListItem.scss";

function RecipeListItem({
  recipe,
  onOpen,
  onRemove,
  removeLabel = "Remove recipe",
  showRemoveButton = false,
  isRemoving = false,
}) {
  return (
    <li className="recipe-list-item">
      <div className="recipe-list-item__image">
        {(recipe.thumb || recipe.image) && (
          <img src={recipe.thumb || recipe.image} alt={recipe.title} />
        )}
      </div>

      <div className="recipe-list-item__content">
        <h3 className="recipe-list-item__title">{recipe.title}</h3>

        <p className="recipe-list-item__description">{recipe.description}</p>
      </div>

      <div className="recipe-list-item__actions">
        <button
          type="button"
          className="recipe-list-item__button"
          onClick={() => onOpen?.(recipe)}
          disabled={!onOpen}
          aria-label={`Open ${recipe.title}`}
        >
          ↗
        </button>

        {showRemoveButton && (
          <button
            type="button"
            className="recipe-list-item__button"
            onClick={() => onRemove?.(recipe)}
            disabled={isRemoving || !onRemove}
            aria-label={`${removeLabel}: ${recipe.title}`}
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
