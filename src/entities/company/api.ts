// no external http client needed for local JSON
import { httpClient } from "@/shared/api/http";

export interface CompaniesResponse {
  companies: string[];
}

export async function getCompanies(): Promise<string[]> {
  try {
    const res = await fetch("/corp-codes.json");
    if (!res.ok) throw new Error("Failed to load corp-codes.json");
    const data = (await res.json()) as CompanyInfo[];
    return data.map((c) => c.corp_name);
  } catch {
    return [];
  }
}

export interface CompanyInfo {
  corp_code: string;
  corp_name: string;
  stock_code?: string;
}

// Remote API: GET /companies
export async function getCompaniesRemote(): Promise<string[]> {
  try {
    const res = await httpClient.get("/companies");
    const data = res.data as unknown;
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as { companies?: unknown }).companies)
    ) {
      return ((data as { companies: unknown[] }).companies as string[]).filter(
        (v): v is string => typeof v === "string"
      );
    }
    // If API returns a flat array
    if (Array.isArray(data)) {
      return (data as unknown[]).filter(
        (v): v is string => typeof v === "string"
      );
    }
    return [];
  } catch {
    return [];
  }
}
