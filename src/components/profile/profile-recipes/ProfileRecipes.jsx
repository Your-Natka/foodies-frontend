import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getOwnRecipes, deleteRecipe } from "../../../services/api/recipesApi";
import RecipeListItem from "../list-items/RecipeListItem";
import Pagination from "../../shared/pagination/Pagination";
import EmptyState from "../../shared/empty-state/EmptyState";

const RECIPES_PER_PAGE = 9;

function ProfileRecipes({ onProfileUpdate, getCachedData, setCachedData }) {
  const [currentPage, setCurrentPage] = useState(1);

  const [recipes, setRecipes] = useState(
    () => getCachedData("recipes", 1)?.recipes ?? [],
  );

  const [totalPages, setTotalPages] = useState(
    () => getCachedData("recipes", 1)?.totalPages ?? 0,
  );

  const [isLoadingRecipes, setIsLoadingRecipes] = useState(
    () => !getCachedData("recipes", 1),
  );

  const [deletingRecipeId, setDeletingRecipeId] = useState(null);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const deletingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const fetchRecipes = async () => {
      const cachedData = getCachedData("recipes", currentPage);

      if (cachedData) {
        setRecipes(cachedData.recipes);
        setTotalPages(cachedData.totalPages);
        setIsLoadingRecipes(false);
      } else {
        setIsLoadingRecipes(true);
      }

      setError(null);

      try {
        const response = await getOwnRecipes({
          page: currentPage,
          limit: RECIPES_PER_PAGE,
        });

        if (!isActive) return;

        const ownRecipes = response.data ?? response.recipes ?? [];
        const nextRecipes = Array.isArray(ownRecipes) ? ownRecipes : [];
        const nextTotalPages = response.pagination?.totalPages ?? 0;

        if (currentPage > 1 && currentPage > nextTotalPages) {
          setCurrentPage(Math.max(1, nextTotalPages));
          return;
        }

        setRecipes(nextRecipes);
        setTotalPages(nextTotalPages);

        setCachedData("recipes", currentPage, {
          recipes: nextRecipes,
          totalPages: nextTotalPages,
        });
      } catch (err) {
        if (!isActive) return;

        setError(err.response?.data?.message || "Failed to load your recipes.");
      } finally {
        if (isActive) {
          setIsLoadingRecipes(false);
        }
      }
    };

    void fetchRecipes();

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

      const updatedRecipes = recipes.filter(
        (item) => String(item.id) !== String(recipe.id),
      );

      setRecipes(updatedRecipes);

      setCachedData("recipes", currentPage, {
        recipes: updatedRecipes,
        totalPages,
      });

      onProfileUpdate?.();

      if (updatedRecipes.length === 0 && currentPage > 1) {
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
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default ProfileRecipes;
