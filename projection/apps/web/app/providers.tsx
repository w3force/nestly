"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ZustandProvider } from "@projection/core";
import { UserProvider } from "../contexts/UserContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ZustandProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </ZustandProvider>
    </QueryClientProvider>
  );
}
