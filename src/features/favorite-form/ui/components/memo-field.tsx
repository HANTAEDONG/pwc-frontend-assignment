import type { UseFormRegister } from "react-hook-form";
import type { FavoriteFormData } from "../../model";

interface MemoFieldProps {
  register: UseFormRegister<FavoriteFormData>;
}

export function MemoField({ register }: MemoFieldProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="memo"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        기업 메모
      </label>
      <textarea
        id="memo"
        {...register("memo")}
        rows={8}
        className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-0 focus:border-[#FF8700]"
        placeholder="기업에 대한 메모를 입력하세요"
      />
    </div>
  );
}
