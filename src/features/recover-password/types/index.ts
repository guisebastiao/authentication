export type RecoverPasswordResponse = {
  email: string;
  recoverToken: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export type ResendEmailRequest = {
  recoverToken: string;
};

export type VerifyRecoverPasswordRequest = {
  recoverToken: string;
  otpCode: string;
};

export type CreateRecoverPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  recoverToken: string;
  newPassword: string;
  confirmPassword: string;
};
