import { httpClient } from "@/shared/api/http";

export interface FavoriteCompanyCreate {
  email: string;
  company_name: string;
  memo: string | null;
}

export interface FavoriteCompanyUpdate {
  memo: string | null;
}

export interface FavoriteCompanyResponse {
  id: number;
  email: string;
  company_name: string;
  memo: string | null;
  created_at: string;
}

export interface FavoriteCompanyListItem {
  id: number;
  company_name: string;
  created_at: string;
}

export interface PaginatedFavoriteCompanyResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: FavoriteCompanyListItem[];
}

export interface MessageResponse {
  message: string;
}

export interface GetFavoriteCompaniesParams {
  email: string;
  page?: number;
}

export interface GetFavoriteCompanyDetailParams {
  favorite_id: number;
  email: string;
}

export interface UpdateFavoriteCompanyParams {
  favorite_id: number;
  email: string;
  memo: string | null;
}

export interface DeleteFavoriteCompanyParams {
  favorite_id: number;
  email: string;
}

export async function getFavoriteCompanies(
  params: GetFavoriteCompaniesParams
): Promise<PaginatedFavoriteCompanyResponse> {
  const response = await httpClient.get<PaginatedFavoriteCompanyResponse>(
    "/favorites",
    {
      params: {
        email: params.email,
        page: params.page ?? 1,
      },
    }
  );
  return response.data;
}

export async function getFavoriteCompanyDetail(
  params: GetFavoriteCompanyDetailParams
): Promise<FavoriteCompanyResponse> {
  const response = await httpClient.get<FavoriteCompanyResponse>(
    `/favorites/${params.favorite_id}`,
    {
      params: {
        email: params.email,
      },
    }
  );
  return response.data;
}

export async function createFavoriteCompany(
  params: FavoriteCompanyCreate
): Promise<MessageResponse> {
  const response = await httpClient.post<MessageResponse>("/favorites", params);
  return response.data;
}

export async function updateFavoriteCompany(
  params: UpdateFavoriteCompanyParams
): Promise<MessageResponse> {
  const response = await httpClient.put<MessageResponse>(
    `/favorites/${params.favorite_id}`,
    { memo: params.memo },
    {
      params: {
        email: params.email,
      },
    }
  );
  return response.data;
}

export async function deleteFavoriteCompany(
  params: DeleteFavoriteCompanyParams
): Promise<MessageResponse | void> {
  const response = await httpClient.delete(`/favorites/${params.favorite_id}`, {
    params: {
      email: params.email,
    },
  });
  if (response.status === 204) {
    return;
  }
  return response.data as MessageResponse;
}
