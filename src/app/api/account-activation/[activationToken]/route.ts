import { AccountActivationResponse } from "@/features/account-activation/types";
import { ApiErrorCode } from "@/shared/types/api-error-codes";
import { HttpError } from "@/shared/lib/http/http-error";
import { NextRequest, NextResponse } from "next/server";
import { httpFetch } from "@/shared/lib/http/http";
import { ApiBody } from "@/shared/types/api";
import { env } from "@/shared/config/env";

type RouteContext = {
  params: Promise<{ activationToken: string }>;
};

export const GET = async (_request: NextRequest, { params }: RouteContext) => {
  try {
    const { activationToken } = await params;

    const { data } = await httpFetch<ApiBody<AccountActivationResponse>>({
      baseURL: env.API_URL,
      path: "/account-activation/:activationToken",
      paths: { activationToken },
      method: "GET",
    });

    return NextResponse.json(data);
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
