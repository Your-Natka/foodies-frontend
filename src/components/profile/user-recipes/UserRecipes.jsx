import { useEffect, useState, useRef } from "react";

import { getRecipes } from "../../../services/api/recipesApi";
import RecipeListItem from "../list-items/RecipeListItem";
import EmptyState from "../../shared/empty-state/EmptyState";
import Pagination from "../../shared/pagination/Pagination";

const RECIPES_PER_PAGE = 9;

function UserRecipes({ userId }) {
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const previousPageRef = useRef(page);
  const previousUserIdRef = useRef(userId);

  useEffect(() => {
    const pageChanged = previousPageRef.current !== page;
    const userChanged = previousUserIdRef.current !== userId;

    if (pageChanged && !userChanged) {
      const tabs = document.querySelector(".tabs-list__navigation");

      if (tabs) {
        const top = tabs.getBoundingClientRect().top + window.scrollY - 100;

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    }

    previousPageRef.current = page;
    previousUserIdRef.current = userId;
  }, [page, userId]);

  useEffect(() => {
    setPage(1);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let isActive = true;

    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getRecipes({
          ownerId: userId,
          page,
          limit: RECIPES_PER_PAGE,
        });

        if (!isActive) return;

        const nextRecipes = Array.isArray(response.data) ? response.data : [];

        const nextTotalPages = response.pagination?.totalPages ?? 0;

        if (page > 1 && page > nextTotalPages) {
          setPage(Math.max(1, nextTotalPages));
          return;
        }

        setRecipes(nextRecipes);
        setTotalPages(nextTotalPages);
      } catch (err) {
        if (!isActive) return;

        setError(err.response?.data?.message || "Failed to load user recipes.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void fetchRecipes();

    return () => {
      isActive = false;
    };
  }, [userId, page]);

  return (
    <section className="user-page__section">
      {isLoading ? (
        <p className="user-page__message">Loading recipes...</p>
      ) : error ? (
        <p className="user-page__message" role="alert">
          {error}
        </p>
      ) : recipes.length > 0 ? (
        <>
          <ul className="user-page__recipe-list">
            {recipes.map((recipe) => (
              <RecipeListItem
                key={recipe.id}
                recipe={recipe}
                showRemoveButton={false}
              />
            ))}
          </ul>

          <Pagination
            page={page}
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
