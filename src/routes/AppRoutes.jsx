import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import SharedLayout from "../components/shared-layout/SharedLayout";
import { restoreSessionThunk } from "../redux/slices/auth/authOperations";

const HomePage = lazy(() => import("../pages/home-page/HomePage"));
const NotFoundPage = lazy(() => import("../pages/not-found-page/NotFoundPage"));

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
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
