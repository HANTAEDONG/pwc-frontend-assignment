import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import React from "react";
import {
  useFavoriteCompaniesQuery,
  useFavoriteCompanyDetailQuery,
  useCreateFavoriteCompany,
  useUpdateFavoriteCompany,
  useDeleteFavoriteCompany,
} from "@/entities/favorite/queries";
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

describe("Favorite queries", () => {
  describe("useFavoriteCompaniesQuery", () => {
    it("should fetch favorite companies successfully", async () => {
      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.items).toBeDefined();
      expect(result.current.data?.total).toBeGreaterThan(0);
    });

    it("should handle pagination", async () => {
      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 2 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.page).toBe(2);
    });

    it("should handle validation error when email is missing", async () => {
      server.use(
        http.get("http://localhost/favorites", () => {
          return HttpResponse.json(
            {
              detail: [
                {
                  loc: ["query", "email"],
                  msg: "Field required",
                  type: "value_error.missing",
                },
              ],
            },
            { status: 422 }
          );
        })
      );

      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "" }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useFavoriteCompanyDetailQuery", () => {
    it("should fetch favorite company detail successfully", async () => {
      const { result } = renderHook(
        () =>
          useFavoriteCompanyDetailQuery({
            favorite_id: 1,
            email: "test@example.com",
          }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe(1);
    });
  });

  describe("useCreateFavoriteCompany", () => {
    it("should rollback optimistic update on error", async () => {
      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialData = result.current.data;

      server.use(
        http.post("http://localhost/favorites", () => {
          return HttpResponse.json(
            { message: "Server error", code: "SERVER_ERROR" },
            { status: 500 }
          );
        })
      );

      const { result: mutationResult } = renderHook(
        () =>
          useCreateFavoriteCompany({
            onError: () => {},
          }),
        { wrapper: createWrapper() }
      );

      mutationResult.current.mutate({
        email: "test@example.com",
        company_name: "Test Company",
        memo: null,
      });

      await waitFor(() => {
        expect(mutationResult.current.isError).toBe(true);
      });

      const { result: queryResult } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(queryResult.current.data).toEqual(initialData);
      });
    });
  });

  describe("useUpdateFavoriteCompany", () => {
    it("should rollback optimistic update on error", async () => {
      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialData = result.current.data;
      const favoriteToUpdate = initialData?.items[0];

      if (!favoriteToUpdate) {
        fail("No favorite found");
      }

      server.use(
        http.put(`http://localhost/favorites/${favoriteToUpdate.id}`, () => {
          return HttpResponse.json(
            { message: "Server error", code: "SERVER_ERROR" },
            { status: 500 }
          );
        })
      );

      const { result: mutationResult } = renderHook(
        () =>
          useUpdateFavoriteCompany({
            onError: () => {},
          }),
        { wrapper: createWrapper() }
      );

      mutationResult.current.mutate({
        favorite_id: favoriteToUpdate.id,
        email: "test@example.com",
        memo: "Updated memo",
      });

      await waitFor(() => {
        expect(mutationResult.current.isError).toBe(true);
      });

      const { result: queryResult } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(queryResult.current.data).toEqual(initialData);
      });
    });
  });

  describe("useDeleteFavoriteCompany", () => {
    it("should rollback optimistic update on error", async () => {
      const { result } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialData = result.current.data;
      const favoriteToDelete = initialData?.items[0];

      if (!favoriteToDelete) {
        fail("No favorite found");
      }

      server.use(
        http.delete(`http://localhost/favorites/${favoriteToDelete.id}`, () => {
          return HttpResponse.json(
            { message: "Server error", code: "SERVER_ERROR" },
            { status: 500 }
          );
        })
      );

      const { result: mutationResult } = renderHook(
        () =>
          useDeleteFavoriteCompany({
            onError: () => {},
          }),
        { wrapper: createWrapper() }
      );

      mutationResult.current.mutate({
        favorite_id: favoriteToDelete.id,
        email: "test@example.com",
      });

      await waitFor(() => {
        expect(mutationResult.current.isError).toBe(true);
      });

      const { result: queryResult } = renderHook(
        () => useFavoriteCompaniesQuery({ email: "test@example.com", page: 1 }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(queryResult.current.data).toEqual(initialData);
      });
    });
  });
});
