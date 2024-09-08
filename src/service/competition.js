import axiosInstance from "@/axios";

const prefix = "competations";
const feedPrefix = "feed";

export const createCompetitionService = async (data) => {
  const formData = new FormData();
  data.name && formData.append("name", data.name);
  data.description && formData.append("description", data.description);
  data.reward && formData.append("reward", data.reward);
  data.expireTime && formData.append("expireTime", data.expireTime);
  data.creator && formData.append("creator", data.creator);
  data.image && formData.append("image", data.image);
  return axiosInstance.post(`${prefix}`, formData, { handleNotification: true });
};

export const getCompetitionService = async () => axiosInstance.get(`/${prefix}`);

export const getSingleCompetitionService = async (id) => axiosInstance.get(`${prefix}/${id}`);

export const getFeedService = async () => axiosInstance.get(`/${feedPrefix}`);