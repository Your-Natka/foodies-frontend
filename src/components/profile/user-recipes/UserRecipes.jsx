import RecipeListItem from "../list-items/RecipeListItem";
import EmptyState from "../../shared/empty-state/EmptyState";

function UserRecipes({ recipes = [] }) {
  return (
    <section className="user-page__section">
      {recipes.length > 0 ? (
        <ul className="user-page__recipe-list">
          {recipes.map((recipe) => (
            <RecipeListItem
              key={recipe.id}
              recipe={recipe}
              showRemoveButton={false}
            />
          ))}
        </ul>
      ) : (
        <EmptyState type="recipes" />
      )}
    </section>
  );
}

export default UserRecipes;
