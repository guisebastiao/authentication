import { SignInResponse } from "@/features/sign-in/types";
import { AUTH_TOKENS } from "@/shared/constants/auth-tokens";
import { NextResponse } from "next/server";

const MAX_COOKIE_AGE = 60 * 60 * 24 * 400;

export const setAuthCookies = (response: NextResponse, data: SignInResponse): NextResponse => {
  const tokens = {
    [AUTH_TOKENS.ACCESS_TOKEN]: data.accessToken,
    [AUTH_TOKENS.REFRESH_TOKEN]: data.refreshToken,
    [AUTH_TOKENS.SESSION_TOKEN]: data.sessionToken,
  };

  Object.entries(tokens).forEach(([name, value]) => {
    response.cookies.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_COOKIE_AGE,
    });
  });

  return response;
};
