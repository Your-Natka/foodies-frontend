import api, { refreshAccessToken } from "../api";

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const refreshSession = async () => {
  return await refreshAccessToken();
};

export const logoutUser = (accessToken) =>
  api.post(
    "/auth/logout",
    {},
    {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {},
    },
  );
