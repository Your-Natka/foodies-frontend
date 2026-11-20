import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFavoritesThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from "./favoritesOperations";

import { logoutThunk } from "../auth/authOperations";
import { clearCredentials } from "../auth/authSlice";

const initialState = {
  items: [],
  page: 1,
  totalPages: 1,
  status: "idle",
  error: null,
  requestId: null,
  pendingByRecipeId: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,

  reducers: {
    clearFavorites: () => ({ ...initialState }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.fulfilled, () => ({ ...initialState }))
      .addCase(clearCredentials, () => ({ ...initialState }))

      // Fetch paginated favorites
      .addCase(fetchFavoritesThunk.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchFavoritesThunk.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.status = "succeeded";
        state.items = action.payload.data;
        state.page = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
        state.requestId = null;
      })
      .addCase(fetchFavoritesThunk.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;

        state.status = action.meta.aborted ? "idle" : "failed";
        state.error = action.meta.aborted ? null : action.payload;
        state.requestId = null;
      })

      // Add favorite
      .addCase(addFavoriteThunk.pending, (state, action) => {
        state.pendingByRecipeId[action.meta.arg] = action.meta.requestId;
      })
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        const recipeId = action.payload.data.recipeId;

        delete state.pendingByRecipeId[recipeId];

        // Invalidate an older favorites request
        state.requestId = null;

        if (state.status === "loading") {
          state.status = state.items.length ? "succeeded" : "idle";
        }
      })
      .addCase(addFavoriteThunk.rejected, (state, action) => {
        const recipeId = action.meta.arg;

        if (state.pendingByRecipeId[recipeId] !== action.meta.requestId) {
          return;
        }

        delete state.pendingByRecipeId[recipeId];
        state.error = action.payload;
      })

      // Remove favorite
      .addCase(removeFavoriteThunk.pending, (state, action) => {
        state.pendingByRecipeId[action.meta.arg] = action.meta.requestId;
      })
      .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
        const recipeId = action.payload;

        delete state.pendingByRecipeId[recipeId];

        // Invalidate an older favorites request
        state.requestId = null;

        if (state.status === "loading") {
          state.status = state.items.length ? "succeeded" : "idle";
        }

        state.items = state.items.filter((recipe) => recipe.id !== recipeId);
      })
      .addCase(removeFavoriteThunk.rejected, (state, action) => {
        const recipeId = action.meta.arg;

        if (state.pendingByRecipeId[recipeId] !== action.meta.requestId) {
          return;
        }

        delete state.pendingByRecipeId[recipeId];
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export const selectFavoriteRecipes = (state) => state.favorites.items;
export const selectFavoritesStatus = (state) => state.favorites.status;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;
