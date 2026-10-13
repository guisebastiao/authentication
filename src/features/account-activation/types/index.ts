export type AccountActivationResponse = {
  email: string;
  activationToken: string;
  expiresAt: string;
  resendAvailableAt: string;
};

export type AccountActivationRequest = {
  activationToken: string;
  otpCode: string;
};

export type ResendEmailRequest = {
  activationToken: string;
};
