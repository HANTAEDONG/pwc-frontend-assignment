import axios from "axios";
import { AppError } from "./AppError";

export const dartHttpClient = axios.create({
  baseURL: "https://opendart.fss.or.kr/api",
  headers: {
    "Content-Type": "application/json",
  },
});

dartHttpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const networkError = new AppError(
        error.message || "Network error",
        "NETWORK_ERROR",
        undefined,
        error
      );
      return Promise.reject(networkError);
    }

    const { status, data } = error.response;
    const message =
      (data as { message?: string })?.message ||
      error.message ||
      "An error occurred";

    const appError = new AppError(
      message,
      (data as { code?: string })?.code || `HTTP_${status}`,
      status,
      error
    );

    return Promise.reject(appError);
  }
);
