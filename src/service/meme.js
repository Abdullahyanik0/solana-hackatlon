import axiosInstance from "@/axios";

const prefix = "apply";

export const createMemeService = async (data, id,creator) => {
  const formData = new FormData();
  formData.append("image", data);
  formData.append("competationsId", id);
  formData.append("creator", creator);
  return axiosInstance.post(`${prefix}`, formData, { handleNotification: true });
};
export const likePostService = async (id,adress) => axiosInstance.post(`${prefix}/${id}`,adress);
export const unlikePostService = async (id,adress) => axiosInstance.post(`${prefix}/${id}`,adress);
