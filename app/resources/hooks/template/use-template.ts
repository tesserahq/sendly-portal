import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  TemplateType,
  CloneTemplatePayload,
  cloneTemplate,
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
  return useQuery({
    queryKey: templateQueryKeys.list(params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
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
  return useQuery({
    queryKey: templateQueryKeys.detail(id),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

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

export function useDeleteTemplate(
  config: IQueryConfig,
  options?: {
    onSuccess?: () => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await deleteTemplate(config, id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() })
      options?.onSuccess?.()
    },
    onError: (error: QueryError) => {
      options?.onError?.(error)
    },
  })
}

/**
 * Hook for cloning a template (Sendly API)
 */
export function useCloneTemplate(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: TemplateType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: CloneTemplatePayload
    }): Promise<TemplateType> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }
      return await cloneTemplate(config, id, data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateQueryKeys.lists() })

      options?.onSuccess?.(data)
    },
  })
}
