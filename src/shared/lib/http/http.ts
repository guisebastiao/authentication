import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";

type ExtractPathParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractPathParams<`/${Rest}`>
  : T extends `${string}:${infer Param}`
    ? Param
    : never;

type PathParams<P extends string> = [ExtractPathParams<P>] extends [never]
  ? { paths?: never }
  : { paths: Record<ExtractPathParams<P>, string | number> };

type HttpFetchOptions<P extends string, B> = {
  baseURL: string;
  path: P;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: B;
  queries?: Record<string, string | number | boolean | null | undefined>;
  options?: Omit<RequestInit, "method" | "body">;
} & PathParams<P>;

const TIMEOUT = 10000;

export const httpFetch = async <T = unknown, B = unknown, const P extends string = string>({
  baseURL,
  path,
  method = "GET",
  paths,
  queries,
  body,
  options = {},
}: HttpFetchOptions<P, B>): Promise<T> => {
  let resolvedPath: string = path;

  if (paths) {
    for (const [key, value] of Object.entries(paths)) {
      resolvedPath = resolvedPath.replace(`:${key}`, encodeURIComponent(String(value)));
    }
  }

  const url = new URL(`${baseURL.replace(/\/$/, "")}/${resolvedPath.replace(/^\//, "")}`);

  if (queries) {
    for (const [key, value] of Object.entries(queries)) {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const headers = new Headers(options.headers);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const timeoutSignal = AbortSignal.timeout(TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new HttpError(response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    if (timeoutSignal.aborted) {
      throw new HttpError(408, {
        status: "error",
        code: ApiErrorCode.TIMEOUT_ERROR,
        details: null,
      });
    }

    throw new HttpError(500, {
      status: "error",
      code: ApiErrorCode.UNEXPECTED_ERROR,
      details: null,
    });
  }
};
