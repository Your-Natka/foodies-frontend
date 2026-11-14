import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api/usersApi";

export function useCurrentUserProfile(isAuthenticated) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getCurrentUser();
      const currentUser = data.user ?? data.data?.user ?? data.data ?? data;

      setProfile(currentUser);
      return currentUser;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load your profile.",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [isAuthenticated, refreshProfile]);

  return {
    profile,
    isLoading,
    error,
    refreshProfile,
  };
}
