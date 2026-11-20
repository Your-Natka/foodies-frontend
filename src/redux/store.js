import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { resetSession } from "./sessionActions";

import recipesReducer from './slices/recipes/recipesSlice';
import ingredientsReducer from './slices/ingredients/ingredientsSlice';
import areasReducer from './slices/areas/areasSlice';
import favoritesReducer from './slices/favorites/favoritesSlice';
import shoppingListReducer, {
  SHOPPING_LIST_STORAGE_KEY,
} from "./slices/shoppingList/shoppingListSlice";

import authReducer, {
  setAccessToken,
  clearCredentials,
} from "./slices/auth/authSlice";

import { configureApiAuth } from "../services/api";
import { loadJSON, removeKey, saveJSON } from "../utils/storage";

const loadShoppingList = () => {
  const saved = loadJSON(SHOPPING_LIST_STORAGE_KEY, null);
  return Array.isArray(saved?.items) ? { items: saved.items } : undefined;
};

const savedShoppingList = loadShoppingList();

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
  preloadedState: savedShoppingList
    ? { shoppingList: savedShoppingList }
    : undefined,
});

// Persist the shopping list locally whenever it changes.
let lastShoppingList = store.getState().shoppingList;

store.subscribe(() => {
  const { shoppingList } = store.getState();

  if (shoppingList !== lastShoppingList) {
    lastShoppingList = shoppingList;

    if (shoppingList.items.length === 0) {
      removeKey(SHOPPING_LIST_STORAGE_KEY);
    } else {
      saveJSON(SHOPPING_LIST_STORAGE_KEY, shoppingList);
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
