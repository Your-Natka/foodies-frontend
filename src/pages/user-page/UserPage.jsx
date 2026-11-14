import { useSelector } from "react-redux";
import { Navigate, useOutletContext } from "react-router-dom";

import UserBar from "../../components/profile/user-bar/UserBar";
import TabsList from "../../components/profile/tabs-list/TabsList";

import {
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
} from "../../redux/slices/auth/authSlice";
import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";

import "./UserPage.scss";

function UserPage() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const { onLogout } = useOutletContext();

  const { profile, isLoading, error, refreshProfile } =
    useCurrentUserProfile(isAuthenticated);

  if (authStatus === "loading") {
    return <p className="user-page__message">Loading profile...</p>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const currentUser = profile ?? user;

  return (
    <main className="user-page">
      <div className="container user-page__container">
        <UserBar
          user={currentUser}
          onLogout={onLogout}
          onProfileUpdate={refreshProfile}
        />

        {isLoading && !profile && (
          <p className="user-page__message">Loading user information...</p>
        )}

        {error && (
          <p className="user-page__message" role="alert">
            {error}
          </p>
        )}

        <div className="user-page__content">
          <TabsList onProfileUpdate={refreshProfile} />
        </div>
      </div>
    </main>
  );
}

export default UserPage;
