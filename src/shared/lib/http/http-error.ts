import { ApiBodyError, ApiFieldError } from "@/shared/types/api";
import { ApiErrorCode } from "@/shared/types/api-error-codes";

export type HttpApiError =
  | (ApiBodyError<ApiFieldError[]> & {
      code: ApiErrorCode.VALIDATION_ERROR;
    })
  | (ApiBodyError<null> & {
      code: Exclude<ApiErrorCode, ApiErrorCode.VALIDATION_ERROR>;
    });

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly data: HttpApiError,
  ) {
    super(data.code);
    this.name = "HttpError";
  }
}
