"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClientConfig } from "./query-client";
import { ModalProvider } from "@/context/modal-context";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <ModalProvider>{children} </ModalProvider>
    </QueryClientProvider>
  );
}
