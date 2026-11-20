import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from "../../../services/api/authApi";
import { getCurrentUser } from "../../../services/api/usersApi";
import {
  hasStoredSession,
  markSessionExists,
  clearStoredSession,
} from "../../../services/authStorage";
import { clearAppStorage } from "../../../utils/storage";
import { resetSession } from "../../sessionActions";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  "Something went wrong. Please try again.";

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const result = await registerUser(userData);
      markSessionExists();
      return result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await loginUser(credentials);
      markSessionExists();
      return result;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Cached API responses may contain the user's private data.
const clearApiCache = async () => {
  try {
    await globalThis.caches?.delete("foodies-api");
  } catch (error) {
    console.error("Failed to clear API cache:", error);
  }
};

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, getState }) => {
    const accessToken = getState().auth.accessToken;

    const serverLogout = logoutUser(accessToken)
      .then(() => true)
      .catch((error) => {
        console.error("Server logout failed:", error);
        return false;
      });

    // Clear Redux and localStorage
    dispatch(resetSession());
    clearAppStorage();

    void clearApiCache();

    const serverLogoutSucceeded = await serverLogout;

    return { serverLogoutSucceeded };
  },
);

export const restoreSessionThunk = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    try {
      const session = await refreshSession();

      const profile = await getCurrentUser();

      const user =
        profile.user ?? profile.data?.user ?? profile.data ?? profile;

      return {
        user,
        accessToken: session.accessToken,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        clearStoredSession();
        return rejectWithValue(null);
      }

      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: () => hasStoredSession(),
  },
);