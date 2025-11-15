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
        className="h-[280px] w-full resize-none rounded-md border border-gray-border px-4 py-4 text-base leading-relaxed text-gray-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="기업에 대한 메모를 입력하세요"
      />
    </div>
  );
}
