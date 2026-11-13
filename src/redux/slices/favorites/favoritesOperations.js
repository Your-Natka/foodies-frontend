
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getFavoriteRecipes,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
} from '../../../services/api/favoritesApi';

const getErrorMessage = error =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  'Something went wrong. Please try again.';

// Fetch favorite recipes
export const fetchFavoritesThunk = createAsyncThunk(
  'favorites/fetchFavorites',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getFavoriteRecipes(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Add recipe to favorites
export const addFavoriteThunk = createAsyncThunk(
  'favorites/addFavorite',
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
  'favorites/removeFavorite',
  async (recipeId, { rejectWithValue }) => {
    try {
      await removeRecipeFromFavorites(recipeId);
      return recipeId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
