import { EmailActivityType } from '@/resources/queries/email-activity'

export const statusConfig = {
  sent: {
    label: 'Sent',
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    dotBeforeColor: 'bg-emerald-500',
    getMessage: (email: EmailActivityType) =>
      `Email successfully sent to ${email.to_email} via ${email.provider}.`,
  },
  failed: {
    label: 'Failed',
    color: 'bg-rose-500/10 text-rose-700 border-rose-200',
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
}
