/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query'
import { IAssetInput, IAssetResponse } from '../../queries/vaulta'
import { deleteAsset, getAsset, uploadAssets } from '../../queries/vaulta'
import { toast } from 'sonner'
import { IQueryConfig } from '@/resources/queries'

export const assetQueryKeys = {
  all: ['assets'] as const,
  details: () => [...assetQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...assetQueryKeys.details(), id] as const,
}

class QueryError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'QueryError'
    this.code = code
  }
}

export function useUploadAsset(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: IAssetResponse | null) => void
    onError?: (error: Error) => void
  }
) {
  return useMutation({
    mutationFn: async (body: IAssetInput) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await uploadAssets(config, body)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      options?.onError?.(error)
      toast.error(error?.message)
    },
  })
}

export function useGetAsset(
  config: IQueryConfig,
  assetId: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: assetQueryKeys.detail(assetId),
    queryFn: async () => {
      try {
        if (!config.token) throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        return await getAsset(config, assetId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false && !!assetId && !!config.token,
  })
}

export function useDeleteAsset(
  config: IQueryConfig,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
) {
  return useMutation({
    mutationFn: async (assetId: string) => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        await deleteAsset(config, assetId)
      } catch (error: any) {
        throw new QueryError(error)
      }
    },
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
      toast.error(error?.message)
    },
  })
}
