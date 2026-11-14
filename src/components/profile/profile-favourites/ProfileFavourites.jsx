import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  getFavoriteRecipes,
  removeFavoriteRecipe,
} from "../../../services/api/recipesApi";
import RecipeListItem from "../list-items/RecipeListItem";
import Pagination from "../../shared/pagination/Pagination";
import EmptyState from "../../shared/empty-state/EmptyState";

const RECIPES_PER_PAGE = 9;

function ProfileFavourites({ onProfileUpdate }) {
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [removingFavoriteId, setRemovingFavoriteId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const removingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getFavoriteRecipes({
          page: currentPage,
          limit: RECIPES_PER_PAGE,
        });

        if (!isActive) return;

        const favoriteRecipes = response.data ?? [];
        const nextTotalPages = response.pagination?.totalPages ?? 0;

        if (nextTotalPages > 0 && currentPage > nextTotalPages) {
          setCurrentPage(nextTotalPages);
          return;
        }

        setFavorites(Array.isArray(favoriteRecipes) ? favoriteRecipes : []);
        setTotalPages(nextTotalPages);
      } catch (err) {
        if (!isActive) return;

        setFavorites([]);
        setTotalPages(0);
        setError(
          err.response?.data?.message ||
            "Failed to load your favourite recipes.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchFavorites();

    return () => {
      isActive = false;
    };
  }, [currentPage, refreshKey]);

  const handleRemoveFavorite = async (recipe) => {
    if (removingRef.current) return;

    removingRef.current = true;
    setRemovingFavoriteId(recipe.id);

    try {
      await removeFavoriteRecipe(recipe.id);

      toast.success("Recipe removed from favourites.");
      onProfileUpdate?.();

      if (favorites.length === 1 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else {
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to remove recipe from favourites.",
      );
    } finally {
      removingRef.current = false;
      setRemovingFavoriteId(null);
    }
  };

  return (
    <section className="user-page__section">
      {isLoading ? (
        <p className="user-page__message">Loading favourites...</p>
      ) : error ? (
        <p className="user-page__message" role="alert">
          {error}
        </p>
      ) : favorites.length > 0 ? (
        <ul className="user-page__recipe-list">
          {favorites.map((recipe) => (
            <RecipeListItem
              key={recipe.id}
              recipe={recipe}
              onRemove={handleRemoveFavorite}
              removeLabel="Remove from favourites"
              showRemoveButton
              isRemoving={removingFavoriteId === recipe.id}
            />
          ))}
        </ul>
      ) : (
        <EmptyState type="favorites" />
      )}

      {!isLoading && !error && favorites.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default ProfileFavourites;
