import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

import CategoryInfo from "../../recipes/category-info/CategoryInfo";
import RecipeFilters from "../../recipes/recipe-filters/RecipeFilters";
import RecipeList from "../../recipes/recipe-list/RecipeList";
import Pagination from "../../shared/pagination/Pagination";
import LoadingState from "../../recipes/recipe-states/LoadingState";
import EmptyState from "../../recipes/recipe-states/EmptyState";

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
  Beef: "Discover the rich flavors of beef, where every dish brings together hearty ingredients, bold aromas, and unforgettable culinary experiences.",

  Breakfast:
    "Start your day with inspiration, where every breakfast is a delicious opportunity to enjoy fresh flavors and create beautiful morning moments.",

  Chicken:
    "Explore the endless possibilities of chicken recipes, where tender textures, aromatic spices, and creative combinations turn every meal into something special.",

  Dessert:
    "Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.",

  Desserts:
    "Go on a taste journey, where every sip is a sophisticated creative chord, and every dessert is an expression of the most refined gastronomic desires.",

  Goat: "Discover the distinctive taste of goat dishes, where traditional cooking meets rich aromas and unique flavors worth exploring.",

  Lamb: "Immerse yourself in the world of lamb recipes, where delicate textures, aromatic herbs, and rich flavors create truly memorable dishes.",

  Miscellaneous:
    "Step beyond the ordinary and explore a collection of unexpected culinary creations, where every recipe brings a new flavor and inspiration.",

  Pasta:
    "Enter the world of pasta, where Italian inspiration, delicious sauces, and endless combinations turn simple ingredients into extraordinary meals.",

  Pork: "Discover the versatility of pork, where juicy textures, rich flavors, and creative cooking ideas bring warmth and satisfaction to every table.",

  Seafood:
    "Dive into the world of seafood, where fresh ocean flavors, delicate textures, and elegant combinations create unforgettable culinary moments.",

  Side: "Complete every meal with inspiring side dishes, where fresh ingredients and thoughtful combinations bring harmony to your plate.",

  Soup: "Warm your soul with comforting soups, where wholesome ingredients, rich broths, and aromatic flavors create the perfect balance in every spoonful.",

  Starter:
    "Begin your culinary experience with inspiring starters, where small creations deliver extraordinary flavors and make every meal more special.",

  Vegan:
    "Explore plant-based creativity, where fresh vegetables, vibrant ingredients, and innovative combinations make every dish a celebration of flavor.",

  Vegetarian:
    "Celebrate the beauty of vegetarian cooking, where seasonal ingredients, colorful vegetables, and creative recipes turn every meal into a delightful experience.",

  default:
    "Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen.",
};

const CategoryRecipes = ({ categoryName, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onRequireAuth } = useOutletContext();

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
      onRequireAuth();
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
      onRequireAuth();
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
    </section>
  );
};

export default CategoryRecipes;
