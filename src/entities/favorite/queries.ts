import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavoriteCompanies,
  getFavoriteCompanyDetail,
  createFavoriteCompany,
  updateFavoriteCompany,
  deleteFavoriteCompany,
  FavoriteCompanyCreate,
  FavoriteCompanyResponse,
  FavoriteCompanyListItem,
  PaginatedFavoriteCompanyResponse,
  MessageResponse,
  GetFavoriteCompaniesParams,
  GetFavoriteCompanyDetailParams,
  UpdateFavoriteCompanyParams,
  DeleteFavoriteCompanyParams,
} from "./api";
import type {
  QueryOptions,
  MutationOptions,
  QueryKeyFactory,
} from "@/shared/lib/react-query";
import { DEFAULT_USER_EMAIL } from "@/shared/config/user";

export const favoriteQueryKeys = {
  all: ["favorite"] as const,
  lists: () => [...favoriteQueryKeys.all, "list"] as const,
  list: (email: string, page?: number) =>
    [...favoriteQueryKeys.lists(), email, page] as const,
  details: () => [...favoriteQueryKeys.all, "detail"] as const,
  detail: (favorite_id: number, email: string) =>
    [...favoriteQueryKeys.details(), favorite_id, email] as const,
} as const as QueryKeyFactory<["favorite"]>;

export function useFavoriteCompaniesQuery(
  params: GetFavoriteCompaniesParams,
  options?: QueryOptions<PaginatedFavoriteCompanyResponse>
) {
  return useQuery({
    queryKey: favoriteQueryKeys.list(params.email, params.page),
    queryFn: () => getFavoriteCompanies(params),
    enabled: !!params.email,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useFavoriteCompanyDetailQuery(
  params: GetFavoriteCompanyDetailParams,
  options?: QueryOptions<FavoriteCompanyResponse>
) {
  return useQuery({
    queryKey: favoriteQueryKeys.detail(params.favorite_id, params.email),
    queryFn: () => getFavoriteCompanyDetail(params),
    enabled: !!params.favorite_id && !!params.email,
    ...options,
  });
}

type CreateFavoriteContext = {
  previousFavorites: PaginatedFavoriteCompanyResponse | undefined;
};

export function useCreateFavoriteCompany(
  options?: MutationOptions<
    MessageResponse,
    Error,
    FavoriteCompanyCreate,
    CreateFavoriteContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavoriteCompany,
    onMutate: async (newFavorite) => {
      const queries =
        queryClient.getQueriesData<PaginatedFavoriteCompanyResponse>({
          queryKey: favoriteQueryKeys.lists(),
        });

      const targetQueryKey = favoriteQueryKeys.list(newFavorite.email, 1);

      let previousFavorites = queries.find(
        ([, data]) => data !== undefined
      )?.[1] as PaginatedFavoriteCompanyResponse | undefined;

      if (!previousFavorites) {
        previousFavorites =
          queryClient.getQueryData<PaginatedFavoriteCompanyResponse>(
            targetQueryKey
          );
      }

      await queryClient.cancelQueries({ queryKey: targetQueryKey });

      if (previousFavorites) {
        const optimisticItem: FavoriteCompanyListItem = {
          id: -1,
          company_name: newFavorite.company_name,
          memo: newFavorite.memo,
          created_at: new Date().toISOString(),
        };
        queryClient.setQueryData<PaginatedFavoriteCompanyResponse>(
          targetQueryKey,
          {
            ...previousFavorites,
            items: [optimisticItem, ...previousFavorites.items],
            total: previousFavorites.total + 1,
          }
        );
      }

      return { previousFavorites };
    },
    onError: (_error, variables, context) => {
      if (context?.previousFavorites) {
        const targetQueryKey = favoriteQueryKeys.list(variables.email, 1);
        queryClient.setQueryData(targetQueryKey, context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKeys.lists(),
        refetchType: "active",
      });
    },
    ...options,
  });
}

type UpdateFavoriteContext = {
  previousFavorite: FavoriteCompanyResponse | undefined;
  previousFavorites: PaginatedFavoriteCompanyResponse | undefined;
};

export function useUpdateFavoriteCompany(
  options?: MutationOptions<
    MessageResponse,
    Error,
    UpdateFavoriteCompanyParams,
    UpdateFavoriteContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavoriteCompany,
    onMutate: async (updatedFavorite) => {
      const detailKey = favoriteQueryKeys.detail(
        updatedFavorite.favorite_id,
        updatedFavorite.email
      );
      const listQueries =
        queryClient.getQueriesData<PaginatedFavoriteCompanyResponse>({
          queryKey: favoriteQueryKeys.lists(),
        });

      await queryClient.cancelQueries({ queryKey: detailKey });
      await queryClient.cancelQueries({ queryKey: favoriteQueryKeys.lists() });

      const previousFavorite =
        queryClient.getQueryData<FavoriteCompanyResponse>(detailKey);

      const matchingListQuery = listQueries.find(([queryKey]) => {
        const key = queryKey as readonly unknown[];
        return key[1] === "list" && key[2] === updatedFavorite.email;
      });
      const previousFavorites = matchingListQuery?.[1] as
        | PaginatedFavoriteCompanyResponse
        | undefined;

      if (previousFavorite) {
        queryClient.setQueryData<FavoriteCompanyResponse>(detailKey, {
          ...previousFavorite,
          memo: updatedFavorite.memo,
        });
      }

      listQueries.forEach(([queryKey, data]) => {
        const key = queryKey as readonly unknown[];
        if (key[1] === "list" && key[2] === updatedFavorite.email && data) {
          queryClient.setQueryData<PaginatedFavoriteCompanyResponse>(queryKey, {
            ...data,
            items: data.items.map((item) =>
              item.id === updatedFavorite.favorite_id
                ? { ...item, memo: updatedFavorite.memo }
                : item
            ),
          });
        }
      });

      return { previousFavorite, previousFavorites };
    },
    onError: (_error, variables, context) => {
      const detailKey = favoriteQueryKeys.detail(
        variables.favorite_id,
        variables.email
      );
      const listQueries =
        queryClient.getQueriesData<PaginatedFavoriteCompanyResponse>({
          queryKey: favoriteQueryKeys.lists(),
        });

      if (context?.previousFavorite) {
        queryClient.setQueryData(detailKey, context.previousFavorite);
      }
      if (context?.previousFavorites) {
        listQueries.forEach(([queryKey]) => {
          const key = queryKey as readonly unknown[];
          if (key[1] === "list" && key[2] === variables.email) {
            queryClient.setQueryData(queryKey, context.previousFavorites);
          }
        });
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKeys.detail(
          variables.favorite_id,
          variables.email
        ),
      });
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKeys.lists(),
      });
    },
    ...options,
  });
}

