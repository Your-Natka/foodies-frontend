
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchRecipesThunk,
  fetchPopularRecipesThunk,
  fetchRecipeByIdThunk,
} from "./recipesOperations";

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
        state.items = action.payload.data;
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
        state.popularRecipes = action.payload;
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

        state.recipeStatus = "succeeded";
        state.currentRecipe = action.payload;
        state.recipeRequestId = null;
      })
      .addCase(fetchRecipeByIdThunk.rejected, (state, action) => {
        if (state.recipeRequestId !== action.meta.requestId) return;

        state.recipeStatus = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted ? null : action.payload;
        state.recipeRequestId = null;
      });
  },
});

export const {
  setRecipesPage,
  clearCurrentRecipe,
} = recipesSlice.actions;

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
