import { Button } from "@/shared/ui";

interface FormActionsProps {
  errorMessage?: string;
  isPending: boolean;
}

export function FormActions({ errorMessage, isPending }: FormActionsProps) {
  return (
    <div className="-mx-5 -mb-0 mt-0 flex items-center justify-end gap-3 px-5 py-5">
      {errorMessage && (
        <div id="company-error" role="alert" className="text-sm text-danger">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        disabled={isPending}
        variant="secondary"
      >
        저장
      </Button>
    </div>
  );
}
