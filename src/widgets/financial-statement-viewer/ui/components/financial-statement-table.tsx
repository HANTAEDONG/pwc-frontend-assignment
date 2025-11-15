import type { FinancialStatementRow } from "@/entities/financial-statement";

interface FinancialStatementTableProps {
  rows: FinancialStatementRow[];
  sjDiv: string;
}

function formatAmount(amount: string): string {
  if (!amount || amount === "-") return "-";
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat("ko-KR").format(num);
}

export function FinancialStatementTable({
  rows,
  sjDiv,
}: FinancialStatementTableProps) {
  const filteredRows = rows.filter((row) => row.sjDiv === sjDiv);

  if (filteredRows.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        조회된 재무제표 데이터가 없습니다.
      </div>
    );
  }

  const sjNm = filteredRows[0]?.sjNm || "";

  const sortedRows = [...filteredRows].sort((a, b) => {
    const ordA = parseInt(a.ord) || 0;
    const ordB = parseInt(b.ord) || 0;
    return ordA - ordB;
  });

  const uniquePeriods = Array.from(
    new Set(
      sortedRows
        .flatMap((row) => [row.thstrmNm, row.bfefrmtrmNm])
        .filter(Boolean)
    )
  ).sort();

  const getAmountForPeriod = (row: FinancialStatementRow, period: string) => {
    if (row.thstrmNm === period) return row.thstrmAmount;
    if (row.bfefrmtrmNm === period) return row.bfefrmtrmAmount;
    return "-";
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{sjNm}</h3>
        <p className="text-sm text-gray-600">(단위 : 원)</p>
      </div>
      <table className="w-full min-w-[800px] border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              과
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
              목
            </th>
            {uniquePeriods.map((period, index) => (
              <th
                key={period}
                className="border border-gray-300 px-4 py-2 text-center font-semibold"
              >
                {period}
                {index === 0
                  ? " (당) 기"
                  : index === 1
                  ? " (전) 기"
                  : " (전전) 기"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, index) => (
            <tr key={`${row.accountId}-${index}`} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                {row.accountDetail || "-"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {row.accountNm}
              </td>
              {uniquePeriods.map((period) => (
                <td
                  key={period}
                  className="border border-gray-300 px-4 py-2 text-right"
                >
                  {formatAmount(getAmountForPeriod(row, period))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

