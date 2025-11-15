interface TableContainerProps {
  children: React.ReactNode;
}

export function TableContainer({ children }: TableContainerProps) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-[#C6C6C8] overflow-x-auto">
      <table
        className="w-full min-w-[640px] table-fixed border-separate border-spacing-0"
        role="table"
        aria-label="관심 기업 목록"
      >
        <caption className="sr-only">
          관심 기업 목록 테이블. 기업명, 등록일, 삭제 컬럼으로 구성되어
          있습니다.
        </caption>
        {children}
      </table>
    </div>
  );
}
