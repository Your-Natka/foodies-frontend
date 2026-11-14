import api from "../api";

export const getAreas = async () => {
  const { data } = await api.get("/areas");
  return data.data;
};
