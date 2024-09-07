import axiosInstance from "@/axios";

const prefix = "memes";

export const createPostService = async (data) => axiosInstance.post(`${prefix}`, data, { handleNotification: true });
export const likePostService = async (id) => axiosInstance.post(`${prefix}/up?memeId=${id}`);
export const unlikePostService = async (id) => axiosInstance.post(`${prefix}/down?memeId=${id}`);
