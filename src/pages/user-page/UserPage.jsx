import { useSelector } from "react-redux";
import { Navigate, useOutletContext, useParams } from "react-router-dom";

import UserBar from "../../components/profile/user-bar/UserBar";
import TabsList from "../../components/profile/tabs-list/TabsList";

import {
  selectUser,
  selectIsAuthenticated,
  selectAuthStatus,
} from "../../redux/slices/auth/authSlice";

import { useCurrentUserProfile } from "../../hooks/useCurrentUserProfile";
import { useUserProfile } from "../../hooks/useUserProfile";

import "./UserPage.scss";

function UserPage() {
  const { userId } = useParams();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authStatus = useSelector(selectAuthStatus);

  const { onLogout } = useOutletContext();

  // Визначаємо, чи це власний профіль
  const isOwnProfile =
    !userId ||
    (isAuthenticated && user?.id != null && String(user.id) === String(userId));

  const isPublicProfile = !isOwnProfile;

  // Завантажуємо власний профіль
  const {
    profile: ownProfile,
    isLoading: isOwnLoading,
    error: ownError,
    refreshProfile: refreshOwnProfile,
  } = useCurrentUserProfile(isAuthenticated && isOwnProfile, user?.id);

  // Завантажуємо чужий профіль
  const {
    profile: otherProfile,
    isLoading: isOtherLoading,
    error: otherError,
    refreshProfile: refreshOtherProfile,
  } = useUserProfile(isPublicProfile ? userId : null);

  // Обираємо потрібні дані
  const profile = isPublicProfile ? otherProfile : (ownProfile ?? user);

  const isLoading = isPublicProfile ? isOtherLoading : isOwnLoading;

  const error = isPublicProfile ? otherError : ownError;

  const refreshProfile = isPublicProfile
    ? refreshOtherProfile
    : refreshOwnProfile;

  // Очікуємо завершення авторизації
  if (authStatus === "loading" && !isPublicProfile) {
    return <p className="user-page__message">Loading profile...</p>;
  }

  // Захищаємо власний профіль
  if (!isPublicProfile && (!isAuthenticated || !user)) {
    return <Navigate to="/" replace />;
  }

  // Завантаження профілю
  if (isLoading && !profile) {
    return <p className="user-page__message">Loading user information...</p>;
  }

  // Помилка завантаження
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
      <div className="container user-page__container">
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
            isOwnProfile={isOwnProfile}
            profileUserId={profile?.id ?? userId}
            onProfileUpdate={refreshProfile}
            recipes={profile?.recipes ?? []}
          />
        </div>
      </div>
    </main>
  );
}

export default UserPage;
