"use client";

import { EmptyComponent } from "@/shared/components/empty-component";
import { ErrorComponent } from "@/shared/components/error-component";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpApiError } from "@/shared/lib/http/http-error";
import { Spinner } from "@/shared/components/ui/spinner";
import React from "react";

type AsyncBoundaryProps<T> = {
  data: T | null | undefined;
  isLoading?: boolean;
  error?: HttpApiError | null | undefined;
  isEmpty?: (data: T) => boolean;
  empty?: React.ComponentType;
  children: (data: T) => React.ReactNode;
};

export function AsyncBoundary<T>({
  data,
  isLoading,
  error,
  isEmpty,
  empty: Empty,
  children,
}: AsyncBoundaryProps<T>) {
  if (isLoading) {
    return <Spinner className="mx-auto my-auto" />;
  }

  if (error && error.code !== ApiErrorCode.VALIDATION_ERROR) {
    return <ErrorComponent error={error} />;
  }

  if (!data) {
    return null;
  }

  if (isEmpty?.(data)) {
    return Empty ? <Empty /> : <EmptyComponent />;
  }

  return <React.Fragment>{children(data)}</React.Fragment>;
}
