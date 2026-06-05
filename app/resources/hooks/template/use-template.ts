import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  CreateTemplatePayload,
  UpdateTemplatePayload,
} from '@/resources/queries/template'
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

export const templateQueryKeys = {
  all: ['templates'] as const,
  lists: () => [...templateQueryKeys.all, 'list'] as const,
  list: (params: IQueryParams) => [...templateQueryKeys.lists(), params] as const,
  details: () => [...templateQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateQueryKeys.details(), id] as const,
}

export function useTemplates(
  config: IQueryConfig,
  params: IQueryParams,
  options?: { enabled?: boolean; staleTime?: number }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: templateQueryKeys.list(params),
    queryFn: async () => {
      try {
        return await getTemplates(config, params)
      } catch (error: unknown) {
        throw new QueryError((error as Error).message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  })
}

export function useTemplate(
  config: IQueryConfig,
  id: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: templateQueryKeys.detail(id),
    queryFn: async () => {
      try {
        return await getTemplate(config, id)
      } catch (error: unknown) {
        throw new QueryError((error as Error).message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!id,
  })
}

export function useCreateTemplate(config: IQueryConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTemplatePayload) => createTemplate(config, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() })
    },
  })
}

export function useUpdateTemplate(config: IQueryConfig, id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTemplatePayload) => updateTemplate(config, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.detail(id) })
    },
  })
}

export function useDeleteTemplate(config: IQueryConfig) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTemplate(config, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() })
    },
  })
}
