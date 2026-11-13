import api from '../api';

export const getIngredients = async () => {
  const { data } = await api.get('/ingredients');
  return data;
};
