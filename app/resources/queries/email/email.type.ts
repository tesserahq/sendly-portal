/*
Email Type
*/

export interface EmailAttachment {
  filename: string
  content: string
  content_type?: string
}

export interface SendEmailPayload {
  from_email?: string
  reply_to?: string
  subject?: string
  html?: string
  text?: string
  attachments?: EmailAttachment[]
  to: string[]
  cc?: string[]
  bcc?: string[]
  template_id?: string
  template_alias?: string
  template_variables?: Record<string, unknown>
  custom_headers?: Record<string, string>
  priority?: number
  idempotency_key?: string
  tags?: string[]
  metadata?: Record<string, unknown>
  message_stream?: string
}

export interface SendEmailResponse {
  id?: string
  message?: string
  [key: string]: unknown
}
