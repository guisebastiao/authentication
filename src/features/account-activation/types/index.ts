export type AccountActivationResponse = {
  activationToken: string;
  expiresAt: Date;
  resendAvailableAt: Date;
};
