/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  getBroadcastDetail,
  getBroadcastListing,
  getBroadcastRecipients,
} from '@/resources/queries/broadcast'
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
 * Broadcast query keys for React Query caching
 */
export const broadcastQueryKeys = {
  all: ['broadcast'] as const,
  lists: () => [...broadcastQueryKeys.all, 'list'] as const,
  list: (config: IQueryConfig, params: IQueryParams) =>
    [...broadcastQueryKeys.lists(), config, params] as const,
  details: () => [...broadcastQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...broadcastQueryKeys.details(), id] as const,
  recipients: (config: IQueryConfig, id: string, params: IQueryParams) =>
    [...broadcastQueryKeys.detail(id), 'recipients', config, params] as const,
}

/**
 * Hook for fetching paginated broadcast batches
 * @param config Broadcast query configuration
 * @param params Broadcast query parameters
 * @param options Broadcast query options
 */
export function useBroadcastListing(
  config: IQueryConfig,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: broadcastQueryKeys.list(config, params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getBroadcastListing(config, params)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  })
}

/**
 * Hook to fetch a single broadcast batch's status/progress by batch_id
 * @param config Broadcast query configuration
 * @param id Broadcast batch_id
 * @param options Broadcast query options
 */
export function useBroadcastDetail(
  config: IQueryConfig,
  id: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: broadcastQueryKeys.detail(id),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getBroadcastDetail(config, id)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && !!id,
  })
}

/**
 * Hook to fetch paginated per-recipient results for a broadcast batch
 * @param config Broadcast query configuration
 * @param id Broadcast batch_id
 * @param params Broadcast query parameters
 * @param options Broadcast query options
 */
export function useBroadcastRecipients(
  config: IQueryConfig,
  id: string,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: broadcastQueryKeys.recipients(config, id, params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }
        return await getBroadcastRecipients(config, id, params)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && !!id,
  })
}
