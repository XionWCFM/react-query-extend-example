"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>;
};
