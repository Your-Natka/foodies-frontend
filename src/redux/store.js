import { configureStore } from "@reduxjs/toolkit";

import authReducer, {
  setAccessToken,
  clearCredentials,
} from "./slices/auth/authSlice";

import { configureApiAuth } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

configureApiAuth({
  getToken: () => store.getState().auth.accessToken,

  updateToken: (token) => {
    store.dispatch(setAccessToken(token));
  },

  onFailure: () => {
    store.dispatch(clearCredentials());
  },
});
