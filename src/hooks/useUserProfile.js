import { useCallback, useEffect, useRef, useState } from "react";
import { getUserById } from "../services/api/usersApi";

export function useUserProfile(userId) {
  const [profileState, setProfileState] = useState({
    userId: null,
    profile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

  const refreshProfile = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!userId) {
      setProfileState({
        userId: null,
        profile: null,
      });
      setIsLoading(false);
      setError(null);
      return null;
    }

    const requestedUserId = userId;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserById(requestedUserId);

      if (requestId !== requestIdRef.current) {
        return null;
      }

      const user =
        response.user ?? response.data?.user ?? response.data ?? response;

      setProfileState({
        userId: requestedUserId,
        profile: user,
      });

      return user;
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return null;
      }

      setProfileState({
        userId: requestedUserId,
        profile: null,
      });

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load user profile.",
      );

      return null;
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadProfile = () => {
      void refreshProfile();
    };

    loadProfile();

    return () => {
      requestIdRef.current += 1;
    };
  }, [userId, refreshProfile]);

  const profile =
    userId && profileState.userId === userId ? profileState.profile : null;

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
  };
}
