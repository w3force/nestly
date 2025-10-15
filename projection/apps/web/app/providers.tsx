"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ZustandProvider } from "@projection/core";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ZustandProvider is a no-op for now, but can be used for SSR or context in the future */}
      <ZustandProvider>{children}</ZustandProvider>
    </QueryClientProvider>
  );
}
