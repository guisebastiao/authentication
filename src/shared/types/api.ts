import { ApiErrorCode, ValidationErrorCode } from "@/shared/types/api-error-codes";

export type ApiBody<T = null> = {
  status: "success";
  data: T;
};

export type ApiBodyError<T = null> = {
  status: "error";
  code: ApiErrorCode;
  details: T;
};

export type ApiFieldError = {
  field: string;
  code: ValidationErrorCode;
};
