import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import SharedLayout from "../components/shared-layout/SharedLayout";
import Spinner from "../components/loader/Spinner";
import PrivateRoute from "./PrivateRoute";

import { restoreSessionThunk } from "../redux/slices/auth/authOperations";
import { markSessionChecked } from "../redux/slices/auth/authSlice";

import {
  restoreShoppingList,
  SHOPPING_LIST_STORAGE_KEY,
} from "../redux/slices/shoppingList/shoppingListSlice";

import { hasStoredSession } from "../services/authStorage";
import { loadJSON, removeKey } from "../utils/storage";
import { getIngredients } from "../services/api/ingredientsApi";

const UserPage = lazy(() => import("../pages/user-page/UserPage"));

const AddRecipePage = lazy(
  () => import("../pages/add-recipe-page/AddRecipePage"),
);

const HomePage = lazy(() => import("../pages/home-page/HomePage"));
const NotFoundPage = lazy(() => import("../pages/not-found-page/NotFoundPage"));

const CategoryPage = lazy(() => import("../pages/category-page/CategoryPage"));

const RecipePage = lazy(() => import("../pages/recipe-page/RecipePage"));

const ShoppingListPage = lazy(
  () => import("../pages/shopping-list-page/ShoppingListPage"),
);

function AppRoutes() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const restoreUserData = async () => {
      if (hasStoredSession()) {
        try {
          await dispatch(restoreSessionThunk()).unwrap();

          const savedShoppingList = loadJSON(SHOPPING_LIST_STORAGE_KEY, {
            items: [],
          });

          try {
            const ingredients = await getIngredients();

            const ingredientsMap = new Map(
              ingredients.map((ingredient) => [ingredient.id, ingredient.img]),
            );

            const updatedShoppingList = {
              ...savedShoppingList,
              items: (savedShoppingList.items || []).map((item) => ({
                ...item,
                img: ingredientsMap.get(item.ingredientId) || null,
              })),
            };

            dispatch(restoreShoppingList(updatedShoppingList));
          } catch (error) {
            console.error("Failed to update shopping list images:", error);
            dispatch(restoreShoppingList(savedShoppingList));
          }
        } catch {
          removeKey(SHOPPING_LIST_STORAGE_KEY);
        }
      } else {
        removeKey(SHOPPING_LIST_STORAGE_KEY);
        dispatch(markSessionChecked());
      }
    };

    restoreUserData();
  }, [dispatch]);

  useEffect(() => {
    if (location.hash) return;

    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="user" element={<UserPage />} />
            <Route path="user/:userId" element={<UserPage />} />
            <Route path="recipe/add" element={<AddRecipePage />} />
            <Route path="recipe/:recipeId/edit" element={<AddRecipePage />} />
          </Route>

          {/* Recipes catalog */}
          <Route path="recipes" element={<CategoryPage />} />
          <Route path="recipes/:category" element={<CategoryPage />} />

          {/* Recipe details */}
          <Route path="recipe/:id" element={<RecipePage />} />

          {/* Shopping list is accessible to guests */}
          <Route path="shopping-list" element={<ShoppingListPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
