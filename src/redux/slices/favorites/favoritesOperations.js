
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getFavoriteRecipes,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
} from "../../../services/api/favoritesApi";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  "Something went wrong. Please try again.";

// Fetch favorites
export const fetchFavoritesThunk = createAsyncThunk(
  "favorites/fetchFavorites",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getFavoriteRecipes(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Fetch IDs of ALL favorite recipes
export const fetchAllFavoriteIdsThunk = createAsyncThunk(
  "favorites/fetchAllFavoriteIds",
  async (_, { rejectWithValue }) => {
    try {
      const limit = 100;

      const firstPage = await getFavoriteRecipes({
        page: 1,
        limit,
      });

      const totalPages = firstPage.pagination?.totalPages ?? 1;

      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          getFavoriteRecipes({
            page: index + 2,
            limit,
          }),
        ),
      );

      const allPages = [firstPage, ...remainingPages];

      return allPages.flatMap((page) =>
        page.data.map((recipe) => recipe.id),
      );
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Add recipe to favorites
export const addFavoriteThunk = createAsyncThunk(
  "favorites/addFavorite",
  async (recipeId, { rejectWithValue }) => {
    try {
      return await addRecipeToFavorites(recipeId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Remove recipe from favorites
export const removeFavoriteThunk = createAsyncThunk(
  "favorites/removeFavorite",
  async (recipeId, { rejectWithValue }) => {
    try {
      await removeRecipeFromFavorites(recipeId);
      return recipeId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
