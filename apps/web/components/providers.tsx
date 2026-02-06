"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createQueryClient = () => new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
