import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { toast } from "react-toastify";

import {
  clearCurrentRecipe,
  selectCurrentRecipe,
  selectRecipeStatus,
  selectRecipesError,
  selectPopularRecipes,
  selectPopularStatus,
} from "../../redux/slices/recipes/recipesSlice";

import {
  fetchRecipeByIdThunk,
  fetchPopularRecipesThunk,
} from "../../redux/slices/recipes/recipesOperations";

import {
  selectIsAuthenticated,
  selectUser,
} from "../../redux/slices/auth/authSlice";

import {
  addFavoriteThunk,
  removeFavoriteThunk,
} from "../../redux/slices/favorites/favoritesOperations";

import RecipeInfo from "../../components/recipe-details/recipe-info/RecipeInfo";
import RecipeIngredients from "../../components/recipe-details/recipe-ingredients/RecipeIngredients";
import RecipePreparation from "../../components/recipe-details/recipe-preparation/RecipePreparation";
import RecipeFavoriteButton from "../../components/recipe-details/recipe-favorite-button/RecipeFavoriteButton";
import RecipeActions from "../../components/recipe-details/recipe-actions/RecipeActions";
import CookingMode from "../../components/recipe-details/cooking-mode/CookingMode";
import PathInfo from "../../components/recipe-details/path-info/PathInfo";
import PopularRecipes from "../../components/recipes/popular-recipes/PopularRecipes";
import LoadingState from "../../components/recipes/recipe-states/LoadingState";

import css from "./RecipePage.module.scss";

const RecipePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onRequireAuth } = useOutletContext();

  const recipe = useSelector(selectCurrentRecipe);
  const status = useSelector(selectRecipeStatus);
  const error = useSelector(selectRecipesError);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);
  const popularRecipes = useSelector(selectPopularRecipes);
  const popularStatus = useSelector(selectPopularStatus);

  // Cooking mode is tied to a recipe id, so it closes when navigating away.
  const [cookingRecipeId, setCookingRecipeId] = useState(null);
  const closeCookingMode = useCallback(() => setCookingRecipeId(null), []);

  const isOwner =
    Boolean(currentUser?.id) &&
    currentUser.id === (recipe?.owner?.id ?? recipe?.owner?._id);

  const location = useLocation();

  useEffect(() => {
    dispatch(clearCurrentRecipe());
    dispatch(fetchRecipeByIdThunk(id));

    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchPopularRecipesThunk());
  }, [dispatch]);

  const handleEditRecipe = () => {
    navigate(`/recipe/${recipe.id}/edit`);
  };

  // Guest cannot open another user's profile
  const handleAuthorClick = (authorId) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!authorId) return;

    navigate(`/user/${authorId}`);
  };

  const isFavorite = recipe?.isFavorite ?? false;

  const handleToggleFavorite = async (
    recipeId = recipe?.id,
    isRecipeFavorite = recipe?.isFavorite,
  ) => {
    if (!recipeId) return;

    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    try {
      if (isRecipeFavorite) {
        await dispatch(removeFavoriteThunk(recipeId)).unwrap();
        toast.success("Recipe removed from favorites.");
      } else {
        await dispatch(addFavoriteThunk(recipeId)).unwrap();
        toast.success("Recipe added to favorites.");
      }
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to update favorites. Please try again.",
      );
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <main>
        <LoadingState />
      </main>
    );
  }

  if (status === "failed") {
    const isNotFound = error?.toLowerCase().includes("recipe not found");

    return (
      <main>
        <p>
          {isNotFound
            ? "Recipe not found."
            : error || "Something went wrong. Please try again."}
        </p>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main>
        <p>Recipe not found.</p>
      </main>
    );
  }

  return (
    <main className={css.recipePage}>
      <div className="container">
        <PathInfo title={recipe.title} category={recipe.category} />

        <div className={css.recipeInfoWrapper}>
          <RecipeInfo recipe={recipe} onAuthorClick={handleAuthorClick}>
            <RecipeIngredients
              ingredients={recipe.ingredients}
              recipeId={recipe.id}
              recipeTitle={recipe.title}
            />

            <RecipePreparation instructions={recipe.instructions} />

            <div className={`${css.actions} no-print`}>
              <RecipeFavoriteButton
                isFavorite={isFavorite}
                onClick={() => handleToggleFavorite(recipe.id, isFavorite)}
              />

              {isOwner && (
                <button
                  type="button"
                  className={css.editButton}
                  onClick={handleEditRecipe}
                >
                  EDIT RECIPE
                </button>
              )}

              <RecipeActions
                recipe={recipe}
                onStartCooking={() => setCookingRecipeId(recipe.id)}
              />
            </div>
          </RecipeInfo>
        </div>

        <div className={`${css.popularRecipesWrapper} no-print`}>
          {popularStatus === "loading" && <p>Loading popular recipes...</p>}

          {popularStatus === "failed" && <p>Failed to load popular recipes.</p>}

          {popularStatus === "succeeded" && (
            <PopularRecipes
              recipes={popularRecipes}
              onToggleFavorite={handleToggleFavorite}
              onAuthorClick={handleAuthorClick}
            />
          )}
        </div>
      </div>

      {cookingRecipeId === recipe.id && (
        <CookingMode recipe={recipe} onClose={closeCookingMode} />
      )}
    </main>
  );
};

export default RecipePage;
