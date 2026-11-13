
import { createSlice } from '@reduxjs/toolkit';
import { fetchIngredientsThunk } from './ingredientsOperations';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchIngredientsThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectIngredients = state => state.ingredients.items;
export const selectIngredientsStatus = state => state.ingredients.status;
export const selectIngredientsError = state => state.ingredients.error;

export default ingredientsSlice.reducer;
