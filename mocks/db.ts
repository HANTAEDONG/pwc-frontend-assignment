import type { FavoriteCompanyResponse } from "@/entities/favorite/api";

export const db = {
  companies: ["삼성전자", "SK하이닉스", "네이버", "카카오", "LG전자"],
  favorites: [
    {
      id: 1,
      email: "htd0913@gmail.com",
      company_name: "삼성전자",
      memo: "관심 기업",
      created_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      email: "htd0913@gmail.com",
      company_name: "SK하이닉스",
      memo: null,
      created_at: "2024-01-02T00:00:00Z",
    },
  ] as FavoriteCompanyResponse[],
};
