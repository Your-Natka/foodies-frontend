import RecipeCard from "../recipe-card/RecipeCard";

import css from "./PopularRecipes.module.scss";

const PopularRecipes = ({
  recipes = [],
  onToggleFavorite,
  onAuthorClick,
}) => {
  if (!recipes.length) {
    return null;
  }

  return (
    <section className={css.popularRecipes}>
      <h2 className={css.title}>POPULAR RECIPES</h2>

      <ul className={css.list}>
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={recipe.isFavorite}
            onToggleFavorite={onToggleFavorite}
            onAuthorClick={onAuthorClick}
          />
        ))}
      </ul>
    </section>
  );
};

export default PopularRecipes;
