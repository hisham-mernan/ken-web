import axios from "axios";
import { apiKey } from "./apiUrl";
import { currentLanguageCode } from "../utils/switchLang";
import { toast } from "react-toastify";

let onLogout;
let showExpireTokenToast = false;
export const setLogoutHandler = (fn) => {
  onLogout = fn;
};
const axiosInstance = axios.create({
  baseURL: apiKey,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ken_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Every hop must be optional. `error.response` is undefined for anything
    // that never got an HTTP reply -- a dropped connection, a timeout, a
    // cancelled request, a CORS rejection -- and reading .data off it threw a
    // TypeError from inside the interceptor. That TypeError then replaced the
    // real error, so callers saw "Something went wrong" and the actual cause
    // was destroyed before anyone could log it.
    const detail =
      error?.response?.code ||
      error?.response?.data?.error ||
      error?.response?.data?.detail;

    const shouldLogout =
      detail === "invalid token" ||
      detail === "Token has expired" ||
      detail === "Token expired" ||
      detail === "Given token not valid for any token type" ||
      detail === "User not found";

    if (shouldLogout) {
      if (!showExpireTokenToast) {
        showExpireTokenToast = true;
        let message = "";

        if (detail === "User not found") {
          message =
            currentLanguageCode === "en"
              ? "Your account no longer exists. Please contact support or register a new account."
              : "حسابك لم يعد موجودًا. الرجاء التواصل مع الدعم أو تسجيل حساب جديد.";
        } else {
          message =
            currentLanguageCode === "en"
              ? "Your session has expired. Please log in again."
              : "انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.";
        }
        toast.error(message);
      }
      localStorage.removeItem("ken_token");

      if (onLogout) onLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
