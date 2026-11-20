import { createSlice } from "@reduxjs/toolkit";

import {
  fetchRecipesThunk,
  fetchPopularRecipesThunk,
  fetchRecipeByIdThunk,
} from "./recipesOperations";

import {
  addFavoriteThunk,
  removeFavoriteThunk,
} from "../favorites/favoritesOperations";

import {
  loginThunk,
  registerThunk,
  restoreSessionThunk,
} from "../auth/authOperations";

import { clearCredentials } from "../auth/authSlice";

const initialState = {
  items: [],
  popularRecipes: [],
  currentRecipe: null,

  page: 1,
  totalPages: 1,

  recipesStatus: "idle",
  popularStatus: "idle",
  recipeStatus: "idle",

  error: null,

  // IDs of the latest requests
  recipesRequestId: null,
  popularRequestId: null,
  recipeRequestId: null,

  // Latest successful favorite status changes during the current session
  favoriteStatusById: {},
};

// Apply locally confirmed favorite statuses to newly fetched recipes.
const applyFavoriteStatusOverrides = (recipes, favoriteStatusById) =>
  recipes.map((recipe) => {
    const favoriteStatus = favoriteStatusById[recipe.id];

    if (favoriteStatus === undefined) {
      return recipe;
    }

    return {
      ...recipe,
      isFavorite: favoriteStatus,
    };
  });

// Update a recipe in an array without changing unrelated recipes.
const updateRecipeFavoriteStatus = (recipes, recipeId, isFavorite) => {
  const recipe = recipes.find((item) => item.id === recipeId);

  if (recipe) {
    recipe.isFavorite = isFavorite;
  }
};

// Update the favorite status everywhere the recipe may be stored.
const updateFavoriteStatus = (state, recipeId, isFavorite) => {
  state.favoriteStatusById[recipeId] = isFavorite;

  updateRecipeFavoriteStatus(state.items, recipeId, isFavorite);
  updateRecipeFavoriteStatus(state.popularRecipes, recipeId, isFavorite);

  if (state.currentRecipe?.id === recipeId) {
    state.currentRecipe.isFavorite = isFavorite;
  }
};

// Clear local favorite overrides when the authenticated user changes.
const clearFavoriteStatusOverrides = (state) => {
  state.favoriteStatusById = {};
};

// Reset cached favorite statuses when authentication is cleared.
const resetFavoriteStatuses = (state) => {
  state.favoriteStatusById = {};

  state.items.forEach((recipe) => {
    recipe.isFavorite = false;
  });

  state.popularRecipes.forEach((recipe) => {
    recipe.isFavorite = false;
  });

  if (state.currentRecipe) {
    state.currentRecipe.isFavorite = false;
  }
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,

  reducers: {
    setRecipesPage: (state, action) => {
      state.page = action.payload;
    },

    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
      state.recipeStatus = "idle";
      state.recipeRequestId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Recipes catalog
      .addCase(fetchRecipesThunk.pending, (state, action) => {
        state.recipesStatus = "loading";
        state.error = null;
        state.recipesRequestId = action.meta.requestId;
      })
      .addCase(fetchRecipesThunk.fulfilled, (state, action) => {
        if (state.recipesRequestId !== action.meta.requestId) return;

        state.recipesStatus = "succeeded";
        state.items = applyFavoriteStatusOverrides(
          action.payload.data,
          state.favoriteStatusById,
        );
        state.page = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
        state.recipesRequestId = null;
      })
      .addCase(fetchRecipesThunk.rejected, (state, action) => {
        if (state.recipesRequestId !== action.meta.requestId) return;

        state.recipesStatus = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted ? null : action.payload;
        state.recipesRequestId = null;
      })

      // Popular recipes
      .addCase(fetchPopularRecipesThunk.pending, (state, action) => {
        state.popularStatus = "loading";
        state.popularRequestId = action.meta.requestId;
      })
      .addCase(fetchPopularRecipesThunk.fulfilled, (state, action) => {
        if (state.popularRequestId !== action.meta.requestId) return;

        state.popularStatus = "succeeded";
        state.popularRecipes = applyFavoriteStatusOverrides(
          action.payload,
          state.favoriteStatusById,
        );
        state.popularRequestId = null;
      })
      .addCase(fetchPopularRecipesThunk.rejected, (state, action) => {
        if (state.popularRequestId !== action.meta.requestId) return;

        state.popularStatus = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted ? null : action.payload;
        state.popularRequestId = null;
      })

      // Single recipe
      .addCase(fetchRecipeByIdThunk.pending, (state, action) => {
        state.recipeStatus = "loading";
        state.error = null;
        state.recipeRequestId = action.meta.requestId;
      })
      .addCase(fetchRecipeByIdThunk.fulfilled, (state, action) => {
        if (state.recipeRequestId !== action.meta.requestId) return;

        const recipe = action.payload;
        const favoriteStatus = state.favoriteStatusById[recipe.id];

        state.recipeStatus = "succeeded";
        state.currentRecipe =
          favoriteStatus === undefined
            ? recipe
            : { ...recipe, isFavorite: favoriteStatus };

        state.recipeRequestId = null;
      })
      .addCase(fetchRecipeByIdThunk.rejected, (state, action) => {
        if (state.recipeRequestId !== action.meta.requestId) return;

        state.recipeStatus = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted ? null : action.payload;
        state.recipeRequestId = null;
      })

      // Add favorite
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        const { recipeId, isFavorite } = action.payload.data;

        updateFavoriteStatus(state, recipeId, isFavorite);
      })

      // Remove favorite
      .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
        const recipeId = action.meta.arg;

        updateFavoriteStatus(state, recipeId, false);
      })

      // Clear local overrides when the authenticated user changes
      .addCase(loginThunk.fulfilled, clearFavoriteStatusOverrides)
      .addCase(registerThunk.fulfilled, clearFavoriteStatusOverrides)
      .addCase(restoreSessionThunk.fulfilled, clearFavoriteStatusOverrides)

      // Clear cached favorite statuses when authentication is cleared
      .addCase(clearCredentials, resetFavoriteStatuses);
  },
});

export const { setRecipesPage, clearCurrentRecipe } = recipesSlice.actions;

// Selectors
export const selectRecipes = (state) => state.recipes.items;
export const selectPopularRecipes = (state) => state.recipes.popularRecipes;
export const selectCurrentRecipe = (state) => state.recipes.currentRecipe;

export const selectRecipesStatus = (state) => state.recipes.recipesStatus;
export const selectPopularStatus = (state) => state.recipes.popularStatus;
export const selectRecipeStatus = (state) => state.recipes.recipeStatus;

export const selectRecipesError = (state) => state.recipes.error;

export const selectRecipesPage = (state) => state.recipes.page;
export const selectRecipesTotalPages = (state) => state.recipes.totalPages;

export default recipesSlice.reducer;
