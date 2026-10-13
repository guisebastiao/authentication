import { ApiBodyError } from "@/shared/types/api";
import { AlertCircle } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";

type ErrorComponentProps = {
  error: ApiBodyError;
};

export const ErrorComponent = ({ error }: ErrorComponentProps) => {
  const title = error.code;
  const message = error.code;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
