import axios from "axios";

const url = typeof window !== "undefined" ? window.location.origin : "https://solana-hackatlon-livid.vercel.app";
const axiosInstance = axios.create({
  baseURL: url + "/api",
});

axiosInstance.setAuthHeader = (token) => {
  axiosInstance.defaults.headers["x-access-token"] = token;
};

export default axiosInstance;
