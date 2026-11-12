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
