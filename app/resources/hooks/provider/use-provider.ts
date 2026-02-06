/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { getProviders } from '@/resources/queries/provider/provider.quries'
import { useQuery } from '@tanstack/react-query'

/**
 * Custom error class for query errors
 */
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

/**
 * Provider query keys for React Query caching
 */
export const providerQueryKeys = {
  all: ['providers'] as const,
  lists: () => [...providerQueryKeys.all, 'list'] as const,
  list: (params: IQueryParams) => [...providerQueryKeys.lists(), params] as const,
}

/**
 * Hook for fetching providers
 * @config - provider query configuration
 * @params - provider query parameters
 * @options - provider query options
 */
export function useProviders(
  config: IQueryConfig,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: providerQueryKeys.list(params),
    queryFn: async () => {
      try {
        return await getProviders(config, params)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  })
}
