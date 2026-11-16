import api from "../api";

export const getCurrentUser = async () => {
  const { data } = await api.get("/users/current");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.patch("/users/current/avatar", formData);

  return data;
};

export const getUserFollowers = async (id, params = {}) => {
  const { data } = await api.get(`/users/${id}/followers`, { params });
  return data;
};

export const getMyFollowing = async (params = {}) => {
  const { data } = await api.get("/users/following", { params });
  return data;
};

export const followUser = async (id) => {
  const { data } = await api.put(`/users/${id}/follow`);
  return data;
};

export const unfollowUser = async (id) => {
  await api.delete(`/users/${id}/follow`);
};
