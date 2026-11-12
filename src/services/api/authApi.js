import api from "../api";

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

export const refreshSession = async () => {
  const { data } = await api.post("/auth/refresh");
  return data;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
};
