
import { createSlice } from '@reduxjs/toolkit';
import { fetchAreasThunk } from './areasOperations';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAreasThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAreasThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
      })
      .addCase(fetchAreasThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectAreas = state => state.areas.items;
export const selectAreasStatus = state => state.areas.status;
export const selectAreasError = state => state.areas.error;

export default areasSlice.reducer;
