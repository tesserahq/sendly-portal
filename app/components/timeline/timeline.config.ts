import { EmailActivityType } from '@/resources/queries/email-activity'

export const eventTypeConfig = {
  delivered: {
    label: 'Delivered',
    color: 'bg-emerald-500/10 text-foreground dark:text-emerald-300 border-emerald-200',
    dotColor: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    dotBeforeColor: 'bg-emerald-500',
    getMessage: (email: EmailActivityType) =>
      `Email successfully delivered to ${email.to_email} via ${email.provider}.`,
  },

  opened: {
    label: 'Opened',
    color: 'bg-sky-500/10 text-sky-700 border-sky-200',
    dotColor: 'bg-sky-500',
    iconColor: 'text-sky-600',
    dotBeforeColor: 'bg-sky-500',
    getMessage: (email: EmailActivityType) => `Email opened by ${email.to_email}.`,
  },

  clicked: {
    label: 'Clicked',
    color: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    dotColor: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    dotBeforeColor: 'bg-indigo-500',
    getMessage: (email: EmailActivityType) => `Link clicked by ${email.to_email}.`,
  },

  bounced: {
    label: 'Bounced',
    color: 'bg-rose-500/10 text-foreground dark:text-rose-300 border-rose-200',
    dotColor: 'bg-rose-500',
    iconColor: 'text-rose-600',
    dotBeforeColor: 'bg-rose-500',
    getMessage: (email: EmailActivityType) => `Email to ${email.to_email} was bounced.`,
  },

  complained: {
    label: 'Spam Complaint',
    color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    dotColor: 'bg-orange-500',
    iconColor: 'text-orange-600',
    dotBeforeColor: 'bg-orange-500',
    getMessage: (email: EmailActivityType) => `${email.to_email} marked this email as spam.`,
  },

  unknown: {
    label: 'Unknown',
    color: 'bg-gray-500/10 text-gray-700 border-gray-200',
    dotColor: 'bg-gray-500',
    iconColor: 'text-gray-600',
    dotBeforeColor: 'bg-gray-500',
    getMessage: () => `Unknown email event.`,
  },
  sent: {
    label: 'Sent',
    color: 'bg-emerald-500/10 text-foreground dark:text-emerald-300 border-emerald-200',
    dotColor: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    dotBeforeColor: 'bg-emerald-500',
    getMessage: (email: EmailActivityType) =>
      `Email successfully sent to ${email.to_email} via ${email.provider}.`,
  },
  failed: {
    label: 'Failed',
    color: 'bg-rose-500/10 text-foreground dark:text-rose-300 border-rose-200',
    dotColor: 'bg-rose-500',
    iconColor: 'text-rose-600',
    dotBeforeColor: 'bg-rose-500',
    getMessage: (email: EmailActivityType) => `Failed to send email to ${email.to_email}.`,
  },
  queued: {
    label: 'Queued',
    color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    iconColor: 'text-amber-600',
    dotBeforeColor: 'bg-amber-500',
    getMessage: (email: EmailActivityType) =>
      `Email queued for delivery to ${email.to_email} via ${email.provider}.`,
  },
} as const
