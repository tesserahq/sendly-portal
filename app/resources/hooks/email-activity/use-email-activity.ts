/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { getEmailActivityDetail, getEmailActivityListing } from '@/resources/queries/email-activity'
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
 * News query keys for React Query caching
 */
export const emailActivityQueryKeys = {
  all: ['email-activity'] as const,
  lists: () => [...emailActivityQueryKeys.all, 'list'] as const,
  list: (config: IQueryConfig, params: IQueryParams) =>
    [...emailActivityQueryKeys.lists(), config, params] as const,
  details: () => [...emailActivityQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...emailActivityQueryKeys.details(), id] as const,
}

/**
 * Hook for fetching paginated email activity
 * @param config Email activity query configuration
 * @param params Email activity query parameters
 * @param options Email activity query options
 */

export function useEmailActivityListing(
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
    queryKey: emailActivityQueryKeys.list(config, params),
    queryFn: async () => {
      try {
        return await getEmailActivityListing(config, params)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  })
}

/**
 * Hook to fetch a single email activity by ID
 * @param config Email activity query configuration
 * @param id Email activity ID
 * @param options Email activity query options
 */
export function useEmailActivityDetail(
  config: IQueryConfig,
  id: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useQuery({
    queryKey: emailActivityQueryKeys.detail(id),
    queryFn: async () => {
      try {
        return await getEmailActivityDetail(config, id)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && !!id,
  })
}
