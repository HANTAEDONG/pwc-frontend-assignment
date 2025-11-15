export interface DartFinancialStatementRow {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  sj_div: string;
  sj_nm: string;
  account_id: string;
  account_nm: string;
  account_detail: string;
  thstrm_nm: string;
  thstrm_amount: string;
  thstrm_add_amount: string;
  frmtrm_nm: string;
  frmtrm_amount: string;
  frmtrm_add_amount: string;
  bfefrmtrm_nm: string;
  bfefrmtrm_amount: string;
  bfefrmtrm_add_amount: string;
  ord: string;
  currency: string;
}

export interface DartFinancialStatementResponse {
  status: string;
  message: string;
  list: DartFinancialStatementRow[];
}

export interface FinancialStatementRow {
  sjDiv: string;
  sjNm: string;
  accountId: string;
  accountNm: string;
  accountDetail: string;
  thstrmAmount: string;
  thstrmNm: string;
  bfefrmtrmAmount: string;
  bfefrmtrmNm: string;
  ord: string;
}

export interface FinancialStatementResponse {
  status: string;
  message: string;
  rows: FinancialStatementRow[];
}
