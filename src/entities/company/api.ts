// no external http client needed for local JSON

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
