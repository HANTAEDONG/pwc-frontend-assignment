import { httpClient } from "@/shared/api/http";
import { dartHttpClient } from "@/shared/api/dart-http";
import { env } from "@/shared/config/env";
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
}

let cachedDartCompanies: CompanyInfo[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000;
async function fetchCompaniesFromDart(): Promise<CompanyInfo[]> {
  try {
    const response = await dartHttpClient.get("/corpCode.xml", {
      params: {
        crtfc_key: env.dartApiKey,
      },
      responseType: "arraybuffer",
    });
    const arrayBuffer = response.data;

    const JSZip = await import("jszip");
    const zip = await JSZip.default.loadAsync(arrayBuffer);

    const xmlFile = zip.file("CORPCODE.xml");
    if (!xmlFile) {
      throw new AppError(
        "CORPCODE.xml 파일을 찾을 수 없습니다.",
        "FILE_NOT_FOUND",
        undefined
      );
    }

    const xmlText = await xmlFile.async("string");

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new AppError(
        "XML 파싱 중 오류가 발생했습니다.",
        "XML_PARSE_ERROR",
        undefined
      );
    }

    const companies: CompanyInfo[] = [];
    const listItems = xmlDoc.querySelectorAll("list");

    listItems.forEach((item) => {
      const corpCode = item.querySelector("corp_code")?.textContent?.trim();
      const corpName = item.querySelector("corp_name")?.textContent?.trim();

      if (corpCode && corpName) {
        companies.push({
          corp_code: corpCode,
          corp_name: corpName,
        });
      }
    });

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
  const now = Date.now();
  let companies: CompanyInfo[];

  if (cachedDartCompanies && now - cacheTimestamp < CACHE_DURATION) {
    companies = cachedDartCompanies;
  } else {
    companies = await fetchCompaniesFromDart();
    cachedDartCompanies = companies;
    cacheTimestamp = now;
  }

  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    return companies.filter((company) =>
      company.corp_name.toLowerCase().includes(searchLower)
    );
  }
  return companies;
}
