import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../../../services/api/authApi";
import { getCurrentUser } from "../../../services/api/usersApi";
import { setAccessToken } from "./authSlice";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  "Something went wrong. Please try again.";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUser(userData);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  // Навіть якщо сервер не відповів, локальну сесію потрібно завершити.
  try {
    await logoutUser();
  } catch {
    // Credentials будуть очищені в extraReducers.
  }
});

export const restoreSessionThunk = createAsyncThunk(
  "auth/restoreSession",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const session = await refreshSession();

      dispatch(setAccessToken(session.accessToken));

      const profile = await getCurrentUser();

      const user =
        profile.user ?? profile.data?.user ?? profile.data ?? profile;

      return {
        user,
        accessToken: session.accessToken,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (_, { getState }) => getState().auth.status === "idle",
  },
);
