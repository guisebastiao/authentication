import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/shared/utils/set-auto-cookies";
import { AUTH_TOKENS } from "@/shared/constants/auth-tokens";
import { SignInResponse } from "@/features/sign-in/types";
import { httpFetch } from "@/shared/lib/http/http";
import { match } from "path-to-regexp";
import { decodeJwt } from "jose";

const REDIRECT_WHEN_AUTHENTICATED = "/";
const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

const publicRoutes = [
  {
    path: "/sign-in",
    redirectWhenAuthenticated: true,
  },
  {
    path: "/sign-up",
    redirectWhenAuthenticated: true,
  },
  {
    path: "/forgot",
    redirectWhenAuthenticated: true,
  },
  {
    path: "/account-activation/:activationCode",
    redirectWhenAuthenticated: true,
  },
];

export const proxy = async (request: NextRequest) => {
  const publicRoute = publicRoutes.find((route) => match(route.path)(request.nextUrl.pathname));

  if (!hasAllAuthTokens(request)) {
    return publicRoute ? NextResponse.next() : redirectToSignIn(request);
  }

  if (publicRoute?.redirectWhenAuthenticated) {
    return redirect(request, REDIRECT_WHEN_AUTHENTICATED);
  }

  const accessToken = request.cookies.get(AUTH_TOKENS.ACCESS_TOKEN)?.value;

  if (accessToken && isAccessTokenValid(accessToken)) {
    return NextResponse.next();
  }

  const data = await refresh(request);

  if (!data) {
    return redirectToSignIn(request);
  }

  return setAuthCookies(NextResponse.next(), data);
};

const hasAllAuthTokens = (request: NextRequest) => {
  return Object.values(AUTH_TOKENS).every((name) => {
    return Boolean(request.cookies.get(name)?.value);
  });
};

const isAccessTokenValid = (accessToken: string) => {
  try {
    const { exp } = decodeJwt(accessToken);
    return exp !== undefined && exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const redirect = (request: NextRequest, pathname: string) => {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
};

const redirectToSignIn = (request: NextRequest) => {
  const response = redirect(request, REDIRECT_WHEN_NOT_AUTHENTICATED);

  Object.values(AUTH_TOKENS).forEach((name) => {
    response.cookies.delete(name);
  });

  return response;
};

const refresh = async (request: NextRequest): Promise<SignInResponse | null> => {
  const body = Object.fromEntries(
    Object.entries(AUTH_TOKENS).map(([key, name]) => [key, request.cookies.get(name)?.value]),
  );

  try {
    return await httpFetch<SignInResponse>({
      baseURL: request.nextUrl.origin,
      path: "/api/auth/refresh",
      body,
    });
  } catch {
    return null;
  }
};

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
