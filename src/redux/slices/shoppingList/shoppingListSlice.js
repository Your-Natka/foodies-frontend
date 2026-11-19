import { createSlice, createSelector } from "@reduxjs/toolkit";

import { logoutThunk } from "../auth/authOperations";

export const SHOPPING_LIST_STORAGE_KEY = "foodies:shopping-list";

const initialState = { items: [] };

const shoppingListSlice = createSlice({
  name: "shoppingList",
  initialState,
  reducers: {
    addRecipeIngredients(state, { payload }) {
      const { recipeId, recipeTitle, ingredients = [] } = payload;

      ingredients.forEach(({ id, name, img, measure }) => {
        const key = `${recipeId}-${id}`;
        if (state.items.some((item) => item.key === key)) return;

        state.items.push({
          key,
          recipeId,
          recipeTitle,
          ingredientId: id,
          name,
          img,
          measure,
          checked: false,
        });
      });
    },
    toggleItem(state, { payload: key }) {
      const item = state.items.find((entry) => entry.key === key);
      if (item) item.checked = !item.checked;
    },
    removeItem(state, { payload: key }) {
      state.items = state.items.filter((item) => item.key !== key);
    },
    removeRecipe(state, { payload: recipeId }) {
      state.items = state.items.filter((item) => item.recipeId !== recipeId);
    },
    clearChecked(state) {
      state.items = state.items.filter((item) => !item.checked);
    },
    clearAll(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const {
  addRecipeIngredients,
  toggleItem,
  removeItem,
  removeRecipe,
  clearChecked,
  clearAll,
} = shoppingListSlice.actions;

export const selectShoppingItems = (state) => state.shoppingList.items;

export const selectShoppingCount = (state) =>
  state.shoppingList.items.filter((item) => !item.checked).length;

export const selectIsRecipeInList = (recipeId) => (state) =>
  state.shoppingList.items.some((item) => item.recipeId === recipeId);

export const selectShoppingGroups = createSelector(
  [selectShoppingItems],
  (items) => {
    const groups = new Map();

    items.forEach((item) => {
      if (!groups.has(item.recipeId)) {
        groups.set(item.recipeId, {
          recipeId: item.recipeId,
          recipeTitle: item.recipeTitle,
          items: [],
        });
      }
      groups.get(item.recipeId).items.push(item);
    });

    return [...groups.values()];
  },
);

export default shoppingListSlice.reducer;
