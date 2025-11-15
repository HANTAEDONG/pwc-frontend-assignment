import axios from "axios";
import { env } from "@/shared/config/env";
import {
  setupRequestInterceptor,
  setupResponseInterceptor,
} from "./interceptors";

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
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
