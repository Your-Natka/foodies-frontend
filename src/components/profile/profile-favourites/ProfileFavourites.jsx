import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { removeFavoriteThunk } from "../../../redux/slices/favorites/favoritesOperations";
import { getFavoriteRecipes } from "../../../services/api/favoritesApi";
import RecipeListItem from "../list-items/RecipeListItem";
import Pagination from "../../shared/pagination/Pagination";
import EmptyState from "../../shared/empty-state/EmptyState";

const RECIPES_PER_PAGE = 9;

function ProfileFavourites({ onProfileUpdate, getCachedData, setCachedData }) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const [favorites, setFavorites] = useState(
    () => getCachedData("favourites", 1)?.favorites ?? [],
  );

  const [totalPages, setTotalPages] = useState(
    () => getCachedData("favourites", 1)?.totalPages ?? 0,
  );

  const [isLoading, setIsLoading] = useState(
    () => !getCachedData("favourites", 1),
  );
  const [error, setError] = useState(null);

  const [removingFavoriteId, setRemovingFavoriteId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const removingRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    const fetchFavorites = async () => {
      const cachedData = getCachedData("favourites", currentPage);

      if (cachedData) {
        setFavorites(cachedData.favorites);
        setTotalPages(cachedData.totalPages);
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const response = await getFavoriteRecipes({
          page: currentPage,
          limit: RECIPES_PER_PAGE,
        });

        if (!isActive) return;

        const favoriteRecipes = response.data ?? [];
        const nextFavorites = Array.isArray(favoriteRecipes)
          ? favoriteRecipes
          : [];

        const nextTotalPages = response.pagination?.totalPages ?? 0;

        if (currentPage > 1 && currentPage > nextTotalPages) {
          setCurrentPage(Math.max(1, nextTotalPages));
          return;
        }

        setFavorites(nextFavorites);
        setTotalPages(nextTotalPages);

        setCachedData("favourites", currentPage, {
          favorites: nextFavorites,
          totalPages: nextTotalPages,
        });
      } catch (err) {
        if (!isActive) return;

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

    void fetchFavorites();

    return () => {
      isActive = false;
    };
  }, [currentPage, refreshKey]);

  const handleRemoveFavorite = async (recipe) => {
    if (removingRef.current) return;

    removingRef.current = true;
    setRemovingFavoriteId(recipe.id);

    try {
      await dispatch(removeFavoriteThunk(recipe.id)).unwrap();

      toast.success("Recipe removed from favourites.");

      const updatedFavorites = favorites.filter(
        (item) => String(item.id) !== String(recipe.id),
      );

      setFavorites(updatedFavorites);

      setCachedData("favourites", currentPage, {
        favorites: updatedFavorites,
        totalPages,
      });

      onProfileUpdate?.();

      if (updatedFavorites.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      } else {
        setRefreshKey((prevKey) => prevKey + 1);
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to remove recipe from favourites.",
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
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default ProfileFavourites;
