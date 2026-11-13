import api from '../api';

export const getFavoriteRecipes = async (params = {}) => {
  const { data } = await api.get('/recipes/favorites', { params });
  return data;
};

export const addRecipeToFavorites = async recipeId => {
  const { data } = await api.put(`/recipes/${recipeId}/favorite`);
  return data;
};

export const removeRecipeFromFavorites = async recipeId => {
  await api.delete(`/recipes/${recipeId}/favorite`);
};
