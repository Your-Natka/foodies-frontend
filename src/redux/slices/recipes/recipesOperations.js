
import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getRecipes,
  getPopularRecipes,
  getRecipeById,
} from '../../../services/api/recipesApi';

const getErrorMessage = error =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  'Something went wrong. Please try again.';

// Fetch recipes catalog
export const fetchRecipesThunk = createAsyncThunk(
  'recipes/fetchRecipes',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getRecipes(params);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Fetch popular recipes
export const fetchPopularRecipesThunk = createAsyncThunk(
  'recipes/fetchPopularRecipes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPopularRecipes();
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Fetch recipe details
export const fetchRecipeByIdThunk = createAsyncThunk(
  'recipes/fetchRecipeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getRecipeById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
