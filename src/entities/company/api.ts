import { httpClient } from "@/shared/api/http";
import { AppError } from "@/shared/api/AppError";

export interface CompaniesResponse {
  companies: string[];
}

export async function getCompanies(): Promise<string[]> {
  const response = await httpClient.get<CompaniesResponse>("/companies");
  return response.data.companies;
}

export interface CompanyInfo {
  corp_code: string;
  corp_name: string;
  stock_code?: string;
}

let cachedDartCompanies: CompanyInfo[] | null = null;

async function fetchCompaniesFromDart(): Promise<CompanyInfo[]> {
  try {
    // public 폴더의 정적 JSON 파일 로드
    const response = await fetch("/corp-codes.json");

    if (!response.ok) {
      throw new AppError(
        "기업 코드 목록을 불러올 수 없습니다. 먼저 'pnpm generate-corp-codes'를 실행해주세요.",
        "FILE_NOT_FOUND",
        response.status
      );
    }

    const companies: CompanyInfo[] = await response.json();
    return companies;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error instanceof Error
        ? error.message
        : "기업 목록을 가져오는 중 오류가 발생했습니다.",
      "FETCH_ERROR",
      undefined,
      error
    );
  }
}

export async function getCompaniesFromDart(
  search?: string
): Promise<CompanyInfo[]> {
  // 캐시 확인 (한 번 로드하면 계속 사용)
  if (!cachedDartCompanies) {
    cachedDartCompanies = await fetchCompaniesFromDart();
  }

  const companies = cachedDartCompanies;

  // 검색어가 있으면 필터링
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    return companies.filter((company) =>
      company.corp_name.toLowerCase().includes(searchLower)
    );
  }

  return companies;
}
