import { IQueryConfig } from '@/resources/queries'
import { sendEmail, SendEmailPayload, SendEmailResponse } from '@/resources/queries/email'
import { useMutation } from '@tanstack/react-query'

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
 * Hook for sending an email (Sendly API)
 */
export function useSendEmail(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: SendEmailResponse) => void
    onError?: (error: QueryError) => void
  }
) {
  return useMutation({
    mutationFn: async (data: SendEmailPayload): Promise<SendEmailResponse> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }
      return await sendEmail(config, data)
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      options?.onError?.(error)
    },
  })
}
