import { memo, useMemo } from "react";
import type { FinancialStatementRow } from "@/entities/financial-statement";
import { REPORT_CODE_MAP } from "@/entities/financial-statement";

interface FinancialStatementTableProps {
  rows: FinancialStatementRow[];
  reprtCode: string;
  bsnsYear?: string;
}

function formatAmount(amount: string): string {
  if (!amount || amount === "-" || amount.trim() === "") return "　";
  const num = parseFloat(amount);
  if (isNaN(num)) return "　";

  const millionWon = num / 1000000;
  return new Intl.NumberFormat("ko-KR").format(millionWon);
}

// ord 값의 길이를 기반으로 들여쓰기 레벨 결정
function getIndentLevel(ord: string): number {
  const ordNum = parseInt(ord) || 0;
  if (ordNum === 0) return 0;
  return ord.toString().length - 1;
}

// 들여쓰기 레벨에 따라 공백 문자 반환
function getIndentPrefix(ord: string): string {
  const level = getIndentLevel(ord);
  return "　".repeat(level);
}

// 공통 테이블 스타일
const tableStyle = {
  tableLayout: "fixed" as const,
  fontSize: "11pt",
  fontFamily: '"굴림", Gulim, sans-serif',
  borderCollapse: "collapse" as const,
  borderStyle: "solid" as const,
  borderColor: "black",
  color: "#000000",
};

const thStyle = {
  fontSize: "11pt",
  lineHeight: "1.6em",
  fontFamily: '"굴림", Gulim, sans-serif',
  backgroundColor: "#dcdcdc",
  borderColor: "gray",
  padding: "4px 4px 2px 4px",
  fontWeight: "normal" as const,
};

const tdStyle = {
  fontSize: "11pt",
  lineHeight: "1.6em",
  fontFamily: '"굴림", Gulim, sans-serif',
  borderColor: "gray",
  padding: "4px 4px 2px 4px",
};

// 기간명에서 날짜 추출 또는 계산
function getPeriodWithDate(
  period: string,
  bsnsYear: string,
  reprtCode: string
): string {
  // 기간명에 이미 날짜가 포함되어 있는지 확인
  const dateMatch = period.match(/(\d{4}\.\d{2}\.\d{2})/);
  if (dateMatch) {
    return period; // 이미 날짜가 포함되어 있으면 그대로 반환
  }

  // 날짜가 없으면 보고서 유형과 사업연도로 계산
  const year = parseInt(bsnsYear);
  if (isNaN(year)) {
    return period; // 유효한 연도가 아니면 원본 반환
  }

  let endDateStr = "";
  const startDateStr = `${year}.01.01`;

  if (reprtCode === REPORT_CODE_MAP["1분기보고서"]) {
    // 1분기말: 3월 31일
    endDateStr = `${year}.03.31`;
  } else if (reprtCode === REPORT_CODE_MAP["반기보고서"]) {
    // 반기말: 6월 30일
    endDateStr = `${year}.06.30`;
  } else if (reprtCode === REPORT_CODE_MAP["3분기보고서"]) {
    // 3분기말: 9월 30일
    endDateStr = `${year}.09.30`;
  } else if (reprtCode === REPORT_CODE_MAP["사업보고서"]) {
    // 사업보고서(연말): 12월 31일
    endDateStr = `${year}.12.31`;
  }

  if (!endDateStr) {
    return period; // 날짜를 계산할 수 없으면 원본 반환
  }

  // 기간명에 "말"이 포함되어 있으면 종료일만 추가 (재무상태표, 현금흐름표)
  if (period.includes("말")) {
    return `${period} ${endDateStr} 현재`;
  }

  // 기간명에 "부터"가 포함되어 있으면 시작일과 종료일 표시 (손익계산서, 포괄손익계산서, 자본변동표)
  if (period.includes("부터")) {
    // 이미 "부터"가 있으면 그대로 사용하되, 날짜가 없으면 추가
    return `${period} ${startDateStr} 부터 ${endDateStr} 까지`;
  }

  // 기간명에 "분기"가 포함되어 있으면 시작일과 종료일 표시 (손익계산서, 포괄손익계산서)
  if (period.includes("분기") && !period.includes("말")) {
    return `${period} ${startDateStr} 부터 ${endDateStr} 까지`;
  }

  // 기간명에 "기"가 포함되어 있으면 (예: "제 56 기말")
  if (period.includes("기") && period.includes("말")) {
    return `${period} ${endDateStr} 현재`;
  }

  // 그 외의 경우에도 종료일 추가 시도
  return `${period} ${endDateStr} 현재`;
}

