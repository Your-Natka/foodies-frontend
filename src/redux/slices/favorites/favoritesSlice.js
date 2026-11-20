
import { createSlice } from "@reduxjs/toolkit";

import {
  fetchFavoritesThunk,
  fetchAllFavoriteIdsThunk,
  addFavoriteThunk,
  removeFavoriteThunk,
} from "./favoritesOperations";

import { logoutThunk } from "../auth/authOperations";
import { clearCredentials } from "../auth/authSlice";

const initialState = {
  items: [],
  favoriteIds: [],
  page: 1,
  totalPages: 1,
  status: "idle",
  error: null,
  favoriteIdsRequestId: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,

  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.favoriteIds = [];
      state.page = 1;
      state.totalPages = 1;
      state.status = "idle";
      state.error = null;
      state.favoriteIdsRequestId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(clearCredentials, () => initialState)

      // Fetch favorites
      .addCase(fetchFavoritesThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavoritesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.favoriteIds = action.payload.data.map((recipe) => recipe.id);
        state.page = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchFavoritesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch all favorite IDs
      .addCase(fetchAllFavoriteIdsThunk.pending, (state, action) => {
        state.favoriteIdsRequestId = action.meta.requestId;
      })
      .addCase(fetchAllFavoriteIdsThunk.fulfilled, (state, action) => {
        if (state.favoriteIdsRequestId !== action.meta.requestId) return;

        state.favoriteIds = action.payload;
        state.favoriteIdsRequestId = null;
      })
      .addCase(fetchAllFavoriteIdsThunk.rejected, (state, action) => {
        if (state.favoriteIdsRequestId !== action.meta.requestId) return;

        state.favoriteIdsRequestId = null;
      })

      // Add favorite
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        // Invalidate an older favorites request
        state.favoriteIdsRequestId = null;

        const recipeId = action.payload.data.recipeId;

        if (!state.favoriteIds.includes(recipeId)) {
          state.favoriteIds.push(recipeId);
        }
      })

      // Remove favorite
      .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
        // Invalidate an older favorites request
        state.favoriteIdsRequestId = null;

        const recipeId = action.payload;

        state.favoriteIds = state.favoriteIds.filter(
          (id) => id !== recipeId,
        );

        state.items = state.items.filter(
          (recipe) => recipe.id !== recipeId,
        );
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export const selectFavoriteRecipes = (state) => state.favorites.items;
export const selectFavoriteIds = (state) => state.favorites.favoriteIds;
export const selectFavoritesStatus = (state) => state.favorites.status;
export const selectFavoritesError = (state) => state.favorites.error;

export const selectIsFavorite = (recipeId) => (state) =>
  state.favorites.favoriteIds.includes(recipeId);

export default favoritesSlice.reducer;
