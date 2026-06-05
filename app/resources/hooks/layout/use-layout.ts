import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  getLayouts,
  getLayout,
  createLayout,
  updateLayout,
  deleteLayout,
  CreateLayoutPayload,
  UpdateLayoutPayload,
} from '@/resources/queries/layout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

class QueryError extends Error {
  code?: string
  details?: unknown

  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'QueryError'
    this.code = code
    this.details = details
  }
}

export const layoutQueryKeys = {
  all: ['layouts'] as const,
  lists: () => [...layoutQueryKeys.all, 'list'] as const,
  list: (params: IQueryParams) => [...layoutQueryKeys.lists(), params] as const,
  details: () => [...layoutQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...layoutQueryKeys.details(), id] as const,
}

export function useLayouts(
  config: IQueryConfig,
  params: IQueryParams,
  options?: { enabled?: boolean; staleTime?: number }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: layoutQueryKeys.list(params),
    queryFn: async () => {
      try {
        return await getLayouts(config, params)
      } catch (error: unknown) {
        throw new QueryError((error as Error).message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  })
}

export function useLayout(
  config: IQueryConfig,
  id: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: layoutQueryKeys.detail(id),
    queryFn: async () => {
      try {
        return await getLayout(config, id)
      } catch (error: unknown) {
        throw new QueryError((error as Error).message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!id,
  })
}

export function useCreateLayout(config: IQueryConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLayoutPayload) => createLayout(config, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutQueryKeys.lists() })
    },
  })
}

export function useUpdateLayout(config: IQueryConfig, id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateLayoutPayload) => updateLayout(config, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: layoutQueryKeys.detail(id) })
    },
  })
}

export function useDeleteLayout(config: IQueryConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteLayout(config, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: layoutQueryKeys.lists() })
    },
  })
}
