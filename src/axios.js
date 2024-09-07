import axios from "axios";

import { errorNotify, successNotify } from "@/components/Notification";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.setAuthHeader = (token) => {
  axiosInstance.defaults.headers["x-access-token"] = token;
};
/* 
const responseSuccessInterceptor = (response) => {
  if (response.config.hasOwnProperty("handleNotification") && response.config.handleNotification === true) {
    const successMessage = statusCode[response?.data?.status_code] || "Operation successful";
    successNotify("Success", successMessage);
  }
  return response;
};

const responseErrorInterceptor = async (error) => {
  if (error?.response?.status === 401) {
    localStorage.clear();
    window.location.href = "/auth/login";
  }

  if (
    (error?.config?.hasOwnProperty("handleNotification") && error?.config?.handleNotification === true) ||
    (error?.config?.hasOwnProperty("onlyError") && error?.config?.onlyError === true)
  ) {
    if (error.response) {
      const errorMessage = statusCode[error.response?.data?.status_code] || "Operation Failed";
      errorNotify("Failure", errorMessage);
    }
  }

  return Promise.reject(error);
}; 

axiosInstance.interceptors.response.use(responseSuccessInterceptor, responseErrorInterceptor);
*/

export default axiosInstance;
