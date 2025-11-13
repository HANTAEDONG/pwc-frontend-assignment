import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React from "react";
import { useCompanies } from "@/entities/company/queries";
import { server } from "@/../mocks/server";
import { http, HttpResponse } from "msw";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe("Company queries", () => {
  describe("useCompanies", () => {
    it("should fetch companies successfully", async () => {
      const { result } = renderHook(() => useCompanies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([
        "삼성전자",
        "SK하이닉스",
        "네이버",
        "카카오",
        "LG전자",
      ]);
    });

    it("should handle server error", async () => {
      server.use(
        http.get("http://localhost/companies", () => {
          return HttpResponse.json(
            { message: "Internal server error", code: "SERVER_ERROR" },
            { status: 500 }
          );
        })
      );

      const { result } = renderHook(() => useCompanies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});
