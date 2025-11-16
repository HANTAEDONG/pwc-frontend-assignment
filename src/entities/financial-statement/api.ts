import { dartHttpClient } from "@/shared/api/dart-http";
import { env } from "@/shared/config/env";
import { AppError } from "@/shared/api/AppError";
import type {
  DartFinancialStatementResponse,
  FinancialStatementResponse,
  FinancialStatementRow,
} from "./model/types";

export interface GetFinancialStatementParams {
  corp_code: string;
  bsns_year: string;
  reprt_code: string;
  fs_div: string;
}

export async function getFinancialStatement(
  params: GetFinancialStatementParams
): Promise<FinancialStatementResponse> {
  const response = await dartHttpClient.get<DartFinancialStatementResponse>(
    "/fnlttSinglAcntAll.json",
    {
      params: {
        crtfc_key: env.dartApiKey,
        corp_code: params.corp_code,
        bsns_year: params.bsns_year,
        reprt_code: params.reprt_code,
        fs_div: params.fs_div,
      },
    }
  );

  const data = response.data;

  if (data.status !== "000") {
    const errorMessage =
      data.status === "013"
        ? "제무제표를 조회 중 오류가 발생했습니다.\n옵션을 확인 후 다시 시도해주세요."
        : data.message || "재무제표 조회에 실패했습니다.";
    throw new AppError(errorMessage, data.status, undefined, data);
  }

  const rows: FinancialStatementRow[] = (data.list || []).map((item) => ({
    sjDiv: item.sj_div,
    sjNm: item.sj_nm,
    accountId: item.account_id,
    accountNm: item.account_nm,
    accountDetail: item.account_detail,
    thstrmAmount: item.thstrm_amount,
    thstrmAddAmount: item.thstrm_add_amount,
    thstrmNm: item.thstrm_nm,
    frmtrmAmount: item.frmtrm_amount,
    frmtrmAddAmount: item.frmtrm_add_amount,
    frmtrmNm: item.frmtrm_nm,
    bfefrmtrmAmount: item.bfefrmtrm_amount,
    bfefrmtrmAddAmount: item.bfefrmtrm_add_amount,
    bfefrmtrmNm: item.bfefrmtrm_nm,
    ord: item.ord,
    currency: item.currency,
  }));

  return {
    status: data.status,
    message: data.message,
    rows,
  };
}
