import api from "../api";

export const getTestimonials = async () => {
  const { data } = await api.get("/testimonials");
  return data.data;
};
