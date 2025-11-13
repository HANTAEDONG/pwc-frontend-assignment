import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { AppError } from "./AppError";
import type { HTTPValidationError } from "./types";

export function setupRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
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

  if (status === 422) {
    const validationError = data as HTTPValidationError;
    if (validationError.detail && validationError.detail.length > 0) {
      const firstError = validationError.detail[0];
      const appError = new AppError(
        firstError.msg || "Validation error",
        "VALIDATION_ERROR",
        status,
        error
      );
      return Promise.reject(appError);
    }
  }

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
