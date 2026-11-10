import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import SharedLayout from "../components/shared-layout/SharedLayout";

const HomePage = lazy(() => import("../pages/home-page/HomePage"));
const NotFoundPage = lazy(() => import("../pages/not-found-page/NotFoundPage"));

function AppRoutes() {
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