type DeleteFavoriteContext = {
  previousFavoritesMap: Map<
    readonly unknown[],
    PaginatedFavoriteCompanyResponse | undefined
  >;
};

export function useDeleteFavoriteCompany(
  options?: MutationOptions<
    MessageResponse | void,
    Error,
    DeleteFavoriteCompanyParams,
    DeleteFavoriteContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavoriteCompany,
    onMutate: async (params) => {
      const listQueries =
        queryClient.getQueriesData<PaginatedFavoriteCompanyResponse>({
          queryKey: favoriteQueryKeys.lists(),
        });

      await queryClient.cancelQueries({ queryKey: favoriteQueryKeys.lists() });

      const previousFavoritesMap = new Map<
        readonly unknown[],
        PaginatedFavoriteCompanyResponse | undefined
      >();

      listQueries.forEach(([queryKey, data]) => {
        const key = queryKey as readonly unknown[];
        if (key[1] === "list" && key[2] === params.email) {
          // 각 쿼리의 이전 데이터를 저장
          previousFavoritesMap.set(queryKey, data);

          // Optimistic update 수행
          if (data) {
            queryClient.setQueryData<PaginatedFavoriteCompanyResponse>(
              queryKey,
              {
                ...data,
                items: data.items.filter(
                  (item) => item.id !== params.favorite_id
                ),
                total: data.total - 1,
              }
            );
          }
        }
      });

      return { previousFavoritesMap };
    },
    onError: (_error, variables, context) => {
      if (context?.previousFavoritesMap) {
        // 각 쿼리에 대해 해당 쿼리의 이전 데이터만 복원
        context.previousFavoritesMap.forEach((previousData, queryKey) => {
          const key = queryKey as readonly unknown[];
          if (key[1] === "list" && key[2] === variables.email) {
            queryClient.setQueryData(queryKey, previousData);
          }
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKeys.lists(),
      });
    },
    ...options,
  });
}

export function useFavorite(
  id: string,
  options?: QueryOptions<FavoriteCompanyResponse>
) {
  const favoriteId = parseInt(id, 10);
  return useFavoriteCompanyDetailQuery(
    { favorite_id: favoriteId, email: DEFAULT_USER_EMAIL },
    { enabled: !!id && !isNaN(favoriteId), ...options }
  );
}

export function useFavorites(email: string = DEFAULT_USER_EMAIL) {
  const { data, isLoading, error } = useFavoriteCompaniesQuery(
    { email },
    { enabled: !!email }
  );

  return {
    data: data?.items.map((item) => ({
      id: item.id.toString(),
      companyName: item.company_name,
    })),
    isLoading,
    error,
  };
}

export function useDeleteFavorite(email: string = DEFAULT_USER_EMAIL) {
  const mutation = useDeleteFavoriteCompany();

  return {
    ...mutation,
    mutateAsync: async (id: string) => {
      return mutation.mutateAsync({
        favorite_id: parseInt(id, 10),
        email,
      });
    },
  };
}
