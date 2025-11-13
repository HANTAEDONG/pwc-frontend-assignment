import { httpClient } from "@/shared/api/http";

export interface CompaniesResponse {
  companies: string[];
}

export async function getCompanies(): Promise<string[]> {
  const response = await httpClient.get<CompaniesResponse>("/companies");
  return response.data.companies;
}
