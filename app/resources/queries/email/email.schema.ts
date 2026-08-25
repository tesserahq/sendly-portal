import { z } from 'zod'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function parseEmailList(value?: string): string[] {
  return (value ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || EMAIL_REGEX.test(value), {
    message: 'Must be a valid email address',
  })

function emailList(required: boolean) {
  return z
    .string()
    .optional()
    .refine(
      (value) => {
        const emails = parseEmailList(value)
        if (emails.length === 0) return !required
        return emails.every((email) => EMAIL_REGEX.test(email))
      },
      {
        message: required
          ? 'Enter at least one valid recipient email, separated by commas'
          : 'Enter valid email address(es), separated by commas',
      }
    )
}

export const sendEmailFormSchema = z.object({
  from_email: optionalEmail,
  reply_to: optionalEmail,
  to: emailList(true),
  cc: emailList(false),
  bcc: emailList(false),
  template_variables: z.record(z.string(), z.unknown()),
})

export type SendEmailFormValue = z.infer<typeof sendEmailFormSchema>
