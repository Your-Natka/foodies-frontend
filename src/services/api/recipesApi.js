import api from "../api";

export const getRecipes = async (params = {}) => {
  const { data } = await api.get("/recipes", { params });
  return data;
};

export const getPopularRecipes = async () => {
  const { data } = await api.get("/recipes/popular");
  return data;
};

export const getOwnRecipes = async (params = {}) => {
  const { data } = await api.get("/recipes/own", { params });
  return data;
};

export const getRecipeById = async (id) => {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
};

export const deleteRecipe = async (id) => {
  await api.delete(`/recipes/${id}`);
};

export const createRecipe = async (formData) => {
  const { data } = await api.post("/recipes", formData);
  return data.data;
};
