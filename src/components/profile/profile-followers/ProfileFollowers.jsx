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

function ProfileFollowers({
  type = "followers",
  profileUserId,
  onProfileUpdate,
  getCachedData,
  setCachedData,
  invalidateTabCache,
}) {
  const currentUser = useSelector(selectUser);
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState(() => getCachedData(type, 1)?.users ?? []);

  const [totalPages, setTotalPages] = useState(
    () => getCachedData(type, 1)?.totalPages ?? 1,
  );

  const [isLoading, setIsLoading] = useState(() => !getCachedData(type, 1));

  const [error, setError] = useState(null);

  const [actionError, setActionError] = useState(null);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [listKey, setListKey] = useState(`${type}:${profileUserId ?? ""}`);

  const currentListKey = `${type}:${profileUserId ?? ""}`;

  if (listKey !== currentListKey) {
    const cachedData = getCachedData(type, 1);

    setListKey(currentListKey);
    setPage(1);
    setUsers(cachedData?.users ?? []);
    setTotalPages(cachedData?.totalPages ?? 1);
    setIsLoading(!cachedData);
    setError(null);
    setActionError(null);
  }

  useEffect(() => {
    let isActive = true;

    const fetchUsers = async () => {
      const cachedData = getCachedData(type, page);

      if (cachedData) {
        setUsers(cachedData.users);
        setTotalPages(cachedData.totalPages);
        setIsLoading(false);
      } else {
        setUsers([]);
        setIsLoading(true);
      }

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

        const nextUsers = Array.isArray(response.data) ? response.data : [];

        const nextTotalPages = response.pagination?.totalPages ?? 1;

        if (page > nextTotalPages) {
          setPage(Math.max(1, nextTotalPages));
          return;
        }

        setUsers(nextUsers);
        setTotalPages(nextTotalPages);

        setCachedData(type, page, {
          users: nextUsers,
          totalPages: nextTotalPages,
        });
      } catch (err) {
        if (!isActive) return;

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

      const updatedUsers =
        type === "following" && isFollowing
          ? users.filter((user) => String(user.id) !== String(userId))
          : users.map((user) =>
              String(user.id) === String(userId)
                ? { ...user, isFollowing: !isFollowing }
                : user,
            );

      setUsers(updatedUsers);

      setCachedData(type, page, {
        users: updatedUsers,
        totalPages,
      });

      if (type === "followers") {
        invalidateTabCache("following");
      } else {
        invalidateTabCache("followers");
      }

      if (type === "following" && isFollowing) {
        if (users.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          setReloadKey((prev) => prev + 1);
        }
      }

      onProfileUpdate?.();
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

  if (isLoading && users.length === 0) {
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
