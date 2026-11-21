import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import Section from "../../common/Section/Section";

import { CATEGORY_DESCRIPTIONS } from "../../../constants/recipes";
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
  addFavoriteThunk,
  removeFavoriteThunk,
} from "../../../redux/slices/favorites/favoritesOperations";

import css from "./CategoryRecipes.module.scss";

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

  // Scroll to the top of the section
  const categorySectionRef = useRef(null);

  useEffect(() => {
    const section = categorySectionRef.current;

    if (!section) return;

    requestAnimationFrame(() => {
      section.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });
  }, [categoryName, page]);

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
  const handleToggleFavorite = async (recipeId, isFavorite) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    try {
      if (isFavorite) {
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
    <Section
      className={css.categorySection}
      ref={categorySectionRef}
      data-category-recipes-section
    >
      <div className={css.heroContainer}>
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
    </Section>
  );
};

export default CategoryRecipes;
