import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { resetSession } from "./sessionActions";

import recipesReducer from "./slices/recipes/recipesSlice";
import ingredientsReducer from "./slices/ingredients/ingredientsSlice";
import areasReducer from "./slices/areas/areasSlice";
import favoritesReducer from "./slices/favorites/favoritesSlice";
import shoppingListReducer, {
  SHOPPING_LIST_STORAGE_KEY,
} from "./slices/shoppingList/shoppingListSlice";

import authReducer, {
  setAccessToken,
  clearCredentials,
} from "./slices/auth/authSlice";

import {
  configureApiAuth,
  scheduleTokenRefresh,
  cancelTokenRefresh,
} from "../services/api";
import { removeKey, saveJSON } from "../utils/storage";

const appReducer = combineReducers({
  auth: authReducer,
  recipes: recipesReducer,
  ingredients: ingredientsReducer,
  areas: areasReducer,
  favorites: favoritesReducer,
  shoppingList: shoppingListReducer,
});

const rootReducer = (state, action) => {
  if (resetSession.match(action)) {
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// persist the shopping list and schedule token refresh when needed
let lastShoppingList = store.getState().shoppingList;
let lastAccessToken = store.getState().auth.accessToken;

store.subscribe(() => {
  const state = store.getState();
  const { shoppingList } = state;
  const accessToken = state.auth.accessToken;

  if (shoppingList !== lastShoppingList) {
    lastShoppingList = shoppingList;

    if (shoppingList.items.length === 0) {
      removeKey(SHOPPING_LIST_STORAGE_KEY);
    } else {
      saveJSON(SHOPPING_LIST_STORAGE_KEY, shoppingList);
    }
  }

  if (accessToken !== lastAccessToken) {
    lastAccessToken = accessToken;

    if (accessToken) {
      scheduleTokenRefresh(accessToken);
    } else {
      cancelTokenRefresh();
    }
  }
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
