import {
  Navigate,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectIsSessionChecked,
} from "../redux/slices/auth/authSlice";

function PrivateRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSessionChecked = useSelector(selectIsSessionChecked);
  const location = useLocation();

  const outletContext = useOutletContext();

  if (!isSessionChecked) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet context={outletContext} />;
}

export default PrivateRoute;
