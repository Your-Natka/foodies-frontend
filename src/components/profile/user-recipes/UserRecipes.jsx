import { useEffect, useState } from "react";

import RecipeListItem from "../list-items/RecipeListItem";
import EmptyState from "../../shared/empty-state/EmptyState";
import Pagination from "../../shared/pagination/Pagination";

const RECIPES_PER_PAGE = 9;

function UserRecipes({ recipes = [], userId }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [userId]);

  const totalPages = Math.ceil(recipes.length / RECIPES_PER_PAGE);

  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;

  const visibleRecipes = recipes.slice(
    startIndex,
    startIndex + RECIPES_PER_PAGE,
  );

  return (
    <section className="user-page__section">
      {recipes.length > 0 ? (
        <>
          <ul className="user-page__recipe-list">
            {visibleRecipes.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                recipe={recipe}
                showRemoveButton={false}
              />
            ))}
          </ul>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState type="recipes" />
      )}
    </section>
  );
}

export default UserRecipes;
