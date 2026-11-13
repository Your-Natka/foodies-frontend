import { configureStore } from "@reduxjs/toolkit";

import recipesReducer from './slices/recipes/recipesSlice';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import areasReducer from './slices/areas/areasSlice';
import favoritesReducer from './slices/favorites/favoritesSlice';

import authReducer, {
  setAccessToken,
  clearCredentials,
} from "./slices/auth/authSlice";

import { configureApiAuth } from "../services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    ingredients: ingredientsReducer,
    areas: areasReducer,
    favorites: favoritesReducer,

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
