import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AppError } from "./AppError";
import { getAuthToken } from "@/shared/lib/auth";

export function setupRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function setupResponseInterceptor(error: AxiosError): Promise<never> {
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
