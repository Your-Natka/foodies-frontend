import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import CategoryInfo from "../../recipes/category-info/CategoryInfo";
import RecipeFilters from "../../recipes/recipe-filters/RecipeFilters";
import RecipeList from "../../recipes/recipe-list/RecipeList";
import Pagination from "../../shared/pagination/Pagination";
import LoadingState from "../../recipes/recipe-states/LoadingState";
import EmptyState from "../../recipes/recipe-states/EmptyState";

import SignInModal from "../../auth/sign-in-modal/SignInModal";
import SignUpModal from "../../auth/sign-up-modal/SignUpModal";

import { selectIngredients } from "../../../redux/slices/ingredients/ingredientsSlice";
import { selectAreas } from "../../../redux/slices/areas/areasSlice";

import {
  setRecipesPage,
  selectRecipes,
  selectRecipesStatus,
  selectRecipesError,
  selectRecipesPage,
  selectRecipesTotalPages,
} from "../../../redux/slices/recipes/recipesSlice";

import { fetchRecipesThunk } from "../../../redux/slices/recipes/recipesOperations";
import { fetchIngredientsThunk } from "../../../redux/slices/ingredients/ingredientsOperations";
import { fetchAreasThunk } from "../../../redux/slices/areas/areasOperations";

import { selectIsAuthenticated } from "../../../redux/slices/auth/authSlice";

import {
  selectFavoriteIds,
  clearFavorites,
} from "../../../redux/slices/favorites/favoritesSlice";

import {
  fetchFavoritesThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from "../../../redux/slices/favorites/favoritesOperations";

import css from "./CategoryRecipes.module.scss";

const CATEGORY_DESCRIPTIONS = {
  Dessert:
    "Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.",
  default:
    "Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen.",
};

const CategoryRecipes = ({ categoryName, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recipes = useSelector(selectRecipes);
  const status = useSelector(selectRecipesStatus);
  const error = useSelector(selectRecipesError);
  const page = useSelector(selectRecipesPage);
  const totalPages = useSelector(selectRecipesTotalPages);

  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const favoriteIds = useSelector(selectFavoriteIds);

  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [authModal, setAuthModal] = useState(null);

  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

  const limit = isMobile ? 8 : 12;

  const categoryDescription =
    CATEGORY_DESCRIPTIONS[categoryName] || CATEGORY_DESCRIPTIONS.default;

  // Detect mobile screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleScreenChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  // Reset pagination and filters when category changes
  useEffect(() => {
    dispatch(setRecipesPage(1));
    setSelectedIngredient("");
    setSelectedArea("");
  }, [dispatch, categoryName]);

  // Load ingredients and areas
  useEffect(() => {
    dispatch(fetchIngredientsThunk());
    dispatch(fetchAreasThunk());
  }, [dispatch]);

  // Load recipes for the selected category
  useEffect(() => {
    dispatch(
      fetchRecipesThunk({
        page,
        limit,
        category: categoryName || undefined,
        ingredientId: selectedIngredient || undefined,
        area: selectedArea || undefined,
      }),
    );
  }, [dispatch, page, limit, categoryName, selectedIngredient, selectedArea]);

  // Load favorites for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavoritesThunk({ page: 1, limit: 100 }));
    } else {
      dispatch(clearFavorites());
    }
  }, [dispatch, isAuthenticated]);

  // Guest cannot open another user's profile
  const handleAuthorClick = (authorId) => {
    if (!isAuthenticated) {
      setAuthModal("signIn");
      return;
    }

    if (!authorId) return;

    navigate(`/user/${authorId}`);
  };

  const handlePageChange = (nextPage) => {
    dispatch(setRecipesPage(nextPage));
  };

  const handleIngredientChange = (value) => {
    setSelectedIngredient(value);
    dispatch(setRecipesPage(1));
  };

  const handleAreaChange = (value) => {
    setSelectedArea(value);
    dispatch(setRecipesPage(1));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedIngredient("");
    setSelectedArea("");
    dispatch(setRecipesPage(1));
  };

  // Guest must sign in to add or remove favorites
  const handleToggleFavorite = async (recipeId) => {
    if (!isAuthenticated) {
      setAuthModal("signIn");
      return;
    }

    try {
      if (favoriteIds.includes(recipeId)) {
        await dispatch(removeFavoriteThunk(recipeId)).unwrap();
      } else {
        await dispatch(addFavoriteThunk(recipeId)).unwrap();
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to update favorites. Please try again.",
      );
    }
  };

  return (
    <section className={css.categorySection}>
      <div className="container">
        <CategoryInfo
          title={categoryName}
          description={categoryDescription}
          onBack={onBack}
        />

        <div className={css.catalog}>
          <aside className={css.sidebar}>
            <RecipeFilters
              ingredients={ingredients}
              areas={areas}
              selectedIngredient={selectedIngredient}
              selectedArea={selectedArea}
              onIngredientChange={handleIngredientChange}
              onAreaChange={handleAreaChange}
            />
          </aside>

          <div className={css.content}>
            {status === "loading" && <LoadingState />}

            {status === "failed" && (
              <p role="alert">
                {error || "Something went wrong. Please try again."}
              </p>
            )}

            {status === "succeeded" && recipes.length === 0 && (
              <EmptyState
                hasIngredientFilter={Boolean(selectedIngredient)}
                hasAreaFilter={Boolean(selectedArea)}
                onClearFilters={handleClearFilters}
              />
            )}

            {status === "succeeded" && recipes.length > 0 && (
              <RecipeList
                recipes={recipes}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onAuthorClick={handleAuthorClick}
              />
            )}

            {status === "succeeded" && totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <SignInModal
        isOpen={authModal === "signIn"}
        onClose={() => setAuthModal(null)}
        onSwitchToSignUp={() => setAuthModal("signUp")}
      />

      <SignUpModal
        isOpen={authModal === "signUp"}
        onClose={() => setAuthModal(null)}
        onSwitchToSignIn={() => setAuthModal("signIn")}
      />
    </section>
  );
};

export default CategoryRecipes;