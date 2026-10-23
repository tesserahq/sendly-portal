import { EmailActivityType } from '@/resources/queries/email-activity'

export const eventTypeConfig = {
  delivered: {
    label: 'Delivered',
    color: 'bg-primary/10 text-foreground dark:text-primary border-primary/30',
    dotColor: 'bg-primary',
    iconColor: 'text-primary',
    dotBeforeColor: 'bg-primary',
    getMessage: (email: EmailActivityType) =>
      `Email successfully delivered to ${email.to_email} via ${email.provider}.`,
  },

  opened: {
    label: 'Opened',
    color: 'bg-primary/10 text-primary border-primary/30',
    dotColor: 'bg-primary',
    iconColor: 'text-primary',
    dotBeforeColor: 'bg-primary',
    getMessage: (email: EmailActivityType) => `Email opened by ${email.to_email}.`,
  },

  clicked: {
    label: 'Clicked',
    color: 'bg-primary/10 text-primary border-primary/30',
    dotColor: 'bg-primary',
    iconColor: 'text-primary',
    dotBeforeColor: 'bg-primary',
    getMessage: (email: EmailActivityType) => `Link clicked by ${email.to_email}.`,
  },

  bounced: {
    label: 'Bounced',
    color: 'bg-destructive/10 text-foreground dark:text-destructive border-destructive/30',
    dotColor: 'bg-destructive',
    iconColor: 'text-destructive',
    dotBeforeColor: 'bg-destructive',
    getMessage: (email: EmailActivityType) => `Email to ${email.to_email} was bounced.`,
  },

  complained: {
    label: 'Spam Complaint',
    color: 'bg-accent/10 text-accent-foreground border-accent',
    dotColor: 'bg-primary',
    iconColor: 'text-accent-foreground',
    dotBeforeColor: 'bg-primary',
    getMessage: (email: EmailActivityType) => `${email.to_email} marked this email as spam.`,
  },

  unknown: {
    label: 'Unknown',
    color: 'bg-muted/10 text-foreground border-border',
    dotColor: 'bg-muted',
    iconColor: 'text-muted-foreground',
    dotBeforeColor: 'bg-muted',
    getMessage: () => `Unknown email event.`,
  },
  sent: {
    label: 'Sent',
    color: 'bg-primary/10 text-foreground dark:text-primary border-primary/30',
    dotColor: 'bg-primary',
    iconColor: 'text-primary',
    dotBeforeColor: 'bg-primary',
    getMessage: (email: EmailActivityType) =>
      `Email successfully sent to ${email.to_email} via ${email.provider}.`,
  },
  failed: {
    label: 'Failed',
    color: 'bg-destructive/10 text-foreground dark:text-destructive border-destructive/30',
    dotColor: 'bg-destructive',
    iconColor: 'text-destructive',
    dotBeforeColor: 'bg-destructive',
    getMessage: (email: EmailActivityType) => `Failed to send email to ${email.to_email}.`,
  },
  queued: {
    label: 'Queued',
    color: 'bg-accent/10 text-accent-foreground border-accent',
    dotColor: 'bg-accent',
    iconColor: 'text-accent-foreground',
    dotBeforeColor: 'bg-accent',
    getMessage: (email: EmailActivityType) =>
      `Email queued for delivery to ${email.to_email} via ${email.provider}.`,
  },
} as const
