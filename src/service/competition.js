import axiosInstance from "@/axios";

const prefix = "competations";

export const createCompetitionService = async (data) => axiosInstance.post(`${prefix}`, data, { handleNotification: true });

export const getCompetitionService = async () => axiosInstance.get(`/${prefix}`);

export const getSingleCompetitionService = async (id) => axiosInstance.get(`${prefix}/detail/${id}`);
