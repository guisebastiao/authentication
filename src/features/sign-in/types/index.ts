export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type GoogleSignInRequest = {
  code: string;
};
