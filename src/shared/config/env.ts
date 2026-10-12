const getEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const env = {
  API_URL: getEnv(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL"),
  GOOGLE_CLIENT_ID: getEnv(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  ),
} as const;
