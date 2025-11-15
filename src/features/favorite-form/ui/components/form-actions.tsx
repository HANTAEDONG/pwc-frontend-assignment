import { Button } from "@/shared/ui";

interface FormActionsProps {
  errorMessage?: string;
  isPending: boolean;
}

export function FormActions({ errorMessage, isPending }: FormActionsProps) {
  return (
    <div className="flex items-center justify-between">
      {errorMessage ? (
        <div id="company-error" role="alert" className="text-sm text-red-600">
          {errorMessage}
        </div>
      ) : (
        <div />
      )}
      <Button
        type="submit"
        disabled={isPending}
        variant="fill"
        className="bg-black hover:bg-gray-800"
      >
        저장
      </Button>
    </div>
  );
}
