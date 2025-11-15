interface SkeletonRowProps {
  companyColumnClassName?: string;
  createdColumnClassName?: string;
}

export function SkeletonRow({
  companyColumnClassName = "w-[55%]",
  createdColumnClassName = "w-[25%]",
}: SkeletonRowProps) {
  return (
    <tr className="h-[50px] border-b border-[#C6C6C8] last:border-b-0">
      <td className="w-[60px] px-[15px]">
        <div className="h-4 w-4 rounded bg-gray-200" />
      </td>
      <td className={`px-4 ${companyColumnClassName}`}>
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </td>
      <td className={`px-4 ${createdColumnClassName}`}>
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </td>
      <td className="px-4 w-[74px]">
        <div className="mx-auto h-4 w-6 rounded bg-gray-200" />
      </td>
      <td className="px-2 w-[17px]">
        <div className="h-4 w-full rounded bg-gray-200" />
      </td>
    </tr>
  );
}
