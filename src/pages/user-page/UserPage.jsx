import { useSelector } from "react-redux";
import { Navigate, useOutletContext, useParams } from "react-router-dom";

import UserBar from "../../components/profile/user-bar/UserBar";
import TabsList from "../../components/profile/tabs-list/TabsList";
import Loader from "../../components/shared/Loader/Loader";

import {
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
} from "../../redux/slices/auth/authSlice";

import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useUserProfile } from "../../hooks/useUserProfile";
import PathInfo from "../../components/recipe-details/path-info/PathInfo";

import "./UserPage.scss";

function UserPage() {
  const { userId } = useParams();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const { onLogout } = useOutletContext();

  const isOwnProfile =
    !userId ||
    (isAuthenticated && user?.id != null && String(user.id) === String(userId));

  const isPublicProfile = !isOwnProfile;

  const {
    profile: ownProfile,
    isLoading: isOwnLoading,
    error: ownError,
    refreshProfile: refreshOwnProfile,
  } = useCurrentUserProfile(isAuthenticated && isOwnProfile, user?.id);

  const {
    profile: otherProfile,
    isLoading: isOtherLoading,
    error: otherError,
    refreshProfile: refreshOtherProfile,
  } = useUserProfile(isPublicProfile ? userId : null);

  const profile = isPublicProfile ? otherProfile : (ownProfile ?? user);

  const isLoading = isPublicProfile ? isOtherLoading : isOwnLoading;

  const error = isPublicProfile ? otherError : ownError;

  const refreshProfile = isPublicProfile
    ? refreshOtherProfile
    : refreshOwnProfile;

  if (authStatus === "loading" && !isPublicProfile) {
    return <Loader text="Loading profile..." />;
  }

  if (!isPublicProfile && (!isAuthenticated || !user)) {
    return <Navigate to="/" replace />;
  }

  if (isLoading && !profile) {
    return <Loader text="Loading user information..." />;
  }

  if (error && !profile) {
    return (
      <p className="user-page__message" role="alert">
        {error}
      </p>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="user-page">
      <div className="container">
        <div className="user-page__header">
          <PathInfo title="PROFILE" />

          <h1 className="user-page__heading">PROFILE</h1>

          <p className="user-page__description">
            Reveal your culinary art, share your favorite recipe and create
            gastronomic masterpieces with us.
          </p>
        </div>

        <div className="user-page__container">
          <UserBar
            user={profile}
            isOwnProfile={isOwnProfile}
            onLogout={onLogout}
            onProfileUpdate={refreshProfile}
          />

          {error && (
            <p className="user-page__message" role="alert">
              {error}
            </p>
          )}

          <div className="user-page__content">
            <TabsList
              key={`${isOwnProfile ? "own" : "public"}:${profile?.id ?? userId}`}
              isOwnProfile={isOwnProfile}
              profileUserId={profile?.id ?? userId}
              onProfileUpdate={refreshProfile}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserPage;
