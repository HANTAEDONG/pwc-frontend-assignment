import { httpClient } from "@/shared/api/http";
import { AppError, isAppError } from "@/shared/api/AppError";

describe("httpClient", () => {
  describe("기본 기능", () => {
    it("httpClient 인스턴스를 생성해야 합니다.", () => {
      expect(httpClient).toBeDefined();
      expect(httpClient.defaults.baseURL).toBeDefined();
    });

    it("AppError 클래스를 가지고 있어야 합니다.", () => {
      const error = new AppError("Test error", "TEST_CODE", 500);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.statusCode).toBe(500);
    });

    it("isAppError 타입 가드를 가지고 있어야 합니다.", () => {
      const appError = new AppError("Test");
      const regularError = new Error("Test");

      expect(isAppError(appError)).toBe(true);
      expect(isAppError(regularError)).toBe(false);
      expect(isAppError(null)).toBe(false);
      expect(isAppError(undefined)).toBe(false);
    });
  });
});
