"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
// import { useEffect } from "react";

// async function enableMocking() {
//   const shouldEnableMSW =
//     process.env.NEXT_PUBLIC_ENABLE_MSW === "true" &&
//     process.env.NODE_ENV === "development";

//   if (!shouldEnableMSW) {
//     return;
//   }

//   if (typeof window === "undefined") {
//     return;
//   }

//   // MSW를 비동기로 로드하여 렌더링을 차단하지 않도록 함
//   const { worker } = await import("@/../mocks/browser");
//   return worker.start({
//     onUnhandledRequest: "bypass",
//   });
// }

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            // staleTime을 설정하여 캐시를 더 오래 유지하고 불필요한 재요청 방지
            staleTime: 5 * 60 * 1000, // 5분
            // gcTime (이전 cacheTime)을 설정하여 캐시 유지 시간 조정
            gcTime: 10 * 60 * 1000, // 10분
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  // useEffect(() => {
  //   // MSW를 지연 로드하여 초기 렌더링을 차단하지 않도록 함
  //   if (typeof window !== "undefined") {
  //     // 다음 틱에서 실행하여 초기 렌더링을 차단하지 않음
  //     const timer = setTimeout(() => {
  //       enableMocking().catch(() => {
  //         // MSW 로드 실패는 무시 (프로덕션에서는 MSW가 없을 수 있음)
  //       });
  //     }, 0);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
}
