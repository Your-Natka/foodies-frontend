
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredients } from '../../../services/api/ingredientsApi';

export const fetchIngredientsThunk = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredients();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to load ingredients.',
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().ingredients;

      return status === 'idle' || status === 'failed';
    },
  },
);
