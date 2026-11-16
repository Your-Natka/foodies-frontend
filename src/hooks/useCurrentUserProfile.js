import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentUser } from "../services/api/usersApi";

export function useCurrentUserProfile(isAuthenticated, userId) {
  const [profileState, setProfileState] = useState({
    userId: null,
    profile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const refreshProfile = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!isAuthenticated || userId == null) {
      setProfileState({ userId: null, profile: null });
      setIsLoading(false);
      setError(null);
      return null;
    }

    const requestedUserId = String(userId);

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCurrentUser();

      if (requestId !== requestIdRef.current) {
        return null;
      }

      const currentUser = data.user ?? data.data?.user ?? data.data ?? data;

      if (String(currentUser?.id) !== requestedUserId) {
        setProfileState({
          userId: requestedUserId,
          profile: null,
        });

        setError("The returned profile does not match the current user.");
        return null;
      }

      setProfileState({
        userId: requestedUserId,
        profile: currentUser,
      });

      return currentUser;
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return null;
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load your profile.",
      );

      return null;
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || userId == null) {
      return;
    }

    const loadProfile = () => {
      void refreshProfile();
    };

    loadProfile();

    return () => {
      requestIdRef.current += 1;
    };
  }, [isAuthenticated, userId, refreshProfile]);

  const profile =
    isAuthenticated && userId != null && profileState.userId === String(userId)
      ? profileState.profile
      : null;

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
  };
}
