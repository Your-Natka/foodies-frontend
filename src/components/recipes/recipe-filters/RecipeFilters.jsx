
import css from './RecipeFilters.module.scss';

const RecipeFilters = ({
  ingredients = [],
  areas = [],
  selectedIngredient = '',
  selectedArea = '',
  onIngredientChange,
  onAreaChange,
}) => {
  return (
    <div className={css.filters}>
      <label className={css.filter}>
        <span className={css.visuallyHidden}>Ingredients</span>

        <div className={css.selectWrapper}>
          <select
            className={`${css.select} ${!selectedIngredient ? css.placeholder : ''}`}
            value={selectedIngredient}
            onChange={event => onIngredientChange?.(event.target.value)}
          >
            <option value="">Ingredients</option>

            {ingredients.map(ingredient => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>

          <svg className={css.chevron} aria-hidden="true">
            <use href="/images/sprite.svg#icon-chevron-down-food" />
          </svg>
        </div>
      </label>

      <label className={css.filter}>
        <span className={css.visuallyHidden}>Area</span>

        <div className={css.selectWrapper}>
          <select
            className={`${css.select} ${!selectedArea ? css.placeholder : ''}`}
            value={selectedArea}
            onChange={event => onAreaChange?.(event.target.value)}
          >
            <option value="">Area</option>

            {areas.map(area => (
              <option key={area.id} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>

          <svg className={css.chevron} aria-hidden="true">
            <use href="/images/sprite.svg#icon-chevron-down-food" />
          </svg>
        </div>
      </label>
    </div>
  );
};

export default RecipeFilters;
