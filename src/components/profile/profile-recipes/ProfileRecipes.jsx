import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getOwnRecipes, deleteRecipe } from "../../../services/api/recipesApi";
import RecipeListItem from "../list-items/RecipeListItem";
import Pagination from "../../shared/pagination/Pagination";
import EmptyState from "../../shared/empty-state/EmptyState";

const RECIPES_PER_PAGE = 9;

function ProfileRecipes({ onProfileUpdate }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingRecipeId, setDeletingRecipeId] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const deletingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const fetchRecipes = async () => {
      try {
        setIsLoadingRecipes(true);
        setError(null);

        const response = await getOwnRecipes({
          page: currentPage,
          limit: RECIPES_PER_PAGE,
        });

        if (!isActive) return;

        const ownRecipes = response.data ?? response.recipes ?? [];
        const pagination = response.pagination;

        const nextTotalPages = pagination?.totalPages ?? 0;

        if (nextTotalPages > 0 && currentPage > nextTotalPages) {
          setCurrentPage(nextTotalPages);
          return;
        }

        setRecipes(Array.isArray(ownRecipes) ? ownRecipes : []);
        setTotalPages(nextTotalPages);
      } catch (err) {
        if (!isActive) return;

        setRecipes([]);
        setTotalPages(0);
        setError(err.response?.data?.message || "Failed to load your recipes.");
      } finally {
        if (isActive) {
          setIsLoadingRecipes(false);
        }
      }
    };

    fetchRecipes();

    return () => {
      isActive = false;
    };
  }, [currentPage, refreshKey]);

  const handleDeleteRecipe = async (recipe) => {
    if (deletingRef.current) return;

    deletingRef.current = true;
    setDeletingRecipeId(recipe.id);

    try {
      await deleteRecipe(recipe.id);

      toast.success("Recipe deleted successfully.");
      onProfileUpdate?.();

      if (recipes.length === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else {
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete the recipe.",
      );
    } finally {
      deletingRef.current = false;
      setDeletingRecipeId(null);
    }
  };

  return (
    <section className="user-page__section">
      {isLoadingRecipes ? (
        <p className="user-page__message">Loading recipes...</p>
      ) : error ? (
        <p className="user-page__message" role="alert">
          {error}
        </p>
      ) : recipes.length > 0 ? (
        <ul className="user-page__recipe-list">
          {recipes.map((recipe) => (
            <RecipeListItem
              key={recipe.id}
              recipe={recipe}
              onRemove={handleDeleteRecipe}
              showRemoveButton
              isRemoving={deletingRecipeId === recipe.id}
            />
          ))}
        </ul>
      ) : (
        <EmptyState type="recipes" />
      )}

      {!isLoadingRecipes && !error && recipes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default ProfileRecipes;
