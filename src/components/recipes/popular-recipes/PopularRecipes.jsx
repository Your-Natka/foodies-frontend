import RecipeCard from '../recipe-card/RecipeCard';

import css from './PopularRecipes.module.scss';

const PopularRecipes = ({
  recipes = [],
  favoriteIds = [],
  onToggleFavorite,
}) => {
  if (!recipes.length) {
    return null;
  }

  return (
    <section className={css.popularRecipes}>
      <h3 className={css.title}>POPULAR RECIPES</h3>

      <ul className={css.list}>
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favoriteIds.includes(recipe.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </ul>
    </section>
  );
};

export default PopularRecipes;