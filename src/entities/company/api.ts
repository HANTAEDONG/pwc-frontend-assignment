import { httpClient } from "@/shared/api/http";

export interface Company {
  id: string;
  name: string;
}

export interface CompanySearchParams {
  keyword: string;
}

export interface CompanySearchResponse {
  companies: Company[];
}

export async function searchCompanies(
  params: CompanySearchParams
): Promise<CompanySearchResponse> {
  const response = await httpClient.get<CompanySearchResponse>(
    "/companies/search",
    { params }
  );
  return response.data;
}
