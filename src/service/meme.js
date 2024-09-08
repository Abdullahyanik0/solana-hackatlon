import axiosInstance from "@/axios";

const prefix = "apply";
const memePrefix = "memes";

export const createMemeService = async (data, id, creator) => {
  const formData = new FormData();
  formData.append("image", data);
  formData.append("competationsId", id);
  formData.append("creator", creator);
  return axiosInstance.post(`${prefix}`, formData, {
    handleNotification: true,
  });
};
export const likePostService = async (id, address) => axiosInstance.put(`${prefix}/${id}/like`, { address });
export const unlikePostService = async (id, address) => axiosInstance.put(`${prefix}/${id}/unlike`, { address });

export const getMemeTemplate = async (text) => {
 return axiosInstance.post(`${memePrefix}`, { text: text });
};
