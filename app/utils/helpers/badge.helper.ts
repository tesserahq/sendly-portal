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
    case 'sent':
      return { variant: 'default', className: 'bg-[#32b554] text-white' }
    case 'failed':
      return { variant: 'destructive', className: '' }
    case 'queued':
      return { variant: 'outline', className: 'border-gray-500 text-gray-600' }
    default:
      return { variant: 'outline', className: 'border-gray-500 text-gray-600' }
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
