import axiosInstance from "@/axios";

const prefix = "memes";

export const createPostService = async (data) => axiosInstance.post(`${prefix}`, data, { handleNotification: true });
export const updatePostService = async (data, id) => axiosInstance.put(`${prefix}/${id}`, data, { handleNotification: true });
export const deletePostService = async (id) => axiosInstance.delete(`${prefix}/${id}`, { handleNotification: true });

export const getPostService = async (limit, offset, id) => {
  const params = new URLSearchParams();
  params.append("limit", limit || 10);
  params.append("skip", offset || 0);
  params.append("id", id);

  return axiosInstance.get(`profile/${prefix}/${id}`, { params });
};

export const getSinglePostService = async (id) => axiosInstance.get(`${prefix}/detail/${id}`);

export const getMostMemeService = async (limit, offset) => {
  const params = new URLSearchParams();
  params.append("limit", limit || 10);
  params.append("skip", offset || 0);

  return axiosInstance.get(`${prefix}/most-view`, { params });
};

export const getNewMemeService = async (limit, offset) => {
  const params = new URLSearchParams();
  params.append("limit", limit || 10);
  params.append("skip", offset || 0);

  return axiosInstance.get(`${prefix}/new`, { params });
};

export const getSavedPostService = async (limit, offset) => {
  const params = new URLSearchParams();
  params.append("limit", limit || 10);
  params.append("skip", offset || 1);

  return axiosInstance.get(`${prefix}/save`, { params });
};

export const likePostService = async (id) => axiosInstance.post(`${prefix}/up?memeId=${id}`);
export const unlikePostService = async (id) => axiosInstance.post(`${prefix}/down?memeId=${id}`);
export const savePostService = async (id) => axiosInstance.put(`${prefix}/save/${id}`);
export const unsavePostService = async (id) => axiosInstance.put(`${prefix}/unsave/${id}`);
export const reportPostService = async (id) => axiosInstance.post(`${prefix}/${id}`, id);
