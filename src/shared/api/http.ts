import axios from "axios";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(setupRequestInterceptor);

httpClient.interceptors.response.use(
  (response) => response,
  setupResponseInterceptor
);

export { AppError, isAppError } from "./AppError";
