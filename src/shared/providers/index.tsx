"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "@/shared/lib/query-client";
import { Toaster } from "@/shared/components/ui/toast";
import { PropsWithChildren } from "react";
import { env } from "@/shared/config/env";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>{children}</GoogleOAuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
};
