import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  updateAvatar,
  followUser,
  unfollowUser,
} from "../../../services/api/usersApi";

import {
  updateUser,
  selectIsAuthenticated,
} from "../../../redux/slices/auth/authSlice";

import "./UserBar.scss";

function UserBar({ user, onLogout, onProfileUpdate, isOwnProfile = true }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const fileInputRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState(null);

  const avatarUrl = user?.avatar;
  const avatarError = avatarUrl === failedAvatarUrl;

  const serverIsFollowing = Boolean(user?.isFollowing);

  const hasFollowOverride =
    followOverride &&
    String(followOverride.userId) === String(user?.id) &&
    followOverride.previousValue === serverIsFollowing;

  const isFollowing = hasFollowOverride
    ? followOverride.value
    : serverIsFollowing;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const response = await updateAvatar(file);
      const updatedUser = response.user ?? response.data?.user;

      if (!updatedUser) {
        throw new Error("The server did not return updated user data.");
      }

      dispatch(updateUser(updatedUser));
      setFailedAvatarUrl(null);

      await onProfileUpdate?.();

      toast.success("Profile photo updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to upload profile photo.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to follow users.");
      return;
    }

    if (!user?.id || isFollowLoading || isOwnProfile) return;

    const targetUserId = user.id;
    const wasFollowing = isFollowing;

    setIsFollowLoading(true);

    try {
      if (wasFollowing) {
        await unfollowUser(targetUserId);
      } else {
        await followUser(targetUserId);
      }

      setFollowOverride({
        userId: targetUserId,
        previousValue: serverIsFollowing,
        value: !wasFollowing,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update following status.",
      );
      setIsFollowLoading(false);
      return;
    }

    try {
      const updatedProfile = await onProfileUpdate?.();

      if (!updatedProfile && onProfileUpdate) {
        toast.error("Following updated, but profile refresh failed.");
      }
    } catch {
      toast.error("Following updated, but profile refresh failed.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <section className="user-bar">
      <div className="user-bar__avatar-wrapper">
        <div className="user-bar__avatar">
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt={`${user?.name || "User"} profile`}
              onError={() => setFailedAvatarUrl(avatarUrl)}
            />
          ) : (
            <img
              src="/images/chef-food.png"
              alt="Default chef avatar"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        {isOwnProfile && (
          <>
            <button
              className="user-bar__avatar-button"
              type="button"
              onClick={handleAvatarClick}
              disabled={isUploading}
              aria-label="Upload profile photo"
            >
              {isUploading ? "…" : "+"}
            </button>

            <input
              ref={fileInputRef}
              className="user-bar__file-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </>
        )}
      </div>

      <h1 className="user-bar__name">{user?.name || "User"}</h1>

      <dl className="user-bar__details">
        {isOwnProfile && (
          <div className="user-bar__detail">
            <dt>Email:</dt>
            <dd>{user?.email || "—"}</dd>
          </div>
        )}

        <div className="user-bar__detail">
          <dt>Added recipes:</dt>
          <dd>{user?.recipesCount ?? 0}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Favorites:</dt>
          <dd>{user?.favoritesCount ?? "—"}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Followers:</dt>
          <dd>{user?.followersCount ?? 0}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Following:</dt>
          <dd>{user?.followingCount ?? "—"}</dd>
        </div>
      </dl>

      {isOwnProfile && (
        <button className="user-bar__logout" type="button" onClick={onLogout}>
          LOG OUT
        </button>
      )}

      {!isOwnProfile && (
        <button
          className="user-bar__follow"
          type="button"
          onClick={handleFollowToggle}
          disabled={isFollowLoading}
        >
          {isFollowLoading ? "LOADING..." : isFollowing ? "UNFOLLOW" : "FOLLOW"}
        </button>
      )}
    </section>
  );
}

export default UserBar;
