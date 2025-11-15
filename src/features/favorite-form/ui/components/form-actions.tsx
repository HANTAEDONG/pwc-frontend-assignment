import { Button } from "@/shared/ui";

interface FormActionsProps {
  errorMessage?: string;
  isPending: boolean;
}

export function FormActions({ errorMessage, isPending }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 -mx-5 -mb-0 mt-0 px-5 py-5">
      {errorMessage && (
        <div id="company-error" role="alert" className="text-sm text-red-600">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        disabled={isPending}
        variant="fill"
        className="bg-black hover:bg-gray-800 px-4 py-2 gap-2 rounded"
      >
        저장
      </Button>
    </div>
  );
}
