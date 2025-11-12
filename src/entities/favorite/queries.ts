import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import {
  getFavorites,
  getFavoriteById,
  createFavorite,
  updateFavorite,
  deleteFavorite,
  CreateFavoriteParams,
  UpdateFavoriteParams,
  Favorite,
} from './api';

export const favoriteQueryKeys = {
  all: ['favorite'] as const,
  lists: () => [...favoriteQueryKeys.all, 'list'] as const,
  list: (filters?: string) => [...favoriteQueryKeys.lists(), filters] as const,
  details: () => [...favoriteQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...favoriteQueryKeys.details(), id] as const,
};

export function useFavorites(
  options?: Omit<UseQueryOptions<Favorite[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: favoriteQueryKeys.lists(),
    queryFn: getFavorites,
    ...options,
  });
}

export function useFavorite(
  id: string,
  options?: Omit<UseQueryOptions<Favorite, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: favoriteQueryKeys.detail(id),
    queryFn: () => getFavoriteById(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateFavorite(
  options?: UseMutationOptions<Favorite, Error, CreateFavoriteParams>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
    },
    ...options,
  });
}

export function useUpdateFavorite(
  options?: UseMutationOptions<Favorite, Error, UpdateFavoriteParams>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavorite,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKeys.detail(data.id),
      });
    },
    ...options,
  });
}

export function useDeleteFavorite(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteQueryKeys.lists() });
    },
    ...options,
  });
}
