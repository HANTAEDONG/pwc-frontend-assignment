"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const { worker } = await import("@/../mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    enableMocking().then(() => {
      setMswReady(true);
    });
  }, []);

  if (!mswReady && process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
