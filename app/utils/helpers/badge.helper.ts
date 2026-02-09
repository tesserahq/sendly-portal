import { BadgeProps } from '@/modules/shadcn/ui/badge'
import { EmailStatusEnum } from '@/resources/queries/email-activity'

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
