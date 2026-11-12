import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { updateAvatar } from "../../../services/api/usersApi";
import { updateUser } from "../../../redux/slices/auth/authSlice";

import "./UserBar.scss";

function UserBar({ user, onLogout }) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

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
      setAvatarError(false);
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

  const avatarUrl = user?.avatar;

  return (
    <section className="user-bar">
      <div className="user-bar__avatar-wrapper">
        <div className="user-bar__avatar">
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt={`${user?.name || "User"} profile`}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <img
              src="/images/default-chef-avatar.png"
              alt="Default chef avatar"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

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
      </div>

      <h1 className="user-bar__name">{user?.name || "User"}</h1>

      <dl className="user-bar__details">
        <div className="user-bar__detail">
          <dt>Email:</dt>
          <dd>{user?.email || "—"}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Added recipes:</dt>
          <dd>{user?.recipesCount ?? 0}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Favorites:</dt>
          <dd>{user?.favoritesCount ?? 0}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Followers:</dt>
          <dd>{user?.followersCount ?? 0}</dd>
        </div>

        <div className="user-bar__detail">
          <dt>Following:</dt>
          <dd>{user?.followingCount ?? 0}</dd>
        </div>
      </dl>

      <button className="user-bar__logout" type="button" onClick={onLogout}>
        LOG OUT
      </button>
    </section>
  );
}

export default UserBar;
