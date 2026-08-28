import { BadgeProps } from '@/modules/shadcn/ui/badge'
import { eventTypeConfig } from '@/components/timeline/timeline.config'
import { EmailStatusEnum } from '@/resources/queries/email-activity'

type EventType = keyof typeof eventTypeConfig

export const getStatusBadgeProps = (status?: boolean) => {
  if (status) {
    return { className: 'border-green-500 text-green-600' }
  }

  return { className: 'border-gray-500 text-gray-600' }
}

export const getEmailStatusBadge = (
  status?: EmailStatusEnum
): { variant: BadgeProps['variant']; className: string } => {
  switch (status) {
    case 'delivered':
    case 'sent':
      return {
        variant: 'default',
        className: 'bg-emerald-400/10 border-emerald-500 text-emerald-500',
      }
    case 'bounced':
    case 'failed':
      return {
        variant: 'outline',
        className: 'border-orange-400 text-orange-400 bg-orange-500/10',
      }
    case 'queued':
      return {
        variant: 'outline',
        className: 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
      }
    default:
      return { variant: 'outline', className: 'border-gray-500 text-gray-600' }
  }
}

export type RecipientOutcome = 'suppressed' | 'pending' | 'failed'

/**
 * Derives the outcome of a broadcast recipient that never produced an email
 * (email_id is null): suppressed recipients are never prepared; unsuppressed
 * recipients that aren't prepared are either still being processed
 * ("pending") or, once the batch has finished, stuck without an email
 * ("failed").
 */
export const resolveRecipientOutcome = (
  suppressed: boolean,
  prepared: boolean,
  batchFinished: boolean
): RecipientOutcome => {
  if (suppressed) return 'suppressed'
  if (!prepared) return batchFinished ? 'failed' : 'pending'
  // prepared=true with no email_id isn't expected to happen; treat it as a
  // failure rather than silently rendering nothing.
  return 'failed'
}

export const getRecipientOutcomeBadge = (
  outcome: RecipientOutcome
): { variant: BadgeProps['variant']; className: string } => {
  switch (outcome) {
    case 'suppressed':
      return { variant: 'outline', className: 'border-gray-400 text-gray-600 bg-gray-500/5' }
    case 'pending':
      return {
        variant: 'outline',
        className: 'border-yellow-500 text-yellow-600 bg-yellow-500/5',
      }
    case 'failed':
      return { variant: 'destructive', className: 'bg-rose-600 text-white' }
  }
}

export const getEmailEventTypeBadge = (
  status?: EventType
): { variant: BadgeProps['variant']; className: string } => {
  switch (status) {
    case 'delivered':
      return {
        variant: 'default',
        className: 'bg-emerald-600 text-white',
      }

    case 'opened':
      return {
        variant: 'outline',
        className: 'border-sky-400 text-sky-700 bg-sky-500/5',
      }

    case 'clicked':
      return {
        variant: 'outline',
        className: 'border-indigo-400 text-indigo-700 bg-indigo-500/5',
      }

    case 'bounced':
      return {
        variant: 'destructive',
        className: 'bg-rose-600 text-white',
      }

    case 'complained':
      return {
        variant: 'outline',
        className: 'border-orange-400 text-orange-700 bg-orange-500/5',
      }

    case 'unknown':
    default:
      return {
        variant: 'outline',
        className: 'border-gray-400 text-gray-600 bg-gray-500/5',
      }
  }
}
