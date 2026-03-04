"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClientConfig } from "./query-client";
import { ModalProvider } from "@/context/modal-context";
import { initializeShowcaseMocks } from "./showcase-mocks";

export function Providers({ children }: { children: ReactNode }) {
  initializeShowcaseMocks();
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <ModalProvider>{children} </ModalProvider>
    </QueryClientProvider>
  );
}
