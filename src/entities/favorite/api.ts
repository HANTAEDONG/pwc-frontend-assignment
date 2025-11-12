import { httpClient } from "@/shared/api/http";

export interface Favorite {
  id: string;
  companyId: string;
  companyName: string;
}

export interface CreateFavoriteParams {
  companyId: string;
  companyName: string;
}

export interface UpdateFavoriteParams {
  id: string;
}

export async function getFavorites(): Promise<Favorite[]> {
  const response = await httpClient.get<Favorite[]>("/favorites");
  return response.data;
}

export async function getFavoriteById(id: string): Promise<Favorite> {
  const response = await httpClient.get<Favorite>(`/favorites/${id}`);
  return response.data;
}

export async function createFavorite(
  params: CreateFavoriteParams
): Promise<Favorite> {
  const response = await httpClient.post<Favorite>("/favorites", params);
  return response.data;
}

export async function updateFavorite(
  params: UpdateFavoriteParams
): Promise<Favorite> {
  const { id, ...updateData } = params;
  const response = await httpClient.put<Favorite>(
    `/favorites/${id}`,
    updateData
  );
  return response.data;
}

export async function deleteFavorite(id: string): Promise<void> {
  await httpClient.delete(`/favorites/${id}`);
}
