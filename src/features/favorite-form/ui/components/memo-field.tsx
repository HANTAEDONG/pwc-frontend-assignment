import type { UseFormRegister } from "react-hook-form";
import type { FavoriteFormData } from "../../model";

interface MemoFieldProps {
  register: UseFormRegister<FavoriteFormData>;
}

export function MemoField({ register }: MemoFieldProps) {
  return (
    <div className="mb-6 -mt-4">
      <textarea
        id="memo"
        {...register("memo")}
        className="w-full h-[280px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-[#FF8700]"
        placeholder="기업에 대한 메모를 입력하세요"
      />
    </div>
  );
}
