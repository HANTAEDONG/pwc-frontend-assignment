export const REPORT_CODE_MAP = {
  "1분기보고서": "11013",
  반기보고서: "11012",
  "3분기보고서": "11014",
  사업보고서: "11011",
} as const;

export const FS_DIV_MAP = {
  OFS: "OFS",
  CFS: "CFS",
} as const;

export const SJ_DIV_MAP = {
  BS: "BS",
  IS: "IS",
  CIS: "CIS",
  CF: "CF",
  SCE: "SCE",
} as const;

export const REPORT_NAME_OPTIONS = [
  { label: "1분기보고서", value: REPORT_CODE_MAP["1분기보고서"] },
  { label: "반기보고서", value: REPORT_CODE_MAP["반기보고서"] },
  { label: "3분기보고서", value: REPORT_CODE_MAP["3분기보고서"] },
  { label: "사업보고서", value: REPORT_CODE_MAP["사업보고서"] },
] as const;

export const FS_DIV_OPTIONS = [
  { label: "재무제표 (개별)", value: FS_DIV_MAP.OFS },
  { label: "연결재무제표", value: FS_DIV_MAP.CFS },
] as const;

export const SJ_DIV_OPTIONS = [
  { label: "재무상태표", value: SJ_DIV_MAP.BS },
  { label: "손익계산서", value: SJ_DIV_MAP.IS },
  { label: "포괄손익계산서", value: SJ_DIV_MAP.CIS },
  { label: "현금흐름표", value: SJ_DIV_MAP.CF },
  { label: "자본변동표", value: SJ_DIV_MAP.SCE },
] as const;

const currentYear = new Date().getFullYear();
export const BUSINESS_YEAR_OPTIONS = Array.from(
  { length: currentYear - 2014 },
  (_, i) => currentYear - i
).map((year) => ({ label: `${year}`, value: `${year}` }));
