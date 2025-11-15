import { favoriteQueryKeys } from "@/entities/favorite/queries";
import {
  getFavoriteCompanies,
  getFavoriteCompanyDetail,
} from "@/entities/favorite/api";

describe("관심 기업 쿼리", () => {
  describe("favoriteQueryKeys 쿼리 키", () => {
    it("올바른 쿼리 키를 생성해야 합니다.", () => {
      expect(favoriteQueryKeys.all).toEqual(["favorite"]);
      expect(favoriteQueryKeys.lists()).toEqual(["favorite", "list"]);
      expect(favoriteQueryKeys.list("htd0913@gmail.com", 1)).toEqual([
        "favorite",
        "list",
        "htd0913@gmail.com",
        1,
      ]);
      expect(favoriteQueryKeys.details()).toEqual(["favorite", "detail"]);
      expect(favoriteQueryKeys.detail(1, "htd0913@gmail.com")).toEqual([
        "favorite",
        "detail",
        1,
        "htd0913@gmail.com",
      ]);
    });
  });

  describe("getFavoriteCompanies API 호출", () => {
    it("getFavoriteCompanies 함수를 호출해야 합니다.", async () => {
      try {
        await getFavoriteCompanies({ email: "htd0913@gmail.com", page: 1 });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("getFavoriteCompanyDetail API 호출", () => {
    it("getFavoriteCompanyDetail 함수를 호출해야 합니다.", async () => {
      try {
        await getFavoriteCompanyDetail({
          favorite_id: 1,
          email: "htd0913@gmail.com",
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
