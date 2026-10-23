import { BadgeProps } from '@/modules/shadcn/ui/badge'
import { eventTypeConfig } from '@/components/timeline/timeline.config'
import { EmailStatusEnum } from '@/resources/queries/email-activity'

type EventType = keyof typeof eventTypeConfig

export const getStatusBadgeProps = (status?: boolean) => {
  if (status) {
    return { className: 'border-primary/30 text-primary' }
  }

  return { className: 'border-border text-muted-foreground' }
}

export const getEmailStatusBadge = (
  status?: EmailStatusEnum
): { variant: BadgeProps['variant']; className: string } => {
  switch (status) {
    case 'delivered':
    case 'sent':
      return {
        variant: 'default',
        className: 'bg-primary/10 border-primary/30 text-primary',
      }
    case 'bounced':
    case 'failed':
      return {
        variant: 'outline',
        className: 'border-destructive/30 text-destructive bg-destructive/10',
      }
    case 'queued':
      return {
        variant: 'outline',
        className: 'border-accent text-accent-foreground bg-accent/10',
      }
    default:
      return { variant: 'outline', className: 'border-border text-muted-foreground' }
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
      return { variant: 'outline', className: 'border-border text-muted-foreground bg-muted/5' }
    case 'pending':
      return {
        variant: 'outline',
        className: 'border-accent text-accent-foreground bg-accent/5',
      }
    case 'failed':
      return { variant: 'destructive', className: 'bg-destructive text-destructive-foreground' }
  }
}

export const getEmailEventTypeBadge = (
  status?: EventType
): { variant: BadgeProps['variant']; className: string } => {
  switch (status) {
    case 'delivered':
      return {
        variant: 'default',
        className: 'bg-primary text-primary-foreground',
      }

    case 'opened':
      return {
        variant: 'outline',
        className: 'border-primary/30 text-primary bg-primary/5',
      }

    case 'clicked':
      return {
        variant: 'outline',
        className: 'border-primary/30 text-primary bg-primary/5',
      }

    case 'bounced':
      return {
        variant: 'destructive',
        className: 'bg-destructive text-destructive-foreground',
      }

    case 'complained':
      return {
        variant: 'outline',
        className: 'border-accent text-accent-foreground bg-accent/5',
      }

    case 'unknown':
    default:
      return {
        variant: 'outline',
        className: 'border-border text-muted-foreground bg-muted/5',
      }
  }
}
