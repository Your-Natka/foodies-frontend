import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAreas } from '../../../services/api/areasApi';

export const fetchAreasThunk = createAsyncThunk(
  'areas/fetchAreas',
  async (_, { rejectWithValue }) => {
    try {
      return await getAreas();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          'Failed to load areas.',
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().areas;

      return status === 'idle' || status === 'failed';
    },
  },
);
