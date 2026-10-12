import { setAuthCookies } from "@/shared/utils/set-auto-cookies";
import { SignInResponse } from "@/features/sign-in/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { NextRequest, NextResponse } from "next/server";
import { httpFetch } from "@/shared/lib/http/http";
import { env } from "@/shared/config/env";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    const data = await httpFetch<SignInResponse>({
      baseURL: env.API_URL,
      path: "/auth/refresh",
      method: "POST",
      body,
    });

    const response = NextResponse.json(data);

    setAuthCookies(response, data);

    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data, {
        status: error.status,
      });
    }

    return NextResponse.json(
      {
        status: "error",
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        details: null,
      },
      {
        status: 500,
      },
    );
  }
};
