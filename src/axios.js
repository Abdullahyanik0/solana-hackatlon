import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://solana-hackatlon-livid.vercel.app/",
});

axiosInstance.setAuthHeader = (token) => {
  axiosInstance.defaults.headers["x-access-token"] = token;
};

export default axiosInstance;
