import RecipeCard from '../recipe-card/RecipeCard';
import recipesMock from '../../../data/recipesMock';
import css from './RecipeList.module.scss';

const RecipeList = ({
    recipes = recipesMock,
    favoriteIds = [],
    onToggleFavorite,
}) => {
    return (
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
    );
};

export default RecipeList;