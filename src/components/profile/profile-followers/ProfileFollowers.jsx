import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/slices/auth/authSlice";

import {
  getUserFollowers,
  getMyFollowing,
  followUser,
  unfollowUser,
} from "../../../services/api/usersApi";

import EmptyState from "../../shared/empty-state/EmptyState";
import UserCard from "../user-card/UserCard";
import Pagination from "../../shared/pagination/Pagination";

function ProfileFollowers({ type = "followers", profileUserId }) {
  const currentUser = useSelector(selectUser);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(
    type === "following" || Boolean(profileUserId),
  );
  const [error, setError] = useState(null);

  const [actionError, setActionError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [listKey, setListKey] = useState(`${type}:${profileUserId ?? ""}`);

  const currentListKey = `${type}:${profileUserId ?? ""}`;

  if (listKey !== currentListKey) {
    setListKey(currentListKey);
    setPage(1);
    setUsers([]);
    setTotalPages(1);
    setIsLoading(type === "following" || Boolean(profileUserId));
    setError(null);
    setActionError(null);
  }

  useEffect(() => {
    let isActive = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          type === "following"
            ? await getMyFollowing({ page, limit: 5 })
            : await getUserFollowers(profileUserId, {
                page,
                limit: 5,
              });

        if (!isActive) return;

        const nextUsers = response.data ?? [];
        const nextTotalPages = response.pagination?.totalPages ?? 1;

        if (page > nextTotalPages) {
          setPage(Math.max(1, nextTotalPages));
          return;
        }

        setUsers(nextUsers);
        setTotalPages(nextTotalPages);
      } catch (err) {
        if (!isActive) return;

        setUsers([]);
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load users.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    if (type === "following" || profileUserId) {
      void fetchUsers();
    }

    return () => {
      isActive = false;
    };
  }, [type, profileUserId, page, reloadKey]);

  const handleFollowToggle = async (userId, isFollowing) => {
    if (updatingUserId !== null) return;

    setUpdatingUserId(userId);
    setActionError(null);

    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isFollowing: !isFollowing } : user,
        ),
      );

      // Оновлюємо дані та пагінацію після зміни підписки.
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update following status.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return <p className="user-page__message">Loading users...</p>;
  }

  if (error) {
    return (
      <p className="user-page__message" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="profile-followers">
      {actionError && (
        <p className="user-page__message" role="alert">
          {actionError}
        </p>
      )}

      {users.length === 0 ? (
        <EmptyState type={type} />
      ) : (
        <>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onFollowToggle={handleFollowToggle}
              isFollowLoading={isLoading || updatingUserId === user.id}
              showFollowButton={
                Boolean(currentUser?.id) &&
                String(currentUser.id) !== String(user.id)
              }
            />
          ))}

          <div className="profile-followers__pagination">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileFollowers;
