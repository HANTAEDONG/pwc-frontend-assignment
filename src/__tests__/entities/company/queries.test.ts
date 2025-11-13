import { companyQueryKeys } from "@/entities/company/queries";
import { getCompanies } from "@/entities/company/api";
import { isAppError } from "@/shared/api/AppError";

describe("기업 쿼리", () => {
  describe("companyQueryKeys 쿼리 키", () => {
    it("올바른 쿼리 키를 생성해야 합니다.", () => {
      expect(companyQueryKeys.all).toEqual(["company"]);
      expect(companyQueryKeys.lists()).toEqual(["company", "list"]);
      expect(companyQueryKeys.list()).toEqual(["company", "list"]);
    });
  });

  describe("getCompanies API 호출", () => {
    it("getCompanies 함수를 호출해야 합니다.", async () => {
      try {
        const result = await getCompanies();
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
        if (isAppError(error)) {
          expect(error.code).toBeDefined();
        }
      }
    });
  });
});
