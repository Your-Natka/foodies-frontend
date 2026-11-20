import RecipeCard from "../recipe-card/RecipeCard";
import css from "./RecipeList.module.scss";

const RecipeList = ({
  recipes = [],
  onToggleFavorite,
  onAuthorClick,
}) => {
  return (
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
  );
};

export default RecipeList;
