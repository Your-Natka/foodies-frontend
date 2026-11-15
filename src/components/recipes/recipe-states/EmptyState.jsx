import css from "./EmptyState.module.scss";

const EmptyState = ({ hasIngredientFilter, hasAreaFilter, onClearFilters }) => {
  const getMessage = () => {
    if (hasIngredientFilter) {
      return "We couldn't find recipes with this ingredient in this category.";
    }

    if (hasAreaFilter) {
      return "We couldn't find recipes from this area in this category.";
    }

    return "No recipes found in this category.";
  };

  const hasActiveFilters = hasIngredientFilter || hasAreaFilter;

  return (
    <div className={css.emptyState}>
      <div className={css.illustration} aria-hidden="true">
        🍽️
      </div>

      <h2 className={css.title}>No recipes found</h2>

      <p className={css.description}>{getMessage()}</p>

      <p className={css.hint}>
        Try selecting another option to discover more delicious recipes.
      </p>

      {hasActiveFilters && (
        <button
          className={css.clearButton}
          type="button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;