// 헤더 테이블 컴포넌트
function HeaderTable({
  sjNm,
  periods,
  unitLabel,
  bsnsYear,
  reprtCode,
}: {
  sjNm: string;
  periods: string[];
  unitLabel: string;
  bsnsYear?: string;
  reprtCode?: string;
}) {
  return (
    <table
      className="w-full mb-0 border-collapse"
      style={{
        borderStyle: "none",
        fontSize: "12pt",
        fontFamily: '"바탕", Batang, serif',
      }}
    >
      <tbody>
        <tr>
          <td
            className="text-center py-2"
            style={{
              fontSize: "12pt",
              fontWeight: "bold",
              fontFamily: '"바탕", Batang, serif',
            }}
          >
            {sjNm}
          </td>
        </tr>
        {periods.map((period, index) => {
          const periodWithDate =
            bsnsYear && reprtCode
              ? getPeriodWithDate(period, bsnsYear, reprtCode)
              : period;
          return (
            <tr key={`period-${index}`}>
              <td className="text-center py-1" style={{ fontSize: "11pt" }}>
                {periodWithDate}
              </td>
            </tr>
          );
        })}
        <tr>
          <td
            className="text-right py-1"
            style={{
              fontSize: "11pt",
              fontFamily: '"바탕", Batang, serif',
            }}
          >
            (단위 : {unitLabel})
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// 단순 구조 렌더러 (BS, CF)
function SimpleTableRenderer({
  sjDiv,
  sjNm,
  rows,
  periods,
  getAmountForPeriod,
  bsnsYear,
  reprtCode,
}: {
  sjDiv: string;
  sjNm: string;
  rows: FinancialStatementRow[];
  periods: string[];
  getAmountForPeriod: (row: FinancialStatementRow, period: string) => string;
  bsnsYear?: string;
  reprtCode?: string;
}) {
  const unitLabel = "백만원";

  return (
    <div className="overflow-x-auto">
      <HeaderTable
        sjNm={sjNm}
        periods={periods}
        unitLabel={unitLabel}
        bsnsYear={bsnsYear}
        reprtCode={reprtCode}
      />
      <table
        className="w-full min-w-[600px] border-collapse border border-black mb-1.5"
        style={tableStyle}
      >
        <thead>
          <tr>
            <th className="text-left border border-gray-500" style={thStyle}>
              　
            </th>
            {periods.map((period, idx) => (
              <th
                key={period}
                className={`text-center border border-gray-500 ${
                  idx === periods.length - 1 ? "hidden sm:table-cell" : ""
                }`}
                style={thStyle}
              >
                {period}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const indentPrefix = getIndentPrefix(row.ord);
            return (
              <tr key={`${row.accountId}-${sjDiv}-${index}`}>
                <td
                  className="text-left border border-gray-500"
                  style={tdStyle}
                >
                  {indentPrefix}
                  {row.accountNm}
                  {row.accountDetail ? ` (${row.accountDetail})` : ""}
                </td>
                {periods.map((period, idx) => {
                  const amount = getAmountForPeriod(row, period);
                  return (
                    <td
                      key={period}
                      className={`text-right border border-gray-500 ${
                        idx === periods.length - 1 ? "hidden sm:table-cell" : ""
                      }`}
                      style={tdStyle}
                    >
                      {formatAmount(amount)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 3개월/누적 구조 렌더러 (IS, CIS - 1분기, 3분기 보고서)
function QuarterlyTableRenderer({
  sjDiv,
  sjNm,
  rows,
  periods,
  bsnsYear,
  reprtCode,
}: {
  sjDiv: string;
  sjNm: string;
  rows: FinancialStatementRow[];
  periods: string[];
  bsnsYear?: string;
  reprtCode?: string;
}) {
  const unitLabel = "백만원";

  // periods를 그룹화: 분기 보고서인 경우 각 기간에 대해 [3개월, 누적] 2개 서브 컬럼 생성
  const periodGroups: Array<{ main: string; sub: Array<"3개월" | "누적"> }> =
    periods.map((p) =>
      p.includes("분기")
        ? { main: p, sub: ["3개월", "누적"] }
        : { main: p, sub: ["3개월", "누적"] } // 손익/포괄손익은 분기/반기에 상관없이 3개월/누적 구조를 유지
    );

  function getQuarterlyAmounts(
    row: FinancialStatementRow,
    mainPeriod: string
  ): { threeMonth: string; cumulative: string } {
    if (row.thstrmNm === mainPeriod) {
      return {
        threeMonth: row.thstrmAmount,
        cumulative: row.thstrmAddAmount ?? row.thstrmAmount,
      };
    }
    if (row.frmtrmNm === mainPeriod) {
      return {
        threeMonth: row.frmtrmAmount,
        cumulative: row.frmtrmAddAmount ?? row.frmtrmAmount,
      };
    }
    if (row.bfefrmtrmNm === mainPeriod) {
      return {
        threeMonth: row.bfefrmtrmAmount,
        cumulative: row.bfefrmtrmAddAmount ?? row.bfefrmtrmAmount,
      };
    }
    return { threeMonth: "-", cumulative: "-" };
  }

  return (
    <div className="overflow-x-auto">
      <HeaderTable
        sjNm={sjNm}
        periods={periods}
        unitLabel={unitLabel}
        bsnsYear={bsnsYear}
        reprtCode={reprtCode}
      />
      <table
        className="w-full min-w-[600px] border-collapse border border-black mb-1.5"
        style={tableStyle}
      >
        <thead>
          <tr>
            <th
              className="text-left border border-gray-500"
              style={thStyle}
              rowSpan={2}
            >
              　
            </th>
            {periodGroups.map((group) => (
              <th
                key={group.main}
                className="text-center border border-gray-500"
                style={thStyle}
                colSpan={group.sub.length}
              >
                {group.main}
              </th>
            ))}
          </tr>
          <tr>
            {periodGroups.map((group) =>
              group.sub.map((sub) => (
                <th
                  key={`${group.main}-${sub}`}
                  className="text-center border border-gray-500"
                  style={thStyle}
                >
                  {sub}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const indentPrefix = getIndentPrefix(row.ord);
            return (
              <tr key={`${row.accountId}-${sjDiv}-${index}`}>
                <td
                  className="text-left border border-gray-500"
                  style={tdStyle}
                >
                  {indentPrefix}
                  {row.accountNm}
                  {row.accountDetail ? ` (${row.accountDetail})` : ""}
                </td>
                {periodGroups.map((group) => {
                  const { threeMonth, cumulative } = getQuarterlyAmounts(
                    row,
                    group.main
                  );
                  return (
                    <>
                      <td
                        key={`${group.main}-3개월`}
                        className="text-right border border-gray-500"
                        style={tdStyle}
                      >
                        {formatAmount(threeMonth)}
                      </td>
                      <td
                        key={`${group.main}-누적`}
                        className="text-right border border-gray-500"
                        style={tdStyle}
                      >
                        {formatAmount(cumulative)}
                      </td>
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 자본변동표 렌더러 (SCE) - 복잡한 다중 컬럼 구조
function CapitalTableRenderer({
  sjDiv,
  sjNm,
  rows,
  periods,
  getAmountForPeriod,
  bsnsYear,
  reprtCode,
}: {
  sjDiv: string;
  sjNm: string;
  rows: FinancialStatementRow[];
  periods: string[];
  getAmountForPeriod: (row: FinancialStatementRow, period: string) => string;
  bsnsYear?: string;
  reprtCode?: string;
}) {
  const unitLabel = "백만원";

  // 자본변동표는 특별한 구조이므로 단순 구조로 시작
  // 실제 데이터 구조에 맞게 조정 필요
  return (
    <div className="overflow-x-auto">
      <HeaderTable
        sjNm={sjNm}
        periods={periods}
        unitLabel={unitLabel}
        bsnsYear={bsnsYear}
        reprtCode={reprtCode}
      />
      <table
        className="w-full min-w-[1200px] border-collapse border border-black mb-1.5"
        style={tableStyle}
      >
        <thead>
          <tr>
            <th
              className="text-left border border-gray-500"
              style={thStyle}
              rowSpan={3}
            >
              　
            </th>
            <th
              className="text-center border border-gray-500"
              style={thStyle}
              colSpan={7}
            >
              자본
            </th>
          </tr>
          <tr>
            <th
              className="text-center border border-gray-500"
              style={thStyle}
              colSpan={5}
            >
              지배기업의 소유주에게 귀속되는 지분
            </th>
            <th
              className="text-center border border-gray-500"
              style={thStyle}
              rowSpan={2}
            >
              비지배지분
            </th>
            <th
              className="text-center border border-gray-500"
              style={thStyle}
              rowSpan={2}
            >
              자본 합계
            </th>
          </tr>
          <tr>
            <th className="text-center border border-gray-500" style={thStyle}>
              자본금
            </th>
            <th className="text-center border border-gray-500" style={thStyle}>
              주식발행초과금
            </th>
            <th className="text-center border border-gray-500" style={thStyle}>
              이익잉여금
            </th>
            <th className="text-center border border-gray-500" style={thStyle}>
              기타자본항목
            </th>
            <th className="text-center border border-gray-500" style={thStyle}>
              지배기업의 소유주에게 귀속되는 지분 합계
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const indentPrefix = getIndentPrefix(row.ord);
            return (
              <tr key={`${row.accountId}-${sjDiv}-${index}`}>
                <td
                  className="text-left border border-gray-500"
                  style={tdStyle}
                >
                  {indentPrefix}
                  {row.accountNm}
                  {row.accountDetail ? ` (${row.accountDetail})` : ""}
                </td>
                {/* 자본변동표는 실제 데이터 구조에 맞게 조정 필요 */}
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <td
                    key={i}
                    className="text-right border border-gray-500"
                    style={tdStyle}
                  >
                    {formatAmount(getAmountForPeriod(row, periods[0] || ""))}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const FinancialStatementTable = memo(function FinancialStatementTable({
  rows,
  reprtCode,
  bsnsYear,
}: FinancialStatementTableProps) {
  // sjDiv별로 그룹화 (메모화)
  const groupedBySjDiv = rows.reduce<Record<string, FinancialStatementRow[]>>(
    (acc, row) => {
      if (!acc[row.sjDiv]) {
        acc[row.sjDiv] = [];
      }
      acc[row.sjDiv].push(row);
      return acc;
    },
    {}
  );

  const sortedSjDivs = useMemo(() => {
    const sjDivOrder = ["BS", "IS", "CIS", "CF", "SCE"];
    return Object.keys(groupedBySjDiv).sort((a, b) => {
      const indexA = sjDivOrder.indexOf(a);
      const indexB = sjDivOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [groupedBySjDiv]);

  // sjDiv 별로 정렬된 rows와 기간 컬럼을 사전 계산 (메모화)
  const preparedBySjDiv = useMemo(() => {
    const result: Record<
      string,
      { sortedRows: FinancialStatementRow[]; periodsOrdered: string[] }
    > = {};
    for (const sjDiv of Object.keys(groupedBySjDiv)) {
      const filteredRows = groupedBySjDiv[sjDiv];
      const sortedRows = [...filteredRows].sort((a, b) => {
        const ordA = parseInt(a.ord) || 0;
        const ordB = parseInt(b.ord) || 0;
        return ordA - ordB;
      });
      const first = sortedRows[0];
      const preferred = [
        first?.thstrmNm,
        first?.frmtrmNm,
        first?.bfefrmtrmNm,
      ].filter((p): p is string => !!p);
      const periodsOrdered =
        preferred.length > 0
          ? preferred
          : sortedRows.reduce<string[]>((acc, row) => {
              const candidate = [
                row.thstrmNm,
                row.frmtrmNm,
                row.bfefrmtrmNm,
              ].filter((p): p is string => !!p);
              candidate.forEach((p) => {
                if (!acc.includes(p)) acc.push(p);
              });
              return acc;
            }, []);
      result[sjDiv] = { sortedRows, periodsOrdered };
    }
    return result;
  }, [groupedBySjDiv]);

  const isQuarterlyReport =
    reprtCode === REPORT_CODE_MAP["1분기보고서"] ||
    reprtCode === REPORT_CODE_MAP["3분기보고서"];

  return (
    <div className="space-y-8 max-h-[600px] overflow-y-auto pr-2">
      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          조회된 재무제표 데이터가 없습니다.
        </div>
      )}
      {rows.length > 0 &&
        sortedSjDivs.map((sjDiv) => {
          const { sortedRows, periodsOrdered } = preparedBySjDiv[sjDiv];
          const sjNm = sortedRows[0]?.sjNm || "";

          const getAmountForPeriod = (
            row: FinancialStatementRow,
            period: string
          ) => {
            if (row.thstrmNm === period) return row.thstrmAmount;
            if (row.frmtrmNm === period) return row.frmtrmAmount;
            if (row.bfefrmtrmNm === period) return row.bfefrmtrmAmount;
            return "-";
          };

          // sjDiv에 따라 다른 렌더러 선택
          if (sjDiv === "BS" || sjDiv === "CF") {
            return (
              <SimpleTableRenderer
                key={sjDiv}
                sjDiv={sjDiv}
                sjNm={sjNm}
                rows={sortedRows}
                periods={periodsOrdered}
                getAmountForPeriod={getAmountForPeriod}
                bsnsYear={bsnsYear}
                reprtCode={reprtCode}
              />
            );
          } else if ((sjDiv === "IS" || sjDiv === "CIS") && isQuarterlyReport) {
            return (
              <QuarterlyTableRenderer
                key={sjDiv}
                sjDiv={sjDiv}
                sjNm={sjNm}
                rows={sortedRows}
                periods={periodsOrdered}
                bsnsYear={bsnsYear}
                reprtCode={reprtCode}
              />
            );
          } else if (sjDiv === "SCE") {
            return (
              <CapitalTableRenderer
                key={sjDiv}
                sjDiv={sjDiv}
                sjNm={sjNm}
                rows={sortedRows}
                periods={periodsOrdered}
                getAmountForPeriod={getAmountForPeriod}
                bsnsYear={bsnsYear}
                reprtCode={reprtCode}
              />
            );
          } else {
            // 기본 렌더러 (IS, CIS - 반기/사업보고서)
            return (
              <SimpleTableRenderer
                key={sjDiv}
                sjDiv={sjDiv}
                sjNm={sjNm}
                rows={sortedRows}
                periods={periodsOrdered}
                getAmountForPeriod={getAmountForPeriod}
                bsnsYear={bsnsYear}
                reprtCode={reprtCode}
              />
            );
          }
        })}
    </div>
  );
});
