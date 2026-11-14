import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import SharedLayout from "../components/shared-layout/SharedLayout";
import PrivateRoute from "./PrivateRoute";
import { restoreSessionThunk } from "../redux/slices/auth/authOperations";

const UserPage = lazy(() => import("../pages/user-page/UserPage"));

const AddRecipePage = lazy(
  () => import("../pages/add-recipe-page/AddRecipePage"),
);

const HomePage = lazy(() => import("../pages/home-page/HomePage"));
const NotFoundPage = lazy(() => import("../pages/not-found-page/NotFoundPage"));

const CategoryPage = lazy(() => import("../pages/category-page/CategoryPage"));

const RecipePage = lazy(() => import("../pages/recipe-page/RecipePage"));

function AppRoutes() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSessionThunk());
  }, [dispatch]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<HomePage />} />

          {/* Private routes */}
          <Route element={<PrivateRoute />}>
            <Route path="user" element={<UserPage />} />
            <Route path="recipe/add" element={<AddRecipePage />} />
          </Route>

          {/* Public user profile */}
          <Route path="user/:userId" element={<UserPage />} />

          {/* Recipes catalog */}
          <Route path="recipes" element={<CategoryPage />} />
          <Route path="recipes/:category" element={<CategoryPage />} />

          {/* Recipe details */}
          <Route path="recipe/:id" element={<RecipePage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
