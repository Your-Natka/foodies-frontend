
import { createSlice } from '@reduxjs/toolkit';

import {
  fetchRecipesThunk,
  fetchPopularRecipesThunk,
  fetchRecipeByIdThunk,
} from './recipesOperations';

const initialState = {
  items: [],
  popularRecipes: [],
  currentRecipe: null,

  page: 1,
  totalPages: 1,

  recipesStatus: 'idle',
  popularStatus: 'idle',
  recipeStatus: 'idle',

  error: null,
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,

  reducers: {
    setRecipesPage: (state, action) => {
      state.page = action.payload;
    },

    clearCurrentRecipe: state => {
      state.currentRecipe = null;
      state.recipeStatus = 'idle';
    },
  },

  extraReducers: builder => {
    builder
      // Recipes catalog
      .addCase(fetchRecipesThunk.pending, state => {
        state.recipesStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchRecipesThunk.fulfilled, (state, action) => {
        state.recipesStatus = 'succeeded';
        state.items = action.payload.data;
        state.page = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchRecipesThunk.rejected, (state, action) => {
        state.recipesStatus = 'failed';
        state.error = action.payload;
      })

      // Popular recipes
      .addCase(fetchPopularRecipesThunk.pending, state => {
        state.popularStatus = 'loading';
      })
      .addCase(fetchPopularRecipesThunk.fulfilled, (state, action) => {
        state.popularStatus = 'succeeded';
        state.popularRecipes = action.payload;
      })
      .addCase(fetchPopularRecipesThunk.rejected, (state, action) => {
        state.popularStatus = 'failed';
        state.error = action.payload;
      })

      // Single recipe
      .addCase(fetchRecipeByIdThunk.pending, state => {
        state.recipeStatus = 'loading';
      })
      .addCase(fetchRecipeByIdThunk.fulfilled, (state, action) => {
        state.recipeStatus = 'succeeded';
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeByIdThunk.rejected, (state, action) => {
        state.recipeStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setRecipesPage,
  clearCurrentRecipe,
} = recipesSlice.actions;

// Selectors
export const selectRecipes = state => state.recipes.items;
export const selectPopularRecipes = state => state.recipes.popularRecipes;
export const selectCurrentRecipe = state => state.recipes.currentRecipe;

export const selectRecipesStatus = state => state.recipes.recipesStatus;
export const selectPopularStatus = state => state.recipes.popularStatus;
export const selectRecipeStatus = state => state.recipes.recipeStatus;

export const selectRecipesError = state => state.recipes.error;

export const selectRecipesPage = state => state.recipes.page;
export const selectRecipesTotalPages = state => state.recipes.totalPages;

export default recipesSlice.reducer;
